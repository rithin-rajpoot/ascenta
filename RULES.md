# Ascenta — Development Rules

## 1. Purpose

This document defines the rules that every developer and AI coding assistant must follow while building Ascenta.

These rules are intended to keep the codebase consistent, maintainable, secure, and within the MVP scope defined in `PRD.md` and `ARCHITECTURE.md`.

When a requested implementation conflicts with these rules, prefer the simpler implementation that satisfies the PRD and ask for clarification before expanding the scope.

---

# 2. Core Development Principles

- Follow the PRD as the primary product specification.
- Follow `ARCHITECTURE.md` for the technical architecture.
- Do not add features that are not part of the current phase unless explicitly requested.
- Prefer simple, maintainable implementations over unnecessary complexity.
- Do not over-engineer the MVP.
- Build reusable components and services where reuse is meaningful.
- Keep frontend, backend, database, and AI responsibilities clearly separated.
- Do not duplicate business logic across multiple layers.
- Do not introduce a new library when an existing project dependency can solve the problem adequately.
- Do not create unnecessary microservices.
- Do not change the technology stack without explicit approval.

---

# 3. MVP Scope Rules

The current MVP includes:

- Authentication
- Student and Faculty roles
- Team creation, joining, invitations, and solo projects
- Project creation
- AI project idea generation
- AI project blueprint generation
- Manual project configuration
- AI-assisted SDG mapping
- AI feature suggestions
- AI technology suggestions
- AI milestone planning
- Kanban task management
- Faculty project reviews and feedback
- AI documentation generation
- AI technical assistant
- Notifications
- Student dashboard
- Faculty dashboard

The following are explicitly OUT OF SCOPE for the MVP:

- Admin portal
- GitHub integration
- Viva preparation
- In-app team chat
- Mobile application
- Calendar integration
- Advanced real-time collaboration
- AI architecture diagram generation

Do not implement out-of-scope features unless explicitly requested.

---

# 4. Roles and Permissions

## Student

Students can:

- Create or join teams
- Create solo projects
- Create and manage projects
- Create milestones
- Create and manage tasks according to their role
- Use AI features
- Generate documentation
- Use the technical assistant
- View faculty feedback

## Team Leader

Team leaders have additional project permissions:

- Invite team members
- Manage team membership
- Assign tasks
- Create and manage milestones
- Manage project-level information

Do not assume every team member has team-leader permissions.

## Faculty

Faculty can:

- View assigned projects
- Monitor project progress
- Review milestones
- Provide feedback

## Admin

Admin functionality is NOT part of the current implementation.

Do not create admin pages, routes, controllers, models, or UI unless explicitly requested later.

---

# 5. Authentication and Security Rules

- Use JWT-based authentication.
- Passwords must never be stored in plain text.
- Hash passwords using bcrypt or an equivalent secure password hashing mechanism.
- Never hardcode JWT secrets.
- Never hardcode API keys.
- Store secrets in environment variables.
- Never expose Gemini API keys to the frontend.
- Protect authenticated routes on the backend.
- Enforce authorization on the backend, not only in the frontend.
- Validate user input on the server.
- Do not trust role information supplied directly by the client.
- Return appropriate HTTP status codes.
- Do not expose sensitive information in error responses.

---

# 6. Frontend Rules

- Use React functional components.
- Use hooks appropriately.
- Use Tailwind CSS for styling.
- Avoid unnecessary inline styles.
- Build reusable components for repeated UI patterns.
- Keep pages focused on composition rather than large amounts of business logic.
- Keep API calls inside service/API modules rather than scattering Axios calls throughout components.
- Show loading states for asynchronous operations.
- Show useful error states.
- Show success feedback for important actions.
- Validate forms before submission and also validate them on the backend.
- Make all important pages responsive.
- Maintain consistent spacing, typography, buttons, cards, forms, and colors according to `DESIGN.md`.
- Avoid unnecessarily complex global state management.
- Do not introduce Redux unless the project actually requires it.
- Avoid deeply nested components when a simpler structure is possible.

---

# 7. Backend Rules

