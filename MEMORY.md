# Ascenta — Project Memory

> **Purpose:** This file is the persistent working memory for AI coding agents working on Ascenta.
>
> **Important:** Update this file whenever meaningful implementation work is completed, an important architectural/design decision is made, or the current development task changes.

---

# 1. Project Identity

**Project Name:** Ascenta

**Project Type:** AI-assisted academic project lifecycle management platform

**Primary Goal:**

Help students take an academic project from idea → planning → development → review → documentation → completion through one unified platform.

**Target Users:**

- Students
- Faculty

**Admin:** Not included in the current MVP. It may be considered later if sufficient time remains.

---

# 2. Current Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Redux Toolkit
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## AI Service

- FastAPI
- Gemini API

## Database

- MongoDB Atlas

## Deployment — Planned

- Frontend → Vercel
- Node.js Backend → Render
- FastAPI AI Service → Render
- Database → MongoDB Atlas

---

# 3. Architecture Summary

```text
React + Vite
     │
     │ REST API
     ▼
Node.js + Express
     │
     ├──────────────► MongoDB Atlas
     │
     └──────────────► FastAPI AI Service
                            │
                            ▼
                       Gemini API
```

The Node.js backend is responsible for normal application/business APIs.

The FastAPI service is responsible for AI-related processing.

The Gemini API key must remain inside the FastAPI service and must never be exposed to the frontend.

---

# 4. Current Development Status

## Overall Status

**Phase 3 — Project Creation & AI Project Blueprint is complete.**

Project creation, AI idea generation, feature suggestion, SDG mapping, and blueprint generation are implemented and verified. The user can create solo or team projects from their team dashboard and view the project overview. Phase 3 has been refined further with team-scoped projects, an enhanced project overview, and hardened project authorization.

## Current Phase

**Phase 3 — Project Creation & AI Project Blueprint (COMPLETED, refinements staged)**

## Current Task

Phase 3 work (team invite codes, team-scoped projects, project overview enhancements, hardened project authorization) is complete and ready to commit/push. Phase 4 — AI Project Blueprint Generator has not yet started.

---

# 5. Documentation Status

| File | Status | Purpose |
|---|---|---|
| `PRD.md` | Complete | Product requirements |
| `ARCHITECTURE.md` | Complete | Application architecture |
| `RULES.md` | Complete | AI/development rules |
| `PHASES.md` | Complete | Development roadmap |
| `DESIGN.md` | Complete | UI/UX and design system |
| `MEMORY.md` | Active | Persistent development memory |

---

# 6. MVP Scope

## Included

### Authentication

- Student registration
- Student login
- Faculty login
- JWT authentication
- Role-based authorization

### Team Management

- Create team
- Invite members
- Join team
- Solo project
- Shareable human-friendly team invite code (e.g. `ASC-XXXXXX`) for joining a team

### Project Management

- Create project
- Generate project ideas with AI
- Use an existing project idea
- Project workspace
- Project overview
- Features
- Technologies
- Difficulty
- SDG mapping

### AI Project Blueprint

Initial AI endpoint:

```text
POST /ai/project-blueprint
```

The endpoint generates structured project information such as:

- Project overview
- Problem statement
- Objectives
- SDG mapping
- Features
- Technologies
- Modules
- Future scope

### Milestones

- Create milestone
- Edit milestone
- Delete milestone
- Deadline
- Status
- Progress

### Task Management

Kanban board:

```text
Todo
In Progress
Review
Completed
```

Tasks include:

- Title
- Description
- Assignee
- Priority
- Due date
- Status

### Faculty Review

- Faculty project access
- Project progress view
- Milestone/task visibility
- Feedback
- Feedback history

### AI Technical Assistant

Endpoint:

```text
POST /ai/assistant
```

Used for project-aware technical guidance.

### AI Documentation

Endpoint:

```text
POST /ai/documentation
```

Supported initial sections:

