import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Document Processing — Invoice Extraction",
  description: "Upload a PDF/PNG/JPEG invoice and view the extracted structured JSON data.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
