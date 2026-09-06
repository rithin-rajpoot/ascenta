from fastapi import FastAPI
from app.routes.health import router as health_router
from app.routes.ai import router as ai_router

app = FastAPI(
    title="Ascenta AI Service",
    description="AI service for Ascenta — Gemini API integration",
    version="0.1.0",
)

app.include_router(health_router)
app.include_router(ai_router)