- Abstract
- Introduction
- Problem Statement
- Objectives
- Scope
- Methodology
- Conclusion
- Future Scope

### Notifications

Initial events:

- Team invitation
- Task assignment
- Deadline reminder
- Faculty feedback

### Dashboard

Student and faculty dashboards with basic project progress information.

---

# 7. Explicitly Excluded From MVP

Do NOT implement these unless explicitly added later:

- Admin portal
- GitHub integration
- Viva preparation
- Mobile application
- Advanced analytics
- Calendar integration
- Team chat
- Industry mentor integration

Future AI endpoints such as:

```text
POST /ai/project-ideas
POST /ai/sdg-mapping
POST /ai/feature-suggestions
POST /ai/milestones
```

are not required initially.

The MVP should avoid unnecessary AI micro-endpoints.

---

# 8. AI Endpoint Strategy

The initial AI implementation should remain simple.

## Current AI Endpoints

```text
POST /ai/project-blueprint
POST /ai/assistant
POST /ai/documentation
```

`/ai/project-blueprint` is the primary AI workflow and should generate the structured project blueprint.

Do not split every AI feature into a separate endpoint unless there is a clear implementation need and sufficient time.

---

# 9. Development Priority

## Tier 1 — Must Have

1. Authentication
2. Team management
3. Project creation
4. Project workspace
5. AI project blueprint
6. Milestones
7. Kanban tasks
8. Faculty review

## Tier 2 — Core AI

9. Technical assistant
10. Documentation generator

## Tier 3 — Supporting

11. Notifications
12. Dashboards
13. Basic analytics

## Tier 4 — Polish

14. UI animations
15. Advanced filters
16. Advanced analytics
17. Other optional improvements

If time becomes limited, prioritize a complete Tier 1 + Tier 2 implementation over partially implemented optional features.

---

# 10. Current Database Entities

Expected core entities:

```text
User
Team
Project
Milestone
Task
FacultyReview
Document
Notification
```

Additional entities should only be introduced when required by an implemented feature.

Avoid unnecessary database complexity.

---

# 11. Current API Strategy

The API should be organized by domain.

Example:

```text
/api/auth
/api/users
/api/teams
/api/projects
/api/milestones
/api/tasks
/api/reviews
/api/documents
/api/notifications
/ai/*
```

Follow the existing architecture documentation before introducing new API patterns.

Update `API.md` whenever API documentation is introduced or an endpoint changes.

---

# 12. Current Design Direction

Ascenta uses a modern SaaS/productivity aesthetic.

## Primary

```text
#6366F1
```

## Secondary

```text
#8B5CF6
```

## Font

```text
Inter
```

## Primary Theme

Light theme.

## UI Characteristics

- Clean
- Modern
- Professional
- Minimal
- Student-friendly
- Developer-oriented

Follow `DESIGN.md` for detailed UI rules.

---

# 13. Important Product Decisions

### Decision 1 — MERN + FastAPI

The initial implementation uses MERN with FastAPI for AI rather than Spring Boot.

Reason:

Build the MVP faster using technologies already familiar to the developer.

Spring Boot may be explored or used in a future rewrite, but it is not part of the current MVP implementation.

### Decision 2 — No Admin Initially

Admin functionality is intentionally excluded from the MVP.

It may be added later if sufficient time remains.

### Decision 3 — AI Is Assistive

AI-generated content is a draft/recommendation.

Users must be able to:

- Review it
- Edit it
- Save it

AI must not silently overwrite user data.

### Decision 4 — Keep AI Architecture Simple

Do not create a separate AI endpoint for every small AI capability.

Use the three core AI endpoints unless a strong reason exists to expand them.

### Decision 5 — Complete Core Workflow First

A complete working project lifecycle is more important than having many partially implemented features.

---

# 14. Current Work Log

## Initial State

