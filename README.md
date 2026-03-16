# FullStack AI Chatbot

An in-progress full-stack chatbot that uses a FastAPI WebSocket server, Redis Streams/JSON for message routing and session storage, and a Python worker that calls a Hugging Face inference endpoint.

**What exists today**
- `server/`: FastAPI API + WebSocket gateway that accepts chat input, streams it to Redis, and relays model responses back to the client.
- `worker/`: Background consumer that reads from Redis Streams, calls the LLM, updates Redis JSON chat history, and publishes responses.
- `client/`: Present but currently empty (placeholder for a future UI).
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

**Client (planned)**
![TBD](https://img.shields.io/badge/TBD-555?style=for-the-badge)

**Architecture (current flow)**
1. Client calls `POST /token` with a user name to create a chat session (stored in Redis JSON with a 1-hour TTL).
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

## Notes / gotchas
- Redis JSON features are required for chat history storage (Redis Stack or RedisJSON module).
- Tokens expire after 1 hour (set by the server when creating a session).
- The worker prepends `Human:` / `Bot:` labels when adding messages to the JSON cache.
- `client/` is currently empty and ready for UI work.
