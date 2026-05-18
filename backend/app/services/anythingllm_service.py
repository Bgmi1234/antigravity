import os
import requests
from dotenv import load_dotenv

load_dotenv()

ANYTHINGLLM_BASE_URL = os.getenv("ANYTHINGLLM_BASE_URL", "http://localhost:3001")
ANYTHINGLLM_API_KEY = os.getenv("ANYTHINGLLM_API_KEY", "")
ANYTHINGLLM_WORKSPACE_SLUG = os.getenv("ANYTHINGLLM_WORKSPACE_SLUG", "")

def ask_workspace(question: str) -> str:
    """
    Sends a query to an AnythingLLM workspace and returns the response.
    """
    if not ANYTHINGLLM_API_KEY or not ANYTHINGLLM_WORKSPACE_SLUG:
        raise ValueError("AnythingLLM API key and workspace slug must be configured.")

    url = f"{ANYTHINGLLM_BASE_URL.rstrip('/')}/api/v1/workspace/{ANYTHINGLLM_WORKSPACE_SLUG}/chat"
    
    headers = {
        "Authorization": f"Bearer {ANYTHINGLLM_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    payload = {
        "message": question,
        "mode": "chat"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data.get("textResponse", "No response text found in the AnythingLLM reply.")
    except requests.exceptions.ConnectionError:
        raise Exception(f"Failed to connect to AnythingLLM at {ANYTHINGLLM_BASE_URL}. Is it running?")
    except requests.exceptions.HTTPError as e:
        if response.status_code == 401 or response.status_code == 403:
            raise Exception("AnythingLLM authentication failed. Check your API key.")
        elif response.status_code == 404:
            raise Exception(f"AnythingLLM workspace '{ANYTHINGLLM_WORKSPACE_SLUG}' not found.")
        raise Exception(f"AnythingLLM API error: {str(e)}")
    except requests.exceptions.RequestException as e:
        raise Exception(f"An error occurred while calling AnythingLLM: {str(e)}")
