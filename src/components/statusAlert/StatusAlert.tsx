import { memo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Props {
  message: string | null;
}

export const StatusAlert = memo(function StatusAlert({ message }: Props) {
  if (!message) return null;

  return (
    <Alert
      variant="destructive"
      className="animate-in fade-in slide-in-from-top-2"
    >
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="text-lg font-bold">Erro</AlertTitle>
      <AlertDescription className="text-base">{message}</AlertDescription>
    </Alert>
  );
});
