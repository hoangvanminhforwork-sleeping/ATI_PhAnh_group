import { z } from "zod";

/**
 * Zod contract for the extracted invoice data.
 *
 * This schema is the single source of truth for the JSON shape returned by
 * `POST /api/extract`. It is written so that the current mock extractor
 * (`lib/mockExtractor.ts`) and a future real Multimodal LLM call can be
 * validated with exactly the same contract.
 */

export const lineItemSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  lineTotal: z.number().nonnegative(),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1),
  serialNumber: z.string().min(1),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sellerName: z.string().min(1),
  sellerTaxId: z.string().regex(/^\d{10}(-\d{3})?$/),
  sellerAddress: z.string().min(1),
  buyerName: z.string().min(1),
  buyerTaxId: z.string().regex(/^\d{10}(-\d{3})?$/),
  currency: z.literal("VND"),
  lineItems: z.array(lineItemSchema).min(1).max(10),
  subtotal: z.number().nonnegative(),
  taxRate: z.number().min(0).max(1),
  taxAmount: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),
});

export const documentKindSchema = z.enum(["pdf", "png", "jpeg"]);

export const extractionResultSchema = z.object({
  recordId: z.string().min(1),
  createdAt: z.string().min(1),
  source: z.object({
    fileName: z.string().min(1),
    mimeType: z.string().min(1),
    sizeBytes: z.number().int().nonnegative(),
    kind: documentKindSchema,
    estimatedPages: z.number().int().positive(),
    contentHash: z.string().length(16),
  }),
  invoice: invoiceSchema,
  extraction: z.object({
    provider: z.literal("mock"),
    model: z.string().min(1),
    processingMs: z.number().nonnegative(),
    confidence: z.number().min(0).max(1),
    warnings: z.array(z.string()),
  }),
});

export type LineItem = z.infer<typeof lineItemSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type DocumentKind = z.infer<typeof documentKindSchema>;
export type ExtractionResult = z.infer<typeof extractionResultSchema>;
