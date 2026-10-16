"""
Quick diagnostic: confirms your OPENROUTER_API_KEY works and checks which
vision-capable models respond successfully. Run from the backend/ folder:

    python test_models.py
"""
import os
import base64
import io
from pathlib import Path

import requests
from dotenv import load_dotenv
from PIL import Image

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

API_KEY = os.environ.get("OPENROUTER_API_KEY")
URL = "https://openrouter.ai/api/v1/chat/completions"

if not API_KEY:
    print("❌ OPENROUTER_API_KEY not set in backend/.env")
    raise SystemExit(1)

# Small dummy red square for testing vision models
img = Image.new("RGB", (100, 100), color="red")
buf = io.BytesIO()
img.save(buf, format="JPEG")
data_url = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

candidates = [
    "openai/gpt-4o-mini",
    "openai/gpt-4o",
    "google/gemini-2.5-flash",
    "google/gemini-2.5-flash-lite",
    "anthropic/claude-3.5-sonnet",
    "meta-llama/llama-3.2-11b-vision-instruct",
]

print("Testing candidate OpenRouter vision models with an image request...\n")

for model in candidates:
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Analyze image. Return JSON: {\"status\": \"ok\"}"},
                    {"type": "image_url", "image_url": {"url": data_url}},
                ],
            }
        ],
        "max_tokens": 50,
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "DermaLens AI - model test",
    }
    try:
        resp = requests.post(URL, headers=headers, json=payload, timeout=30)
        if resp.status_code == 200:
            text = resp.json()["choices"][0]["message"]["content"]
            print(f"✅ [SUCCESS] Model '{model}' WORKS! Output: {text[:60]!r}")
        else:
            print(f"❌ [FAILED] Model '{model}': HTTP {resp.status_code} - {resp.text[:150]}")
    except Exception as e:
        print(f"❌ [FAILED] Model '{model}': {e}")

print("\nSet OPENROUTER_MODEL in backend/.env to whichever model succeeded above.")
