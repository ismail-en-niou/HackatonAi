# API Integration Documentation

This document describes how the Next.js frontend integrates with the FastAPI backend server.

## Backend API Endpoints (FastAPI - Port 8000)

The FastAPI server (`ai/src/server.py`) exposes the following endpoints:

### 1. File Management

#### GET `/files`
- **Description**: List all files in the data directory
- **Response**: 
  ```json
  {
    "files": ["file1.pdf", "file2.txt", ...]
  }
  ```

#### POST `/files`
- **Description**: Upload a new file and index it in ChromaDB
- **Request**: `multipart/form-data` with file
- **Response**: 
  ```json
  {
    "detail": "File uploaded and indexed successfully",
    "filename": "example.pdf"
  }
  ```
- **Error Codes**:
  - `409`: File already exists
  - `500`: Processing failed

#### GET `/files/{filename}`
- **Description**: Download a specific file
- **Response**: File content with appropriate content-type

#### DELETE `/files/{filename}`
- **Description**: Delete a specific file
- **Response**: 
  ```json
  {
    "detail": "File deleted successfully"
  }
  ```

### 2. AI Query & Search

#### POST `/query`
- **Description**: Query the LLM with RAG (Retrieval Augmented Generation)
- **Request**: 
  ```json
  {
    "query": "Your question here"
  }
  ```
- **Response**: LLM answer with context from indexed documents

#### POST `/search`
- **Description**: Search for relevant documents without querying the LLM
- **Request**: 
  ```json
  {
    "query": "Search term"
  }
  ```
- **Response**: 
  ```json
  {
    "files": ["relevant_file1.pdf", "relevant_file2.txt"]
  }
  ```

#### POST `/namechat`
- **Description**: Generate a name/title for a chat based on the query
- **Request**: 
  ```json
  {
    "query": "First message in chat"
  }
  ```
- **Response**: Generated chat name/title

---

## Frontend API Routes (Next.js - Port 3000)

The Next.js server acts as a proxy and adds authentication/authorization layers:

### 1. Library Management (`/api/library`)

#### GET `/api/library`
- **Purpose**: List all files
- **Proxies to**: `GET http://ai:8000/files`
- **Authorization**: None (public)
- **Response Enhancement**: Adds URL and file metadata

#### POST `/api/library`
- **Purpose**: Upload file
- **Proxies to**: `POST http://ai:8000/files`
- **Authorization**: **Admin only**
- **Process**: 
  1. Verifies admin privileges
  2. Forwards file to AI service
  3. AI service processes and indexes the file

#### DELETE `/api/library?filename={name}`
- **Purpose**: Delete file
- **Proxies to**: `DELETE http://ai:8000/files/{filename}`
- **Authorization**: **Admin only**

#### GET `/api/library/[filename]`
- **Purpose**: Download specific file
- **Proxies to**: `GET http://ai:8000/files/{filename}`
- **Authorization**: None (public)

### 2. Chat & Query (`/api/chats`)

#### POST `/api/chats/query`
- **Purpose**: Send query to AI
- **Proxies to**: `POST http://ai:8000/query`
- **Authorization**: Optional (user token)
- **Request**: 
  ```json
  {
    "query": "User question"
  }
  ```
- **Response Enhancement**: Formats sources and handles errors gracefully

#### POST `/api/chats/namechat`
- **Purpose**: Generate chat title
- **Proxies to**: `POST http://ai:8000/namechat`
- **Authorization**: None
- **Request**: 
  ```json
  {
    "query": "First message"
  }
  ```

#### POST `/api/search`
- **Purpose**: Search documents
- **Proxies to**: `POST http://ai:8000/search`
- **Authorization**: None
- **Response Enhancement**: Returns both `files` and `results` arrays for compatibility

---

## Environment Configuration

### Docker Compose
The services communicate via Docker network:
- **Frontend**: `http://localhost:3000` (external) → `app` service (internal)
- **Backend**: `http://localhost:8000` (external) → `ai` service (internal)
- **Internal communication**: `http://ai:8000` (from Next.js to FastAPI)

### Environment Variables

#### Web Service (Next.js)
```env
AI_URL=http://ai:8000          # Internal Docker network address
MONGODB_URI=mongodb://mongo:27017/mydb
```

#### AI Service (FastAPI)
```env
# Runs on port 8000
# Data directory: /app/data
```

---

## Frontend Usage Examples

### Upload a File (Admin Only)
```javascript
const formData = new FormData();
formData.append('file', fileObject);

const response = await fetch('/api/library', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Query the AI
```javascript
const response = await fetch('/api/chats/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: "What is in the documents?" })
});

const data = await response.json();
console.log(data.text); // AI response
console.log(data.sources); // Source documents
```

### Search Documents
```javascript
const response = await fetch('/api/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: "machine learning" })
});

const data = await response.json();
console.log(data.files); // Array of relevant filenames
```

### Delete a File (Admin Only)
```javascript
const response = await fetch(`/api/library?filename=${encodeURIComponent(filename)}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Data Flow

### File Upload Flow
1. Admin uploads file via frontend
2. Next.js `/api/library` verifies admin role
3. File forwarded to FastAPI `/files`
4. FastAPI saves file to `/app/data`
5. Document loaded and split into chunks
6. Chunks embedded and stored in ChromaDB
7. Success response returned

### Query Flow
1. User submits query via frontend
2. Next.js `/api/chats/query` receives request
3. Proxied to FastAPI `/query`
4. FastAPI:
   - Searches ChromaDB for relevant chunks
   - Sends query + context to LLM
   - Returns answer with source files
5. Frontend displays response and sources

### Search Flow
1. User submits search query
2. Next.js `/api/search` proxies to FastAPI `/search`
3. FastAPI searches ChromaDB for relevant chunks
4. Returns unique list of source filenames
5. Frontend displays matching files

---

## Security Considerations

1. **Admin Privileges**: File upload/delete requires admin role verification
2. **Path Traversal Protection**: Backend sanitizes filenames and validates paths
3. **File Conflicts**: Returns 409 error if file already exists
4. **Error Handling**: Graceful degradation with user-friendly error messages
5. **CORS**: Services communicate within Docker network (no CORS issues)

---

## Testing the Integration

### Test File Upload
```bash
curl -X POST http://localhost:3000/api/library \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

### Test Query
```bash
curl -X POST http://localhost:3000/api/chats/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is machine learning?"}'
```

### Test Search
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "neural networks"}'
```

### Test Direct AI Service (Development)
```bash
# List files
curl http://localhost:8000/files

# Upload file
curl -X POST http://localhost:8000/files \
  -F "file=@document.pdf"

# Query
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "summarize the document"}'
```

---

## Troubleshooting

### File Upload Issues
- **Error 403**: User is not admin - check token and user role
- **Error 409**: File already exists - delete or rename
- **Error 500**: Processing failed - check AI service logs

### Query Issues
- **503 Service Unavailable**: AI service is starting - wait a few seconds
- **Empty Response**: No documents indexed - upload files first
- **Timeout**: Large documents - check AI service resources

### Connection Issues
- Verify services are running: `docker-compose ps`
- Check AI service health: `curl http://localhost:8000/files`
- Check logs: `docker-compose logs ai` or `docker-compose logs app`
