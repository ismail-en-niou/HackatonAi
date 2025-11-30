from src.db_management.db_manager import init_db
from src.ai_interaction.query_llm import query_llm
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
        answer = query_llm(query)
        print(answer)


if __name__ == "__main__":
    main()
