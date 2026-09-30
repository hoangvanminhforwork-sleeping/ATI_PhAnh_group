import { NextRequest } from "next/server";
import { MAX_FILE_SIZE_BYTES, mockExtract } from "@/lib/mockExtractor";
import { extractionResultSchema } from "@/lib/invoiceSchema";
import { saveInvoice } from "@/lib/invoiceStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, code: string, message: string, details: string[] = []) {
  return Response.json({ ok: false, error: { code, message, details } }, { status });
}

/**
 * POST /api/extract
 * multipart/form-data with a single field `file` (PDF / PNG / JPEG).
 * Returns the validated extraction result (mock data) and stores it.
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    // A request without a multipart body (or without a Content-Type) throws here.
    // That is a client error, not a server error.
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return jsonError(400, "NO_FILE", "Thiếu multipart/form-data với field tên `file`.");
    }

    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return jsonError(400, "NO_FILE", "Thiếu file. Hãy gửi multipart/form-data với field tên `file`.");
    }

    if (file.size === 0) {
      return jsonError(400, "EMPTY_FILE", "File rỗng.");
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return jsonError(413, "FILE_TOO_LARGE", `File vượt quá ${Math.round(MAX_FILE_SIZE_BYTES / 1024 / 1024)}MB.`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = mockExtract({
      buffer,
      fileName: file.name || "upload",
      mimeType: file.type,
      sizeBytes: file.size,
    });

    if (!result) {
      return jsonError(
        415,
        "UNSUPPORTED_TYPE",
        "Chỉ hỗ trợ PDF, PNG hoặc JPEG.",
        [`Nhận được: type="${file.type || "unknown"}", name="${file.name}"`],
      );
    }

    // Structured-output validation: the same contract will validate a real LLM response later.
    const parsed = extractionResultSchema.safeParse(result);
    if (!parsed.success) {
      return jsonError(500, "SCHEMA_MISMATCH", "Kết quả trích xuất không khớp schema.", parsed.error.issues.map(String));
    }

    await saveInvoice(parsed.data);

    return Response.json(
      { ok: true, data: parsed.data, meta: { processingMs: Date.now() - startedAt } },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST /api/extract]", error);
    return jsonError(500, "INTERNAL_ERROR", "Không xử lý được file. Xem log server.");
  }
}
