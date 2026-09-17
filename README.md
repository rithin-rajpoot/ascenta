# Ascenta

**AI-assisted academic project lifecycle management platform.**

Ascenta helps students take an academic project from idea → planning → development → review → documentation → completion through one unified platform. It combines project planning, team collaboration, AI assistance, and faculty interaction in a modern SaaS experience.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Redux Toolkit, Lucide React |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| AI Service | Python, FastAPI, Google Gemini API |
| Database | MongoDB Atlas |

---

## Repository Structure

```text
ascenta/
│
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── ai-service/      # FastAPI AI service
├── docs/            # Project documents
│
├── .gitignore
├── .env.example
├── README.md
│
├── PRD.md
├── ARCHITECTURE.md
├── RULES.md
├── PHASES.md
├── DESIGN.md
└── MEMORY.md
```

---

## Architecture

```text
React Frontend
      │
      │ REST API
      ▼
Node.js + Express Backend
      │
      ├──────────► MongoDB Atlas
      │
      └──────────► FastAPI AI Service
                        │
                        ▼
                   Gemini API
```

---

## Local Setup

### Prerequisites

- Node.js (18+)
- Python 3.10+
- MongoDB Atlas account (for database)

### 1. Environment Variables

Each service reads its own `.env` file. Create them from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
cp ai-service/.env.example ai-service/.env
```

Then replace the placeholder values with your real values.

---

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Runs at `http://localhost:5173`.

---

### 3. Backend

```bash
cd server
npm install
npm run dev
```

Runs at `http://localhost:5000`.

Health check: `GET http://localhost:5000/api/health`

---

### 4. AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs at `http://localhost:8000`.

Health check: `GET http://localhost:8000/health`

---

## Features Implemented

### Authentication & User Management (Phase 1)
- Student and Faculty registration with role selection
- Secure login with JWT authentication
- Password hashing (bcrypt)
- Role-based route protection (frontend + backend)
- User profile management

### Team Management (Phase 2)
- Create team with leader assignment
- Invite members by user ID
- Shareable human-friendly team invite code (e.g. `ASC-XXXXXX`) — join any team without exposing internal IDs
- Join existing teams
- Solo project option
- Remove members (leader only)
- My Teams dashboard

### Project Creation & AI Blueprint (Phase 3)
- Project creation (solo or team-based)
- AI-powered project idea generation (Gemini API)
- AI-powered feature suggestions
- AI-powered SDG mapping
- Full blueprint generation (problem statement, objectives, scope, methodology, etc.)
- Editable blueprint form — students remain in control of AI-generated content
- Team-scoped projects — projects are created and viewed from the team page
- Project overview page (title, domain, technologies, objectives, scope, target users, methodology, expected outcome, future scope, features, SDGs)
- Authorization — only owners/team members can access their projects

### AI Project Blueprint Generator (Phase 4)
- Dedicated `POST /api/ai/project-blueprint` endpoint (proxied to the FastAPI AI service)
- Accepts project idea, domain, technologies, difficulty, team size, and preferred SDGs
- AI generates a structured blueprint: problem statement, objectives, scope, features, target users, SDG mapping, methodology, expected outcome, future scope
- Editable blueprint form — students remain in control of AI-generated content
- Blueprint validation/normalization server-side before saving (AI output cannot corrupt stored data)
- Graceful AI/API failure handling

### Milestone Planning (Phase 5)
- Create, edit, and delete milestones
- Set deadlines and mark milestone status (Pending / In Progress / Completed)
- Milestone progress is shown as a progress bar in the project workspace and on the milestone page
- Leader/owner-managed milestone planning, viewable by all project members
- Milestones are exposed as nested project routes (`/api/projects/:projectId/milestones`)

### Task Management / Kanban Board (Phase 6)
- Four-column Kanban board (Todo / In Progress / Review / Completed) with drag-and-drop and a "Move to" dropdown for smaller screens
- Leaders/owners create, assign, edit, and delete tasks; assignees can update the status of their own tasks
- Tasks carry description, assignee, priority (Low/Medium/High), due date, and status
- Filter tasks by assignee and priority; task progress shown in the project workspace
- Tasks are exposed as nested project routes (`/api/projects/:projectId/tasks`)

---

### Faculty Review Portal (Phase 7)
- Students (owner/leader) assign a faculty reviewer to their project
- Faculty dashboard lists assigned projects; project view shows team members and milestone/task progress
- Faculty submit feedback (comment + optional 1–5 rating); students see feedback history (read-only) on the project overview
- Feedback is exposed as `/api/faculty/projects/:projectId/reviews`; students have no write access

