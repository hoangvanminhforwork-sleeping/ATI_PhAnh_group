# Project Overview

> Source of truth for **"what is this project?"**.
> Architecture / stack: `knowledge/architecture.md` · Environment: `knowledge/configuration.md` · APIs: `knowledge/apiDocs.md`
> Last updated: 30/09/2026

## 1. Project Identity

| Item | Value |
| --- | --- |
| Project name | **Smart Document Processing** — Automated Invoice Data Extraction System |
| Project type | Fullstack web prototype (Next.js App Router) |
| Purpose | Users upload invoice documents (PDF / PNG / JPEG). The system returns structured invoice JSON, stores it in a database and shows it on a dashboard |
| Data pipeline | `upload (pdf/image) → structured JSON → database` |
| Implementation level | UI, API, Zod contract and (mock) database are **real code**; the extraction step itself is **mocked** (no Multimodal LLM call yet) |

## 2. Target Users

* **Primary users:** team members, lecturers and reviewers who demonstrate/test the project; anyone who needs to digitise paper invoices.
* **User characteristics:** limited technical knowledge. All functionality must be reachable from the browser UI — no CLI required.
* Documented but **not implemented**: multi-tenant departments with RBAC so a user only sees their own department's invoices (`project_details.md`).

## 3. Main Features

| Feature | Description | Status |
| --- | --- | --- |
| Submission box (upload) | Drag & drop or file picker; client + server validation (PDF/PNG/JPEG, ≤ 10 MB) | Partial |
| Mock invoice extraction | Uploaded file → structured invoice JSON derived from the file itself (hash-seeded, deterministic) | Mocked |
| Structured output contract | Zod schema `lib/invoiceSchema.ts` validates every result before it is stored/returned | Working |
| Mock database | Every result is appended to `data/invoices.json` (max 50 records) | Working |
| Result dashboard | Invoice card + line items + totals + raw JSON + download JSON | Partial |
| Invoice history | `GET /api/invoices` list + reset button (mock DB reset) | Partial |
| Real Multimodal LLM extraction | OpenAI / OpenRouter / Gemini structured output | Not implemented |
| SQLite + Prisma storage, RBAC | Target storage described in `project_details.md` | Not implemented |

Status vocabulary: `Working` · `Partial` · `Mocked` · `In-Progress` · `Blocked`.
`Working` = verified end-to-end at HTTP/data level; `Partial` = verified at API/data level but the UI has not
been click-tested in a browser; `Mocked` = works, but returns simulated data.
Verification evidence: `state/task_30_09_state.md` §5.
Step-by-step manual test instructions live in `features.md`.

## 4. Scope

### In scope (current task)

* Web UI with a submission/upload box.
* Server API route that accepts the file and returns structured invoice JSON.
* Mock data generation **related to the uploaded file** (kind, size, hash, page estimate).
* Persisting results so the `→ database` step of the pipeline is demonstrable.
* Documentation + test instructions.

### Out of scope (needs explicit approval)

* Real LLM provider keys, billing, prompting strategy.
* Authentication, RBAC, departments.
* Prisma/SQLite migration, production deployment, CI/CD.
* OCR of scanned images (the mock does not read pixel content).

## 5. Team Profile & Development Model

* Small course team with limited technical experience; requirements are given in natural language.
* Development is **AI-assisted**: agents implement, test and document; humans provide requirements, scope decisions and approvals.
* Coordination is file-based (`knowledge/`, `requestFromUsers/`, `state/`) so a new agent can continue from the repository alone.

## 6. Environment and Technology

* Environment / devcontainer / machine info: `knowledge/configuration.md`
* Approved stack and architecture: `knowledge/architecture.md`
* API contracts: `knowledge/apiDocs.md`
* Agent procedure: `knowledge/workflows.md`

## 7. Current Project Status

| Item | Value |
| --- | --- |
| Overall status | **IN_PROGRESS** — first vertical slice implemented; `npm install`, typecheck, lint and 7 API test cases all PASS (2 bugs found + fixed). Browser click-through and a full build remain |
| Current active task | `TASK-30-09` (`state/task_30_09_state.md`) |
| Known blockers | None. The production build is only *slow* on this container (~3.7 GiB RAM) |
| Last updated | 30/09/2026 |

---

## Appendix — original human note (kept verbatim)

```text
read .devcontainer

And the project is Smart Document Processing by the way

Users upload pdf, image => json => database
```
