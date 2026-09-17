# Ascenta — Development Phases

## Purpose

This document defines the implementation roadmap for Ascenta.

The project is intentionally divided into phases so development remains controlled, testable, and achievable within the initial one-month MVP timeline.

### Important Rules

- Complete and test one phase before moving to the next whenever practical.
- Do not start advanced features while core functionality is unstable.
- Follow `PRD.md` for product requirements.
- Follow `ARCHITECTURE.md` for technical structure.
- Follow `RULES.md` for implementation rules.
- Update `MEMORY.md` after completing meaningful work.
- Update `API.md` whenever an API is added or changed.
- Update `DATABASE.md` whenever a database schema changes.
- A feature is not considered complete until it is tested.
- If time becomes limited, prioritize a complete core workflow over optional polish.

---

# Phase 0 — Project Foundation

## Objective

Set up the complete development environment and repository structure.

## Tasks

### Repository

- Create Git repository.
- Create project root.
- Create `docs/` directory.
- Add project documentation files.
- Add `.gitignore`.
- Add `.env.example`.
- Create README.

### Frontend

- Initialize React + Vite.
- Configure Tailwind CSS.
- Configure React Router.
- Configure Redux Toolkit (state management).
- Create basic application structure.
- Create reusable UI foundation.

### Backend

- Initialize Node.js project.
- Configure Express.
- Configure environment variables.
- Connect MongoDB Atlas.
- Create basic server structure.
- Add centralized error handling.

### AI Service

- Initialize FastAPI project.
- Configure environment variables.
- Create basic service structure.
- Verify Gemini API connectivity.

### Completion Criteria

- Frontend runs successfully.
- Backend runs successfully.
- AI service runs successfully.
- MongoDB connection works.
- All services can be started independently.
- Basic Git workflow is established.

---

# Phase 1 — Authentication & User Management

## Objective

Build secure authentication and the basic user foundation.

## Features

### Student

- Registration
- Login
- Logout
- Profile

### Faculty

- Login
- Profile

### Security

- Password hashing
- JWT authentication
- Protected routes
- Role-based authorization

## Database

Create:

- Users

## Frontend

- Landing page
- Login
- Registration
- Profile
- Protected route handling

## Backend

- Authentication routes
- Authentication controllers
- Authentication services
- JWT middleware
- Authorization middleware

## Completion Criteria

- Student can register with role selection.
- Student can log in.
- Faculty can register and log in.
- Invalid credentials are rejected.
- Protected APIs require authentication.
- Role restrictions work correctly.

## Status

**COMPLETED**

---

# Phase 2 — Team Management

## Objective

Allow students to establish the project team structure.

## Team Options

When starting a project, the student chooses:

### Option 1 — Create a Team

- Enter team name.
- Become team leader.
- Invite members.

### Option 2 — Join a Team

- View/join available teams.
- Accept/join a team.

### Option 3 — Solo Project

- Continue without additional members.

## Features

- Create team
- Join team
- Invite members
- View team members
- Team leader identification
- Team member management
- Shareable human-friendly team invite code (e.g. `ASC-XXXXXX`) for joining

## Database

Create:

- Teams

Update:

- Users

## Completion Criteria

- Student can create a team.
- Student can invite another student.
- Student can join a team (via a shareable invite code).
- Student can select solo project.
- Team leader is correctly identified.
- Unauthorized users cannot manage another team's members.

## Status

**COMPLETED**

---

# Phase 3 — Project Creation & Project Workspace

## Objective

Create the central project workspace that becomes the main area of Ascenta.

## Project Creation

Student selects:

### Option A

Generate project ideas using AI.

### Option B

Already have an idea.

For an existing idea, the student can provide:

- Project title/idea
- Description
- Domain
- Technologies
- Difficulty
- Team size
- Optional SDG information

Team projects are created from the team details page and are bound to that team (the `teamId` flows through setup → ideas → blueprint).

## Project Workspace

Create a centralized workspace containing:

```text
Overview
Features
Milestones
Tasks
Documentation
AI Assistant
Faculty Feedback
```

## Database

Create:

- Projects

## Completion Criteria

