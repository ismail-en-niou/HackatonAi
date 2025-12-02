from db_management.db_manager import get_relevant_chunks, init_db
from ai_interaction.query_llm import query_llm
import sys


def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py [init_db | query]")
        return
    command = sys.argv[1]
    if command == "init_db":
        if (len(sys.argv) > 2 and sys.argv[2] == "-y"):
            init_db(y=True)
        else:
            init_db()
    elif command == "query":
        if len(sys.argv) < 3:
            print("Usage: python main.py query <your query here>")
            return
        query = " ".join(sys.argv[2:])
        # chunks = get_relevant_chunks(query, n=7)
        # for i, (doc, score) in enumerate(chunks):
        #     print(f"=== Chunk {i+1} (score: {score}, src: {doc.metadata['source']}) ===")
        #     print(doc.page_content)
        #     print()
        answer = query_llm(query)
        print(answer)


if __name__ == "__main__":
    main()
