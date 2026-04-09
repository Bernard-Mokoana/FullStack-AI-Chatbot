import asyncio
import contextlib
import os
from fastapi import APIRouter, WebSocket, Request, HTTPException, Depends, WebSocketDisconnect
import uuid
from ..socket.connection import ConnectionManager
from ..socket.utils import get_token
from ..redis.producer import Producer
from ..redis.config import Redis
from ..schema.chat import Chat
from ..redis.stream import StreamConsumer
from ..redis.cache import Cache

chat = APIRouter()
manager = ConnectionManager()
redis = Redis()

@chat.post("/token")
async def token_generator(name: str, request: Request):
    token = str(uuid.uuid4())

    if name == "":
        raise HTTPException(status_code=400, detail={
            "loc": "name", "message": "Enter a valid name"
        })
    
    redis_client = await redis.create_connection()
    chat_session = Chat(token=token, messages=[], name=name)
    await redis_client.json().set(str(token), "$", chat_session.dict())
    await redis_client.expire(str(token), 3600)

    return chat_session.model_dump()


@chat.get("/refresh_token")
async def refresh_token(request: Request, token: str):
    json_client = redis.create_json_connection()
    cache = Cache(json_client)
    data = await cache.get_chat_history(token)

    if (data) == None:
        raise HTTPException(
            status_code=400, detail="Session expired or does not exist"
        )
    else:
        return data

@chat.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket, token: str = Depends(get_token)):
    await manager.connect(websocket)
    redis_client = await redis.create_connection()
    producer = Producer(redis_client)
    consumer = StreamConsumer(redis_client)
    token = str(token)

    last_id = "$"
    
    async def response_listener():
        nonlocal last_id
        while True:
            response = await consumer.consume_stream(
                stream_channel="response_channel",
                block=10000,
                count=1,
                last_id=last_id
            )

            if not response:
                continue

            for stream, messages in response:
                for message in messages:
                    message_id = message[0].decode("utf-8") if isinstance(message[0], (bytes, bytearray)) else message[0]
                    token_key = next(iter(message[1].keys()), None)
                    message_value = next(iter(message[1].values()), None)

                    response_token = token_key.decode("utf-8") if isinstance(token_key, (bytes, bytearray)) else token_key

       
                    last_id = message_id

                    if token == response_token:
                        response_message = message_value.decode("utf-8") if isinstance(message_value, (bytes, bytearray)) else message_value
                        await manager.send_personal_message(response_message, websocket)
                        await consumer.delete_message(stream_channel="response_channel", message_id=message_id)
                   

    listener_task = asyncio.create_task(response_listener())


    try:
        while True:
            data = await websocket.receive_text()
            stream_data = {token: data}
            await producer.add_to_stream(stream_data, "message_channel")

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    finally:
        listener_task.cancel()
        with contextlib.suppress(asyncio.CancelError):
            await listener_task