- Project concept finalized.
- Project renamed to Ascenta.
- MVP scope reduced to make the project achievable within approximately one month.
- GitHub integration removed.
- Viva preparation removed.
- Admin module excluded from MVP.
- MERN + FastAPI selected for initial implementation.
- Project documentation structure established.

## Phase 0 — Project Foundation (Completed)

- Created monorepo-style structure: `client/`, `server/`, `ai-service/`, `docs/`.
- Created root `.gitignore`, `.env.example`, and `README.md`.
- Initialized Git repository.
- Scaffolded React + Vite frontend with Tailwind CSS, React Router, Axios, Redux Toolkit, and Lucide React.
- Created frontend structure: `assets/`, `components/`, `layouts/`, `pages/`, `routes/`, `services/`, `hooks/`, `utils/`, `store/`.
- Created test pages (Home, About) proving React + Vite + Tailwind + React Router work.
- Created Redux store (`client/src/store/index.js`) and wired `Provider` into `main.jsx`.
- Created Express backend with clean structure: `config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `services/`, `utils/`.
- Installed `bcryptjs` and `jsonwebtoken` in server.
- Created MongoDB connection logic with clear failure diagnostics.
- Created `/api/health` endpoint returning `{"success": true, "message": "Ascenta backend is running"}`.
- Created FastAPI AI service with structure: `config/`, `routes/`, `schemas/`, `services/`.
- Created `/health` endpoint returning `{"success": true, "message": "Ascenta AI service is running"}`.
- Configured `GEMINI_API_KEY` environment variable in AI service.
- Created `.env` files with dummy values for all three services.
- Installed `@reduxjs/toolkit` and `react-redux` in client.
- Verified all three services run independently.
- Verified frontend production build succeeds with Redux wired in.
- Verified security: `.env` files ignored, no secrets hardcoded.
- Pushed first commit to GitHub (`main` branch) at `git@github.com:rithin-rajpoot/ascenta.git`.

## Phase 1 — Authentication & User Management (Completed)

- Created `User` model with name, email, password (hashed via bcrypt), and role (student/faculty).
- Created `generateToken` JWT utility.
- Created `authMiddleware` with `protect` (JWT verification) and `authorize` (role-based) middleware.
- Created `authService` with `registerStudent`, `loginUser`, and `getProfile`.
- Created `authController` with `register`, `login`, and `profile` handlers.
- Created `authRoutes` with `POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/profile` (protected).
- Wired auth routes into `app.js`.
- Updated `errorMiddleware` to surface handled error messages.
- Created frontend `authService` API client.
- Updated `api.js` with JWT token interceptor.
- Created `authSlice` Redux slice with `registerUser`, `loginUser`, `logout`, and `clearError`.
- Registered auth reducer in the Redux store.
- Created `ProtectedRoute` component for route protection.
- Created `AuthLayout` for login/register pages.
- Created `LoginPage`, `RegisterPage`, and `ProfilePage`.
- Updated routes with `/login`, `/register`, and protected `/profile`.
- Updated `MainLayout` with auth-aware navigation (Login/Register when logged out; Profile/Logout when logged in).
- Verified frontend production build succeeds.
- Verified full auth flow end-to-end: register → login → protected profile.

## Phase 2 — Team Management (Completed)

- Created `Team` model with name, leader, and members (Mongoose references).
- Created `teamService` with createTeam, getTeam, inviteMember, joinTeam, removeMember.
- Created `teamController` with create, get, invite, join, remove handlers.
- Created `teamRoutes` with POST /api/teams, GET /api/teams/:id, POST /api/teams/:id/invite, POST /api/teams/:id/join, DELETE /api/teams/:id/members/:userId.
- Wired team routes into `app.js` (all protected by `protect` middleware).
- Created frontend `teamService` API client.
- Created `teamSlice` Redux slice with createTeam, getTeam, inviteMember, joinTeam, removeMember, clearTeam, clearError.
- Registered team reducer in the Redux store.
- Created `TeamSetupPage` (Create/Join/Solo selection).
- Created `CreateTeamPage`, `JoinTeamPage`, and `TeamDetailsPage`.
- Added protected routes: /team/setup, /team/create, /team/join, /team/:id.
- Verified frontend production build succeeds.
- Verified all team APIs end-to-end: create, get, invite, join, remove, with proper authorization.
## Phase 3 — Project Creation & AI Blueprint (Completed, refinements)

- Added `inviteCode` to the `Team` model (unique, shareable `ASC-XXXXXX` codes) with a `generateInviteCode` utility and automatic backfill for legacy teams.
- Added `POST /api/teams/join/by-code` route + `joinTeamByCode` service so students join by a human-friendly code instead of a raw MongoDB ID.
- Fixed the `team.populate(...).populate is not a function` crash after `save()` — populated references are now awaited separately via `loadTeamRefs`.
- `inviteMember`, `joinTeam`, `joinTeamByCode`, and `removeMember` now return fully populated teams (leader/members + invite code).
- Team-scoped projects: `teamId` is carried through setup → ideas → blueprint and tied to the project; added `getTeamProjects` API + `projectSlice`/`projectService` wiring; Team Details shows the team's project + "Start Project".
- Hardened project authorization: ObjectIds compared as strings for owner/leader/member checks; added `getTeamProjectsController` (members only).
- `ProjectOverviewPage` now renders Objectives, Scope, Target Users, Expected Outcome, and Future Scope.
- `ProjectBlueprintPage` resiliently guards string/null array fields; AI proxy adds request/response logging; Gemini prompts forced to respond in English only.
- `JoinTeamPage` takes an invite code (auto-uppercase); `TeamDetailsPage` shows the shareable invite code with a copy button and improved member-management UX (confirm remove, loading/success/error states, member count).

---

# 15. Current Task

**Phase 3 work (team invite codes, team-scoped projects, project overview enhancements, hardened project authorization) is complete and staged to push. Phase 4 — AI Project Blueprint Generator has not yet started.**

---

# 16. Files Currently Being Worked On

```text
Staged for the current Phase 2/3 commit:
server/src/utils/generateInviteCode.js         (new)
server/src/models/Team.js
server/src/controllers/teamController.js
server/src/routes/teamRoutes.js
server/src/services/teamService.js
server/src/controllers/projectController.js
server/src/routes/projectRoutes.js
server/src/services/projectService.js
server/src/controllers/aiController.js
ai-service/app/services/gemini_service.py
client/src/pages/team/JoinTeamPage.jsx
client/src/pages/team/TeamDetailsPage.jsx
client/src/services/teamService.js
client/src/store/slices/teamSlice.js
client/src/services/projectService.js
client/src/store/slices/projectSlice.js
client/src/pages/project/ProjectSetupPage.jsx
client/src/pages/project/ProjectIdeasPage.jsx
client/src/pages/project/ProjectBlueprintPage.jsx
client/src/pages/project/ProjectOverviewPage.jsx
```

---

# 17. Known Issues

```text
None currently.
```

Record unresolved bugs or implementation problems here.

Do not remove an issue until it has actually been resolved.

---

# 18. Important Decisions Log

### 2026-08-16 — Redux Toolkit for Frontend State Management

Decision:
Redux Toolkit (@reduxjs/toolkit + react-redux) is the state management library for the frontend.

Reason:
The application will share significant global state (authentication, current project, team data) across many pages/sections, and the project explicitly requires Redux Toolkit.

Impact:
- Frontend stack updated in ARCHITECTURE.md, RULES.md, PHASES.md, MEMORY.md, README.md.
- RULES.md previously discouraged Redux; it now mandates Redux Toolkit and forbids alternative state management libraries.
- Phase 0 now includes Redux Toolkit configuration alongside React Router.
- client/package.json will include `@reduxjs/toolkit` and `react-redux`.

### 2026-09-06 — Human-Friendly Team Invite Codes

Decision:
Teams use a shareable, human-friendly invite code (`ASC-XXXXXX`, e.g. `ASC-K7M2QP`) for joining instead of a raw MongoDB ObjectId.

Reason:
MongoDB IDs are not user-friendly and were not surfaced anywhere in the team UI, making it hard for peers to join. A short, unambiguous code is easy to share and type.

Impact:
- `Team` model gained a unique `inviteCode` field; legacy teams are backfilled on read.
- Joining is now done via `POST /api/teams/join/by-code`; the old `/:id/join` route is kept for backward compatibility.
- Codes are case-insensitive (normalized to uppercase) and generated with an ambiguous-character-free alphabet.
- Team Details shows the code with a copy button; the Join page accepts the code.
Use this format for future decisions:

```text
### YYYY-MM-DD — Decision Title

