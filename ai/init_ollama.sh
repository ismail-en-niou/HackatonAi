#!/usr/bin/env bash
set -euo pipefail

MODEL_NAME="qwen2.5:3b"
MAX_WAIT=60
OLLAMA_API="http://localhost:11434"

log() { printf "[entrypoint] %s\n" "$*"; }

# Start Ollama daemon in background
log "Starting Ollama daemon..."
ollama serve &
OLLAMA_PID=$!

cleanup() {
  log "Stopping Ollama (pid $OLLAMA_PID)..."
  kill "$OLLAMA_PID" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

# Wait for Ollama API
log "Waiting for Ollama API to become ready..."
for i in $(seq 1 "$MAX_WAIT"); do
  if curl -fsSL "$OLLAMA_API/api/tags" >/dev/null 2>&1; then
    log "Ollama is ready."
    break
  fi
  if [ "$i" -eq "$MAX_WAIT" ]; then
    log "Ollama API did not become ready in ${MAX_WAIT}s" >&2
    exit 1
  fi
  sleep 1
done

# Ensure model is present
if ! ollama list | awk '{print $1}' | grep -Fxq "$MODEL_NAME"; then
  log "Model $MODEL_NAME not found. Pulling..."
  ollama pull "$MODEL_NAME"
else
  log "Model $MODEL_NAME already present."
fi
log "Entrypoint script completed."
