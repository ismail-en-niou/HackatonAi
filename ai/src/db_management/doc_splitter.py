from langchain_text_splitters import RecursiveCharacterTextSplitter

docs_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=400,
    add_start_index=True,
    separators=["\n\n", "\n", ". ", "; ", ", ", " "]
)

def split_documents(docs):
    chunks = docs_splitter.split_documents(docs)
    return chunks
