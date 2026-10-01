"use client";

import { useCallback, useMemo, useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp } from "lucide-react";
import { AppCard } from "@/components/appCard/AppCard";
import { FileUploadInput } from "@/components/fileUploadInput/FileUploadInput";
import { ProcessButton } from "@/components/processButton/ProcessButton";
import { StatusAlert } from "@/components/statusAlert/StatusAlert";
import { SummaryPanel } from "@/components/summaryPanel/SummaryPanel";
import { HistoryList } from "@/components/historyList/HistoryList";
import { useHistory } from "@/hooks/useHistory/useHistory";
import { useSplitPdf } from "@/hooks/useSplitPdf/useSplitPdf";
import { validateUpload } from "@/lib/upload/uploadLimits";

// Cabeçalho estático criado uma única vez: o React reaproveita o mesmo elemento.
const HEADER = (
  <CardHeader className="pb-8">
    <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-brand-primary">
      <div className="p-3 rounded-xl bg-brand-bg">
        <FileUp className="w-8 h-8 text-brand-light" />
      </div>
      Separador de PDF por Colaborador
    </CardTitle>
  </CardHeader>
);

export function PdfSplitter() {
  const [files, setFiles] = useState<File[]>([]);
  const { status, split, reset } = useSplitPdf();
  const { history, addEntries, clearHistory } = useHistory();
  const loading = status.state === "loading";

  // Erro de limite derivado da seleção: bloqueia o envio antes do upload.
  const uploadError = useMemo(
    () => (files.length ? validateUpload(files) : null),
    [files],
  );
  const errorMessage =
    uploadError?.message ?? (status.state === "error" ? status.message : null);

  const handleFilesChange = useCallback(
    (selected: File[]) => {
      setFiles(selected);
      reset();
    },
    [reset],
  );

  const handleProcess = useCallback(async () => {
    const ok = await split(files);
    const processedAt = new Date().toISOString();
    addEntries(
      files.map((file) => ({
        fileName: file.name,
        processedAt,
        status: ok ? "success" : "error",
      })),
    );
    // O formulário sai de tela no sucesso; ao voltar, o input já começa vazio.
    if (ok) setFiles([]);
  }, [files, split, addEntries]);

  return (
    <AppCard>
      {HEADER}
      <CardContent className="space-y-6 px-6 sm:px-10 pb-12">
        {status.state === "success" ? (
          <SummaryPanel result={status.result} onReset={reset} />
        ) : (
          <>
            <FileUploadInput
              files={files}
              disabled={loading}
              onChange={handleFilesChange}
            />
            <StatusAlert message={errorMessage} />
            <ProcessButton
              loading={loading}
              disabled={files.length === 0 || !!uploadError || loading}
              onClick={handleProcess}
            />
          </>
        )}
        <HistoryList history={history} onClear={clearHistory} />
      </CardContent>
    </AppCard>
  );
}