Use a clear separation:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Model / Database
```

- Routes define endpoints and authorization requirements.
- Controllers handle HTTP request/response concerns.
- Services contain business logic.
- Models define database structures.
- Do not place large amounts of business logic inside routes.
- Do not directly access the database from frontend code.
- Validate request bodies and parameters.
- Use consistent API response structures.
- Handle errors centrally where practical.
- Avoid duplicate business logic.
- Use RESTful naming conventions.
- Keep controllers small and readable.

---

# 8. Database Rules

- MongoDB Atlas is the database for the MVP.
- Use Mongoose models.
- Keep schemas explicit and understandable.
- Use references where relationships require them.
- Avoid unnecessary data duplication.
- Add timestamps to important entities.
- Validate required fields.
- Use appropriate indexes when justified.
- Do not change an existing schema without considering existing data and updating `DATABASE.md`.
- Whenever a database entity is added or changed, update `DATABASE.md`.

Core entities include:

```text
Users
Teams
Projects
Milestones
Tasks
FacultyReviews
Notifications
Documents
AIChats
```

---

# 9. AI Architecture Rules

AI functionality must remain separated from the main Node.js/Express backend.

Architecture:

```text
React Frontend
      ↓
Node.js / Express Backend
      ↓
FastAPI AI Service
      ↓
Google Gemini API
```

The frontend must NOT call Gemini directly.

The Gemini API key must remain inside the FastAPI AI service environment.

---

# 10. AI Endpoint Strategy

The AI functionality is divided into **three MVP AI capabilities**.

These three capabilities are part of the required MVP and should be implemented.

## MVP AI Endpoints

### 1. Project Blueprint

```text
POST /ai/project-blueprint
```

Purpose:

Generate the complete project blueprint from a selected or user-provided project idea.

The blueprint can include:

- Project title
- Description
- Problem statement
- Objectives
- SDG recommendations
- SDG reasoning
- Feature suggestions
- Technology suggestions
- Difficulty
- Modules
- Future scope

This endpoint intentionally combines several AI capabilities into one request to reduce implementation time and API complexity.

---

### 2. Documentation Generator

```text
POST /ai/documentation
```

Purpose:

Generate editable documentation sections using the stored project context.

Supported document sections include:

- Abstract
- Introduction
- Problem Statement
- Objectives
- Scope
- Methodology
- Conclusion
- Future Scope

The endpoint should receive the project context and requested document section/type and return a structured or clearly delimited draft.

This is an **MVP requirement**, not a future feature.

---

### 3. Technical Assistant

```text
POST /ai/assistant
```

Purpose:

Provide project-related technical guidance throughout development.

It can assist with:

- Technical concept explanations
- Architecture guidance
- API suggestions
- Database design guidance
- Debugging assistance
- Technology recommendations
- Development questions

This is an **MVP requirement**, not a future feature.

---

# 10.1 Future AI Endpoint Expansion

The MVP deliberately avoids creating a separate endpoint for every small AI capability.

The following endpoints are optional future optimizations:

```text
POST /ai/project-ideas
POST /ai/sdg-mapping
POST /ai/feature-suggestions
POST /ai/milestones
```

These capabilities are already covered in the MVP through the existing AI workflows.

For example:

```text
Project Ideas
     ↓
Project Blueprint

SDG Mapping
     ↓
Project Blueprint

Feature Suggestions
     ↓
Project Blueprint

Milestone Suggestions
     ↓
Existing milestone-planning workflow
```

If sufficient development time remains, these capabilities may later be separated into dedicated endpoints for better modularity and independent prompting.

**Do not build these additional endpoints during the initial MVP unless explicitly requested.**

---

# 10.2 AI Endpoint Summary

| Endpoint | MVP | Purpose |
|---|---|---|
| `POST /ai/project-blueprint` | YES | Complete project blueprint |
| `POST /ai/documentation` | YES | Documentation generation |
| `POST /ai/assistant` | YES | Technical guidance |
| `POST /ai/project-ideas` | Future | Dedicated idea generation |
| `POST /ai/sdg-mapping` | Future | Dedicated SDG mapping |
| `POST /ai/feature-suggestions` | Future | Dedicated feature generation |
| `POST /ai/milestones` | Future | Dedicated milestone generation |

The goal is to keep the MVP AI architecture small while still delivering all required AI functionality.

# 11. Project Blueprint Response Structure

The initial `POST /ai/project-blueprint` endpoint should return structured JSON.

Recommended response:

```json
{
  "title": "Smart Campus Attendance System",

  "description": "A system that ...",

  "problemStatement": "Students and institutions ...",

  "objectives": [
    "Objective 1",
    "Objective 2",
    "Objective 3"
  ],

  "sdgs": [
    {
      "goal": "SDG 4 - Quality Education",
      "reason": "This project contributes to ..."
    }
  ],

  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],

  "technologies": [
    "React",
    "Node.js",
    "MongoDB"
  ],

  "difficulty": "Intermediate",

  "modules": [
    "Authentication",
    "Dashboard",
    "Attendance Management"
  ],

  "futureScope": [
    "Future enhancement 1",
    "Future enhancement 2"
  ]
}
```

The exact fields may evolve during implementation, but the response must remain structured and predictable.

The frontend should render the response as editable sections rather than displaying raw AI-generated text.

---

# 12. AI Blueprint User Flow

```text
Student chooses New Project
        ↓
