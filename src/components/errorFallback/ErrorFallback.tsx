"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { AppCard } from "@/components/appCard/AppCard";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

interface Props {
  error: Error & { digest?: string };
  onRetry: () => void;
}

// Tela exibida quando a interface quebra de forma inesperada.
export function ErrorFallback({ error, onRetry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppCard>
      <CardContent className="flex flex-col items-center gap-5 px-6 sm:px-10 py-12 text-center">
        <div className="p-3 rounded-xl bg-red-50">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Algo deu errado</h1>
        <p className="text-slate-600">
          A tela encontrou um erro inesperado. Seus arquivos não foram
          alterados; tente novamente.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400">Código do erro: {error.digest}</p>
        )}
        <Button variant="brand" size="xl" onClick={onRetry}>
          <RotateCcw className="mr-3 h-5 w-5" />
          Tentar novamente
        </Button>
      </CardContent>
    </AppCard>
  );
}
