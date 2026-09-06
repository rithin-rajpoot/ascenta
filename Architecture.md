# Architecture Document

# Ascenta

### An AI-Powered Academic Project Lifecycle Management Platform

---

# 1. System Overview

Ascenta follows a modular architecture consisting of three independent layers.

```
                React Frontend
                       │
                REST API (HTTP)
                       │
         Node.js + Express Backend
                       │
        ┌──────────────┴──────────────┐
        │                             │
 MongoDB Atlas                FastAPI AI Service
                                      │
                                 Google Gemini API
```

Responsibilities

Frontend
- User Interface
- Routing
- State Management
- API Communication

Backend
- Authentication
- Business Logic
- Database Operations
- Authorization

AI Service
- Gemini Integration
- Prompt Engineering
- AI Response Formatting

Database
- User Data
- Projects
- Tasks
- Milestones
- Notifications
- Feedback

---

# 2. Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Redux Toolkit
- React Hook Form
- React Hot Toast
- Recharts
- dnd-kit

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Mongoose

---

## AI Service

- FastAPI
- Google Gemini API

---

## Database

MongoDB Atlas

---

## Development Tools

- VS Code
- Postman
- Git
- GitHub
- MongoDB Compass

---

## Deployment

Frontend

Vercel

Backend

Render

AI Service

Render

Database

MongoDB Atlas

---

# 3. Folder Structure

```
ascenta/

│

├── docs/

│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── RULES.md
│   ├── PHASES.md
│   ├── DESIGN.md
│   ├── DATABASE.md
│   ├── API.md
│   └── MEMORY.md

│

├── client/

│

├── server/

│

├── ai-service/

│

└── README.md
```

---

# 4. Frontend Structure

```
client/

src/

│

├── assets/

├── components/

│      ├── common/

│      ├── dashboard/

│      ├── project/

│      ├── task/

│      ├── ai/

│      └── faculty/

│

├── pages/

│      ├── auth/

│      ├── dashboard/

│      ├── projects/

│      ├── milestones/

│      ├── tasks/

│      ├── ai/

│      └── faculty/

│

├── layouts/

├── hooks/

├── context/

├── services/

├── utils/

├── routes/

├── constants/

├── types/

└── App.jsx
```

---

# 5. Backend Structure

```
server/

src/

│

├── config/

├── middleware/

├── models/

├── controllers/

├── routes/

├── services/

├── repositories/

├── validators/

├── utils/

├── prompts/

├── constants/

├── uploads/

└── app.js
```

---

# 6. AI Service Structure

```
ai-service/

app/

│

├── routers/

├── services/

├── prompts/

├── utils/

├── schemas/

└── main.py
```

---

# 7. High Level Application Flow

```
User Registers

↓

Login

↓

Dashboard

↓

Team Management

↓

Project Creation

↓

AI Blueprint Generation

↓

Milestone Planning

↓

Task Management

↓

Faculty Review

↓

Documentation Generation

↓

Project Completion
```

---

# 8. Authentication Flow

```
Register

↓

Login

↓

Backend validates credentials

↓

JWT Generated

↓

Token stored

↓

Protected Routes

↓

Authenticated Requests
```

---

# 9. Team Workflow

```
Student
  |
  ↓
Choose

Create Team   OR   Join Team (via invite code, e.g. ASC-XXXXXX)   OR   Solo Project
  |
  ↓
Share invite code with peers
  |
  ↓
Project Workspace
```

---

# 10. Project Creation Workflow

```
Create Project

↓

Choose

AI Idea

OR

Own Idea

↓

AI Blueprint Generator

↓

Student Reviews

↓

Project Created (solo, or bound to the selected team)
```

---

# 11. AI Blueprint Workflow

```
Project Idea

↓

Gemini API

↓

Generate

• Features

• SDGs

• Technologies

• Difficulty

• Overview

↓

Student Edits

↓

Save
```

---

# 12. Milestone Workflow

```
Generate Milestones

↓

Edit Milestones

↓

Assign Dates

↓

Save
```

---

# 13. Task Workflow

```
Create Task

↓

Assign Member

↓

Todo

↓

In Progress

↓

Review

↓

Completed
```

---

# 14. Faculty Workflow

```
Faculty Login

↓

Assigned Projects

↓

View Progress

↓

Review Milestones

↓

Submit Feedback
```

---

# 15. Documentation Workflow

```
Project Completed

↓

Choose Document

↓

AI Generates Draft

↓

Student Reviews

↓

Save
```

---

# 16. AI Technical Assistant Workflow

```
Student Question

↓

FastAPI

↓

Gemini

↓

Response

↓

Display Answer
```

---

# 17. Notification Flow

```
Task Assigned

↓

Notification Created

↓

Stored

↓

Shown to User
```

---

# 18. Future Architecture

The following modules are intentionally excluded from MVP.

- Admin Portal
- GitHub Integration
- Viva Preparation
- Team Chat
- Calendar
- Mobile App

The architecture should remain modular so these features can be integrated later without major restructuring.

---

# 19. Design Principles

The project must follow:

- Modular Architecture
- RESTful APIs
- Separation of Concerns
- Reusable Components
- Clean Folder Structure
- Stateless Authentication
- AI as an Independent Service
- Responsive UI
- Scalable Design

---

# 20. Coding Pattern

Frontend

```
Page

↓

Components

↓

Services

↓

Backend APIs
```

Backend

```
Route

↓

Controller

↓

Service

↓

Repository

↓

Database
```

AI

```
Request

↓

Prompt Builder

↓

Gemini

↓

Formatter

↓

Response
```

---

# 21. MVP Modules

✔ Authentication

✔ Team Management

✔ Project Creation

✔ AI Blueprint Generator

✔ Milestone Planner

✔ Kanban Board

✔ Faculty Review

✔ Documentation Generator

✔ AI Technical Assistant

✔ Notifications

✔ Dashboard

---

# 22. Out of Scope

- Admin Module
- GitHub Integration
- Viva Module
- Team Chat
- Mobile App
- Calendar Integration
- AI UML Diagram Generator
