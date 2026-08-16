# Ascenta — Design System & UI/UX Guidelines

## 1. Purpose

This document defines the visual identity, UI/UX principles, layout system, component styles, and interaction patterns for Ascenta.

Every frontend feature should follow this document unless a deliberate design decision is documented.

The goal is to make Ascenta feel like a polished modern SaaS product rather than a traditional college management portal.

---

# 2. Product Design Direction

## Design Personality

Ascenta should feel:

- Modern
- Clean
- Professional
- Intelligent
- Trustworthy
- Productive
- Student-friendly
- Developer-oriented

The visual language may be inspired by modern productivity/SaaS products such as Linear, Notion, Vercel, GitHub, and Atlassian, but Ascenta must have its own visual identity.

---

# 3. Brand Identity

## Product Name

**Ascenta**

## Brand Meaning

The name represents progress, growth, and moving upward toward successful project completion.

The interface should visually reinforce this idea of progress and advancement.

---

# 4. Primary Theme

## MVP Theme

Use a **light theme as the primary/default theme**.

The MVP should not spend significant development time implementing a complete dark-mode system.

A dark theme may be added later if sufficient time remains.

---

# 5. Color Palette

## Primary Brand Color

```text
Primary:        #6366F1
Primary Dark:   #4F46E5
Primary Light:  #EEF2FF
```

Use the primary color for:

- Primary buttons
- Active navigation
- Links
- Selected states
- Important actions
- AI-related accents

## Secondary Accent

```text
Secondary:       #8B5CF6
Secondary Light: #F5F3FF
```

Use sparingly for:

- AI features
- Special highlights
- Gradients
- Important visual accents

## Semantic Colors

```text
Success:        #10B981
Success Light:  #ECFDF5

Warning:        #F59E0B
Warning Light:  #FFFBEB

Error:          #EF4444
Error Light:    #FEF2F2

Info:           #3B82F6
Info Light:     #EFF6FF
```

## Neutral Colors

```text
Background:     #F8FAFC
Surface:        #FFFFFF

Text Primary:   #0F172A
Text Secondary: #475569
Text Muted:     #94A3B8

Border:         #E2E8F0
Border Strong:  #CBD5E1
```

Avoid pure black (`#000000`) for normal text.

---

# 6. AI Visual Language

AI functionality should have a subtle visual identity.

```text
Primary AI:     #6366F1
Secondary AI:   #8B5CF6
AI Background:  #F5F3FF
```

AI-related components may use subtle gradients:

```text
linear-gradient(135deg, #6366F1, #8B5CF6)
```

Do not use large flashy gradients throughout the application.

AI should feel integrated into Ascenta, not like a separate chatbot website.

---

# 7. Typography

## Primary Font

Use:

**Inter**

Fallback:

```text
Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Inter should be used consistently throughout the application.

## Typography Scale

### Page Title

```text
32px
Weight: 700
Line height: 1.2
```

### Section Heading

```text
24px
Weight: 600
```

### Card Heading

```text
18px
Weight: 600
```

### Body

```text
14px–16px
Weight: 400
```

### Small Text

```text
12px–13px
```

Use typography hierarchy rather than excessive font-size variation.

---

# 8. Spacing System

Use Tailwind's spacing scale consistently.

Preferred spacing values:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Avoid arbitrary spacing values unless necessary.

---

# 9. Application Layout

Use a modern SaaS dashboard layout.

```text
┌───────────────────────────────────────────────┐
│                 Top Header                    │
├───────────────┬───────────────────────────────┤
│               │                               │
│   Sidebar     │       Main Content            │
│               │                               │
│               │                               │
└───────────────┴───────────────────────────────┘
```

## Student Sidebar

- Dashboard
- Projects
- Notifications
- Profile

## Faculty Sidebar

- Dashboard
- Projects
- Reviews
- Notifications
- Profile

Project-specific navigation appears inside the project workspace.

---

# 10. Dashboard Design

The dashboard should prioritize useful information.

Recommended structure:

```text
Welcome back

[Active Projects] [Tasks] [Milestones] [Pending Reviews]

────────────────────────────────────────────

Projects

