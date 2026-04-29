import { PDFDocument } from "pdf-lib";
import { extractPageTexts } from "../lib/pdf/extractPageTexts";
import { groupPagesByCpf } from "../lib/pdf/groupPagesByCpf";
import { buildZip } from "../lib/zip/buildZip";

// Centralizo as funções do extractor
export async function splitPdfByCpf(buffer: Buffer): Promise<Uint8Array> {
  // Extrai o texto e agrupa as paginas.
  const { texts } = await extractPageTexts(buffer);
  // Carrega o pdf original para criar os novos pdfs.
  const originalPdf = await PDFDocument.load(buffer);
  // Agrupa as paginas por cpf.
  const groups = groupPagesByCpf(texts);
  // zipa os pdfs em uma pasta.
  return buildZip(originalPdf, groups);
}
