# FullStack AI Chatbot

An in-progress full-stack chatbot that uses a FastAPI WebSocket server, Redis Streams/JSON for message routing and session storage, and a Python worker that calls a Hugging Face inference endpoint.

**What exists today**
- `server/`: FastAPI API + WebSocket gateway that accepts chat input, streams it to Redis, and relays model responses back to the client.
- `worker/`: Background consumer that reads from Redis Streams, calls the LLM, updates Redis JSON chat history, and publishes responses.
- `client/`: Next.js App Router UI with a name-gated chat screen that opens a tokenized WebSocket session.
- `Application Architecture/Chatbot Architecture.drawio`: Architecture diagram source.

## Tech Stack

**Backend (API + WebSocket)**
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-3C3C3C?style=for-the-badge&logo=uvicorn&logoColor=white)

**Worker / Model**
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Hugging%20Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)

**Data / Messaging**
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Redis%20JSON](https://img.shields.io/badge/Redis%20JSON-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Redis%20Streams](https://img.shields.io/badge/Redis%20Streams-DC382D?style=for-the-badge&logo=redis&logoColor=white)

**Client (Next.js)**
![Next.js](https://img.shields.io/badge/Next.js-111?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Zustand](https://img.shields.io/badge/Zustand-433?style=for-the-badge)

**Architecture (current flow)**
1. Client collects a user name and calls `POST /token` to create a chat session (stored in Redis JSON with a 1-hour TTL).
2. Client opens WebSocket `GET /chat?token=...`.
3. Server sends each incoming message to Redis Stream `message_channel`.
4. Worker consumes from `message_channel`, appends to Redis JSON history, calls the model, and writes a response to `response_channel`.
5. Server listens on `response_channel`, matches by token, and pushes the response back to the client WebSocket.

**Key Redis usage**
- Redis JSON stores chat session state keyed by token.
- Redis Streams pass messages between server and worker:
  - `message_channel`: inbound user messages.
  - `response_channel`: outbound model responses.

## API (current)

**HTTP**
- `GET /test`: health check.
- `POST /token?name=...`: create a chat session and return `{ token, messages, name, session_start }`.
- `GET /refresh_token?token=...`: fetch session state if token exists; 400 if expired.

**WebSocket**
- `GET /chat?token=...`: stream user messages in and bot messages out.

## Configuration

There are separate `.env` files for `server/` and `worker/`. Do not commit real secrets.
The client uses `.env.local` inside `client/`.

**Shared Redis config**
- `REDIS_URL`
- `REDIS_USER`
- `REDIS_PASSWORD`
- `REDIS_HOST`
- `REDIS_PORT`

**Server only**
- `APP_ENV` (when set to `development`, the server runs with `uvicorn` reload on port `3500`)

**Worker only**
- `HUGGINFACE_INFERENCE_TOKEN` (note the spelling matches the code)
- `MODEL_ID` (defaults to `katanemo/Arch-Router-1.5B` if not set)
- `MAX_NEW_TOKENS` (defaults to `25` if not set)

**Client only**
- `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3500`)
- `NEXT_PUBLIC_WS_URL` (defaults to `ws://localhost:3500/chat`)

### Example `.env` (safe placeholders)
```env
APP_ENV=development
REDIS_URL=redis.example.com:6379
REDIS_USER=default
REDIS_PASSWORD=your_password
REDIS_HOST=redis.example.com
REDIS_PORT=6379

HUGGINFACE_INFERENCE_TOKEN=hf_xxx
MODEL_ID=katanemo/Arch-Router-1.5B
MAX_NEW_TOKENS=150
```

### Example `client/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3500
NEXT_PUBLIC_WS_URL=ws://localhost:3500/chat
```

## Local setup

**Python dependencies**
- `redis`
- `python-dotenv`
- `huggingface_hub`
- `fastapi`
- `uvicorn`
- `pydantic`

You can install the base requirements and then add any missing packages:
```powershell
pip install -r requirements.txt
```

## Run

**Server**
```powershell
cd server
python main.py
```

**Worker**
```powershell
cd worker
python main.py
```

**Client**
```powershell
cd client
npm install
npm run dev
```

## Notes / gotchas
- Redis JSON features are required for chat history storage (Redis Stack or RedisJSON module).
- Tokens expire after 1 hour (set by the server when creating a session).
- The worker prepends `Human:` / `Bot:` labels when adding messages to the JSON cache.
- WebSocket messages are raw text (not JSON). The client parses the worker’s Python-dict-style string payloads.
