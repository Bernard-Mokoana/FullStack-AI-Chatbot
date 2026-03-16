import os
from urllib.parse import urlparse
from dotenv import load_dotenv
import redis
import redis.asyncio as redis_async

load_dotenv()

class Redis():
    def __init__(self):
        self.REDIS_URL = os.environ["REDIS_URL"]
        self.REDIS_PASSWORD = os.environ["REDIS_PASSWORD"]
        self.REDIS_USER = os.environ["REDIS_USER"]
        self.REDIS_HOST = os.environ.get("REDIS_HOST", "")
        self.REDIS_PORT = os.environ.get("REDIS_PORT", "")
        self.connection_url = self._build_connection_url()
        self._redis_host, self._redis_port = self._resolve_host_port()

    def _build_connection_url(self) -> str:
        if "://" in self.REDIS_URL:
            return self.REDIS_URL
        return f"redis://{self.REDIS_USER}:{self.REDIS_PASSWORD}@{self.REDIS_URL}"

    def _resolve_host_port(self):
        if "://" in self.REDIS_URL:
            parsed = urlparse(self.REDIS_URL)
            host = parsed.hostname or ""
            port = parsed.port
            return host, port

        if self.REDIS_URL:
            parsed = urlparse(f"redis://{self.REDIS_URL}")
            host = parsed.hostname or ""
            port = parsed.port
            if host:
                return host, port

        host = self.REDIS_HOST
        if host and ":" in host:
            host, port_str = host.rsplit(":", 1)
            try:
                port = int(port_str)
            except ValueError:
                port = None
            return host, port

        try:
            port = int(self.REDIS_PORT) if self.REDIS_PORT else None
        except ValueError:
            port = None
        return host, port


    async def create_connection(self):
        self.connection = redis_async.from_url(
            self.connection_url, db=0)
        
        return self.connection
    
    def create_json_connection(self):
        self.redisJson = redis.Redis(
            host=self._redis_host,
            port=self._redis_port,
            decode_responses=True,
            username=self.REDIS_USER,
            password=self.REDIS_PASSWORD,
        )

        return self.redisJson

