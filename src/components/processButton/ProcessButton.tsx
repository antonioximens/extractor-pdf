import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

interface Props {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function ProcessButton({ loading, disabled, onClick }: Props) {
  return (
    <Button
      className="w-full text-white font-bold h-12 text-xl rounded-xl
                 transition-all duration-300 hover:opacity-90 active:scale-[0.99]
                 bg-brand-primary disabled:bg-brand-light
                 shadow-[0_10px_15px_-3px_rgba(15,72,179,0.3)]"
      onClick={onClick}
      disabled={disabled}
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
  );
}
