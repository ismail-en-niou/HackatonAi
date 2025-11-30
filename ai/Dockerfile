FROM debian:latest

ENV DEBIAN_FRONTEND=noninteractive

# Install Python, curl and other required tools
RUN apt-get update && apt-get upgrade -y && \
	apt-get install -y python3 python3-pip curl ca-certificates bash && \
	rm -rf /var/lib/apt/lists/*

# Install uv (official recommended installer)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Ensure uv (installed under /root/.local/bin) and ollama (/usr/local/bin) are in PATH
ENV PATH="/root/.cargo/bin:/root/.local/bin:/usr/local/bin:${PATH}"

WORKDIR /app

# Copy application code (including entrypoint) into image
COPY . /app

# Sync Python dependencies (requires pyproject.toml in /app)
RUN uv sync

# Make sure entrypoint script is executable
RUN chmod +x /app/init_ollama.sh
	
RUN /app/init_ollama.sh

RUN uv run python main.py init_db -y

# Expose application port (uvicorn default) and Ollama port
EXPOSE 8000 11434

# Use the entrypoint script
CMD ["sh", "-c", "ollama serve & uv run uvicorn server:app --host 0.0.0.0 --port 8000"]
