import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

// Moldura padrão das telas: card centralizado com a borda da marca.
export function AppCard({ children }: Props) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-2xl shadow-2xl border-t-[6px] border-t-brand-primary bg-white transition-all">
        {children}
      </Card>
    </div>
  );
}