┌──────────────────────┐
│ Project Card         │
│ Progress: 72%        │
│ Next milestone       │
└──────────────────────┘

────────────────────────────────────────────

Recent Activity       Upcoming Tasks
```

Do not overload the dashboard with unnecessary charts.

---

# 11. Project Workspace

The Project Workspace is one of the most important screens in Ascenta.

```text
┌─────────────────────────────────────────────┐
│ Project Name                  Progress: 72% │
│ Short project description                   │
├─────────────────────────────────────────────┤
│ Overview | Features | Milestones | Tasks    │
│ Documentation | AI Assistant | Feedback     │
├─────────────────────────────────────────────┤
│                                             │
│                Active Content               │
│                                             │
└─────────────────────────────────────────────┘
```

Project navigation should remain visually consistent.

---

# 12. Project Overview

Display:

- Project title
- Description
- Problem statement
- Objectives
- SDGs
- Technologies
- Difficulty
- Team members
- Project progress

Use cards and structured sections rather than one large text block.

---

# 13. Project Blueprint UI

The Blueprint Generator should feel like a polished AI workflow.

## Input

```text
Project Idea
Domain
Team Size
Difficulty
Technologies
SDGs
```

## Main Action

```text
✨ Generate Project Blueprint
```

## Output

Display separate editable sections:

```text
Project Overview

Problem Statement

Objectives

SDG Mapping

Features

Technology Stack

Modules

Future Scope
```

Each section should support:

- View
- Edit
- Save

---

# 14. Blueprint Generation State

While AI is generating:

```text
✨ Generating your project blueprint...

Analyzing project idea
Finding relevant SDGs
Suggesting features
Building project structure
Preparing overview
```

Use a subtle animated loading indicator.

Do not show fake progress percentages unless the system actually tracks progress.

---

# 15. AI Content Editing

AI-generated information should have a subtle AI indicator without making the content visually confusing.

Example:

```text
✨ AI Generated
```

When editing:

```text
[ Edit ]

[ Save Changes ]
[ Cancel ]
```

Never make AI-generated content permanently read-only.

Users remain in control of generated content.

---

# 16. Kanban Board

Use a horizontal board:

```text
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ Todo       │ │ In Progress│ │ Review     │ │ Completed  │
│            │ │            │ │            │ │            │
│ Task       │ │ Task       │ │ Task       │ │ Task       │
│ Task       │ │            │ │            │ │ Task       │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
```

Task cards should show:

- Task title
- Assignee
- Priority
- Due date

Priority colors:

```text
High       Red
Medium     Amber
Low        Gray/Blue
```

Avoid excessive color.

---

# 17. Milestone UI

Milestones should visually communicate project progress.

Example:

```text
✓ Literature Survey
      │
✓ UI Design
      │
● Backend Development
      │
○ Testing
      │
○ Documentation
```

Use:

```text
Completed → Green
Current   → Primary
Upcoming  → Gray
```

---

# 18. Faculty Review UI

Faculty pages should prioritize clarity over visual complexity.

```text
Project
────────────────────────────

Team
Progress
Milestones
Tasks

────────────────────────────

Faculty Feedback

[ Write feedback... ]

[ Submit Feedback ]
```

Feedback should include:

- Faculty name
- Date
- Feedback content

Avoid complex grading UI unless explicitly required.

---

# 19. Documentation UI

Documentation should use an editor-style layout.

```text
Documentation

[ Abstract ]
[ Introduction ]
[ Objectives ]
[ Methodology ]
[ Conclusion ]

──────────────────────────

Abstract

Generated content...

