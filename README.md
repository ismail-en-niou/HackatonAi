# How ro run
install uv if it's not already installed
install ollama if it's not already installed
pull and serve the qwen2.5:7b llm with ollama
go to the ai directory
run `uv sync`
run `uv run uvicorn --app-dir src server:app --host 0.0.0.0 --port 8000`
now keep the server running and to root of the repository
then run `docker compose up -d`
now go ahead and use your favorite browser to access `localhost:3000`