- Student can create a project.
- Project belongs to the correct team/owner.
- Solo projects work.
- Team projects work.
- Project workspace opens correctly.
- Project information can be viewed and edited.

## Status

**COMPLETED**

---

# Phase 4 — AI Project Blueprint Generator

## Objective

Implement the main AI-powered project planning feature.

## MVP Endpoint

```text
POST /ai/project-blueprint
```

The initial implementation intentionally uses one endpoint for the complete blueprint.

## Input

Potential inputs:

- Project idea
- Domain
- Team size
- Difficulty
- Technologies
- SDGs

## AI Output

```json
{
  "title": "string",
  "description": "string",
  "problemStatement": "string",
  "objectives": [],
  "sdgs": [
    {
      "goal": "string",
      "reason": "string"
    }
  ],
  "features": [],
  "technologies": [],
  "difficulty": "string",
  "modules": [],
  "futureScope": []
}
```

## User Flow

```text
New Project
    ↓
Generate Idea OR Use Existing Idea
    ↓
Provide Project Inputs
    ↓
Generate Blueprint
    ↓
Review AI Output
    ↓
Edit
    ↓
Save
```

## Important Rules

- AI output must be structured.
- AI output must be validated before saving.
- User edits must be preserved.
- AI must not silently overwrite saved project information.
- Gemini API key must remain inside the FastAPI service.

## Completion Criteria

- AI service receives a valid request.
- Gemini generates a blueprint.
- Response follows the expected structure.
- Frontend displays each section separately.
- Student can edit the generated information.
- Student can save the finalized blueprint.
- AI/API failure is handled gracefully.

> **Implementation note:** The generated blueprint follows the `Project` model schema
> (`problemStatement`, `objectives`, `scope`, `features`, `targetUsers`, `domain`,
> `technologies`, `sdgs`, `methodology`, `expectedOutcome`, `futureScope`) rather than the
> earlier sketch's `modules` field, so it stays consistent with the Project model and the
> Phase 3 blueprint UI. This avoids a schema migration for a field that milestone planning
> (Phase 5) already covers.

## Status

**COMPLETED**

---

# Phase 5 — Milestone Planning

## Objective

Allow students to convert the project blueprint into an actionable development plan.

## Features

- Create milestone
- Edit milestone
- Delete milestone
- Set deadline
- Mark milestone status
- View milestone progress

## AI Assistance

AI-assisted milestone suggestions may use the project blueprint.

For the initial MVP, do not create a separate AI milestone endpoint unless necessary.

The regular backend can manage milestone data.

## Example Milestones

```text
Literature Survey
UI Design
Backend Development
Frontend Development
Integration
Testing
Documentation
Final Submission
```

## Database

Create:

- Milestones

## Completion Criteria

- Team leader can create milestones.
- Milestones have deadlines.
- Students can view milestone status.
- Milestone progress is reflected in the project workspace.

> **Implementation note:** Milestone mutations are restricted to the project owner or team
> leader (see `RULES.md`), while project members can view milestones and progress. Milestones
> are exposed as nested project routes under `POST/GET /api/projects/:projectId/milestones`.
> No separate AI milestone endpoint is used — the regular backend manages milestone data.

## Status

**COMPLETED**

---

# Phase 6 — Task Management / Kanban Board

## Objective

Provide a simple project task-management system.

## Kanban Columns

```text
Todo
In Progress
Review
Completed
```

## Task Information

- Title
- Description
- Assigned member
- Priority
- Due date
- Status

## Features

- Create task
- Assign task
- Update task
- Move task between columns
- Delete task
- Filter/view tasks

## Permissions

Team leaders can:

- Create tasks
- Assign tasks

Team members can:

- Update their task status
- View assigned tasks

## Database

Create:

- Tasks

## Completion Criteria

- Tasks can be created.
- Tasks can be assigned.
- Tasks can move between statuses.
- Task ownership is respected.
- Kanban board works on desktop and smaller screens.

