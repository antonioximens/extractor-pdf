import { extractText, getDocumentProxy } from "unpdf";
import { PDFDocument } from "pdf-lib";

// Captura cpf com ou sem formatação.
const CPF_REGEX = /\b(\d{3}\.?\d{3}\.?\d{3}-?\d{2})\b/;

// Criando a função que processa o PDF, separa por CPF e gera um ZIP
export async function splitPdfByCpf(buffer: Buffer): Promise<Uint8Array> {
  // Carrega o PDF usando a biblioteca unpdf para extração do texto.
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const numPages = pdf.numPages;
  // Copia o PDF original para criar novos PDFs separados por CPF.
  const originalPdf = await PDFDocument.load(buffer);

  // Armazena as paginas agrupadas por CPF.
  const groups: { cpf: string; pages: number[] }[] = [];
  let currentCpf = "Vazio";

  // Extrai o texto de cada página para identificar o CPF e agrupar as páginas.
  const { text } = await extractText(pdf, { mergePages: false });

  // Itera sobre cada página, extrai o texto e procura pelo CPF usando regex.
  for (let i = 1; i <= numPages; i++) {
    const pageText = Array.isArray(text) ? text[i - 1] : text;
    const match = pageText.match(CPF_REGEX);
    // Caso encontre o cpf diferente do atual cria um novo grupo.
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

  // Cria um arquivo zip
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  // Cria um novo pdf para cada grupo.
  for (const group of groups) {
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(originalPdf, group.pages);
    copiedPages.forEach((page) => newPdf.addPage(page));
    const pdfBytes = await newPdf.save();
    zip.file(`${group.cpf}.pdf`, pdfBytes);
  }

  return await zip.generateAsync({ type: "uint8array" });
}