Generate AI Idea
OR
Use Existing Idea
        ↓
Enter / Select Project Inputs
        ↓
Generate Blueprint
        ↓
AI generates:
    • Title
    • Description
    • Problem Statement
    • Objectives
    • SDGs
    • Features
    • Technologies
    • Difficulty
    • Modules
    • Future Scope
        ↓
Student reviews
        ↓
Student edits if required
        ↓
Save Project
```

---

# 13. Future AI Endpoint Expansion

The initial implementation should use the single blueprint endpoint.

If sufficient development time remains, the AI service may later be split into more specialized endpoints.

Potential future endpoints:

```text
POST /ai/project-ideas
POST /ai/project-blueprint
POST /ai/documentation
POST /ai/milestones
POST /ai/assistant
POST /ai/sdg-mapping
POST /ai/feature-suggestions
```

This is a FUTURE optimization, not an MVP requirement.

Do NOT build all of these initially simply because they are listed here.

The priority is to get the single blueprint endpoint working reliably first.

---

# 14. AI Technical Assistant Rules

The Technical Assistant is an **MVP feature** and is separate conceptually from the Project Blueprint Generator.

It should support:

- Technical concept explanations
- Architecture guidance
- API suggestions
- Database design guidance
- Debugging assistance
- Technology recommendations
- Development questions

The assistant must not:

- Automatically modify project data
- Automatically modify source code
- Execute arbitrary user-provided code on the server
- Expose API keys
- Pretend that generated technical suggestions are guaranteed to be correct

For the initial MVP, implement the simplest reliable version.

---

# 15. AI Documentation Rules

The Documentation Generator is an **MVP feature**.

Documentation generation must use the stored project context wherever possible.

The system should not repeatedly ask students to provide information already stored in the project.

Generated documentation is a DRAFT.

Students must be able to:

```text
Generate
   ↓
Review
   ↓
Edit
   ↓
Save
```

AI-generated content must never automatically replace previously saved user content without confirmation.

---

# 16. AI Safety and Reliability Rules

- Treat AI output as untrusted generated content.
- Validate structured AI responses before saving them.
- Handle malformed AI responses gracefully.
- Handle Gemini/API failures gracefully.
- Provide useful error messages to users.
- Never assume an AI response will always contain every requested field.
- Use fallback handling for missing fields.
- Do not expose internal prompts or API credentials.
- Avoid sending unnecessary sensitive user information to the AI service.
- Keep prompts centralized and versionable where practical.

---

# 17. Project Workspace Rules

Each project should have a centralized workspace.

Recommended sections:

```text
Overview
Features
Milestones
Tasks
Documentation
AI Assistant
Faculty Feedback
```

Project-related functionality should live inside this workspace where logically appropriate.

Do not create unnecessary standalone pages when a feature naturally belongs to the project workspace.

---

# 18. Kanban Rules

Task workflow:

```text
Todo
  ↓
In Progress
  ↓
Review
  ↓
