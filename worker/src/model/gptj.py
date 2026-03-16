import os
from dotenv import load_dotenv
from urllib.parse import urlparse
from huggingface_hub import InferenceClient

load_dotenv()

class GPT:
    def __init__(self):
        token = os.environ.get('HUGGINFACE_INFERENCE_TOKEN')
        if not token:
            raise RuntimeError("Missing HUGGINFACE_INFERENCE_TOKEN in environment.")
        self.client = InferenceClient(
            provider="hf-inference",
            api_key=token
        )
        self.model_id = self._resolve_model_id()
        self.max_new_tokens = int(os.environ.get("MAX_NEW_TOKENS", "25"))

    def _resolve_model_id(self) -> str:
        model_id = os.environ.get("MODEL_ID")
        if model_id:
            return model_id
        url = os.environ.get("MODEL_URL", "")
        if url:
            parsed = urlparse(url)
            path = parsed.path.strip("/")
            if "/models/" in path:
                return path.split("/models/")[-1]
            parts = path.split("/")
            if len(parts) >= 2:
                return "/".join(parts[-2:])
        return "katanemo/Arch-Router-1.5B"

    def query(self, input: str) -> list:
        response = self.client.chat.completions.create(
            model=self.model_id,
            messages=[{"role": "user", "content": input}],
            max_tokens=self.max_new_tokens
        )
        text = response.choices[0].message.content
        res = str(text.split("Human:")[0]).strip("\n").strip()
        return res

if __name__ == "__main__":
    GPT().query("Hello")
