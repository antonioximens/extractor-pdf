import { PDFDocument } from "pdf-lib";
import { PageGroup } from "./groupPagesByCpf";

// Cria um novo pdf para cada grupo de cpf
export async function buildPdfGroup(
  originalPdf: PDFDocument,
  group: PageGroup,
): Promise<Uint8Array> {
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(originalPdf, group.pages);
  copiedPages.forEach((page) => newPdf.addPage(page));
  return newPdf.save();
}
