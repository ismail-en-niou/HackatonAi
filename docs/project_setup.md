# Project Setup Guide

This guide explains how to set up and run the project locally.

## Prerequisites

- **Docker**: Make sure you have Docker installed and running.
- **Node.js**: Make sure you have Node.js and npm installed.
- **Python**: Make sure you have Python and uv installed.

## Running the Project

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Run the AI backend**:
   ```bash
   cd ai
   uv sync
   uv run uvicorn --app-dir src server:app --host 0.0.0.0 --port 8000
   ```

3. **Run the web frontend**:
   ```bash
   cd web
   npm install
   npm run dev
   ```

4. **Access the application**:
   - The AI backend will be running at `http://localhost:8000`.
   - The web frontend will be running at `http://localhost:3000`.