> **Implementation note:** Tasks live under nested project routes
> (`GET/POST /api/projects/:projectId/tasks`, `PUT/DELETE .../tasks/:taskId`). The project owner
> or team leader creates, assigns, edits, and deletes tasks; assignees can update only the
> status of their own tasks (the server rejects any other field change from non-managers).
> Tasks can only be assigned to the owner, leader, or team members. The Kanban board
> (`ProjectTasksPage`, route `/project/:id/tasks`) has four columns (Todo / In Progress /
> Review / Completed) with HTML5 drag-and-drop plus a "Move to" dropdown fallback for touch and
> smaller screens, and supports filtering by assignee and priority. Task progress is reflected
> in the project workspace via an Overview card.

## Status

**COMPLETED**

---

# Phase 7 — Faculty Review Portal

## Objective

Give faculty members visibility into project development and a simple feedback mechanism.

## Faculty Features

- View assigned projects
- View project overview
- View team members
- View milestones
- View task progress
- Submit feedback

## Student Features

- View faculty feedback
- View feedback history

## Database

Create:

- FacultyReviews

## Completion Criteria

- Faculty can access assigned projects.
- Faculty can view project progress.
- Faculty can submit feedback.
- Students can view feedback.
- Students cannot modify faculty feedback.

> **Implementation note:** Faculty assignment is student-initiated — the project owner or team
> leader assigns a faculty reviewer via `POST /api/faculty/projects/:projectId/assign`
> (validated to be a faculty user). `Project` gained an `assignedFaculty` field. Faculty routes
> live under `/api/faculty`: `GET /` (faculty list), `GET /projects` (assigned projects,
> faculty-only), `GET /projects/:projectId` (project + team + milestone/task progress,
> faculty-only and only for their own assignment), `POST/GET /projects/:projectId/reviews`
> (assigned faculty submit; project members and the assigned faculty can view history).
> Feedback is stored in the `FacultyReview` model (comment required, optional 1–5 rating) and
> is read-only for students — no student-facing mutation path exists.

## Status

**COMPLETED**

---

# Phase 8 — AI Technical Assistant

## Objective

Provide students with project-aware technical guidance during development.

## MVP Endpoint

```text
POST /ai/assistant
```

## Supported Use Cases

- Explain technical concepts.
- Suggest APIs.
- Suggest database structures.
- Explain authentication.
- Provide architecture guidance.
- Help debug code snippets.
- Recommend implementation approaches.
- Answer development questions.

## Context

Where practical, the assistant should receive relevant project context such as:

- Project title
- Description
- Features
- Technologies
- Modules

This makes the assistant more useful than a generic chatbot.

## Important Rules

- Assistant responses are guidance, not guaranteed correctness.
- Do not expose secrets.
- Do not execute arbitrary code on the server.
- Do not automatically modify project data.
- Keep the first implementation simple.

## Completion Criteria

- Student can open the assistant from the project workspace.
- Student can ask technical questions.
- AI responds successfully.
- API failures are handled.
- Conversation UI is usable.

> **Implementation note:** `POST /ai/assistant` (FastAPI, proxied by the Express backend at
> `POST /api/ai/assistant`, student-only) returns free-text guidance — the first endpoint that
> does not use the JSON response-schema path. Each request carries the project context
> (title, description, domain, technologies, features, methodology) plus the last ~6 conversation
> turns for continuity. System rules enforce: guidance-not-guarantee, no secrets, no code
> execution, no automatic project modification. The chat UI (`ProjectAssistantPage`,
> `/project/:id/assistant`, opened from an Overview card) shows suggestion chips, a typing
> indicator, error bubbles with retry (the failed question is restored to the input), and
> auto-scroll.

---

# Phase 9 — AI Documentation Generator

## Objective

Reduce the time students spend preparing academic documentation.

## MVP Endpoint

```text
POST /ai/documentation
```

## Supported Sections

- Abstract
- Introduction
- Problem Statement
- Objectives
- Scope
- Methodology
- Conclusion
- Future Scope

## Workflow

```text
Project Workspace
      ↓
Documentation
      ↓
Select Section
      ↓
Generate
      ↓
Review
      ↓
Edit
      ↓
Save
```

## Important Rules

- Use stored project information as context.
- Generated content is a draft.
- Never silently overwrite saved documentation.
- Students must be able to edit generated content.

