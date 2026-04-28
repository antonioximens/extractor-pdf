import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { PDFDocument } from "pdf-lib";

const CPF_REGEX = /\b(\d{3}\.?\d{3}\.?\d{3}-?\d{2})\b/;

export async function splitPdfByCpf(buffer: Buffer): Promise<Uint8Array> {
  const data = new Uint8Array(buffer);

  // Isso impede que o PDF.js procure arquivos .mjs externos
  const loadingTask = pdfjs.getDocument({
    data,
    useSystemFonts: true,
    disableFontFace: true,
    verbosity: 0,
  });

  const pdfReader = await loadingTask.promise;
  const numPages = pdfReader.numPages;

  const originalPdf = await PDFDocument.load(buffer);
  const groups: { cpf: string; pages: number[] }[] = [];

  let currentCpf = "desconhecido";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfReader.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");

    const match = pageText.match(CPF_REGEX);

    if (match) {
      currentCpf = match[1].replace(/\D/g, "");
      groups.push({ cpf: currentCpf, pages: [i - 1] });
    } else {
      if (groups.length === 0) {
        groups.push({ cpf: currentCpf, pages: [i - 1] });
      } else {
        groups[groups.length - 1].pages.push(i - 1);
      }
    }
  }

  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  for (const group of groups) {
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(originalPdf, group.pages);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    // Se houver múltiplos grupos com o mesmo CPF, o zip.file sobrescreve.
    // Adicionado um índice para evitar perda de dados se o CPF repetir em blocos separados.
    zip.file(`${group.cpf}_${Date.now()}.pdf`, pdfBytes);
  }

  return await zip.generateAsync({ type: "uint8array" });
}
