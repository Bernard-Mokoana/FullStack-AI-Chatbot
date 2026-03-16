import os
from dotenv import load_dotenv
import redis.asyncio as redis_async
import redis

load_dotenv()

class Redis():
    def __init__(self):
        self.REDIS_URL = os.environ['REDIS_URL']
        self.REDIS_PASSWORD = os.environ['REDIS_PASSWORD']
        self.REDIS_USER = os.environ['REDIS_USER']
        self.connection_url = f"redis://{self.REDIS_USER}:{self.REDIS_PASSWORD}@{self.REDIS_URL}"
        self.REDIS_HOST = os.environ.get("REDIS_HOST", "")
        self.REDIS_PORT = os.environ.get("REDIS_PORT", "")

        # Normalize host/port when REDIS_HOST accidentally includes a port.
        if self.REDIS_HOST and ":" in self.REDIS_HOST:
            host_part, port_part = self.REDIS_HOST.rsplit(":", 1)
            self.REDIS_HOST = host_part
            self.REDIS_PORT = port_part or self.REDIS_PORT

        if isinstance(self.REDIS_PORT, str) and self.REDIS_PORT.isdigit():
            self.REDIS_PORT = int(self.REDIS_PORT)

    async def create_connection(self):
        self.connection = redis_async.from_url(
            self.connection_url, db=0
        )

        return self.connection
    
    def create_rejson_connection(self):
        self.redisJson = redis.Redis(
            host=self.REDIS_HOST,
            port=self.REDIS_PORT,
            decode_responses=True,
            username=self.REDIS_USER,
            password=self.REDIS_PASSWORD,
        )

        return self.redisJson