[ Edit ] [ Generate with AI ] [ Save ]
```

Students must always be able to edit AI-generated documentation.

---

# 20. AI Technical Assistant UI

The assistant should look like a project-aware developer assistant rather than a generic chatbot.

```text
┌─────────────────────────────────────────────┐
│ ✨ Ascenta Technical Assistant              │
│ Project: Current Project                    │
├─────────────────────────────────────────────┤
│                                             │
│ You: How should I structure the backend?    │
│                                             │
│ AI: For your project, I recommend...        │
│                                             │
├─────────────────────────────────────────────┤
│ Ask a technical question...          [Send] │
└─────────────────────────────────────────────┘
```

Where useful, show the current project context.

---

# 21. Cards

Cards should use:

```text
Background: #FFFFFF
Border: #E2E8F0
Border radius: 12px
```

Use subtle shadows only when necessary.

Preferred:

```text
shadow-sm
```

Avoid excessive floating cards with heavy shadows.

---

# 22. Buttons

## Primary

```text
Background: #6366F1
Text: White
Radius: 8px
```

Example:

```text
+ Create Project
```

## Secondary

```text
Background: White
Border: #E2E8F0
Text: #334155
```

## AI Button

Use a subtle AI accent.

```text
✨ Generate Blueprint
```

## Danger

Use red only for destructive actions.

```text
Delete Project
```

---

# 23. Button Rules

Buttons should:

- Clearly describe the action.
- Have visible hover states.
- Have disabled states.
- Show loading states during asynchronous operations.

Example:

```text
Generate Blueprint
       ↓
Generating...
```

Do not allow repeated triggering of an expensive AI request while the request is running.

---

# 24. Forms

Forms should:

- Use clear labels.
- Show validation errors near the relevant field.
- Use helpful placeholders.
- Group related fields.
- Avoid unnecessarily long forms.

For project creation, prefer logical sections or a guided form instead of presenting a very large form at once.

---

# 25. Modals

Use modals for:

- Confirmations
- Small forms
- Quick edits

Do not use modals for large workflows.

Complex workflows should use a dedicated page or workspace section.

---

# 26. Toast Notifications

Use toast notifications for short-lived feedback.

Examples:

```text
✓ Project created successfully

✓ Task assigned successfully

✓ Feedback submitted

✕ Failed to generate blueprint
```

Do not use toasts as the only way to communicate important persistent information.

---

# 27. Loading States

Every asynchronous feature should have a loading state.

Examples:

```text
Loading projects...

Loading milestones...

Generating blueprint...

Saving documentation...
```

Prefer skeleton loaders for large page sections.

Use spinners for smaller actions.

---

# 28. Empty States

Empty states should explain what the user can do next.

Bad:

```text
No projects.
```

Better:

```text
No projects yet.

Start your academic project journey by creating
a new project or generating an idea with AI.

[ Create Project ]
[ Generate Idea ]
```

---

# 29. Error States

Errors should be understandable.

Bad:

```text
500 Internal Server Error
```

Better:

```text
Something went wrong.

We couldn't generate your project blueprint.
Please try again.

[ Try Again ]
```

Technical details should be logged for developers but not unnecessarily shown to users.

---

# 30. Icons

Use a single consistent icon library.

Preferred:

**Lucide React**

Use icons for:

- Navigation
- Actions
- Status
- Context

Avoid mixing multiple icon libraries.

Do not use emojis as normal UI icons except where deliberately used for AI branding or personality.

---

# 31. Animations

Animations should be subtle and purposeful.

Good examples:

- Button hover
- Card hover
- Modal entrance
- Sidebar transition
- Kanban drag feedback
- AI loading animation

Avoid:

- Excessive page transitions
- Large bouncing elements
- Constant animations
- Distracting gradients
- Animation on every component

Use CSS transitions or lightweight animation utilities.

---

# 32. Responsive Design

The application must work on:

- Desktop
- Laptop
- Tablet
- Mobile

## Desktop

Use:

- Sidebar
- Multi-column layouts
- Kanban columns

## Tablet

- Condense sidebar
- Reduce grid columns
- Maintain readable content

## Mobile

- Sidebar becomes a drawer/menu.
- Cards stack vertically.
- Tables become cards or horizontally scrollable containers.
- Kanban board can horizontally scroll.
- Forms become single-column.
- Important actions remain accessible.

Do not simply hide important functionality on mobile.

---

# 33. Accessibility

Follow basic accessibility practices.

- Use semantic HTML.
- Use labels for inputs.
- Maintain sufficient color contrast.
- Do not rely only on color to communicate status.
- Provide visible focus states.
- Buttons must have meaningful labels.
- Images require appropriate alt text.
- Keyboard navigation should work for important interactions.

---

# 34. Responsive Breakpoints

Use Tailwind's standard breakpoints:

```text
sm
md
lg
xl
2xl
```

Do not create custom breakpoints unless there is a clear need.

---

# 35. Navigation

## Global Student Navigation

```text
Dashboard
Projects
Notifications
Profile
```

## Global Faculty Navigation

```text
Dashboard
Projects
Reviews
Notifications
Profile
```

## Project Navigation

```text
Overview
Features
Milestones
Tasks
Documentation
AI Assistant
Feedback
```

Do not include these in MVP navigation:

```text
Admin
GitHub
Viva
```

---

# 36. AI Interaction States

Every AI interaction should communicate:

```text
Ready
Generating
Generated
```

Example:

```text
Ready:
[ Generate Blueprint ]

