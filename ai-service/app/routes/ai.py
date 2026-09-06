from fastapi import APIRouter
from app.schemas.ai import (
    ProjectIdeaRequest, ProjectIdeasResponse,
    ProjectFeaturesRequest, ProjectFeaturesResponse,
    ProjectSDGsRequest, ProjectSDGsResponse,
    ProjectBlueprintRequest, ProjectBlueprintResponse
)
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/ai", tags=["AI Integration"])

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
