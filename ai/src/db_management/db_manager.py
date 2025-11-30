from .doc_loader import load_documents_from_directory
from .doc_splitter import split_documents
from .embedder import NomicLocalEmbeddings
import chromadb
from langchain_chroma import Chroma
import os
import shutil


def init_db(y=False):
    if os.path.exists("./chroma_db"):
        print("ChromaDB already initialized.")
        if not y:
            res = input("Do you want to re-initialize it? This will delete existing data. (y/n): ")
            if res.lower() != 'y':
                return
        shutil.rmtree("./chroma_db", ignore_errors=True)
        print("Deleted existing ChromaDB.")
    docs = load_documents_from_directory("data")
    chunks = split_documents(docs)
    insert_chunks_into_chroma(chunks)
    print(f"Inserted {len(chunks)} chunks into ChromaDB.")


def get_relevant_chunks(query, n=5):
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    embedding_func = NomicLocalEmbeddings()
    vectorstore = Chroma(
        client=chroma_client,
        collection_name="phosphate_docs",
        embedding_function=embedding_func,
    )
    results = vectorstore.similarity_search_with_relevance_scores(query, k=n)
    return results


def insert_chunks_into_chroma(chunks):
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    embedding_func = NomicLocalEmbeddings()
    vectorstore = Chroma(
        client=chroma_client,
        collection_name="phosphate_docs",
        embedding_function=embedding_func,
    )
    texts = [c.page_content for c in chunks]
    metadatas = [c.metadata for c in chunks]
    vectorstore.add_texts(texts=texts, metadatas=metadatas)
