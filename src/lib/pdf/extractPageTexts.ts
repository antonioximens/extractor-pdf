import { extractText, getDocumentProxy } from "unpdf";

// Extrai o texto de cada página do pdf.
export async function extractPageTexts(bytes: Uint8Array): Promise<string[]> {
  // O pdf.js pode transferir (e esvaziar) o buffer recebido, por isso passamos
  // uma cópia: os bytes originais ainda serão usados pelo pdf-lib.
  const pdf = await getDocumentProxy(bytes.slice());
  try {
    const { text } = await extractText(pdf, { mergePages: false });
    return Array.isArray(text) ? text : [text];
  } finally {
    // Libera a memória do documento assim que o texto foi extraído.
    await pdf.destroy();
  }
}
