import os
import json
import google.generativeai as genai
from fastapi import HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("WARNING: GEMINI_API_KEY not set")
        else:
            genai.configure(api_key=api_key)
        
        self.model = genai.GenerativeModel("gemini-3.6-flash")

    def _generate_json(self, prompt: str, schema: BaseModel) -> dict:
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=schema,
                ),
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to generate content from AI")

    def generate_ideas(self, data: dict) -> dict:
        from app.schemas.ai import ProjectIdeasResponse
        prompt = f"""
        Generate 3 suitable academic project ideas for a computer science or software engineering student.
        Domain: {data.get('domain', 'Any')}
        Technologies: {data.get('technologies', 'Any')}
        Difficulty: {data.get('difficulty', 'Any')}
        Interests: {data.get('interests', 'Any')}
        
        Provide a short title and a concise description for each idea.
        IMPORTANT: Respond ONLY in English.
        """
        return self._generate_json(prompt, ProjectIdeasResponse)

    def generate_features(self, data: dict) -> dict:
        from app.schemas.ai import ProjectFeaturesResponse
        prompt = f"""
        Suggest core and optional features for the following academic project:
        Title: {data.get('title')}
        Description: {data.get('description')}
        Domain: {data.get('domain', 'Any')}
        Technologies: {data.get('technologies', 'Any')}
        
        IMPORTANT: Respond ONLY in English.
        """
        return self._generate_json(prompt, ProjectFeaturesResponse)

    def generate_sdgs(self, data: dict) -> dict:
        from app.schemas.ai import ProjectSDGsResponse
        prompt = f"""
        Suggest 1 to 3 relevant UN Sustainable Development Goals (SDGs) for the following academic project:
        Title: {data.get('title')}
        Description: {data.get('description')}
        
        For each SDG, provide the goal name, reason for alignment, and expected social impact.
        IMPORTANT: Respond ONLY in English.
        """
        return self._generate_json(prompt, ProjectSDGsResponse)

    def generate_blueprint(self, data: dict) -> dict:
        from app.schemas.ai import ProjectBlueprintResponse
        prompt = f"""
        Generate a structured academic project blueprint for the following project:
        Title: {data.get('title')}
        Description: {data.get('description')}
        Domain: {data.get('domain', 'Any')}
        Technologies: {data.get('technologies', 'Any')}
        Difficulty: {data.get('difficulty', 'Any')}
        
        Provide a comprehensive overview including problem statement, objectives, scope, features, target users, domain, technologies, SDGs, methodology, expected outcome, and future scope.
        IMPORTANT: Respond ONLY in English.
        """
        return self._generate_json(prompt, ProjectBlueprintResponse)

gemini_service = GeminiService()
