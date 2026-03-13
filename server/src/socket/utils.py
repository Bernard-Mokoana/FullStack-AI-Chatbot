from fastapi import WebSocket, status, Query
from typing import Optional
from ..redis.config import Redis as redis

async def get_token(self, websocket: WebSocket, token: Optional[str] = Query(None),):
    if token is None or token == "":
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)

    redis_client = await redis.create_connection(self)
    isexists = await redis_client.exists(token)

    if isexists == 1:
        return token
    else:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