### AI Technical Assistant (Phase 8)
- Project-aware chat assistant opened from the project workspace (`/project/:id/assistant`)
- Answers technical questions: concepts, APIs, database structures, auth, architecture, debugging, implementation approaches
- Each request carries the project context (title, description, features, technologies, methodology) and recent conversation turns
- Responses are guidance only — no secrets, no code execution, no automatic project modification
- Exposed as `POST /ai/assistant` (FastAPI) proxied by the Express backend; failures surface as retryable error bubbles

### Notifications (Phase 10)
- Bell with unread badge in the main navigation (all roles); opens a dropdown panel
- Events: team invitation (added to team), task assignment/reassignment, milestone deadline set, faculty feedback
- Mark one or all notifications as read; clicking a notification deep-links to the relevant page
- Exposed as `/api/notifications` (`GET /`, `GET /unread`, `PUT /:id/read`, `PUT /read-all`); unread badge polls every 30s

### Dashboards & Progress Overview (Phase 11)
- Student dashboard (`/dashboard`): stat cards (active projects, pending tasks, milestones done, overall progress), per-project progress cards (milestone/task counts, pending & personally-assigned tasks, next deadline), recent faculty feedback
- Faculty dashboard: stats grid plus per-project progress bars, pending task counts, and feedback counts/last feedback date
- Backed by `GET /api/dashboard/student` and `GET /api/faculty/dashboard` — computed from actual database state, no extra analytics dependencies

### Integration, Testing & Polish (Phase 12)
- Stable end-to-end product: register → team → project → ideas/blueprint → milestones → Kanban → faculty review → assistant → notifications → dashboards
- Global toast notifications with friendly error messages; `PageLoader`, `EmptyState`, `ErrorBoundary`, accessible `ConfirmModal`, and a 404 page
- Auth client-side validation with inline messages; API safety net (session-expiry re-login, throttled offline toast); `prefers-reduced-motion` support
- Security review: expired-JWT rejection, role authorization on all routers, server-side AI key, CORS allowlist, 100kb body cap, auth rate limiting, AI proxy timeout (90s, cold-start aware)
- Regression suites green: server 9/9 (`node --test tests/`), AI service 14/14 (`python -m unittest discover`, incl. 6 Gemini failover-chain tests), frontend production build succeeds

### Project Deletion (post-Phase-12)
- Manager-only `DELETE /api/projects/:id` (project owner or team leader; 403 otherwise) with cascade cleanup of milestones, tasks, faculty reviews, and project notifications
- Delete Project button with confirmation modal on the project overview; success toast + redirect to `/teams`

### Deployment & Final Release (Phase 13)
- Live deployment: frontend on Vercel (`https://ascenta-frontend.vercel.app`), backend + AI service on Render free tier, MongoDB Atlas database
- AI-service deploy config: `render.yaml` Blueprint + `ai-service/.python-version` (Python 3.13.13); manual Web Service uses the same values as dashboard env vars (`ALLOWED_ORIGINS`, `PYTHON_VERSION`, `GEMINI_API_KEY`, `INTERNAL_API_KEY`)
- Backend binds `0.0.0.0` for the Render proxy; AI proxy returns friendly retry JSON on timeouts and HTML gateway 502/503/504s, with host-only production logging
- Gemini model failover chain (`gemini-3.5-flash → 3.6 → 3.7 → 3.8-flash`, via `GEMINI_MODEL_CHAIN`): automatic retry on quota/rate-limit errors, HTTP 429 when all models are exhausted

### Skipped
- **Phase 9 — AI Documentation Generator:** deferred by project decision (see `PHASES.md`)

## Phase Status

- **Phase 0 — Project Foundation:** Completed
- **Phase 1 — Authentication & User Management:** Completed
- **Phase 2 — Team Management:** Completed
- **Phase 3 — Project Creation & AI Blueprint:** Completed
- **Phase 4 — AI Project Blueprint Generator:** Completed
- **Phase 5 — Milestone Planning:** Completed
- **Phase 6 — Task Management / Kanban Board:** Completed
- **Phase 7 — Faculty Review Portal:** Completed
- **Phase 8 — AI Technical Assistant:** Completed
- **Phase 9 — AI Documentation Generator:** Skipped (deferred by project decision)
- **Phase 10 — Notifications:** Completed
- **Phase 11 — Dashboards & Progress Overview:** Completed
- **Phase 12 — Integration, Testing & Polish:** Completed
- **Phase 13 — Deployment & Final Release:** Completed (live: Vercel frontend, Render backend + AI service, Atlas DB)

See `PHASES.md` for the full development roadmap.