## Database

Use:

- Documents

## Completion Criteria

- Student can select a document section.
- AI generates content using project context.
- Student can edit the result.
- Student can save the document.
- Existing saved content is protected from accidental overwrite.

> **Status: SKIPPED (deferred by project decision).** The AI Documentation Generator is not
> implemented for now. The `Documents` model, the `POST /ai/documentation` endpoint, and the
> documentation UI are intentionally omitted from the current build and can be revisited after
> the remaining phases if time permits.

## Status

**SKIPPED (deferred)**

---

# Phase 10 — Notifications

## Objective

Provide useful project-related notifications without building an unnecessarily complex notification system.

## MVP Events

- Team invitation
- Task assignment
- Milestone/deadline reminder
- Faculty feedback

## Database

Create:

- Notifications

## Initial Implementation

Use a simple notification model and display notifications in the dashboard.

Real-time notifications are optional.

## Completion Criteria

- Important events create notifications.
- Users can view notifications.
- Notifications can be marked as read.

> **Implementation note:** `Notification` model (recipient, type, title, message, optional
> project ref + deep-link path, read flag). Exposed at `/api/notifications` (authenticated):
> `GET /` (list + unread count), `GET /unread`, `PUT /:id/read`, `PUT /read-all`. Events are
> fire-and-forget so they can never break the primary flow: team invite (added to team),
> task assignment (create + reassignment), milestone deadline set (all team members except
> the creator), and faculty feedback (project owner + leader). The UI is a bell with unread
> badge in the main nav opening a dropdown panel (mark one/all read, deep-links navigate);
> the unread badge polls every 30s. No real-time websockets for MVP.

## Status

**COMPLETED**

---

# Phase 11 — Dashboards & Progress Overview

## Objective

Provide users with a clear overview of project health.

## Student Dashboard

Display:

- Active projects
- Current project phase
- Milestone progress
- Task progress
- Pending tasks
- Recent feedback
- Notifications

## Faculty Dashboard

Display:

- Assigned projects
- Project progress
- Pending reviews
- Recent feedback activity

## Analytics

Keep analytics simple for MVP.

Useful metrics:

- Tasks completed
- Tasks remaining
- Milestones completed
- Overall project progress

## Completion Criteria

- Dashboard data reflects actual database state.
- Progress calculations are consistent.
- Dashboard is responsive.
- No unnecessary analytics complexity is introduced.

> **Implementation note:** `GET /api/dashboard/student` (student-only) aggregates all of a
> student's projects (owned or team-based) with per-project milestone/task counts, pending and
> personally-assigned task counts, next upcoming deadline, a combined progress %, and the 5 most
> recent faculty feedback entries. `GET /api/faculty/dashboard` (faculty-only) does the same for
> assigned projects plus feedback counts and last-feedback date. Simple metrics only — no chart
> library. UI: `StudentDashboardPage` (`/dashboard`, student nav link) with stat cards, project
> progress cards, and recent feedback; the faculty portal now shows the same stats grid and
> per-project progress bars/pending-task/feedback counts.

## Status

**COMPLETED**

---

# Phase 12 — Integration, Testing & Polish

**Status: COMPLETED**

## Objective

Connect all modules into one stable end-to-end product.

## Implementation Note

- **Verification:** server regression suite (`node --test tests/`) 9/9 pass; AI-service suite
  (`python -m unittest discover`) 14/14 pass (8 schema/health + 6 Gemini failover-chain
  tests); frontend production build succeeds; both backend
  apps import cleanly. End-to-end flow verified: register → team → project → ideas/blueprint →
  milestones → Kanban → faculty review → assistant → notifications → dashboards.
- **UI polish delivered:** `react-hot-toast` global toasts with friendly fallback messages
  (never raw HTTP codes) across auth/teams/projects/milestones/tasks/AI pages; `PageLoader`,
  `EmptyState`, `ErrorBoundary`, `ConfirmModal` (accessible, Escape/backdrop close, focus
  trap); 404 `NotFoundPage` + catch-all route; auth client-side validation (email format,
  required fields) with inline messages; API safety net (401 → session-expired toast +
  re-login, offline → single throttled toast); `prefers-reduced-motion` CSS guard so
  spinners/marquee/menu animations are static for reduced-motion users.
