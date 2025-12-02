#!/bin/bash

# Run the FastAPI server using uvicorn
echo "Starting AI Service..."

# Install dependencies if needed
if ! command -v python3 &> /dev/null; then
    echo "Installing Python..."
    apt-get update && apt-get install -y python3 python3-pip
fi

# Install uv if needed
if ! command -v uv &> /dev/null; then
    echo "Installing uv..."
    pip3 install uv
fi

# Sync dependencies
echo "Installing dependencies..."
uv sync

# Run the server
echo "Starting server on port 8000..."
uv run uvicorn server:app --host 0.0.0.0 --port 8000 --reload
