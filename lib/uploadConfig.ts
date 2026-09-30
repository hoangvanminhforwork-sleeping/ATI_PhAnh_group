/**
 * Upload rules shared by the browser (client-side pre-flight check) and the
 * server (authoritative validation in `app/api/extract/route.ts`).
 *
 * This file must stay free of Node-only imports so client components can use it.
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"] as const;
export const ACCEPTED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg"] as const;

/** Client-side pre-flight check. Returns an error message, or null when the file is acceptable. */
export function validateUploadFile(file: File): string | null {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const mimeOk = (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type.toLowerCase());
  const extensionOk = (ACCEPTED_EXTENSIONS as readonly string[]).includes(extension);

  if (!mimeOk && !extensionOk) {
    return `Định dạng không hỗ trợ (${file.type || extension || "không rõ"}). Chỉ nhận PDF, PNG, JPEG.`;
  }
  if (file.size === 0) {
    return "File rỗng.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File vượt quá ${Math.round(MAX_FILE_SIZE_BYTES / 1024 / 1024)}MB.`;
  }
  return null;
}
