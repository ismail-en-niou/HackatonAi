import os
import pandas as pd
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_core.documents import Document

def load_documents_from_directory(directory):
    all_docs = []

    for file in os.listdir(directory):
        print(f"Processing file: {file}...")
        path = os.path.join(directory, file)

        try:
            if file.lower().endswith(".pdf"):
                loader = PyPDFLoader(path)
                docs = loader.load()
                docs = _clean_doc(docs, path)

            elif file.lower().endswith(".docx"):
                loader = Docx2txtLoader(path)
                docs = loader.load()
                if isinstance(docs, list):
                    docs = _clean_doc(docs, path)
                else:
                    docs = _clean_doc([docs], path)

            elif file.lower().endswith(".txt"):
                loader = TextLoader(path)
                docs = loader.load()
                if isinstance(docs, list):
                    docs = _clean_doc(docs, path)
                else:
                    docs = _clean_doc([docs], path)

            # elif file.lower().endswith(".xlsx"):
            #     df = pd.read_excel(path, dtype=str)
            #     text = df.to_csv(index=False)
            #     docs = [{
            #         "page_content": text,
            #         "metadata": {"source": file}
            #     }]
            else:
                continue

            all_docs.extend(docs)
        except Exception as e:
            print(f"Error processing {file}: {e}")
            continue

    return all_docs

def _clean_doc(docs, source_path):
    def _page_key(d):
        md = getattr(d, "metadata", {}) or {}
        return md.get("page", md.get("page_number", 0))

    try:
        sorted_docs = sorted(docs, key=_page_key)
    except Exception:
        sorted_docs = docs

    combined_text = _collapse_empty_lines("\n\n".join(getattr(d, "page_content", str(d)) for d in sorted_docs))
    combined_meta = {"source": source_path}
    return [Document(page_content=combined_text, metadata=combined_meta)]

def _collapse_empty_lines(text: str, trim_edges: bool = True) -> str:
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")

    out = []
    prev_blanks = False
    for line in lines:
        if line.strip() == "":
            if not prev_blanks:
                out.append("")  # keep a single blank line
                prev_blanks = True
        else:
            out.append(line)
            prev_blanks = False

    if trim_edges:
        while out and out[0] == "":
            out.pop(0)
        while out and out[-1] == "":
            out.pop()

    return "\n".join(out)
