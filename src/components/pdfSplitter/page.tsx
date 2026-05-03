"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp } from "lucide-react";
import { FileUploadInput } from "@/components/fileUploadInput/FileUploadInput";
import { ProcessButton } from "@/components/processButton/ProcessButton";
import { StatusAlert } from "@/components/statusAlert/StatusAlert";
import { HistoryList } from "@/components/historyList/HistoryList";
import { useHistory } from "@/hooks/useHistory/useHistory";

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const { history, addEntry } = useHistory();

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/split", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Falha ao processar o arquivo.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `processado_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      addEntry({
        fileName: file.name,
        processedAt: new Date().toISOString(),
        status: "success",
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
      addEntry({
        fileName: file.name,
        processedAt: new Date().toISOString(),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-2xl shadow-2xl border-t-[6px] border-t-brand-primary bg-white transition-all">
        <CardHeader className="pb-8">
          <CardTitle
            className="flex items-center justify-center gap-3 text-3xl font-bold text-brand-primary"
            style={{ color: "#0F48B3" }}
          >
            <div className="p-3 rounded-xl bg-brand-bg">
              <FileUp className="w-8 h-8 text-brand-light" />
            </div>
            Separador de PDF por CPF
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-10 pb-12">
          <FileUploadInput
            fileInputRef={fileInputRef}
            disabled={loading}
            onChange={(f) => {
              setFile(f);
              setError(null);
              setSuccess(false);
            }}
          />
          <StatusAlert error={error} success={success} />
          <ProcessButton
            loading={loading}
            disabled={!file || loading}
            onClick={handleProcess}
          />
          <HistoryList history={history} />
        </CardContent>
      </Card>
    </div>
  );
}
