import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

interface Props {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const ProcessButton = memo(function ProcessButton({
  loading,
  disabled,
  onClick,
}: Props) {
  return (
    <Button
      variant="brand"
      size="xl"
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
});
