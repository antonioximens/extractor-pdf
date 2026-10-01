"use client";

import { ErrorFallback } from "@/components/errorFallback/ErrorFallback";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return <ErrorFallback error={error} onRetry={unstable_retry} />;
}