- **Security review delivered:** JWT middleware now rejects expired tokens with 401
  (`TokenExpiredError` → "Session expired"), role authorization on every router, AI key
  server-side only (never exposed to browser), CORS allowlist from env, 100kb body cap,
  30 req/15min rate limit on `/api/auth`, AI proxy timeout (90s, raised from 60s for
  Render free-tier cold starts) + no-secret prompts.
- Phase 9 (Documentation Generator) stays **SKIPPED/deferred** — references below to
  "Generate Documentation" in the end-to-end flow are aspirational, not implemented.

## End-to-End Flow

```text
Register
   ↓
Create / Join Team / Solo
   ↓
Create Project
   ↓
Generate Idea OR Use Existing Idea
   ↓
Generate Blueprint
   ↓
Finalize Project
   ↓
Plan Milestones
   ↓
Create & Assign Tasks
   ↓
Develop Project
   ↓
Faculty Reviews
   ↓
Technical AI Assistance
   ↓
Generate Documentation
   ↓
Final Submission
```

## Testing

Test:

- Authentication
- Authorization
- Team creation
- Team joining
- Invitations
- Solo projects
- Project creation
- AI blueprint generation
- Blueprint editing
- Milestone management
- Kanban operations
- Faculty reviews
- AI assistant
- Documentation generation
- Notifications
- Dashboard calculations

## UI Polish

- Responsive design
- Consistent spacing
- Consistent typography
- Loading states
- Empty states
- Error states
- Toast notifications
- Form validation
- Accessibility basics

## Security Review

- Environment variables
- JWT protection
- Role authorization
- Input validation
- API protection
- AI key protection

---

# Phase 13 — Deployment & Final Release

**Status: COMPLETED**

## Objective

Deploy the MVP and prepare it for demonstration and paper-related evaluation.

## Deployment

Live deployment (all three tiers):

| Tier | Host | URL |
|---|---|---|
| Frontend | Vercel | `https://ascenta-frontend.vercel.app` |
| Backend | Render (free tier) | `https://ascenta-backend-hixp.onrender.com` |
| AI Service | Render (free tier, manual Web Service) | `https://<ai-service>.onrender.com` |
| Database | MongoDB Atlas | — |

## Implementation Note

- **AI-service deploy config:** `render.yaml` Blueprint (rootDir `ai-service`, build
  `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`,
  `healthCheckPath: /health`, `PYTHON_VERSION: 3.13.13`) plus `ai-service/.python-version`
  (`3.13.13`, matching the tested local venv). For the manual Web Service flow `render.yaml`
  is ignored, so the same values (`ALLOWED_ORIGINS`, `PYTHON_VERSION=3.13.13`,
  `GEMINI_API_KEY`, `INTERNAL_API_KEY`) are set as dashboard env vars.
- **Backend Render hardening:** `server.js` binds `0.0.0.0` explicitly (Render routes to the
  injected `$PORT`; no manually-set `PORT` in the dashboard so `10000` takes effect, local
  dev unchanged at `5000`).
- **AI proxy vs. cold starts:** proxy timeout raised to **90s** (was 60s) to cover double
  cold start (backend + AI service waking) plus Gemini generation; timeouts and HTML
  gateway 502/503/504s both return the friendly retry JSON
  (`"The AI service is waking up or taking too long..."`) instead of leaking gateway pages.
  Production logs print the AI target host (never the key) and truncate gateway HTML to its
  `<title>` for fast diagnosis.
- **Gemini model failover chain:** `gemini-3.5-flash → 3.6 → 3.7 → 3.8-flash` (configurable
  via `GEMINI_MODEL_CHAIN` env var). Quota/rate-limit failures (429 / `ResourceExhausted`)
  automatically retry the same prompt on the next model; non-quota errors fail fast. All
  models exhausted → HTTP 429 with an honest retry-later message (surfaced by the
  backend proxy + frontend toasts). Applies to all five AI endpoints. AI-service suite
  grew 8 → **14 tests** (chain order, quota detection, failover, exhaustion, fail-fast).
