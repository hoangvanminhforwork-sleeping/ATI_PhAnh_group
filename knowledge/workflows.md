# Agent Workflow Protocol

## 1. Purpose

This document defines the standard workflow for every agent session in this project.

The workflow is designed for a team with limited technical experience and multiple AI coding agents working on the same repository.

The primary goals are:

* Keep agents synchronized through shared documentation.
* Prevent agents from working from outdated assumptions.
* Preserve the original human request.
* Make task progress visible to other agents.
* Enable sequential agent handoff.
* Minimize unnecessary API requests.
* Prevent unrelated changes and architectural drift.
* Allow a new agent to continue work without requiring direct communication with the previous agent.

The repository documentation is the primary coordination mechanism.

---

# 2. Documentation Model

The project uses three categories of information.

## 2.1 Knowledge

Located in:

```text
knowledge/
```

Knowledge describes relatively stable information about the project.

Examples:

* What the project does
* System architecture
* Technology stack
* API information
* Environment configuration
* Development workflow

Agents should treat knowledge files as shared project context.

---

## 2.2 Human Requests

Located in:

```text
requestFromUsers/
```

These files contain the original requests submitted by humans.

Example:

```text
requestFromUsers/task_30_09.md
```

Human request files are historical inputs.

Agents MUST NOT rewrite the original request to match their technical interpretation.

If the requirement changes, create or use a new request file rather than silently changing historical input.

---

## 2.3 State

Located in:

```text
state/
```

State describes the current progress of work.

Examples:

```text
state/task_30_09_state.md
state/taskSummary.md
```

State may be updated by agents as work progresses.

---

# 3. Standard Session Workflow

Every agent session follows this sequence:

```text
LOAD CONTEXT
    ↓
READ HUMAN REQUEST
    ↓
READ PROJECT STATE
    ↓
CREATE / UPDATE TASK STATE
    ↓
DECOMPOSE TASK
    ↓
CHECK BLOCKERS
    ↓
IMPLEMENT
    ↓
VALIDATE
    ↓
UPDATE TASK STATE
    ↓
UPDATE PROJECT SUMMARY
    ↓
COMMIT
    ↓
HANDOFF
```

Agents should not skip workflow stages unless the stage is genuinely irrelevant to the current task.

---

# 4. Step 1 — Load Project Context

Before modifying the project, read the relevant knowledge files.

Start with:

```text
knowledge/metaDocsExplain.md
knowledge/projectOverview.md
knowledge/workflows.md
```

Then read the documents relevant to the task.

Typical examples:

```text
knowledge/architecture.md
knowledge/apiDocs.md
knowledge/configuration.md
```

Do not unnecessarily load every document when the task clearly does not require it.

### Context priority

When interpreting project information, use this priority:

1. Current implementation
2. Approved architectural decisions documented by the project
3. Current task state
4. Project knowledge
5. Human request interpretation

If documentation and implementation disagree, do not silently assume that the documentation is correct.

Investigate the discrepancy before making architectural changes.

---

# 5. Step 2 — Read the Human Request

Read the relevant file from:

```text
requestFromUsers/
```

Example:

```text
requestFromUsers/task_30_09.md
```

The original user request is the source of the requested outcome.

Agents should preserve its meaning but may translate it into technical implementation requirements.

For example:

### Human request

> "I want users to upload a PDF and see the extracted text."

The agent may interpret this as:

```text
- Create an upload endpoint.
- Accept PDF files.
- Extract text.
- Return extracted text.
- Display the result in the UI.
```

The original request itself must remain unchanged.

---

# 6. Step 3 — Read Project State

Read:

```text
state/taskSummary.md
```

Then locate the state file corresponding to the current task.

Example:

```text
state/task_30_09_state.md
```

The state file tells the agent:

* What has already been completed.
* What is currently in progress.
* What remains.
* Which files were changed.
* What previous agents discovered.
* Whether the task is blocked.
* What the next agent should do.

An agent MUST continue from the documented state rather than restarting the task from scratch.

---

# 7. Step 4 — Create or Update Task State

If the task state file does not exist, create it using:

```text
knowledge/templates/taskFilesTemplate.md
```

Example:

```text
state/task_30_09_state.md
```

Record:

* Task identifier
* Original user input
* Agent/device information
* Task status
* Problem decomposition
* Progress
* Files changed
* Validation results
* Remaining work
* Handoff notes

The state file is the primary handoff document for the task.

---

# 8. Step 5 — Decompose the Task

Translate the human request into small, verifiable subtasks.

Example:

```text
[x] Inspect existing document upload implementation
[x] Add PDF validation
[ ] Implement PDF text extraction
[ ] Add API response
[ ] Connect UI
[ ] Test complete flow
```

Tasks should be:

* Concrete
* Testable
* Relevant to the original request
* Small enough to track independently

Do not create unnecessary subtasks for trivial operations.

---

# 9. Step 6 — Check for Blockers

Before making significant changes, determine whether the task can safely proceed.

Potential blockers include:

### Requirement conflict

Two requirements cannot both be satisfied.

### Architectural conflict

The requested implementation requires changing the approved architecture.

### Missing credentials

An API key, secret, account, or permission is required.

### Missing external dependency

The implementation depends on a service that is unavailable or not configured.

### Destructive operation

The requested action could permanently delete or corrupt project data.

### Ambiguous requirement

