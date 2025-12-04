from ollama import Client
import os
from db_management.db_manager import get_relevant_chunks

client = Client(host="http://localhost:11434")

def query_llm(query):
    chunks = get_relevant_chunks(query, n=3)
    if (len(chunks) == 0):
        return {
            "answer": "Les documents de ma base de connaissances ne contiennent pas la réponse à votre question.",
            "context_files": [],
        }
    context = "\n\n-------\n\n".join([f"source file: {os.path.basename(doc.metadata['source'])}\n{doc.page_content}" for doc, _score in chunks])
    prompt = f"""
Tu es un assistant utile. Réponds UNIQUEMENT en utilisant le contexte fourni ci-dessous de maniere précise et concise.
Si la réponse n'est pas dans le contexte, dis la phrase suivante : "Les documents de ma base de connaissances ne contiennent pas la réponse à votre question."

Contexte :
{context}

Question : {query}

Réponse :
"""
    response = client.chat(model="qwen2.5:3b", messages=[{"role": "user", "content": prompt}])
    return {
        "answer": response["message"]["content"],
        "context_files": list({os.path.basename(doc.metadata['source']) for doc, _score in chunks}),
    }

def name_chat(query: str):
    prompt = f"""
Reponds en une seul phrase et de maniere professionnelle qui serait le titre approprié pour une conversation avec un agent ai ayant pour premier message : {query}
le titre doit etre court, concis et pertinent par rapport au sujet de la conversation.
ne met pas de guillemets autour du phrase.
le titre:
"""
    response = client.chat(model="qwen2.5:3b", messages=[{"role": "user", "content": prompt}])
    return {
        "chat_name": response["message"]["content"].strip(),
    }
