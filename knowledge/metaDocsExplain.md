# Documentation System Guide

## 1. Purpose

This document explains the purpose and relationship of the project's documentation files.

The documentation system exists so that humans and AI agents can coordinate work without depending on conversation history.

The repository should be treated as the shared source of project context and task state.

---

# 2. Documentation Structure

```text
knowledge/
├── templates/
│   ├── architectureTemplates.md
│   └── taskFilesTemplate.md
├── apiDocs.md
├── architecture.md
├── configuration.md
├── metaDocsExplain.md
├── projectOverview.md
└── workflows.md

requestFromUsers/
└── task_<date>.md

state/
├── task_<date>_state.md
└── taskSummary.md
```

---

# 3. Three Information Layers

The documentation system is divided into three primary layers.

## 3.1 Knowledge

Location:

```text
knowledge/
```

Purpose:

> Describe what the project is and how it works.

Knowledge should generally remain stable across individual tasks.

Examples:

* Project purpose
* Architecture
* APIs
* Environment
* Workflow

---

## 3.2 Human Input

Location:

```text
requestFromUsers/
```

Purpose:

> Preserve what the human actually asked for.

These files represent input events.

Example:

```text
requestFromUsers/task_30_09.md
```

The original request should not be rewritten by agents.

Technical interpretation belongs in the task state, not in the original request.

---

## 3.3 State

Location:

```text
state/
```

Purpose:

> Describe what has happened and what should happen next.

State changes as agents work.

Examples:

```text
state/task_30_09_state.md
state/taskSummary.md
```

---

# 4. Individual Documents

## `projectOverview.md`

Answers:

> "What is this project?"

Contains:

* Project purpose
* Target users
* Main features
* Scope
* Team profile
* Development model
* High-level project status

This is high-level project context.

---

## `architecture.md`

Answers:

> "How does the system work?"

Contains:

* Repository structure
* Technology stack
* System components
* Data/request flow
* External services
* Architecture diagrams
* Important technical constraints

The architecture document must describe the actual implementation.

---

## `apiDocs.md`

Answers:

> "What APIs does this project use or expose?"

Contains:

* Internal API endpoints
* External API integrations
* Request/response formats
* Authentication requirements
* Relevant API limitations
* Important integration notes

Keep this document focused on API-related information.

---

## `configuration.md`

Answers:

> "What environment does the project run in?"

Contains:

* Development environment
* DevContainer configuration
* Docker configuration
* Runtime versions
* Required environment variables
* Relevant machine configuration
* External services required for development

Do not document hardware information that has no effect on development.

---

## `workflows.md`

Answers:

> "How should an agent perform work?"

Contains:

* Session workflow
* Context loading
* Task creation
* Implementation process
* Validation
* Documentation updates
* Git checkpoints
* Handoff
* Escalation rules

This is the operating procedure for AI agents.

---

## `metaDocsExplain.md`

Answers:

> "What does each documentation file mean?"

This document explains the documentation system itself.

It should remain concise and should not contain project implementation details.

---

# 5. User Request Files

Location:

```text
requestFromUsers/
```

Naming convention:

```text
task_DD_MM.md
```

Example:

```text
task_30_09.md
```

The file contains the original human request.

Example:

```text
# User Request

Add a PDF upload feature so users can upload a document and view the extracted text.
```

Agents should preserve the original wording.

If a new request supersedes an old request, create a new request file rather than modifying the old one.

---

# 6. Task State Files

Location:

```text
state/
```

Naming convention:

```text
task_<date>_state.md
```

Example:

```text
task_30_09_state.md
```

A task state file contains the working state of a specific task.

It should include:

* Task metadata
* Original user request
* Problem decomposition
* Progress
* Files changed
* Validation
* Blockers
* Remaining work
* Handoff notes

This is the primary agent-to-agent handoff document.

---

# 7. Task Summary

File:

```text
state/taskSummary.md
```

Answers:

> "What is the overall status of the project's tasks?"

It should contain a concise table.

Recommended columns:

| Task     | Date  | Status      | Agent   | Summary                 |
| -------- | ----- | ----------- | ------- | ----------------------- |
| TASK-001 | 30/09 | COMPLETED   | Agent A | Added PDF upload        |
| TASK-002 | 30/09 | IN_PROGRESS | Agent B | Implementing extraction |

Do not place detailed technical logs here.

Detailed information belongs in the corresponding task state file.

---

# 8. Templates

Location:

```text
knowledge/templates/
```

Templates define the expected structure of frequently created documents.

Current templates:

### `architectureTemplates.md`

Used when creating or restructuring `architecture.md`.

### `taskFilesTemplate.md`

Used when creating a new task state file.

Templates should contain structure and guidance rather than project-specific information.

---

# 9. Information Flow

The normal information flow is:

```text
Human
  │
  │ request
  ▼
requestFromUsers/
  │
  ▼
Agent interprets request
  │
  ▼
state/task_<date>_state.md
  │
  ▼
Implementation
  │
  ▼
Validation
  │
  ▼
Updated task state
  │
  ▼
state/taskSummary.md
```

Project knowledge provides context throughout the process:

```text
                 knowledge/
                /    |     \
               /     |      \
              ▼      ▼       ▼
        Architecture APIs Configuration
               \      |      /
                \     |     /
                 ▼    ▼    ▼
                  Agent
                    │
                    ▼
                  Task
```

---

# 10. Source-of-Truth Rules

Different documents are authoritative for different information.

| Information            | Source of Truth        |
| ---------------------- | ---------------------- |
| Original human request | `requestFromUsers/`    |
| Project purpose        | `projectOverview.md`   |
| Architecture           | `architecture.md`      |
| API information        | `apiDocs.md`           |
| Environment            | `configuration.md`     |
| Agent procedure        | `workflows.md`         |
| Current task state     | `task_<date>_state.md` |
| Overall task status    | `taskSummary.md`       |

Do not duplicate information unnecessarily.

If the same information appears in multiple documents, keep the copies consistent.

---

# 11. Update Rules

Not every agent session should modify every document.

### Update request files

Only humans should normally create or modify original request files.

### Update task state

Agents update task state whenever task progress changes.

### Update task summary

Agents update the summary when task status changes.

### Update architecture

Update only when the actual system architecture changes.

### Update API documentation

Update when API contracts or integrations change.

### Update configuration

Update when the development environment changes.

### Update project overview

Update when project scope, purpose, or high-level characteristics change.

### Update templates

Update only when the documentation format itself needs to change.

---

# 12. Documentation Principles

## Preserve Original Input

Do not rewrite historical human requests.

## Keep State Current

Task state should describe the current reality, not what was originally planned.

## Prefer Concise Documentation

Documentation exists to help agents work, not to create unnecessary text.

## Avoid Duplicate Information

Every important fact should have one primary location.

## Record Handoffs Explicitly

The next agent should not need access to the previous agent's conversation.

## Describe Reality

Documentation must reflect the actual implementation.

Do not document planned architecture as if it were already implemented.

---

# 13. Mental Model

The documentation system can be understood as:

```text
KNOWLEDGE
"What do we know?"
      +
REQUEST
"What does the human want?"
      +
STATE
"What has happened?"
      =
CONTEXT FOR THE NEXT AGENT
```

The system is intentionally file-based.

No dedicated agent orchestration server is required for the basic workflow.

Git and repository files provide persistence, history, and coordination between agents.
