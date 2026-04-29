import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { PageGroup } from "../pdf/groupPagesByCpf";
import { buildPdfGroup } from "../pdf/buildPdfGroup";

// Cria um arquivo zip com os pdfs
export async function buildZip(
  originalPdf: PDFDocument,
  groups: PageGroup[],
): Promise<Uint8Array> {
  const zip = new JSZip();

  // Cria um novo pdf para cada grupo
  for (const group of groups) {
    const pdfBytes = await buildPdfGroup(originalPdf, group);
    zip.file(`${group.cpf}.pdf`, pdfBytes);
  }

  return zip.generateAsync({ type: "uint8array" });
}
