# FullStack AI Chatbot

This repository contains a small end-to-end chatbot system with three runtime parts:

- `client/`: a Next.js chat UI
- `server/`: a FastAPI app that creates sessions and hosts the WebSocket endpoint
- `worker/`: a Python background process that consumes Redis stream messages, calls a Hugging Face inference model, and publishes replies

The app uses Redis for both session persistence and message passing between the API server and the worker.

## Current Architecture

The project is currently built around a token-based chat session flow:

1. The client collects a user's name.
2. The client calls `POST /token?name=...` on the FastAPI server.
3. The server creates a UUID token, stores a chat session in Redis JSON, and sets a 1-hour expiry.
4. The client opens `ws://.../chat?token=...`.
5. User messages are written by the server into the Redis stream `message_channel`.
6. The worker reads from `message_channel`, updates Redis chat history, calls the Hugging Face model, and writes the answer into `response_channel`.
7. The server listens for matching replies on `response_channel` and forwards them to the correct WebSocket client.

## Repository Layout

```text
.
|-- client/                         Next.js frontend
|   |-- src/app/                    App Router pages
|   |-- src/features/chat/          Chat UI and session logic
|   |-- src/services/               HTTP, WebSocket, and localStorage helpers
|   `-- package.json
|-- server/                         FastAPI API + WebSocket gateway
|   |-- src/routes/chat.py          Token + refresh + WebSocket routes
|   |-- src/socket/                 WebSocket helpers
|   `-- src/redis/                  Redis connection and stream helpers
|-- worker/                         Redis consumer + model caller
|   |-- src/model/gptj.py           Hugging Face inference client
|   `-- src/redis/                  Redis cache/stream helpers
|-- docs/                           Notes on design and requirements
|-- Application Architecture/       Draw.io architecture source
|-- requirements.txt                Python dependencies
`-- README.md
```

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Axios
- Motion

### Backend

- Python
- FastAPI
- Uvicorn
- Redis
- Redis JSON / Redis Stack features
- WebSockets

### Model Worker

- `huggingface_hub` `InferenceClient`
- Redis Streams

## How The Client Behaves

The Next.js app has two pages:

- `/`: asks for a display name, creates a session token, stores `chat_name` and `chat_token` in `localStorage`, then redirects to `/chat`
- `/chat`: restores the name from storage, opens a WebSocket connection, restores Redis-backed history when possible, and keeps a local copy of rendered messages in `localStorage`

Important implementation details:

- The client expects `NEXT_PUBLIC_WS_URL` to be set. `client/src/services/ws/chatSocket.ts` throws during import if it is missing.
- The server CORS config currently allows `http://localhost:3001`.
- Because of that, the frontend should be run on port `3001` unless you change the server CORS config.

## API Surface

### HTTP

- `GET /test`
  Returns a simple health payload.

- `POST /token?name=...`
  Creates a chat session and returns:

```json
{
  "token": "uuid",
  "messages": [],
  "name": "user name",
  "session_start": "ISO timestamp"
}
```

- `GET /refresh_token?token=...`
  Returns the stored session if the token still exists, otherwise returns `400`.

### WebSocket

- `GET /chat?token=...`
  Accepts raw text user messages and returns bot responses for that token.

## Redis Usage

Redis is doing two jobs in this project:

- Session storage:
  Each chat token is stored as a Redis JSON document with message history and a 1-hour TTL.
- Stream-based message passing:
  - `message_channel`: user messages from server to worker
  - `response_channel`: model responses from worker back to server

The worker also prefixes stored messages in Redis history:

- human messages are stored as `Human: ...`
- bot messages are stored as `Bot: ...`

The client strips those prefixes back out when rebuilding chat history.

## Environment Variables

There is no checked-in sample env file yet, so use these values as a reference.

### Root Python dependencies

Install from the repository root:

```powershell
pip install -r requirements.txt
```

### `server/.env`

```env
APP_ENV=development
REDIS_URL=redis://localhost:6379/0
```

Notes:

- `server/src/redis/config.py` currently reads `REDIS_URL`.
- `python server/main.py` only starts Uvicorn when `APP_ENV=development`.

### `worker/.env`

```env
REDIS_URL=redis://localhost:6379/0
HUGGINFACE_INFERENCE_TOKEN=hf_xxx
MODEL_ID=katanemo/Arch-Router-1.5B
MAX_NEW_TOKENS=25
```

Notes:

- The code expects the variable name `HUGGINFACE_INFERENCE_TOKEN` exactly as spelled above.
- `MODEL_ID` is optional if `MODEL_URL` is provided, but `MODEL_ID` is the simplest option.

### `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3500
NEXT_PUBLIC_WS_URL=ws://localhost:3500
```

Notes:

- The WebSocket helper removes a trailing `/chat` if you include it, so either `ws://localhost:3500` or `ws://localhost:3500/chat` will work.

## Running Locally

You need three processes:

1. Redis with Redis JSON support
2. FastAPI server
3. Worker
4. Next.js client

### 1. Start Redis

Use Redis Stack or another Redis instance with Redis JSON available. The app relies on `.json()` operations for session history.

### 2. Start the FastAPI server

From the repository root:

```powershell
cd server
python main.py
```

If you do not want to rely on `APP_ENV=development`, you can also run:

```powershell
cd server
uvicorn main:api --host 0.0.0.0 --port 3500 --reload
```

### 3. Start the worker

```powershell
cd worker
python main.py
```

### 4. Start the client

```powershell
cd client
npm install
npm run dev -- --port 3001
```

Then open `http://localhost:3001`.

## End-to-End Flow

Once everything is running:

1. Visit the landing page.
2. Enter a name.
3. The client creates a session token.
4. The chat page opens a WebSocket connection using that token.
5. Messages are sent over the socket as plain text.
6. The worker generates a response through Hugging Face.
7. The response is pushed back to the browser and rendered in the chat UI.

## Project Notes

This repo also contains planning material that is useful for future work:

- [docs/design.md](docs/design.md)
- [docs/requirements.md](docs/requirements.md)
- [Application Architecture/Chatbot Architecture.drawio](<Application Architecture/Chatbot Architecture.drawio>)
- `notes.txt`

Some of those notes describe future Auth0-based work that is not yet implemented in the current codebase.

## Known Gaps And Gotchas

- No automated test suite is present yet.
- `server/main.py` does not start anything unless `APP_ENV=development` is set.
- The client requires `NEXT_PUBLIC_WS_URL`; without it, the frontend will fail at import time.
- The FastAPI CORS allowlist is hard-coded to `http://localhost:3001`.
- Redis JSON support is required, not just a plain Redis server.
- The worker currently sends back whole model responses rather than token-by-token streaming.

## Next Good Improvements

- Add `.env.example` files for `client`, `server`, and `worker`
- Add a Docker Compose setup for Redis + server + worker + client
- Add tests for session creation, token refresh, and WebSocket flow
- Align CORS and frontend default port
- Add deployment instructions once the runtime setup stabilizes