- **Project deletion (post-Phase-12 feature):** `DELETE /api/projects/:id`, manager-only
  (owner or team leader → 403 otherwise), cascade-deletes milestones, tasks, faculty
  reviews, and project notifications. Frontend: Delete Project button + `ConfirmModal` on
  the overview header, toast + navigate to `/teams` on success.
- **Blueprint envelope fix:** `ProjectBlueprintPage` unwraps `res?.data?.data || res?.data`
  so the full blueprint populates fields regardless of response nesting.
- **Faculty dashboard fix:** removed stale `getAssignedProjects()` call that crashed the
  page with `ReferenceError`.
- **Verification at completion:** server regression 9/9 pass, AI service 14/14 pass,
  frontend production build succeeds.

## Tasks

- [x] Configure production environment variables.
- [x] Configure CORS.
- [x] Deploy frontend.
- [x] Deploy backend.
- [x] Deploy FastAPI AI service.
- [x] Connect production database.
- [x] Test all production APIs.
- [x] Test AI functionality in production.
- [x] Verify authentication.
- [x] Verify responsive UI.

---

# Development Priority

If time becomes limited, follow this priority:

## Tier 1 — Must Have

```text
Authentication
Team Management
Project Creation
Project Workspace
Project Blueprint
Milestones
Kanban Tasks
Faculty Review
```

## Tier 2 — Core AI Features

```text
Technical Assistant
Documentation Generator
```

## Tier 3 — Supporting Features

```text
Notifications
Dashboards
Analytics
```

## Tier 4 — Polish

```text
UI animations
Advanced filters
Advanced analytics
Performance improvements
Extra AI capabilities
```

A complete Tier 1 + Tier 2 implementation is more valuable than partially implemented advanced features.

---

# One-Month Suggested Schedule

This schedule is a guideline, not a rigid requirement.

## Week 1 — Foundation

```text
Day 1
Project setup

Day 2
Frontend structure + design system

Day 3
Backend + database

Day 4
Authentication

Day 5
Authentication testing + team management

Day 6
Team workflows

Day 7
Project creation
```

---

## Week 2 — Core Project Management

```text
Day 8
Project workspace

Day 9
Project Blueprint UI

Day 10
FastAPI + Gemini integration

Day 11
Blueprint response validation + saving

Day 12
Milestones

Day 13
Kanban board

Day 14
Task assignment + testing
```

---

## Week 3 — AI + Faculty

```text
Day 15
Faculty authentication/access

Day 16
Faculty project view

Day 17
Faculty feedback

Day 18
AI Technical Assistant

Day 19
Documentation Generator

Day 20
Documentation editing/saving

Day 21
Notifications + dashboard
```

---

## Week 4 — Integration & Release

```text
Day 22
End-to-end integration

Day 23
Bug fixing

Day 24
Authentication/security testing

Day 25
AI failure/error handling

Day 26
Responsive UI + UX polish

Day 27
Production deployment

Day 28
Production testing

Day 29
Paper/demo preparation

Day 30
Final fixes + release
```

---

# Definition of Phase Completion

A phase is considered complete when:

- Feature implementation is functional.
- Frontend and backend are integrated.
- Database operations work correctly.
- Authentication/authorization is correct where applicable.
- Error handling exists.
- Basic responsive behavior works.
- Manual testing has been completed.
- Relevant documentation is updated.
- `MEMORY.md` records the completed work.

---

# Future Scope

The following can be implemented only after the MVP is stable and sufficient time remains:

- Admin Portal
- GitHub Integration
- Viva Preparation
- Team Chat
- Calendar Integration
- Mobile Application
- AI Architecture Diagram Generation
- Dedicated `/ai/project-ideas` endpoint
- Dedicated `/ai/sdg-mapping` endpoint
- Dedicated `/ai/feature-suggestions` endpoint
- Dedicated `/ai/milestones` endpoint
- Advanced analytics
- Multi-college support
- Industry mentor integration

These are NOT required for the initial release.
