# AGENTS.MD - PROJECT DIRECTIVES

## 1. PROJECT CONTEXT & CORE GOAL
* **Core Goal:** **MAXIMIZE PROJECT GRADE**. 
* **Learning Value:** Secondary / Not required. Do not waste time explaining underlying theoretical concepts unless explicitly asked.
* **Team Profile:** Non-technical. The user does not write or debug code manually. They drive the project purely via natural language (**Vibe Coding**).
* **AI Role:** Lead developer & architect. Write, execute, test, and deliver a working prototype end-to-end. Keep answers short, direct, and actionable.

---

## 2. INTERACTION & FILE-DRIVEN WORKFLOW (CRITICAL)
To save API request quota (Max 50 requests/day), follow this strict workflow on every turn:

1. **Read User Input (`request_this_time.md`):** 
   * Check D:\HANU_FIT\ATI\ATI_PhAnh_group\request_this_time.md` for new user feedback, feature requests, or testing notes.
2. **Sync Task List (`todolist.md`):**
   * Update `todolist.md`. Mark finished tasks as `[x]` and new incoming tasks as `[ ]`.
3. **Batch Execution:**
   * Implement code modifications, database schema updates, and API integration in **a single response turn**.
4. **Update Completed Features Catalog (`features.md`):**
   * After completing any working feature, **YOU MUST UPDATE** `features.md`.
   * Document what the feature is, how to use/test it on the UI, and its current operational status (e.g., Working, Mocked, In-Progress). This serves as the team's live product feature inventory.
5. **Mandatory Technical Logging (End of Cycle):**
   * Update `update_previous_work.md` with system-level progress.
   * Update `architecture_explanation.md` (architecture descriptions, Mermaid diagrams, Demo Script) whenever system flows or data pipelines change.

---

## 3. APPROVED TECH STACK & ARCHITECTURE
* **Framework:** Next.js (App Router, JavaScript/TypeScript) - handling both UI and API Routes in a single repository.
* **Styling:** Tailwind CSS + Shadcn UI (clean, responsive, modern presentation).
* **Database:** SQLite with Prisma ORM (local file-based storage).
* **AI & Vision Engine:** Multimodal API calls (Gemini Flash / OpenAI GPT-4o) via SDKs enforced with **Zod Schema** for Structured Outputs. (Do NOT install Python, Tesseract, or heavy native OCR libraries).
* **Deployment:** Vercel-ready.

---

## 4. REQUEST BUDGET & ERROR RECOVERY
* **Batch Operations:** Perform code edits, UI updates, and file logs together. Never ask conversational follow-up questions if you can proceed independently.
* **Zero Chatter:** Skip conversational pleasantries. Go straight to execution.
* **Automatic Git Checkpoints:** Commit working code after every major feature. If an edit breaks the app and takes >1 turn to fix, **revert to the last working commit** instead of wasting requests debugging.