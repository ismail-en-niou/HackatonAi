from fastapi import FastAPI, HTTPException, Body, UploadFile, File
from fastapi.responses import FileResponse
from pathlib import Path
from db_management.db_manager import get_relevant_chunks, insert_chunks_into_chroma
from db_management.doc_splitter import split_documents
from db_management.doc_loader import load_one_document
from ai_interaction.query_llm import name_chat, query_llm
from db_management.convert_to_md import save_docs_as_md
import os

app = FastAPI()

DATA_DIR = Path("data_raw").resolve()
DATA_MD = Path("data").resolve()


@app.delete("/files/{filename}")
def delete_file(filename: str):
    requested_path = (DATA_DIR / filename).resolve()
    data_path = (DATA_MD / (filename.split(".")[0] + ".md")).resolve()

    if not str(requested_path).startswith(str(DATA_DIR)):
        raise HTTPException(status_code=400, detail="Invalid file path")

    if not requested_path.exists() or not requested_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    requested_path.unlink()
    data_path.unlink(missing_ok=True)
    return {"detail": "File deleted successfully"}


@app.post("/files")
async def upload_file(file: UploadFile = File(...)):
    # Ensure data directory exists
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Sanitize filename to prevent path traversal
    filename = os.path.basename(file.filename)
    if not filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    destination = (DATA_DIR / filename).resolve()

    # Double-check destination is under DATA_DIR
    if not str(destination).startswith(str(DATA_DIR)):
        raise HTTPException(status_code=400, detail="Invalid file path")

    # Check if file with same name (without extension) already exists
    base_name = destination.stem  # Get filename without extension
    existing_files = list(DATA_DIR.glob(f"{base_name}.*"))
    if existing_files:
        raise HTTPException(status_code=409, detail="File with this name already exists")

    try:
        # Stream write to avoid loading large files fully into memory
        with destination.open("wb") as out_file:
            while True:
                chunk = await file.read(1024 * 1024)  # 1MB chunks
                if not chunk:
                    break
                out_file.write(chunk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")
    finally:
        await file.close()

    # Process the uploaded document: load, split into chunks, and insert into Chroma
    try:
        doc = load_one_document(str(destination))
        save_docs_as_md([doc], "data")
        doc = load_one_document("data/" + file.filename.split(".")[0] + ".md")
        if doc is None:
            raise RuntimeError("Document loading returned None")

        chunks = split_documents([doc])
        if not chunks:
            raise RuntimeError("No chunks produced from document")

        insert_chunks_into_chroma(chunks)
    except Exception as e:
        # If processing fails, keep the uploaded file but report processing error
        raise HTTPException(status_code=500, detail=f"File saved but processing failed: {e}")

    return {"detail": "File uploaded and indexed successfully", "filename": filename}


@app.get("/files")
def list_files():
    files = [f.name for f in DATA_DIR.iterdir() if f.is_file()]
    return {"files": files}


@app.get("/files/{filename}")
def get_file(filename: str):
    requested_path = (DATA_DIR / filename).resolve()
    if not str(requested_path).startswith(str(DATA_DIR)):
        raise HTTPException(status_code=400, detail="Invalid file path")
    if not requested_path.exists() or not requested_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=requested_path)


@app.post("/query")
def query_endpoint(query: str = Body(..., embed=True)):
    answer = query_llm(query)
    files_md = answer["context_files"]
    files = [list(DATA_DIR.glob(f"{f.split(".")[0]}.*"))[0].name for f in files_md]
    answer["context_files"] = files
    return answer


@app.post("/search")
def search_endpoint(query: str = Body(..., embed=True)):
    chunks = get_relevant_chunks(query, n=3)
    files_md = list({os.path.basename(doc.metadata['source']) for doc, _score in chunks})
    files = [list(DATA_DIR.glob(f"{f.split(".")[0]}.*"))[0].name for f in files_md]
    return {"files": files}

@app.post("/namechat")
def name_chat_endpoint(query: str = Body(..., embed=True)):
    return name_chat(query)