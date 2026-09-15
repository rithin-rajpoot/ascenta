import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

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