Decision:
What was decided.

Reason:
Why it was decided.

Impact:
What parts of the system are affected.
```

---

# 19. Change Log

Use this section for major completed changes.

```text
### 2026-08-16 — Phase 0: Project Foundation

- Added: Monorepo structure (client/, server/, ai-service/, docs/).
- Added: Root .gitignore, .env.example, README.md.
- Added: React + Vite frontend with Tailwind, React Router, Axios, Redux Toolkit, Lucide.
- Added: Express backend with health endpoint and MongoDB connection.
- Added: FastAPI AI service with health endpoint.
- Added: Git repository initialized.
- Added: .env files with dummy values for all services.
- Verified: Frontend, backend, and AI service all run independently.
- Verified: Security — .env ignored, no secrets hardcoded.

### 2026-08-20 — Phase 1: Authentication & User Management

- Added: User model with bcrypt password hashing.
- Added: JWT authentication (generateToken, protect middleware).
- Added: Role-based authorization (authorize middleware).
- Added: Auth routes, controller, and service.
- Added: Frontend login, register, and profile pages.
- Added: Redux auth slice and ProtectedRoute.
- Verified: Register, login, and protected profile endpoints work end-to-end.

### 2026-08-25 — Phase 2: Team Management

- Added: Team model with name, leader, and members.
- Added: Team service, controller, and routes.
- Added: Frontend team service, Redux team slice, and team pages.
- Verified: Create, get, invite, join, and remove team APIs work end-to-end.
- Verified: Authorization (leader-only actions, no-token 401, non-leader 403).

