# WeddingUp Constitution
*A guiding document for AI-assisted development and autonomous reasoning.*

---

## 1. Purpose
To autonomously design, build, and iterate on a **lightweight project-management web app for wedding planning**, modeled after ClickUp or Jira — but tailored for planners and couples.

The system should support:
- User accounts (Planner, Couple, Vendor)
- Wedding “projects” with tasks, uploads, and communication
- Scalable SaaS architecture for future monetization

---

## 2. Guiding Philosophy
- **Simplicity First** — favor minimal, maintainable code.  
- **Progressive Enhancement** — functional MVP before advanced UX.  
- **Reusability** — modular, composable components.  
- **Human-Centered Design** — clarity and empathy for users planning emotionally charged events.  
- **Autonomous Iteration** — each generated module documents its intent and decisions.

---

## 3. Core Objectives
1. Build a **Next.js + Supabase** app that provides:
   - Authentication and role-based permissions  
   - Project creation (“Wedding Workspaces”)  
   - Task boards (Kanban or List)  
   - Image uploads  
   - Notifications (Realtime or Email)
2. Include:
   - Responsive UI (TailwindCSS + Shadcn/UI)
   - Scalable folder structure (`/components`, `/lib`, `/db`, `/hooks`)
   - CRUD API routes for weddings, tasks, comments, files
3. Prepare for future integration with:
   - Stripe billing (SaaS)
   - Calendar sync (Google / Outlook)
   - AI task assistant

---

## 4. Core Architecture

| Layer | Tool/Framework | Responsibility |
|-------|----------------|----------------|
| Frontend | Next.js + Tailwind + Shadcn | UI components, routing, state |
| Backend | Supabase | Auth, Postgres DB, file storage, realtime |
| API Layer | Next.js API Routes / Supabase Edge Functions | CRUD operations |
| Database Schema | Postgres | `users`, `weddings`, `tasks`, `files`, `messages`, `roles` |
| Notifications | Supabase Realtime / OneSignal | Event-based alerts |
| Hosting | Vercel + Supabase | Managed deployment |
| Testing | Jest / Playwright | Unit + e2e testing |

---

## 5. Decision-Making Hierarchy
When the AI or developer encounters uncertainty:
1. **Follow the Constitution.**
2. **Default to Simplicity.**
3. **Prioritize UX Clarity.**
4. **Optimize for Scalability.**
5. **Document every major decision** inside the module header.

---

## 6. Data Model (Initial)

```sql
-- users
id UUID PRIMARY KEY
email TEXT UNIQUE NOT NULL
role TEXT CHECK (role IN ('planner','couple','vendor'))
created_at TIMESTAMP DEFAULT now()

-- weddings
id UUID PRIMARY KEY
name TEXT NOT NULL
date DATE
owner_id UUID REFERENCES users(id)
status TEXT DEFAULT 'planning'

-- tasks
id UUID PRIMARY KEY
wedding_id UUID REFERENCES weddings(id)
title TEXT NOT NULL
description TEXT
status TEXT DEFAULT 'todo'
assignee UUID REFERENCES users(id)
due_date DATE
created_at TIMESTAMP DEFAULT now()

-- files
id UUID PRIMARY KEY
wedding_id UUID REFERENCES weddings(id)
uploader UUID REFERENCES users(id)
url TEXT NOT NULL
created_at TIMESTAMP DEFAULT now()
```

---

## 7. Context Feeding Logic
When this Constitution is active, AI builders (e.g., Copilot, GPT) must:

- Load the Constitution before coding sessions.
- Receive current phase, component name, and priority list as prompts.
- Produce documented code with rationale for design choices.
- - Respect simplicity, clarity, and maintainability.

Example directive:

> "You are building the TaskBoard.tsx component for WeddingUp.
> Follow the Constitution. Implement a Kanban board using Shadcn components and Supabase data.
> Keep code <200 lines. Include comments for decisions."

---

## 8. Phased Development Plan

**Phase 1 — MVP**
- Auth + roles
- Create/manage wedding projects
- Task CRUD + board UI
- File upload
- Notifications
- Dashboard UI

**Phase 2 — Collaboration Layer**
- Comments & chat
- Role-based views
- Shared timelines
- Vendor invites

**Phase 3 — SaaS Expansion**
- Stripe billing
- Admin portal for planners
- AI "auto wedding plan" assistant

---

## 9. AI Behavior Rules
- No unnecessary dependencies.
- Document every new function (inputs, outputs, side effects).
- Validate and sanitize user input.
- Use accessible, responsive UI (ARIA + Tailwind best practices).
- Create reusable logic hooks (useTasks, useWeddings, useUploads).
- Ensure each commit builds and runs locally without manual config.

---

## 10. Definition of Done
A feature is complete when:

- Functional, accessible, documented, and tested.
- Lighthouse accessibility ≥ 90%.
- Code follows naming conventions and structure.
- Commit message uses conventional commits.

Example directive:

> "You are building the TaskBoard.tsx component for WeddingUp.
> Follow the Constitution. Implement a Kanban board using Shadcn components and Supabase data.
> > Keep code <200 lines. Include comments for decisions."

---

## 8. Phased Development Plan

**Phase 1 — MVP**
- Auth + roles
- Create/manage wedding projects
- Task CRUD + board UI
- File upload
- Notifications
- Dashboard UI

**Phase 2 — Collaboration Layer**
- Comments & chat
- Role-based views
- Shared timelines
- Vendor invites

**Phase 3 — SaaS Expansion**
- Stripe billing
- Admin portal for planners
- AI "auto wedding plan" assistant

---

## 9. AI Behavior Rules
- No unnecessary dependencies.
- Document every new function (inputs, outputs, side effects).
- Validate and sanitize user input.
- Use accessible, responsive UI (ARIA + Tailwind best practices).
- Create reusable logic hooks (useTasks, useWeddings, useUploads).
- Ensure each commit builds and runs locally without manual config.

---

## 10. Definition of Done
A feature is complete when:

- Functional, accessible, documented, and tested.

- Lighthouse accessibility ≥ 90%.
- Code follows naming conventions and structure.
- Commit message uses conventional commits.

---

## 11. References
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)
- [Stripe Dev](https://stripe.com/docs)

---

**Author:** Gabriel Cabrera  
**Version:** 1.0  
**License:** Open for internal AI-assisted development of WeddingUp.