Completed
```

Each task should support, where applicable:

- Title
- Description
- Assigned member
- Priority
- Due date
- Status

Do not add complex task-management functionality such as dependencies, time tracking, recurring tasks, or advanced sprint management unless explicitly requested.

---

# 19. Faculty Review Rules

Faculty review should remain simple for the MVP.

Faculty can:

- View project progress
- View milestones
- View task completion
- Submit feedback

Do not implement complex academic grading or approval workflows unless explicitly requested.

---

# 20. Notification Rules

Notifications should focus only on useful MVP events:

- Team invitation
- Task assignment
- Upcoming milestone/deadline
- Faculty feedback

Do not build a complex notification engine for the MVP.

---

# 21. API Documentation Rule

Whenever an API endpoint is added or modified:

- Update `API.md`.
- Document method.
- Document route.
- Document authentication requirement.
- Document request body.
- Document response structure.
- Document possible errors.

Do not leave undocumented production endpoints.

---

# 22. Database Documentation Rule

Whenever a database collection/schema changes:

- Update `DATABASE.md`.
- Document fields.
- Document types.
- Document required fields.
- Document relationships/references.
- Document important indexes.

---

# 23. Code Quality Rules

- Use meaningful variable and function names.
- Avoid single-letter variables except for simple loop callbacks.
- Keep functions reasonably small.
- Avoid deeply nested conditional logic.
- Avoid duplicated code.
- Remove unused imports and variables.
- Do not leave debugging `console.log` statements in production code.
- Add comments only where they explain non-obvious logic.
- Do not write comments that merely restate the code.
- Keep secrets and configuration out of source code.

---

# 24. Error Handling Rules

Every important asynchronous operation should handle:

```text
Loading
Success
Error
```

Backend errors should return consistent responses.

Frontend should display user-friendly error messages.

Do not expose stack traces or internal implementation details to users.

---

# 25. Git Rules

Use Git throughout development.

Commit after completing logical units of work.

Prefer meaningful commit messages such as:

```text
feat: add project creation flow
feat: add team invitation system
feat: implement kanban task board
feat: add project blueprint endpoint
fix: handle invalid AI response
fix: protect faculty routes
```

Avoid commits such as:

```text
update
changes
stuff
final
final2
working
```

---

# 26. Documentation Synchronization

The following files must remain synchronized:

```text
PRD.md
ARCHITECTURE.md
RULES.md
PHASES.md
DATABASE.md
API.md
DESIGN.md
MEMORY.md
```

If implementation changes a documented architectural decision, update the relevant documentation.

Do not allow documentation to become significantly different from the actual implementation.

---

# 27. Definition of Done

A feature is considered complete only when:

- Frontend implementation is complete.
- Backend implementation is complete.
- API works correctly.
- Database integration works.
- Authentication/authorization is enforced where required.
- Input validation exists.
- Loading state exists where appropriate.
- Error handling exists.
- Responsive UI is implemented.
- Feature is manually tested.
- Relevant `API.md` documentation is updated.
- Relevant `DATABASE.md` documentation is updated.
- `PHASES.md` is updated.
- `MEMORY.md` is updated.

---

# 28. AI Coding Agent Rules

When an AI coding assistant is asked to implement a feature:

1. Read `PRD.md`.
2. Read `ARCHITECTURE.md`.
3. Read `RULES.md`.
4. Read the current `PHASES.md`.
5. Read `MEMORY.md` before continuing existing work.
6. Determine which existing files/components/services are relevant.
7. Reuse existing code where appropriate.
8. Do not rewrite working code unnecessarily.
9. Implement only the requested scope.
10. Test the implementation.
11. Update relevant documentation.
12. Update `MEMORY.md` with the completed work.

If requirements are ambiguous, do not invent major functionality. Ask for clarification.

---

# 29. Scope Control Rule

The primary objective is to complete a stable MVP.

When deciding between two implementations:

> Choose the simpler implementation unless the more complex implementation provides a clear and necessary benefit.

Do not add functionality merely because it is technically possible.

---

# 30. Priority Order

When time is limited, development priority is:

1. Authentication
2. Team Management
3. Project Creation
4. Project Blueprint Generator
5. Milestone Planning
6. Kanban Task Management
7. Faculty Review
8. AI Technical Assistant
9. Documentation Generator
10. Notifications
11. Dashboard Improvements
12. Future enhancements

A complete working core is more important than partially implemented advanced features.

---

# 31. Current Strategic Decision

Ascenta will initially be developed using:

- React
- Node.js
- Express.js
- MongoDB
- FastAPI
- Google Gemini API

The AI service is intentionally separated so that the main backend can potentially be migrated to Spring Boot in the future without requiring a redesign of the AI functionality.

The initial goal is speed, stability, and completion of the MVP.

The required MVP AI layer consists of:

```text
POST /ai/project-blueprint
POST /ai/documentation
POST /ai/assistant
```

Do not add additional AI endpoints unless they provide a clear benefit and sufficient development time remains.

---

# Final Rule

**Build Ascenta as a focused, polished MVP—not as an unnecessarily large system.**

Every implementation decision should answer:

> Does this help us deliver the product defined in the PRD?

If the answer is no, defer it to future scope.
