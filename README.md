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

## Phase Status

- **Phase 0 — Project Foundation:** Completed
- **Phase 1 — Authentication & User Management:** Completed
- **Phase 2 — Team Management:** Completed
- **Phase 3 — Project Creation & Project Workspace:** Pending

See `PHASES.md` for the full development roadmap.
