import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import json
from chatbot import query_llm, client


# def normalize(text):
#     return text.lower().replace(" ", "").replace("\n", "")

# def test_chatbot_answers():
#     test_cases = load_questions()

#     for case in test_cases:
#         question = case["question"]
#         expected = case["expected"]

#         result = query_llm(question)
#         answer = result["answer"]

#         assert normalize(expected) in normalize(answer), (
#             f"\n❌ Wrong answer for:\n{question}\n\n"
#             f"Expected to contain:\n{expected}\n\n"
#             f"But got:\n{answer}\n"
#         )

def load_questions():
    with open("tests/test_questions.json", "r") as f:
        return json.load(f)

def judge_answer(question, expected, answer):
    judge_prompt = f"""
Tu es un expert en chimie. Ta tâche est d'évaluer une réponse donnée par un chatbot.

Question originale :
{question}

Réponse attendue (officielle) :
{expected}

Réponse du chatbot :
{answer}

Est-ce que la réponse du chatbot correspond scientifiquement à la réponse attendue, même si la formulation est différente ?

Réponds uniquement par "OUI" ou "NON".
"""

    resp = client.chat(
        model="qwen2.5:3b",
        messages=[{"role": "user", "content": judge_prompt}]
    )

    return resp["message"]["content"].strip().upper().startswith("OUI")

def test_chatbot_with_llm_judge():
    test_cases = load_questions()

    for case in test_cases:
        question = case["question"]
        expected = case["expected"]

        result = query_llm(question)
        answer = result["answer"]

        ok = judge_answer(question, expected, answer)

        assert ok, (
            f"\n Wrong answer for:\n{question}\n\n"
            f"Expected:\n{expected}\n\n"
            f"But got:\n{answer}\n"
            f"LLM judge says: incorrect\n"
        )