import { clearInvoices, listInvoices } from "@/lib/invoiceStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/invoices — list the invoices stored by the mock database. */
export async function GET() {
  const invoices = await listInvoices();
  return Response.json({ ok: true, count: invoices.length, data: invoices });
}

/** DELETE /api/invoices — reset the mock database (useful for demos). */
export async function DELETE() {
  const deleted = await clearInvoices();
  return Response.json({ ok: true, deleted });
}
