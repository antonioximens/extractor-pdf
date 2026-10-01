"use client";

import "./globals.css";
import { ErrorFallback } from "@/components/errorFallback/ErrorFallback";

// Substitui o layout raiz quando o erro acontece nele, por isso define html/body.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="pt-br" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <title>Erro - Separador de PDF</title>
        <ErrorFallback error={error} onRetry={unstable_retry} />
      </body>
    </html>
  );
}