The agent cannot determine the intended behavior without making a risky assumption.

If a blocker exists, do not invent a solution.

Set the task status to:

```text
BLOCKED
```

Document the blocker in the task state and escalate to the human.

---

# 10. Step 7 — Implement

If the task is not blocked, implement the smallest reliable solution satisfying the acceptance criteria.

Before changing code:

1. Inspect the existing implementation.
2. Identify reusable components.
3. Identify affected files.
4. Check existing conventions.
5. Avoid unnecessary architectural changes.

Agents MUST NOT:

* Rewrite working systems without a requirement.
* Introduce unrelated dependencies.
* Perform unrelated refactoring.
* Create duplicate implementations simply to avoid editing existing code.
* Modify unrelated features.
* Change the technology stack without approval.

---

# 11. Step 8 — Validate

Every completed implementation must be validated.

Depending on the task, validation may include:

```text
- Unit tests
- Integration tests
- API tests
- Build
- Lint
- Type checking
- Manual UI verification
- Container verification
```

Use the validation methods available in the project.

The agent must not report a feature as fully working without reasonable evidence.

Record validation results in the task state.

Example:

```text
## Validation

- Build: PASS
- API test: PASS
- Manual UI test: PASS
```

If validation fails, continue debugging within reasonable limits.

---

# 12. Step 9 — Update Task State

After implementation and validation, update:

```text
state/task_<date>_state.md
```

The state should accurately describe the current situation.

Update:

### Status

Possible values:

```text
TODO
IN_PROGRESS
BLOCKED
COMPLETED
```

### Progress

Mark completed subtasks:

```text
[x] Completed task
[ ] Remaining task
```

### Files Changed

List important files created or modified.

### Validation

Record actual validation results.

### Remaining Work

Clearly identify unfinished work.

### Handoff Notes

Explain what the next agent needs to know.

A handoff should be understandable without reading the entire conversation history.

---

# 13. Step 10 — Update Project Summary

Update:

```text
state/taskSummary.md
```

The summary should provide a high-level view of all tasks.

Example:

| Task     | Date  | Status      | Summary                      |
| -------- | ----- | ----------- | ---------------------------- |
| TASK-001 | 30/09 | COMPLETED   | Added document upload        |
| TASK-002 | 30/09 | IN_PROGRESS | Implementing text extraction |
| TASK-003 | 01/10 | TODO        | Build document viewer        |

Do not copy detailed implementation notes into `taskSummary.md`.

Detailed information belongs in the individual task state file.

---

# 14. Step 11 — Update Knowledge When Necessary

Not every task requires knowledge updates.

Update knowledge documents only when the project itself changes.

Examples:

### Update `architecture.md`

When:

* System components change.
* Data flow changes.
* API architecture changes.
* A new major service is introduced.

### Update `apiDocs.md`

When:

* API endpoints are added.
* API contracts change.
* External APIs change.

### Update `projectOverview.md`

Only when the fundamental project purpose or scope changes.

### Update `configuration.md`

When:

* Development environment requirements change.
* DevContainer configuration changes.
* Required runtime configuration changes.

Do not update documentation merely to create more activity.

Documentation must describe the actual implementation.

---

# 15. Step 12 — Git Checkpoint

After a coherent and validated unit of work, create a Git commit.

Example:

```text
feat(documents): add PDF text extraction
```

Commit messages should describe the actual change.

Before committing:

* Ensure secrets are not included.
* Ensure unrelated files are not modified accidentally.
* Ensure the implementation is in a reasonable working state.

Git commits provide checkpoints and historical traceability between agents.

---

# 16. Step 13 — Handoff

When a task is incomplete, the current agent must leave enough information for another agent to continue.

The handoff must be written to:

```text
state/task_<date>_state.md
```

Include:

```text
## Handoff Notes

### What was completed

...

### What remains

...

### Important implementation details

...

### Known problems

...

### Recommended next action

...
```

The next agent should be able to continue without contacting the previous agent.

---

# 17. Task Completion

A task may be marked:

```text
COMPLETED
```

only when:

1. The requested functionality has been implemented.
2. Relevant validation has passed.
3. The task state has been updated.
4. `taskSummary.md` has been updated.
5. Relevant project documentation has been updated.
6. A Git checkpoint has been created.

If any of these are incomplete, the task should remain `IN_PROGRESS` or `BLOCKED`.

---

# 18. Agent Handoff Principle

Agents do not need direct communication with each other.

The repository is the shared communication layer.

The primary handoff mechanism is:

```text
Human Request
      ↓
Task State
      ↓
Code
      ↓
Validation
      ↓
Git Commit
      ↓
Task State
      ↓
Next Agent
```

The next agent should trust documented evidence, inspect the actual implementation, and continue from the current state.

---

# 19. Request Efficiency

The project may operate under strict API/model request limits.

Agents should therefore:

* Read relevant context before acting.
* Avoid repeatedly reading unchanged files.
* Batch independent operations when safe.
* Avoid unnecessary conversational questions.
* Prefer repository state over conversation history.
* Perform implementation and documentation updates in the same working session when practical.

Request efficiency must not compromise validation or correctness.

---

# 20. Golden Rule

When uncertain:

> **Preserve the original request, preserve the existing architecture, preserve working code, and document the current state.**

Do not silently invent requirements.

Do not silently change architecture.

Do not silently mark unfinished work as complete.
