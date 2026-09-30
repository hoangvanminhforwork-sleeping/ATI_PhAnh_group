"use client";

import { useCallback, useEffect, useState } from "react";
import UploadBox, { type UploadStatus } from "@/components/UploadBox";
import InvoiceResult from "@/components/InvoiceResult";
import InvoiceHistory from "@/components/InvoiceHistory";
import type { ExtractionResult } from "@/lib/invoiceSchema";
import { validateUploadFile } from "@/lib/uploadConfig";

type ExtractResponse = {
  ok: boolean;
  data?: ExtractionResult;
  error?: { code: string; message: string; details?: string[] };
};

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [invoices, setInvoices] = useState<ExtractionResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch("/api/invoices", { cache: "no-store" });
      const payload = (await response.json()) as { data?: ExtractionResult[] };
      setInvoices(payload.data ?? []);
    } catch {
      setError("Không tải được danh sách hóa đơn đã lưu.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  function handleFileSelected(selected: File) {
    const message = validateUploadFile(selected);
    if (message) {
      setError(message);
      setFile(null);
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("idle");
    setFile(selected);
  }

  async function handleUpload() {
    if (!file) return;
    setStatus("processing");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/extract", { method: "POST", body: formData });
      const payload = (await response.json()) as ExtractResponse;

      if (!response.ok || !payload.ok || !payload.data) {
        setStatus("error");
        setError(payload.error?.message ?? `Lỗi HTTP ${response.status}`);
        return;
      }

      setResult(payload.data);
      setStatus("done");
      await loadHistory();
    } catch {
      setStatus("error");
      setError("Không gọi được API /api/extract. Kiểm tra server đang chạy.");
    }
  }

  async function handleClearHistory() {
    await fetch("/api/invoices", { method: "DELETE" });
    setInvoices([]);
    setResult(null);
  }

  function handleReset() {
    setFile(null);
    setStatus("idle");
    setError(null);
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Smart Document Processing — Trích xuất hóa đơn</h1>
        <p>
          Upload hóa đơn PDF/ảnh → hệ thống sinh dữ liệu JSON có cấu trúc (mock) → lưu vào database
          tạm. Luồng API và schema đã thật, chỉ phần gọi Multimodal LLM là mock.
        </p>
      </header>

      {error ? <div className="alert alert-error">✖ {error}</div> : null}

      <UploadBox
        file={file}
        status={status}
        onFileSelected={handleFileSelected}
        onUpload={handleUpload}
        onReset={handleReset}
      />

      {result ? <InvoiceResult result={result} /> : null}

      <InvoiceHistory
        invoices={invoices}
        loading={historyLoading}
        onRefresh={loadHistory}
        onClear={handleClearHistory}
      />
    </main>
  );
}
