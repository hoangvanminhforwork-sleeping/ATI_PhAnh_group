# PROJECT_DETAILS.MD - SYSTEM REQUIREMENTS & ARCHITECTURE

## 1. PROJECT OVERVIEW
* **Project Name:** Automated Invoice Data Extraction System (Hệ thống Tự động hóa Trích xuất & Quản lý Hóa đơn).
* **Primary Objective:** Build a fullstack web prototype that ingests invoice files (PDF/Images), sends API requests to **Multimodal LLMs** Users decide which model used in UI to extract structured financial data, stores it in a database, and presents it on a clean dashboard.
* **Core Philosophy:** Focus heavily on effective **LLM API Integration** and **Structured Output Validation**. Keep the infrastructure simple to maximize development speed and reliability.

---

## 2. LLM INTEGRATION & API WORKFLOW (CORE ENGINE)

### A. Input Ingestion & Preprocessing
* **Supported Inputs:** Vietnamese VAT invoices, retail receipts, e-invoices (PDF, PNG, JPG).
* **Pre-flight Checks:** Client-side file type and size validation (reject `.docx`, `.exe`, or excessively large files before hitting APIs).
* **Payload Preparation:** Convert image/PDF buffers to base64 or temporary blobs to pass directly into the Multimodal LLM API.

### B. LLM API Request & Structured Extraction
* **Target Models:** Users define in batchjob
* **Extraction Strategy:** Utilize **Structured Outputs** with **Zod Schema** enforcement. The API request must force the LLM to return valid JSON, preventing free-form conversational text responses.
* **Extracted Schema Fields:**
  * **Invoice Header:** Serial Number, Tax Identification Number (MST), Issue Date, Seller Name.
  * **Line Items (Array):** Item Name, Quantity, Unit Price, Line Total.
  * **Financial Totals:** Subtotal, Tax Rate/Amount, Total Amount Payable.

---

## 3. DATA PIPELINE & SYSTEM ARCHITECTURE

1. **Client (Frontend UI):**
   * Drag-and-drop file uploader with instant image preview.
   * Status indicators for API processing (Uploading -> Calling LLM API -> Parsed Result).
2. **Backend API Route:**
   * Receives uploaded file.
   * Constructs the system prompt and Zod schema.
   * Sends the payload to the external LLM API (OpenAI/OpenRouter/Gemini).
   * Validates the JSON response returned by LLM.
3. **Storage (SQLite DB via Prisma):**
   * Stores relational data (Users, Departments, Audit Logs).
   * Stores the raw extracted JSON payload for flexible querying.
4. **Data Retrieval & Security (RBAC):**
   * Multi-tenant structure: Automatic query filtering based on `Department_ID` so users only access their own department's invoices.

---

## 4. INSTRUCTIONS FOR CLINE (CODING AGENT)
> **Note for AI (Cline):** Read this file carefully alongside `AGENTS.md`. 
> * Build a unified **Next.js (App Router)** application.
> * Implement the API routes that construct and send requests to the LLM API using `@ai-sdk` or standard SDKs with `zod`.
> * At the end of the sprint, generate a comprehensive architecture explanation, including **Mermaid Sequence Diagrams** (showing File Upload -> LLM API Call -> DB Storage) and save it directly to `architecture_explanation.md`.