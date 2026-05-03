import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  error: string | null;
  success: boolean;
}

export function StatusAlert({ error, success }: Props) {
  if (error) {
    return (
      <Alert
        variant="destructive"
        className="animate-in fade-in slide-in-from-top-2"
      >
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-bold">Erro</AlertTitle>
        <AlertDescription className="text-base">{error}</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 animate-in fade-in slide-in-from-top-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        <AlertTitle className="text-lg font-bold">Sucesso!</AlertTitle>
        <AlertDescription className="text-base">
          O download do ZIP foi iniciado.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
