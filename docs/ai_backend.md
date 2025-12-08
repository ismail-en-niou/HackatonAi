# AI Backend Documentation

The AI backend is a FastAPI application that provides the following functionalities:

- **File Management**: Upload, list, and retrieve files.
- **AI Interaction**: Query the AI model and get relevant information.

## API Endpoints

### File Management

- **`POST /files`**: Upload a file.
  - **Request Body**: `multipart/form-data` with a file.
  - **Response**: A JSON object with a success message and the filename.

- **`GET /files`**: List all uploaded files.
  - **Response**: A JSON object with a list of filenames.

- **`GET /files/{filename}`**: Retrieve a file.
  - **Path Parameter**: `filename` - The name of the file to retrieve.
  - **Response**: The file content.

- **`DELETE /files/{filename}`**: Delete a file.
  - **Path Parameter**: `filename` - The name of the file to delete.
  - **Response**: A JSON object with a success message.

### AI Interaction

- **`POST /query`**: Query the AI model.
  - **Request Body**: A JSON object with a `query` field.
  - **Response**: A JSON object with the AI's answer and the context files used.

- **`POST /search`**: Search for relevant files.
  - **Request Body**: A JSON object with a `query` field.
  - **Response**: A JSON object with a list of relevant filenames.

- **`POST /namechat`**: Name a chat session.
  - **Request Body**: A JSON object with a `query` field.
  - **Response**: A JSON object with the generated chat name.
