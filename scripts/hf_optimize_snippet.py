# scripts/hf_optimize_snippet.py
# pip install requests
import os, requests, json

HF_API_TOKEN = os.environ.get("HF_API_TOKEN")
MODEL = "ibm/granite-1b-instruct"

if not HF_API_TOKEN:
    raise SystemExit("Set HF_API_TOKEN env var")

headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
url = f"https://api-inference.huggingface.co/models/{MODEL}"

prompt = """
Refactor this React TypeScript useEffect code to avoid race conditions when flipping cards quickly.
Provide corrected code and short explanation.
(use TypeScript and functional React)
"""

payload = {
    "inputs": prompt,
    "parameters": {"max_new_tokens": 400, "temperature": 0.2},
    "options": {"wait_for_model": True}
}

resp = requests.post(url, headers=headers, json=payload, timeout=120)
print(resp.status_code)
print(resp.text)