### 2026-08-25 — Phase 2: Team Management UI Completion

- Added: `getUserTeams` API endpoint to fetch a user's teams.
- Added: Frontend `MyTeamsPage` dashboard.
- Added: "Teams" navigation link in `MainLayout`.
- Verified: Dashboard correctly displays existing teams and prompts for team creation if empty.

### 2026-08-25 — Phase 3: Project Creation & AI Blueprint

- Added: `Project` MongoDB schema including fields for title, description, domain, technologies, features, SDGs, problem statement, objectives, etc.
- Added: FastAPI AI Service endpoints (`/ai/project-ideas`, `/ai/project-features`, `/ai/project-sdgs`, `/ai/project-blueprint`) with `google-generativeai` integration and Pydantic schemas.
- Added: Node.js API routes for CRUD operations on Projects (`POST /api/projects`, `GET /api/projects/:id`, `PUT /api/projects/:id`) and proxy routes for AI requests (`/api/ai/*`).
- Added: Redux `projectSlice` and frontend services (`projectService.js`, `aiService.js`).
- Added: React Pages for the project creation flow: `ProjectSetupPage`, `ProjectIdeasPage`, `ProjectBlueprintPage`, and `ProjectOverviewPage`.
- Added: "Start Project" button in Team Dashboard to connect the Phase 2 flow to Phase 3.
- Verified: Flow allows choosing AI idea or manual idea, mapping SDGs, suggesting features, generating blueprint, saving project, and viewing overview.
- Verified: Authorization enforces that only authorized users (owners/team members) can access their project.
### 2026-08-25 — Phase 1: Authentication & User Management (Role Expansion)

