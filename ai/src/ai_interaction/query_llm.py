from ollama import Client
from src.db_management.db_manager import get_relevant_chunks

client = Client()

def query_llm(query):
    chunks = get_relevant_chunks(query, n=3)
    if (len(chunks) == 0):
        print("No relevant chunks found.")
        return
    context = "\n\n-------\n\n".join([doc.page_content for doc, _score in chunks])
    prompt = f"""
You are a helpful assistant. Answer ONLY using the context.
If the answer is not in the context, say "I don't know".

Context:
{context}

Question: {query}

Answer:
"""
    response = client.chat(model="qwen2.5:3b", messages=[{"role": "user", "content": prompt}])
    return {"answer": response["message"]["content"], "context_files": [doc.metadata['source'].split("/")[-1] for doc, _score in chunks]}
