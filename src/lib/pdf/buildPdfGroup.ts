import { PDFDocument } from "pdf-lib";

// Cria um novo pdf apenas com as páginas informadas.
export async function buildPdfGroup(
  originalPdf: PDFDocument,
  pages: number[],
): Promise<Uint8Array> {
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(originalPdf, pages);
  copiedPages.forEach((page) => newPdf.addPage(page));
  return newPdf.save();
}
