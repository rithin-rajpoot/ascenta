from pydantic import BaseModel
from typing import List, Optional

class ProjectIdeaRequest(BaseModel):
    domain: Optional[str] = None
    technologies: Optional[str] = None
    difficulty: Optional[str] = None
    interests: Optional[str] = None

class ProjectIdea(BaseModel):
    title: str
    description: str

class ProjectIdeasResponse(BaseModel):
    ideas: List[ProjectIdea]

class ProjectFeaturesRequest(BaseModel):
    title: str
    description: Optional[str] = None
    domain: Optional[str] = None
    technologies: Optional[str] = None

class ProjectFeaturesResponse(BaseModel):
    coreFeatures: List[str]
    optionalFeatures: List[str]

class ProjectSDGsRequest(BaseModel):
    title: str
    description: Optional[str] = None

class SDGMapping(BaseModel):
    goal: str
    reason: str
    impact: str

class ProjectSDGsResponse(BaseModel):
    sdgs: List[SDGMapping]

class ProjectBlueprintRequest(BaseModel):
    title: str
    description: Optional[str] = None
    domain: Optional[str] = None
    technologies: Optional[str] = None
    difficulty: Optional[str] = None
    teamSize: Optional[int] = None
    # Preferred SDG goal names the AI should align the blueprint with.
    sdgs: Optional[List[str]] = None

class ProjectBlueprintResponse(BaseModel):
    title: str
    problemStatement: str
    description: str
    objectives: List[str]
    scope: str
    features: List[str]
    targetUsers: List[str]
    domain: str
    technologies: List[str]
    sdgs: List[SDGMapping]
    methodology: str
    expectedOutcome: str
    futureScope: str
