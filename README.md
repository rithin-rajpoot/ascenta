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

## Phase Status

- **Phase 0 — Project Foundation:** Completed
- **Phase 1 — Authentication & User Management:** Completed
- **Phase 2 — Team Management:** Completed
- **Phase 3 — Project Creation & AI Blueprint:** Completed
- **Phase 4 — AI Project Blueprint Generator:** Completed
- **Phase 5 — Milestone Planning:** Completed
- **Phase 6 — Task Management / Kanban Board:** Completed

See `PHASES.md` for the full development roadmap.
