from ollama import Client
import os
from db_management.db_manager import get_relevant_chunks

client = Client()

def query_llm(query):
    chunks = get_relevant_chunks(query, n=10)
    if (len(chunks) == 0):
        print("No relevant chunks found.")
        return
    context = "\n\n-------\n\n".join([f"source file: {os.path.basename(doc.metadata['source'])}\n{doc.page_content}" for doc, _score in chunks])
    prompt = f"""
You are a helpful assistant. Answer ONLY using the context provided below.
If the answer is not in the context, say the following: "the documents in my knowledge base do not contain the answer."

Context:
{context}

Question: {query}

Answer:
"""
    response = client.chat(model="qwen2.5:3b", messages=[{"role": "user", "content": prompt}])
    return {
        "answer": response["message"]["content"],
        "context_files": list({os.path.basename(doc.metadata['source']) for doc, _score in chunks}),
    }
