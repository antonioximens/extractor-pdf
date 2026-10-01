import { useCallback, useState } from "react";

export type SplitStatus =
  | { state: "idle" | "loading" | "success" }
  | { state: "error"; message: string };

const IDLE: SplitStatus = { state: "idle" };

// Dispara o download de um blob sem manter referências na página.
function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

async function requestSplit(files: File[]): Promise<Blob> {
  const formData = new FormData();
  files.forEach((file) => formData.append("file", file));

  const response = await fetch("/api/split", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.details || errorData?.error || "Falha ao processar os arquivos.",
    );
  }

  return response.blob();
}

// Envia os pdfs para separação e baixa o zip resultante.
export function useSplitPdf() {
  const [status, setStatus] = useState<SplitStatus>(IDLE);

  const split = useCallback(async (files: File[]): Promise<boolean> => {
    setStatus({ state: "loading" });
    try {
      downloadBlob(await requestSplit(files), `processado_${Date.now()}.zip`);
      setStatus({ state: "success" });
      return true;
    } catch (err) {
      setStatus({
        state: "error",
        message:
          err instanceof Error ? err.message : "Ocorreu um erro inesperado.",
      });
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
