# Product Requirements Document (PRD)

# Ascenta

### Tagline
**From Idea to Innovation**

## Product Overview

Ascenta is an AI-powered academic project lifecycle management platform designed to assist students from project ideation to final submission.

It provides a centralized workspace where students can discover project ideas, form teams, plan project execution, collaborate with teammates, track development progress, receive faculty feedback, generate documentation, and leverage AI-powered technical guidance throughout the project lifecycle.

Unlike generic project management tools, Ascenta is specifically designed for academic projects by combining project planning, collaboration, AI assistance, and faculty interaction into a single integrated platform.

---

# Vision

To become the all-in-one platform for academic project development by simplifying project planning, collaboration, documentation, and faculty interaction using Artificial Intelligence.

---

# Mission

Help students build better academic projects with less time spent managing tools and more time spent building solutions.

---

# Problem Statement

Students often face several challenges while developing academic projects.

- Difficulty finding meaningful project ideas.
- Confusion in selecting appropriate SDGs.
- Difficulty defining project scope and features.
- Lack of structured project planning.
- Poor task management among teammates.
- Limited faculty visibility into project progress.
- Time-consuming documentation process.
- Switching between multiple disconnected tools during development.

Current solutions require students to use multiple platforms such as messaging apps, project management tools, documentation tools, and AI assistants independently.

Ascenta combines these activities into a single platform.

---

# Goals

The platform aims to:

- Simplify academic project planning.
- Encourage structured project development.
- Improve collaboration among team members.
- Improve communication between students and faculty.
- Reduce project planning effort using AI.
- Simplify documentation generation.
- Provide continuous AI-based technical guidance.

---

# Target Users

## Students

Students can:

- Create projects
- Join teams
- Manage tasks
- Track milestones
- Generate documentation
- Use AI technical guidance
- Monitor project progress

---

## Faculty

Faculty members can:

- View assigned projects
- Review progress
- Monitor milestones
- Provide feedback
- Track student performance

---

# User Roles

## Student

Primary user of the platform.

Permissions

- Create project
- Join project
- Create team
- Manage tasks
- Generate documentation
- Use AI assistant
- View feedback

---

## Team Leader

Additional permissions

- Invite members
- Assign tasks
- Create milestones
- Update project information

---

## Faculty

Permissions

- View assigned projects
- Review milestones
- Provide feedback
- Monitor project progress

---

# Core Features

---

## 1. Authentication

- User Registration
- Secure Login
- Role-based Authentication
- User Profile

---

## 2. Team Management

Students should be able to:

- Create Team
- Invite Members
- Share a human-friendly invite code (e.g. `ASC-XXXXXX`) and join an existing team with that code
- Continue as Solo Developer

---

## 3. Project Creation

Students can choose one of the following:

### Option 1

Generate project ideas using AI.

### Option 2

Already have a project idea.

The platform should then assist in planning the project.

---

## 4. AI Project Planner

AI should assist students by generating:

- Project Ideas
- Feature Suggestions
- SDG Recommendations
- Technology Suggestions
- Difficulty Level
- Structured Project Overview

The generated overview should remain editable.

---

## 5. Milestone Planning

Students should be able to:

- Generate milestones using AI
- Create milestones manually
- Assign milestone deadlines
- Track milestone completion

---

## 6. Task Management

Students should be able to:

- Create tasks
- Assign tasks
- Update status
- Set priorities
- Track completion

Kanban Stages

- Todo
- In Progress
- Review
- Completed

---

## 7. Faculty Review

Faculty members should be able to:

- Monitor project progress
- Review milestones
- Provide feedback
- Track project completion

---

## 8. Documentation Generator

Students should be able to generate editable drafts for:

- Abstract
- Introduction
- Problem Statement
- Objectives
- Scope
- Methodology
- Conclusion
- Future Scope

---

## 9. AI Technical Assistant

Students can ask technical questions related to their project.

Examples

- Explain JWT Authentication
- Suggest REST APIs
- Recommend database schema
- Improve architecture
- Explain concepts
- Debug code snippets
- Suggest technologies

---

## 10. Notifications

Students receive notifications for:

- Team Invitations
- Task Assignments
- Milestone Deadlines
- Faculty Feedback
- Documentation Generation

---

## Dashboard

### Student Dashboard

Displays

- Active Projects
- Team Information
- Task Progress
- Milestone Progress
- Notifications
- Faculty Feedback

---

### Faculty Dashboard

Displays

- Assigned Projects
- Student Progress
- Pending Reviews
- Feedback History

---

# User Journey

Student Registration

↓

Create Team / Join Team / Solo Project

↓

Create Project

↓

Generate AI Idea
OR
Use Existing Idea

↓

Generate Project Plan

↓

Generate Features & SDGs

↓

Generate Project Overview

↓

Plan Milestones

↓

Assign Tasks

↓

Develop Project

↓

Faculty Reviews Progress

↓

Generate Documentation

↓

Final Submission

---

# Functional Requirements

The system shall:

- Allow secure user authentication.
- Allow students to create and manage projects.
- Allow team collaboration.
- Generate AI-powered project suggestions.
- Generate AI-assisted project overviews.
- Support milestone planning.
- Support Kanban task management.
- Allow faculty feedback.
- Generate documentation drafts.
- Provide AI technical assistance.
- Display project analytics.

---

# Non-Functional Requirements

- Responsive Design
- Secure Authentication
- Fast Response Time
- Scalable Architecture
- Maintainable Codebase
- User-Friendly Interface
- Modular Development

---

# Success Metrics

- Number of registered users
- Projects created
- Teams formed
- Tasks completed
- Milestones completed
- Documentation generated
- Faculty feedback submitted
- AI assistant usage

---

# Sustainable Development Goals

## Primary

**SDG 4 — Quality Education**

---

## Secondary

**SDG 8 — Decent Work and Economic Growth**

**SDG 17 — Partnerships for the Goals**

---

# MVP Scope

The MVP will include:

- Authentication
- Team Management
- Project Creation
- AI Project Planner
- Milestone Planning
- Kanban Task Board
- Faculty Review
- Documentation Generator
- AI Technical Assistant
- Notifications
- Dashboards

---

# Out of Scope (MVP)

The following features are intentionally excluded from the initial release.

- Admin Portal
- GitHub Integration
- Viva Preparation
- In-app Team Chat
- File Version Control
- Calendar Integration
- Mobile Application
- Project Marketplace
- AI Architecture Diagram Generator

These features may be considered in future releases.

---

# Future Scope

Future versions of Ascenta may include:

- GitHub Integration
- Viva Preparation Assistant
- AI Architecture Diagram Generation
- Project Marketplace
- Team Chat
- Calendar & Meeting Scheduler
- Mobile Application
- Admin Dashboard
- Multi-College Support
- Industry Mentor Portal