Generating:
[ ✨ Generating... ]

Generated:
[ Regenerate ] [ Edit ] [ Save ]
```

AI output should never appear automatically authoritative.

Users should remain in control of generated content.

---

# 37. Project Progress Visualization

Use progress bars where appropriate.

```text
Project Progress

██████████████░░░░ 72%
```

Progress must be calculated from real project data.

A simple MVP calculation can be:

```text
Completed Tasks / Total Tasks
```

or another clearly documented project-progress formula.

Do not use hardcoded progress values.

---

# 38. SDG Visualization

SDG mapping should be visually clear but not overly elaborate.

Example:

```text
SDG 4
Quality Education

✓ Relevant

Why:
The project improves...
```

Use the official SDG number and title as text.

Do not recreate official SDG logos unless their use is properly permitted.

---

# 39. Project Status

Use a small number of clear statuses.

```text
Planning
Development
Testing
Documentation
Completed
```

Use subtle status badges.

Do not create dozens of project states.

---

# 40. Design Consistency Rules

Every page should maintain:

- Same header behavior
- Same sidebar
- Same typography
- Same button styles
- Same card radius
- Same spacing system
- Same status colors
- Same form styles
- Same loading behavior
- Same error behavior

Do not redesign the same component differently on different pages.

---

# 41. Design Anti-Patterns

Avoid:

- Excessive gradients
- Excessive shadows
- Glassmorphism everywhere
- Too many colors
- Huge typography
- Unnecessary animations
- Dense dashboards
- Tiny text
- Giant empty spaces
- Inconsistent border radius
- Multiple button styles for the same action
- Random icon libraries
- Generic Bootstrap-looking layouts
- Excessive use of emojis
- AI-generated UI that changes style between pages

---

# 42. SaaS Product Feel

Ascenta should feel like a real productivity SaaS.

Prioritize:

```text
Clarity
   ↓
Hierarchy
   ↓
Efficiency
   ↓
Feedback
   ↓
Polish
```

A feature should be easy to understand without reading documentation.

---

# 43. Design Rules for AI Coding Agents

When an AI coding assistant creates UI:

1. Read `DESIGN.md` before implementing frontend features.
2. Reuse existing components.
3. Do not create a new button style when an existing one works.
4. Do not introduce new colors without a clear reason.
5. Do not introduce a new font.
6. Do not introduce another icon library.
7. Follow the existing spacing and typography system.
8. Reuse existing cards, modals, inputs, badges, and buttons.
9. Keep responsive behavior in mind from the beginning.
10. Do not redesign existing pages unnecessarily.
11. Do not add decorative UI that does not improve usability.
12. Prefer consistency over novelty.

---

# 44. MVP Design Priority

If development time is limited, prioritize:

## Tier 1

- Clean layout
- Consistent navigation
- Responsive pages
- Forms
- Project workspace
- Kanban board
- AI Blueprint UI

## Tier 2

- AI Assistant UI
- Documentation editor
- Faculty review UI
- Dashboard

## Tier 3

- Animations
- Advanced charts
- Dark mode
- Advanced visualizations

The product must be functional and visually consistent before decorative polish is added.

---

# 45. Final Design Principle

Ascenta should communicate one central idea:

> **Turn an academic project from an idea into a structured, manageable, and successfully completed project.**

Every major screen should reinforce:

```text
Idea
  ↓
Plan
  ↓
Build
  ↓
Review
  ↓
Document
  ↓
Complete
```

The design should make this progression visually obvious while keeping the interface simple enough for students to use without training.
