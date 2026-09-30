# Todolist

Last updated: 30/09/2026 · Active task: **TASK-30-09** (details: `state/task_30_09_state.md`)

## TASK-30-09 — Submission box + mock invoice data

### Done

- [x] Read request, `knowledge/`, `.devcontainer/`, `project_details.md`, `agents.md`
- [x] Scaffold Next.js 15 (App Router) + TypeScript app at the repository root
- [x] Zod contract `lib/invoiceSchema.ts`
- [x] Mock extractor `lib/mockExtractor.ts` (file-derived, deterministic)
- [x] Mock database `lib/invoiceStore.ts` → `data/invoices.json`
- [x] API routes `POST /api/extract`, `GET|DELETE /api/invoices`
- [x] UI: submission box, result dashboard, history
- [x] Sample invoice `samples/sample-invoice.pdf` (+ generator script)
- [x] Documentation: `knowledge/*`, `state/*`, `features.md`, `architecture_explanation.md`

### Validation (executed on 30/09/2026 — results in `state/task_30_09_state.md` §5)

- [x] `npm install` — completed (`added 308 packages in 8m`; `package-lock.json` created)
- [x] `npm run typecheck` — PASS (after fixing a syntax bug in `lib/mockExtractor.ts`)
- [x] `npm run lint` — PASS (the `EBADENGINE` warning is only a warning)
- [x] API tests with `curl` — 7 cases PASS; fixed the 500 → 400 bug in `app/api/extract/route.ts`
- [x] Page render check — `GET /` returns HTTP 200 containing the submission box
- [ ] `npm run build` to completion (slow on this ~3.7 GiB RAM container; the webpack compile passed in 56 s)
- [ ] Browser click-through on port 3000 (steps in `features.md`)
- [ ] Git checkpoint commit
- [ ] Then update `state/task_30_09_state.md` (status → COMPLETED) and this file

### After TASK-30-09 (needs a human decision)

- [ ] Choose the Multimodal LLM provider + API key → replace the mock extraction
- [ ] Replace the JSON file store with Prisma + SQLite (`project_details.md`)
- [ ] Authentication + department RBAC
- [ ] Automated tests (no test runner configured yet)

## Notes

* `features.md` = what works / how to test it.
* `knowledge/` = stable project knowledge (architecture, API, environment, workflow).
* `state/` = task state and handoff.
