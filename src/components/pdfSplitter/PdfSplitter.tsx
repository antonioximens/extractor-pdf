"use client";

import { useCallback, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp } from "lucide-react";
import { FileUploadInput } from "@/components/fileUploadInput/FileUploadInput";
import { ProcessButton } from "@/components/processButton/ProcessButton";
import { StatusAlert } from "@/components/statusAlert/StatusAlert";
import { HistoryList } from "@/components/historyList/HistoryList";
import { useHistory } from "@/hooks/useHistory/useHistory";
import { useSplitPdf } from "@/hooks/useSplitPdf/useSplitPdf";

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
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const { status, split, reset } = useSplitPdf();
  const { history, addEntries, clearHistory } = useHistory();
  const loading = status.state === "loading";

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
    if (ok) {
      setFiles([]);
      fileInputRef.current.value = "";
    }
  }, [files, split, addEntries]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-2xl shadow-2xl border-t-[6px] border-t-brand-primary bg-white transition-all">
        {HEADER}
        <CardContent className="space-y-6 px-10 pb-12">
          <FileUploadInput
            fileInputRef={fileInputRef}
            disabled={loading}
            onChange={handleFilesChange}
          />
          <StatusAlert status={status} />
          <ProcessButton
            loading={loading}
            disabled={files.length === 0 || loading}
            onClick={handleProcess}
          />
          <HistoryList history={history} onClear={clearHistory} />
        </CardContent>
      </Card>
    </div>
  );
}