- Added: Role selection to both Registration and Login pages (Student vs Faculty).
- Added: Validation in `authService.js` to ensure login attempts match the selected role.
- Added: Role-based dashboard rendering in `HomePage.jsx` to direct Students to Projects/Teams and Faculty to their dashboard.
- Verified: Phases 0-3 strictly restrict Faculty from accessing Student-only creation routes.
### 2026-09-06 — Phase 2/3 Refinements: Team Invite Codes & Team-Scoped Projects

- Added: Shareable human-friendly team invite codes (`ASC-XXXXXX`) via new `utils/generateInviteCode.js` and an `inviteCode` field on the `Team` model (unique, backfilled for legacy teams).
- Added: `POST /api/teams/join/by-code` endpoint and `joinTeamByCode` service so students join by invite code instead of a raw MongoDB ID.
- Fixed: `team.populate(...).populate is not a function` crash after `save()` (document populate returns a Promise); replaced with separately awaited `loadTeamRefs`, and all mutating team endpoints now return fully populated teams.
- Added: `getTeamProjects` API + `projectSlice`/`projectService` wiring; `teamId` now flows through setup → ideas → blueprint so projects are tied to the correct team; Team Details shows the team's project with a "Start Project" action.
- Added: `ProjectOverviewPage` sections for Objectives, Scope, Target Users, Expected Outcome, and Future Scope.
- Hardened: Project authorization compares ObjectIds as strings for owner/leader/member checks.
- Added: `JoinTeamPage` invite-code input (auto-uppercase) and Team Details invite-code card with copy-to-clipboard.
- Improved: Team Details member management UX (confirm before remove, loading/success/error states, member count, stale-team clear on navigation).
- Improved: `ProjectBlueprintPage` guards string/null array fields; AI proxy request/response logging; Gemini prompts forced to respond only in English.
- Verified: Frontend production build succeeds; server `node --check` passes on all modified files.
```

Keep entries concise.

---

# 20. AI Agent Instructions

When an AI coding agent starts a task:

1. Read `PRD.md`.
2. Read `ARCHITECTURE.md`.
3. Read `RULES.md`.
4. Read `PHASES.md`.
5. Read `DESIGN.md` for frontend work.
6. Read this `MEMORY.md`.
7. Check the current phase.
8. Check the current task.
9. Inspect existing code before creating new code.
10. Reuse existing components and utilities.
11. Do not assume a feature is missing before checking the repository.
12. Do not modify unrelated modules.
13. Test the implementation.
14. Update this file after meaningful work.
15. Record important architectural decisions.
16. Record unresolved issues.
17. Update the current task when moving to another task.

---

# 21. Memory Update Rule

After completing a meaningful task, update:

```text
Current Development Status
Current Phase
Current Task
Work Log
Files Currently Being Worked On
Known Issues
Change Log
```

Do not rewrite the entire file unnecessarily.

Keep historical decisions intact.

---

# 22. Definition of "Done"

A feature should not be recorded as completed merely because code was written.

A feature is considered complete when:

- Implementation exists.
- Frontend/backend integration works where applicable.
- Database operations work where applicable.
- Authentication/authorization is correct where applicable.
- Error handling exists.
- Basic testing has been performed.
- The feature works in the intended user flow.
- Relevant documentation has been updated.

Only then should the feature be marked as completed in this memory file.

---

# 23. Future Scope Tracking

Future ideas can be recorded here without becoming MVP requirements.

```text
- Admin portal
- GitHub integration
- Viva preparation
- Mobile application
- Advanced analytics
- Calendar integration
- Team chat
- Industry mentor integration
- Additional AI endpoints
```

Do not implement future-scope items unless the MVP is stable and there is sufficient time.
