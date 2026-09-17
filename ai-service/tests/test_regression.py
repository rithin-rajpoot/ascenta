"""Phase 12 regression suite (integration, testing & polish).

Covers dependency-free AI-service contracts that are easy to break during
refactors: request/response schema validation and the unauthenticated
health endpoint.

Run: `.venv\\Scripts\\python.exe tests\\test_regression.py`
(or `python -m unittest tests.test_regression -v`) from ai-service.
"""

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.main import app
from app.schemas import ai as ai_schemas
from app.config.settings import GEMINI_MODEL_CHAIN
from app.services.gemini_service import _is_quota_error, gemini_service

client = TestClient(app)


class ModelFailoverTest(unittest.TestCase):
    def test_chain_has_expected_models_in_order(self):
        self.assertEqual(
            GEMINI_MODEL_CHAIN,
            ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.7-flash", "gemini-3.8-flash"],
        )

    def test_service_builds_one_model_per_chain_entry(self):
        self.assertEqual(len(gemini_service.models), len(GEMINI_MODEL_CHAIN))

    def test_quota_errors_detected(self):
        self.assertTrue(_is_quota_error(Exception("429 You exceeded your current quota")))
        self.assertTrue(_is_quota_error(Exception("Quota exceeded for quota metric")))
        self.assertTrue(_is_quota_error(Exception("ResourceExhausted: rate limit hit")))
        self.assertFalse(_is_quota_error(Exception("Invalid API key")))
        self.assertFalse(_is_quota_error(Exception("model not found")))

    def test_failover_retries_next_model_on_quota_error(self):
        calls = []

        def flaky(model):
            calls.append(model._model_name)
            if len(calls) < 3:
                raise Exception("429 You exceeded your current quota")
            return {"ok": True}

        class FakeModel:
            def __init__(self, name):
                self._model_name = name

        names = ["m1", "m2", "m3"]
        gemini_service.models = [FakeModel(n) for n in names]
        try:
            from unittest.mock import patch

            with patch("app.services.gemini_service.GEMINI_MODEL_CHAIN", names):
                with patch("app.services.gemini_service.time.sleep", return_value=None):
                    result = gemini_service._generate_with_failover(flaky, description="test")
        finally:
            from app.services import gemini_service as gs_module

            gemini_service.models = [
                gs_module.genai.GenerativeModel(name) for name in GEMINI_MODEL_CHAIN
            ]
        self.assertEqual(result, {"ok": True})
        self.assertEqual(calls, names)

    def test_all_models_exhausted_returns_429(self):
        from fastapi import HTTPException

        def always_quota(model):
            raise Exception("429 You exceeded your current quota")

        from unittest.mock import patch

        with patch("app.services.gemini_service.time.sleep", return_value=None):
            with self.assertRaises(HTTPException) as ctx:
                gemini_service._generate_with_failover(always_quota, description="test")
        self.assertEqual(ctx.exception.status_code, 429)

    def test_non_quota_error_fails_fast_without_retry(self):
        from fastapi import HTTPException

        calls = []

        def bad_request(model):
            calls.append(model)
            raise Exception("Invalid API key")

        with self.assertRaises(HTTPException) as ctx:
            gemini_service._generate_with_failover(bad_request, description="test")
        self.assertEqual(ctx.exception.status_code, 500)
        self.assertEqual(len(calls), 1)


class HealthEndpointTest(unittest.TestCase):
    def test_health_reports_service_up(self):
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        # Contract (app/routes/health.py): unauthenticated, {success, message}.
        self.assertTrue(response.json().get("success"))


class SchemaValidationTest(unittest.TestCase):
    def test_idea_request_accepts_empty_payload(self):
        request = ai_schemas.ProjectIdeaRequest()
        self.assertIsNone(request.domain)
        self.assertIsNone(request.difficulty)

    def test_blueprint_request_requires_title(self):
        with self.assertRaises(ValidationError):
            ai_schemas.ProjectBlueprintRequest(description="Missing title")

    def test_blueprint_request_accepts_optional_team_size_and_sdgs(self):
        request = ai_schemas.ProjectBlueprintRequest(
            title="Smart Campus",
            teamSize=4,
            sdgs=["Quality Education", "Climate Action"],
        )
        self.assertEqual(request.teamSize, 4)
        self.assertEqual(len(request.sdgs), 2)

    def test_assistant_request_requires_non_empty_question(self):
        with self.assertRaises(ValidationError):
            ai_schemas.AssistantRequest(question="")

    def test_assistant_context_is_fully_optional(self):
        request = ai_schemas.AssistantRequest(question="How should auth work?")
        self.assertEqual(request.question, "How should auth work?")
        self.assertIsNone(request.context)

    def test_assistant_response_carries_free_text_answer(self):
        response = ai_schemas.AssistantResponse(answer="Use JWT access tokens.")
        self.assertIn("JWT", response.answer)

    def test_features_response_requires_both_feature_lists(self):
        with self.assertRaises(ValidationError):
            ai_schemas.ProjectFeaturesResponse(coreFeatures=["Login"])


if __name__ == "__main__":
    unittest.main()
