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

client = TestClient(app)


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
