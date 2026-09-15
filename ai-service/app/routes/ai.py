from fastapi import APIRouter, Depends
from app.schemas.ai import (
    ProjectIdeaRequest, ProjectIdeasResponse,
    ProjectFeaturesRequest, ProjectFeaturesResponse,
    ProjectSDGsRequest, ProjectSDGsResponse,
    ProjectBlueprintRequest, ProjectBlueprintResponse,
    AssistantRequest, AssistantResponse
)
from app.dependencies import require_internal_key
from app.services.gemini_service import gemini_service

router = APIRouter(
    prefix="/ai",
    tags=["AI Integration"],
    dependencies=[Depends(require_internal_key)],
)

@router.post("/project-ideas")
async def generate_project_ideas(request: ProjectIdeaRequest):
    result = gemini_service.generate_ideas(request.model_dump())
    return {"success": True, "data": result}

@router.post("/project-features")
async def generate_project_features(request: ProjectFeaturesRequest):
    result = gemini_service.generate_features(request.model_dump())
    return {"success": True, "data": result}

@router.post("/project-sdgs")
async def generate_project_sdgs(request: ProjectSDGsRequest):
    result = gemini_service.generate_sdgs(request.model_dump())
    return {"success": True, "data": result}

@router.post("/project-blueprint")
async def generate_project_blueprint(request: ProjectBlueprintRequest):
    result = gemini_service.generate_blueprint(request.model_dump())
    return {"success": True, "data": result}

@router.post("/assistant", response_model=AssistantResponse)
async def ai_assistant(request: AssistantRequest):
    result = gemini_service.generate_assistant(request.model_dump())
    return result
