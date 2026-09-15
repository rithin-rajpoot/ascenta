from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import ALLOWED_ORIGINS, GEMINI_API_KEY, INTERNAL_API_KEY
from app.routes.health import router as health_router
from app.routes.ai import router as ai_router

app = FastAPI(
    title="Ascenta AI Service",
    description="AI service for Ascenta - Gemini API integration",
    version="0.1.0",
)

# Only the configured frontend/backend origins may call this service.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(ai_router)


@app.on_event("startup")
async def log_configuration() -> None:
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY is not set - AI endpoints will return 503.")
    if not INTERNAL_API_KEY:
        print("WARNING: INTERNAL_API_KEY is not set - the AI endpoints are publicly reachable.")