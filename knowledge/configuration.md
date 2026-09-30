# Configuration

> Environment, devcontainer and machine information for this project.
> Only information that affects development is recorded here.
> Related: `architecture.md` (stack) · `projectOverview.md` (context)
> Last updated: 30/09/2026

---

## 1. Current Device (machine used for the current session)

| Item | Value |
| --- | --- |
| Device | DevContainer **"ATI Next.js Vibe Coding Environment"** (Docker container) |
| Repository location | `/workspaces/ATI_PhAnh_group` |
| Operating system | Debian GNU/Linux 12 (bookworm) |
| Architecture | `x86_64` |
| Node.js | `v20.18.0` |
| npm | `10.8.2` |
| CPU / RAM / disk visible to the container | 16 vCPU · ~3.7 GiB RAM · ~921 GiB free on the overlay filesystem |
| Container user / working dir | `node` / `/workspace` |
| Forwarded port | `3000` |
| Tools installed by the image | `git`, `curl`, `sqlite3`, `libsqlite3-dev`, `openssl`, `ca-certificates` |

Observed with `node -v`, `npm -v`, `uname -m`, `nproc`, `free -h`, `df -h`.
The CPU/RAM/disk numbers are **container limits**, not the physical laptop specification.

---

## 2. DevContainer Definition

### `.devcontainer/Dockerfile`

```dockerfile
FROM node:20.18.0-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl sqlite3 libsqlite3-dev openssl ca-certificates
WORKDIR /workspace
USER node
EXPOSE 3000
```

### `.devcontainer/devcontainer.json`

| Setting | Value |
| --- | --- |
| Name | ATI Next.js Vibe Coding Environment |
| Build | Dockerfile |
| `remoteUser` | `node` |
| `forwardPorts` | `3000` |
| `postCreateCommand` | `node -v && npm -v` |
| VS Code settings | bash default profile, format on save, Prettier default formatter |
| VS Code extensions | ESLint, Prettier, Prisma, Cline, Tailwind CSS IntelliSense, GitLens |

---

## 3. Application Runtime and Dependencies

| Component | Version | Source |
| --- | --- | --- |
| Node.js | 20.18.0 (pinned by the image) | `.devcontainer/Dockerfile` |
| Next.js | 15.5.26 | `package.json` |
| React / React DOM | 19.1.0 | `package.json` |
| Zod | ^4.6.5 | `package.json` |
| TypeScript | ^5 | `package.json` |
| ESLint | ^9 + `eslint-config-next` 15.5.26 + `@eslint/eslintrc` ^3 | `package.json` / `eslint.config.mjs` |
| `@types/node` | ^20 | `package.json` |

### Known engine mismatch (must be validated/fixed)

`npm install` reported:

```text
npm warn EBADENGINE  package: 'eslint-visitor-keys@5.0.1'
  required: { node: '^20.19.0 || ^22.13.0 || >=24' }
  current:  { node: 'v20.18.0', npm: '10.8.2' }
```

Options (pick one, needs a decision before `npm run lint` can be trusted):

1. Bump the base image to `node:20.19.0-bookworm` (or newer 20.x) — preferred.
2. Pin `eslint-visitor-keys`/ESLint to versions that support Node 20.18.
3. Remove the ESLint setup and rely on `npm run typecheck` for validation.

---

## 4. Environment Variables

| Variable | Required now? | Purpose |
| --- | --- | --- |
| — | — | The current implementation needs **no** environment variable |

Future (only when the real LLM integration is approved) — put them in `.env.local`, which is gitignored, and never commit secrets:

```text
# example only — none of these are currently used
OPENAI_API_KEY=...
OPENROUTER_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

---

## 5. External Services Required for Development

**None.** No database server, no message queue, no API key.
The mock database is the file `data/invoices.json`, created at runtime and gitignored.

---

## 6. Development Commands

```bash
# 1. install dependencies
npm install

# 2. start the dev server (http://localhost:3000)
npm run dev

# 3. validation
npm run typecheck    # tsc --noEmit
npm run lint         # eslint (see engine mismatch in §3)
npm run build        # production build

# 4. optional: regenerate the sample invoice used for testing
node scripts/make-sample-pdf.mjs

# 5. optional: test the API without the browser
curl -F "file=@samples/sample-invoice.pdf;type=application/pdf" http://localhost:3000/api/extract
curl http://localhost:3000/api/invoices
```

> **Verified on 30/09/2026:** `npm install` completed (`added 308 packages in 8m`) and
> `package-lock.json` exists. `node_modules/.bin` contains `next`, `tsc` and `eslint`.
> The container has only ~3.7 GiB of RAM, so dependency installation (~8 min) and `npm run build`
> (webpack compile ≈ 56 s, then a long lint/type phase) are slow — allow several minutes.
>
> **Dev-server caveat:** in this container `next dev` did **not** hot-reload a changed API route.
> After editing anything under `app/api/`, restart the dev server before re-testing.

---

## 7. Personal Computer Configurations (team)

Each member should add one row and mark which device is used for the current session.
A new agent cannot detect other people's machines, so this table is **maintained by the team**.

| # | Member / role | Device name | Operating system | CPU | RAM | GPU | Node.js | Docker | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | TODO (currently used) | DevContainer in workspace | Debian 12 (container) | 16 vCPU (container) | ~3.7 GiB (container) | — | v20.18.0 | yes | this session |
| 2 | TODO: team member 1 | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| 3 | TODO: team member 2 | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |

How to collect the values:

```bash
node -v          # Node.js version
npm -v           # npm version
docker --version # Docker version (needed for the DevContainer)
uname -a         # Linux / macOS kernel information
systeminfo       # Windows: OS + CPU + RAM (or: Get-ComputerInfo)
```

---

## 8. New Machine Checklist

1. Install Docker Desktop (or Docker Engine) and VS Code with the **Dev Containers** extension.
2. Clone the repository and choose *Reopen in Container*; VS Code builds `.devcontainer/Dockerfile`.
3. Check `node -v` / `npm -v` (the `postCreateCommand` already runs this).
4. `npm install`.
5. `npm run dev` and open port **3000** in the browser.
6. Add your machine to the table in §7.
