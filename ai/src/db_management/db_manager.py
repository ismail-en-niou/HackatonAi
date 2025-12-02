from .doc_loader import load_documents_from_directory
from .doc_splitter import split_documents
from .embedder import NomicLocalEmbeddings
import chromadb
from langchain_chroma import Chroma
import os
import shutil
from FlagEmbedding import FlagReranker
from typing import List, Tuple

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
    # for chunk in chunks:
    #     print(f"source_file: {chunk.metadata["source"]}\n{chunk.page_content}")
    insert_chunks_into_chroma(chunks)
    print(f"Inserted {len(chunks)} chunks into ChromaDB.")


def get_relevant_chunks(query, n=7):
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    embedding_func = NomicLocalEmbeddings()
    vectorstore = Chroma(
        client=chroma_client,
        collection_name="phosphate_docs",
        embedding_function=embedding_func,
    )
    # First retrieve a generous pool via vector search
    chromadb_retriever = vectorstore.as_retriever(search_kwargs={"k": 30})
    # In newer LangChain versions, retrievers are Runnable; use invoke()
    initial_docs = chromadb_retriever.invoke(query)

    # Then rerank locally using FlagEmbedding cross-encoder
    # On CPU, disable fp16 to avoid numerical issues leading to zeros
    reranker = FlagReranker("BAAI/bge-reranker-v2-m3", use_fp16=False)

    # Batch scoring: FlagReranker expects parallel lists [queries], [docs]
    docs_texts = [d.page_content for d in initial_docs]
    pairs = [(query, doc_text) for doc_text in docs_texts]
    try:
        # Prefer pair-based API to ensure correct batching
        scores = reranker.compute_score(pairs)
        # scores may be a list/ndarray/tensor; normalize to Python floats
        try:
            scores = list(scores)
        except Exception as e:
            print(f"Error converting scores to list: {e}")
            pass
    except Exception as e:
        print(f"Error computing scores: {e}")
        # Fallback to (queries, docs) signature
        try:
            queries = [query] * len(docs_texts)
            scores = reranker.compute_score(queries, docs_texts)
            try:
                scores = list(scores)
            except Exception as e:
                print(f"Error converting scores to list: {e}")
                pass
        except Exception as e:
            print(f"Error computing scores: {e}")
            scores = [0.0] * len(docs_texts)

    scored: List[Tuple[float, any]] = [(float(s), d) for s, d in zip(scores, initial_docs)]

    scored.sort(key=lambda x: x[0], reverse=True)
    # Return list of (doc, score) to match caller expectations
    top = [(d, s) for s, d in scored[:n] if s > 0]
    return top


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
