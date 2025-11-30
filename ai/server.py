from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import FileResponse
from pathlib import Path
from src.ai_interaction.query_llm import query_llm

app = FastAPI()

DATA_DIR = Path("data").resolve()


@app.delete("/files/{filename}")
def delete_file(filename: str):
    requested_path = (DATA_DIR / filename).resolve()

    if not str(requested_path).startswith(str(DATA_DIR)):
        raise HTTPException(status_code=400, detail="Invalid file path")

    if not requested_path.exists() or not requested_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    requested_path.unlink()
    return {"detail": "File deleted successfully"}


@app.post("/files")
def upload_file():
    pass  # Placeholder for file upload logic


@app.get("/files")
def list_files():
    files = [f.name for f in DATA_DIR.iterdir() if f.is_file()]
    return {"files": files}


@app.get("/files/{filename}")
def get_file(filename: str):
    # Normalize path and avoid directory traversal
    requested_path = (DATA_DIR / filename).resolve()

    # Check if the file is inside the data directory
    if not str(requested_path).startswith(str(DATA_DIR)):
        raise HTTPException(status_code=400, detail="Invalid file path")

    # Check if file exists
    if not requested_path.exists() or not requested_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(path=requested_path)


@app.post("/query")
def query_endpoint(query: str = Body(..., embed=True)):
    answer = query_llm(query)
    return answer