import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Ordered model failover chain (first = primary). When a model returns a
# quota/rate-limit error (429 / ResourceExhausted), the service automatically
# retries the same prompt on the next model in the list instead of failing.
# Override with a comma-separated GEMINI_MODEL_CHAIN env var.
GEMINI_MODEL_CHAIN = [
    model.strip()
    for model in os.getenv(
        "GEMINI_MODEL_CHAIN",
        "gemini-3.5-flash,gemini-3.6-flash,gemini-3.7-flash,gemini-3.8-flash",
    ).split(",")
    if model.strip()
]

# Shared secret checked on /ai/* requests. Optional: when unset the service
# stays open (local development), when set only the backend can call it.
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "")

# Origins allowed to call this service from a browser.
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5000"
    ).split(",")
    if origin.strip()
]