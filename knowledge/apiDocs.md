# API Documentation

> Internal API exposed by the Next.js App Router (`app/api/**`).
> **No external API is called** in the current implementation — the extraction step is mocked.
> Response contract source of truth: `lib/invoiceSchema.ts`.
> Last updated: 30/09/2026

---

## 1. General Conventions

| Item | Value |
| --- | --- |
| Base URL (dev) | `http://localhost:3000` |
| Authentication | **None** (no auth implemented) |
| Upload encoding | `multipart/form-data` |
| Response encoding | `application/json` |
| Runtime | Node.js (`runtime = "nodejs"`, routes read/write files) |
| Caching | `dynamic = "force-dynamic"` on both routes |
| Error message language | Vietnamese |

> **Verification status:** every endpoint and error code below was executed with `curl` against the
> dev server on 30/09/2026 (results in `state/task_30_09_state.md` §5).

### Response envelope

Success:

```json
{ "ok": true, "data": { }, "meta": { } }
```

Error:

```json
{ "ok": false, "error": { "code": "UNSUPPORTED_TYPE", "message": "...", "details": [] } }
```

---

## 2. `POST /api/extract`

Upload one invoice document; the server returns the structured extraction result and stores it in the mock database.

### Request

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `file` | file | yes | `application/pdf`, `image/png`, `image/jpeg`; not empty; ≤ 10 MB (`MAX_FILE_SIZE_BYTES`) |

Server-side validation order:

1. field `file` must exist (`NO_FILE`)
2. size must be > 0 (`EMPTY_FILE`)
3. size must be ≤ 10 MB (`FILE_TOO_LARGE`)
4. magic bytes must be `%PDF-` / `89 50 4E 47` / `FF D8 FF`; otherwise the reported mime type is used as fallback (`UNSUPPORTED_TYPE`)
5. the generated result is validated by `extractionResultSchema` (`SCHEMA_MISMATCH`)

### Success response — `200`

```json
{
  "ok": true,
  "data": {
    "recordId": "inv_a1b2c3d4e5f60718_m9k2x1",
    "createdAt": "2026-09-30T05:02:11.482Z",
    "source": {
      "fileName": "sample-invoice.pdf",
      "mimeType": "application/pdf",
      "sizeBytes": 1764,
      "kind": "pdf",
      "estimatedPages": 2,
      "contentHash": "a1b2c3d4e5f60718"
    },
    "invoice": {
      "invoiceNumber": "438219",
      "serialNumber": "1C31TAA",
      "issueDate": "2026-08-17",
      "sellerName": "CÔNG TY TNHH THƯƠNG MẠI AN PHÁT",
      "sellerTaxId": "3791765412",
      "sellerAddress": "12 Nguyễn Trãi, Q. Thanh Xuân, Hà Nội",
      "buyerName": "CÔNG TY TNHH PHẦN MỀM ATI",
      "buyerTaxId": "6123098477",
      "currency": "VND",
      "lineItems": [
        { "name": "Giấy in A4 Double A 70gsm", "unit": "Ram", "quantity": 7, "unitPrice": 85000, "lineTotal": 595000 }
      ],
      "subtotal": 595000,
      "taxRate": 0.1,
      "taxAmount": 59500,
      "totalAmount": 654500
    },
    "extraction": {
      "provider": "mock",
      "model": "mock-invoice-extractor-v1",
      "processingMs": 4,
      "confidence": 0.86,
      "warnings": [
        "Dữ liệu mô phỏng (mock) — chưa gọi Multimodal LLM thật.",
        "PDF có khoảng 2 trang; mock chỉ mô phỏng trích xuất trang đầu tiên."
      ]
    }
  },
  "meta": { "processingMs": 12 }
}
```

> Example values are illustrative; the exact numbers depend on the uploaded bytes (deterministic hash seed).

### Error responses

| Status | Code | Cause |
| --- | --- | --- |
| 400 | `NO_FILE` | multipart body without a `file` field, **or** a request whose Content-Type is not `multipart/form-data` (both cases return 400, verified) |
| 400 | `EMPTY_FILE` | 0-byte file |
| 413 | `FILE_TOO_LARGE` | file > 10 MB |
| 415 | `UNSUPPORTED_TYPE` | not a PDF/PNG/JPEG |
| 500 | `SCHEMA_MISMATCH` | generated result does not satisfy the Zod contract |
| 500 | `INTERNAL_ERROR` | unexpected server error (logged to the server console) |

### cURL examples

```bash
# success
curl -i -F "file=@samples/sample-invoice.pdf;type=application/pdf" http://localhost:3000/api/extract

# unsupported type
curl -i -F "file=@README.md;type=text/markdown" http://localhost:3000/api/extract

# missing field
curl -i -X POST http://localhost:3000/api/extract
```

---

## 3. `GET /api/invoices`

Lists every invoice stored in the mock database (`data/invoices.json`, newest first, max 50 records).

```bash
curl -s http://localhost:3000/api/invoices
```

```json
{ "ok": true, "count": 1, "data": [ /* ExtractionResult[] */ ] }
```

---

## 4. `DELETE /api/invoices`

Resets the mock database. Intended for demos/tests.

```bash
curl -s -X DELETE http://localhost:3000/api/invoices
# { "ok": true, "deleted": 1 }
```

---

## 5. Response Object Reference (`ExtractionResult`)

| Field | Type | Notes |
| --- | --- | --- |
| `recordId` | string | `inv_<hash>_<base36 time>` |
| `createdAt` | string (ISO) | when the mock extraction ran |
| `source.fileName` | string | original upload name |
| `source.mimeType` | string | reported mime type |
| `source.sizeBytes` | number | upload size |
| `source.kind` | `pdf` \| `png` \| `jpeg` | detected from magic bytes |
| `source.estimatedPages` | number | heuristic for PDFs, always 1 for images |
| `source.contentHash` | string(16) | first 16 hex chars of the SHA-256 of the bytes |
| `invoice.*` | object | invoice number, serial, issue date, seller/buyer, currency, `lineItems[]`, subtotal, taxRate, taxAmount, totalAmount |
| `extraction.provider` | literal `"mock"` | will become the real provider name (e.g. `openai`) |
| `extraction.model` | string | `mock-invoice-extractor-v1` |
| `extraction.processingMs` | number | mock processing duration |
| `extraction.confidence` | number 0–1 | random-but-deterministic mock value |
| `extraction.warnings` | string[] | tells the user the data is mock / multi-page limitation |

The authoritative field list and constraints: `lib/invoiceSchema.ts`.

---

## 6. Limitations and Integration Notes

* **No authentication / authorization.** Any client can upload, read and delete stored records.
* **No rate limiting** and no file persistence of the uploaded document itself (only the extracted JSON is stored).
* The mock database is a JSON file: single-process only; concurrent writes are not protected; not suitable for serverless deployment.
* The uploaded bytes are **not** interpreted as content (no OCR, no text extraction), so the mock values are not the real values printed on the invoice.
* Nothing is sent to an external service, therefore there is no quota, cost or data-privacy exposure today.

### Planned external integration (not implemented)

| Item | Plan |
| --- | --- |
| Provider | OpenAI / OpenRouter / Gemini (Multimodal) |
| Call site | `app/api/extract/route.ts` (replace `mockExtract()`) |
| Method | Structured Outputs with the existing Zod schema (e.g. AI SDK `generateObject`) |
| Credentials | Provider API key in `.env.local` (never committed) |
| Payload | base64 of the uploaded PDF/image |
| Blocked by | Provider choice + API key + quota approval → requires human decision |
