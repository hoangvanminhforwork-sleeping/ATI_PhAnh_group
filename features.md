# Features

> User-visible functionality of the project.
> Status vocabulary: **Working · Partial · Mocked · In-Progress · Blocked**.
> Architecture: `knowledge/architecture.md` · API details: `knowledge/apiDocs.md`
> Last updated: 30/09/2026.
> `Working` = verified end-to-end at HTTP/data level · `Partial` = verified at API/data level, UI not
> click-tested in a browser yet · `Mocked` = works, but the data is simulated.
> Evidence for everything below: `state/task_30_09_state.md` §5.

---

## F-01 — Submission box (upload an invoice)

* **Description:** A box on the home page where the user drags & drops or picks a PDF/PNG/JPEG invoice (≤ 10 MB). The client checks type/size first, then uploads with *Tải lên & trích xuất*.
* **How to test:**
  1. `npm run dev` → open <http://localhost:3000>.
  2. Drag `samples/sample-invoice.pdf` onto the box (or click it and pick the file).
  3. The file name, size and status pill appear; try a `.txt`/`.docx` file to see the client-side rejection message.
  4. Click *Tải lên & trích xuất*.
* **Expected result:** the pill changes `Chờ file → Đang gọi API → Đã trích xuất` and the result section appears. A too-large/unsupported file shows a red error banner without calling the API.
* **Status:** Partial — `GET /` was verified to return HTTP 200 with the box rendered; the drag & drop/picker interaction has not been click-tested in a browser.

## F-02 — Structured invoice data (mock extraction)

* **Description:** The server derives a complete invoice JSON (number, serial, issue date, seller/buyer + tax IDs, line items, subtotal, VAT, total) from the uploaded file: magic bytes decide the document kind, the SHA-256 hash of the bytes seeds a deterministic random generator, and a PDF page-count heuristic adds a warning for multi-page documents.
* **How to test:**
  1. `curl -F "file=@samples/sample-invoice.pdf;type=application/pdf" http://localhost:3000/api/extract`
  2. Or upload the same file twice in the UI: the invoice number, seller, items and amounts stay identical (only `createdAt`/`processingMs` change).
  3. A multi-page PDF produces the warning `PDF có khoảng N trang; mock chỉ mô phỏng trích xuất trang đầu tiên.`
* **Expected result:** valid invoice JSON that always satisfies `lib/invoiceSchema.ts`.
* **Status:** Mocked — verified: HTTP 200, `kind=pdf`, `estimatedPages=2`, both warnings, and identical `contentHash`/`invoiceNumber` across two separate server runs.

## F-03 — Result dashboard

* **Description:** Invoice card (header fields), line-item table, totals block, raw JSON viewer and a *Tải file JSON* button that downloads the exact API response.
* **How to test:** after F-02, compare the raw JSON block with the downloaded file (they must be identical), and check that the totals equal the sum of the line items.
* **Expected result:** downloaded JSON equals the displayed response and validates against the Zod schema.
* **Status:** Partial — the returned data is verified; the rendered card has not been visually checked in a browser.

## F-04 — Stored invoices (mock database) + reset

* **Description:** Every successful extraction is appended to `data/invoices.json` (newest first, max 50 records) and listed in section *3. Hóa đơn đã lưu*. *Làm mới* reloads the list, *Xoá tất cả* calls `DELETE /api/invoices`.
* **How to test:**
  1. `curl -s http://localhost:3000/api/invoices` → `{"ok":true,"count":N,"data":[...]}`
  2. `cat data/invoices.json` → the same records on disk (persistence across server restarts).
  3. `curl -X DELETE http://localhost:3000/api/invoices` → `{"ok":true,"deleted":N}` and the list becomes empty.
* **Expected result:** records persist across reloads and can be reset for a demo.
* **Status:** Partial — list + reset verified through the API (`count: 2`, `deleted: 1`); the rendered list has not been visually checked.

## F-05 — Sample invoice file for testing

* **Description:** `scripts/make-sample-pdf.mjs` regenerates `samples/sample-invoice.pdf`, a 2-page ASCII invoice used for manual testing (no dependencies).
* **How to test:** `node scripts/make-sample-pdf.mjs` → prints `Wrote .../samples/sample-invoice.pdf (1764 bytes, 2 pages)`.
* **Expected result:** the file exists and opens in a PDF viewer.
* **Status:** Working — the generator was executed successfully and the produced file was accepted by `POST /api/extract`.

---

## Not implemented (do not claim these work)

| Feature | Notes |
| --- | --- |
| Real Multimodal LLM extraction (OpenAI/OpenRouter/Gemini) | Mocked today; needs a provider + API key (human decision) |
| OCR / reading the actual invoice content | The mock never reads pixel or text content |
| SQLite + Prisma storage, users, departments, audit logs | Target architecture in `project_details.md` |
| Authentication and department-scoped RBAC | No login exists; all endpoints are open |
| Batch jobs / model selection per job | Mentioned in `project_details.md` |
| PDF/image preview in the submission box | Only file name/size are shown |
| Automated tests | No test runner is configured |
