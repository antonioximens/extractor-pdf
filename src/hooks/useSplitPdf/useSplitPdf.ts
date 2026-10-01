import { useCallback, useState } from "react";
import {
  decodeSplitResponse,
  SplitResult,
} from "@/lib/split/splitResponse";

export type SplitStatus =
  | { state: "idle" | "loading" }
  | { state: "success"; result: SplitResult }
  | { state: "error"; message: string };

const IDLE: SplitStatus = { state: "idle" };
const LOADING: SplitStatus = { state: "loading" };
const TIMEOUT_MS = 2 * 60 * 1000;

// Converte falhas de rede/timeout em mensagens que o usuário entende.
function toErrorMessage(err: unknown): string {
  if (err instanceof DOMException && err.name === "AbortError") {
    return "O processamento demorou demais. Tente enviar menos arquivos por vez.";
  }
  if (err instanceof TypeError) {
    return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
  }
  return err instanceof Error ? err.message : "Ocorreu um erro inesperado.";
}

async function requestSplit(files: File[]): Promise<SplitResult> {
  const formData = new FormData();
  files.forEach((file) => formData.append("file", file));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch("/api/split", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.details ||
          errorData?.error ||
          "Falha ao processar os arquivos.",
      );
    }

    return await decodeSplitResponse(response);
  } finally {
    clearTimeout(timeout);
  }
}

// Envia os pdfs para separação e guarda o resumo e o zip resultantes.
export function useSplitPdf() {
  const [status, setStatus] = useState<SplitStatus>(IDLE);

  const split = useCallback(async (files: File[]): Promise<boolean> => {
    setStatus(LOADING);
    try {
      setStatus({ state: "success", result: await requestSplit(files) });
      return true;
    } catch (err) {
      setStatus({ state: "error", message: toErrorMessage(err) });
      return false;
    }
  }, []);

  // Só troca o estado (e re-renderiza) se havia algo a limpar.
  const reset = useCallback(
    () => setStatus((prev) => (prev.state === "idle" ? prev : IDLE)),
    [],
  );

  return { status, split, reset };
}
