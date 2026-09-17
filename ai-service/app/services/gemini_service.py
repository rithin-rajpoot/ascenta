import os
import json
import time
import google.generativeai as genai
from fastapi import HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google.api_core.exceptions import ResourceExhausted
from app.config.settings import GEMINI_MODEL_CHAIN

load_dotenv()


def _is_quota_error(error: Exception) -> bool:
    """True when the failure is a quota/rate-limit error worth retrying on the next model."""
    if isinstance(error, ResourceExhausted):
        return True
    message = str(error)
    code = getattr(error, "code", None) or getattr(getattr(error, "response", None), "status_code", None)
    if code == 429:
        return True
    lowered = message.lower()
    return "429" in message or "quota" in lowered or "rate limit" in lowered or "resourceexhausted" in lowered.replace(" ", "").replace("_", "")


class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        self.configured = bool(api_key)
        if not self.configured:
            print("WARNING: GEMINI_API_KEY not set")
        else:
            genai.configure(api_key=api_key)

        self.models = [genai.GenerativeModel(name) for name in GEMINI_MODEL_CHAIN]
        # Back-compat: some code/tests may reference `.model` (the primary).
        self.model = self.models[0]
        print(f"Gemini model chain: {' -> '.join(GEMINI_MODEL_CHAIN)}")


    def _ensure_configured(self) -> None:
        """Fail clearly (and without leaking the key) when AI is not configured."""
        if not self.configured:
            raise HTTPException(
                status_code=503,
                detail="AI service is not configured. Please contact the administrator.",
            )

    def _generate_json(self, prompt: str, schema: BaseModel) -> dict:
        self._ensure_configured()

        def call(model):
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=schema,
                ),
            )
            return json.loads(response.text)

        return self._generate_with_failover(call, description="JSON generation")

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
        provided_sdgs = data.get("sdgs") or []
        if isinstance(provided_sdgs, list):
            provided_sdgs = [str(s).strip() for s in provided_sdgs if str(s).strip()]
        sdgs_text = ", ".join(provided_sdgs) if provided_sdgs else "Any"
        team_size = data.get("teamSize")
        team_size_text = team_size if team_size else "Not specified"
        prompt = f"""
        Generate a structured academic project blueprint for the following project:
        Title: {data.get('title')}
        Description: {data.get('description')}
        Domain: {data.get('domain', 'Any')}
        Technologies: {data.get('technologies', 'Any')}
        Difficulty: {data.get('difficulty', 'Any')}
        Team Size: {team_size_text}
        Preferred SDGs (align the blueprint and the SDG mapping with these, if provided): {sdgs_text}

        Provide a comprehensive overview including problem statement, objectives, scope, features, target users, domain, technologies, SDGs, methodology, expected outcome, and future scope.
        IMPORTANT: Respond ONLY in English.
        """
        return self._generate_json(prompt, ProjectBlueprintResponse)

    def _generate_text(self, prompt: str) -> str:
        """Free-text generation (no JSON schema) for conversational answers."""
        self._ensure_configured()
        return self._generate_with_failover(
            lambda model: model.generate_content(prompt).text,
            description="text generation",
        )

    def _generate_with_failover(self, call, description: str):
        """Run `call(model)` across the model chain, failing over on quota errors.

        Each model gets one attempt. Quota/rate-limit failures (429 /
        ResourceExhausted) move to the next model with a short pause; any other
        error fails fast since retrying a different model won't help.
        """
        last_error = None
        for index, (model_name, model) in enumerate(zip(GEMINI_MODEL_CHAIN, self.models)):
            try:
                return call(model)
            except HTTPException:
                raise
            except Exception as e:
                last_error = e
                if not _is_quota_error(e):
                    print(f"Gemini API Error ({model_name}): {str(e)}")
                    raise HTTPException(status_code=500, detail="Failed to generate content from AI")
                print(f"Gemini quota exceeded on {model_name} ({index + 1}/{len(self.models)}), failing over...: {str(e)[:200]}")
                if index < len(self.models) - 1:
                    time.sleep(1)
        print(f"Gemini API Error: all {len(self.models)} models exhausted quota: {str(last_error)[:300]}")
        raise HTTPException(
            status_code=429,
            detail="AI quota exceeded on all available models. Please try again in a little while.",
        )

    def generate_assistant(self, data: dict) -> dict:
        from app.schemas.ai import AssistantRequest

        req = AssistantRequest(**data)
        ctx = req.context

        context_lines = []
        if ctx:
            if ctx.title:
                context_lines.append(f"Project Title: {ctx.title}")
            if ctx.description:
                context_lines.append(f"Description: {ctx.description}")
            if ctx.domain:
                context_lines.append(f"Domain: {ctx.domain}")
            if ctx.technologies:
                context_lines.append(f"Technologies: {ctx.technologies}")
            if ctx.features:
                context_lines.append("Features: " + ", ".join(ctx.features))
            if ctx.methodology:
                context_lines.append(f"Methodology: {ctx.methodology}")
        context_text = "\n".join(context_lines) if context_lines else "No project context provided."

        history_text = ""
        if req.history:
            recent = req.history[-6:]  # keep the prompt small
            turns = [
                f"{'Student' if m.role == 'user' else 'Assistant'}: {m.content}"
                for m in recent
            ]
            history_text = "Recent conversation:\n" + "\n".join(turns) + "\n\n"

        prompt = f"""
        You are a helpful technical assistant for a student working on an academic software project.
        Answer the student's question with clear, practical, step-by-step technical guidance.
        You may explain technical concepts, suggest APIs, suggest database structures, explain
        authentication, provide architecture guidance, help debug code snippets, recommend
        implementation approaches, and answer development questions.

        {context_text}

        {history_text}Student's question: {req.question}

        Rules:
        - Responses are guidance, not guaranteed correctness — where uncertain, say so.
        - Never include real secrets, API keys, or credentials.
        - Do not claim to have modified any project data.
        - Keep the answer concise and focused on the question.
        - IMPORTANT: Respond ONLY in English.
        """
        answer = self._generate_text(prompt)
        return {"answer": answer}

gemini_service = GeminiService()
