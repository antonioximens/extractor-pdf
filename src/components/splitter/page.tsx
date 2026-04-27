"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  FileUp,
  Download,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      a.style.display = "none";
      a.href = url;
      a.download = `processado_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container para centralização absoluta na tela
    <div
      className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 font-sans italic"
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      <Card
        className="w-full max-w-2xl shadow-2xl border-t-[6px] transition-all"
        style={{ borderTopColor: "#0F48B3" }}
      >
        <CardHeader className="space-y-1 pb-8">
          <CardTitle
            className="flex items-center justify-center gap-3 text-3xl font-bold tracking-tight"
            style={{ color: "#0F48B3" }}
          >
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: "#44A1D820" }}
            >
              <FileUp className="w-8 h-8" style={{ color: "#44A1D8" }} />
            </div>
            Separador de PDF por CPF
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-10 pb-12">
          <div className="grid w-full items-center gap-3">
            <label
              htmlFor="pdf-upload"
              className="text-lg font-semibold text-slate-700 ml-1"
            >
              Selecione o arquivo PDF
            </label>
            <Input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setError(null);
                setSuccess(false);
              }}
              disabled={loading}
              className="cursor-pointer file:font-semibold border-slate-200 h-14 text-lg focus-visible:ring-[#44A1D8] bg-slate-50"
            />
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="animate-in fade-in slide-in-from-top-2"
            >
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-bold">Erro</AlertTitle>
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <AlertTitle className="text-lg font-bold">Sucesso!</AlertTitle>
              <AlertDescription className="text-base">
                O download do ZIP foi iniciado.
              </AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full transition-all duration-300 hover:opacity-90 active:scale-[0.99] text-white font-bold h-12 text-xl rounded-xl"
            onClick={handleProcess}
            disabled={!file || loading}
            style={{
              backgroundColor: loading ? "#44A1D8" : "#0F48B3",
              boxShadow: "0 10px 15px -3px rgba(15, 72, 179, 0.3)",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Download className="mr-3 h-6 w-6" />
                Iniciar Separação
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
