import { memo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { SplitStatus } from "@/hooks/useSplitPdf/useSplitPdf";

interface Props {
  status: SplitStatus;
}

export const StatusAlert = memo(function StatusAlert({ status }: Props) {
  if (status.state === "error") {
    return (
      <Alert
        variant="destructive"
        className="animate-in fade-in slide-in-from-top-2"
      >
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-bold">Erro</AlertTitle>
        <AlertDescription className="text-base">
          {status.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (status.state === "success") {
    return (
      <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 animate-in fade-in slide-in-from-top-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        <AlertTitle className="text-lg font-bold">Sucesso!</AlertTitle>
        <AlertDescription className="text-base">
          O download do ZIP foi iniciado. Confira o relatorio.csv para as
          páginas não identificadas.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
});
