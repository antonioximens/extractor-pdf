import { SplitSummary } from "./summary";

// Formato da resposta da api: [resumo em json][zip], numa única requisição.
// O cabeçalho informa onde o json termina, assim o zip não é copiado nem
// convertido para base64 em nenhum dos lados.
const SUMMARY_LENGTH_HEADER = "X-Summary-Length";

export interface SplitResult {
  summary: SplitSummary;
  zip: Blob;
}

// Servidor: envia o resumo seguido do zip.
export function encodeSplitResponse(
  summary: SplitSummary,
  zip: ArrayBuffer,
): Response {
  const summaryBytes = new TextEncoder().encode(JSON.stringify(summary));
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(summaryBytes);
      controller.enqueue(new Uint8Array(zip));
      controller.close();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(summaryBytes.byteLength + zip.byteLength),
      [SUMMARY_LENGTH_HEADER]: String(summaryBytes.byteLength),
    },
  });
}

// Navegador: separa o resumo e o zip (Blob.slice não copia os dados).
export async function decodeSplitResponse(
  response: Response,
): Promise<SplitResult> {
  const summaryLength = Number(response.headers.get(SUMMARY_LENGTH_HEADER));
  const blob = await response.blob();
  return {
    summary: JSON.parse(await blob.slice(0, summaryLength).text()),
    zip: blob.slice(summaryLength, blob.size, "application/zip"),
  };
}
