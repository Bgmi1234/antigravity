import os
import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")

def generate_response(prompt: str) -> str:
    """
    Calls the local Ollama instance to generate a response.
    """
    url = f"{OLLAMA_BASE_URL.rstrip('/')}/api/generate"
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "")
    except requests.exceptions.ConnectionError:
        raise Exception(f"Failed to connect to Ollama at {OLLAMA_BASE_URL}. Is it running?")
    except requests.exceptions.RequestException as e:
        raise Exception(f"An error occurred while calling Ollama: {str(e)}")
