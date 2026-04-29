import { extractText, getDocumentProxy } from "unpdf";
// Extrai o texto de cada página e retorna texto e o pdf.
export async function extractPageTexts(buffer: Buffer): Promise<{
  pdf: Awaited<ReturnType<typeof getDocumentProxy>>;
  texts: string[];
}> {
  // Carrega o PDF usando a biblioteca unpdf para extração do texto.
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  // Extrai o texto de cada página para identificar o CPF e agrupar as páginas.
  const { text } = await extractText(pdf, { mergePages: false });
  const texts = Array.isArray(text) ? text : [text];
  return { pdf, texts };
}
