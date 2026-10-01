import { useSyncExternalStore } from "react";

export interface HistoryEntry {
  fileName: string;
  processedAt: string; // ISO string
  status: "success" | "error";
}

const STORAGE_KEY = "pdf-splitter-history";
const MAX_ENTRIES = 20;
const EMPTY: HistoryEntry[] = [];

// Store do histórico sobre o localStorage: lê o storage uma única vez e mantém
// o resultado em cache, para que o snapshot só mude quando o histórico mudar.
let cache: HistoryEntry[] | undefined;
const listeners = new Set<() => void>();

function getSnapshot(): HistoryEntry[] {
  if (!cache) {
    const stored = localStorage.getItem(STORAGE_KEY);
    cache = stored ? JSON.parse(stored) : EMPTY;
  }
  return cache!;
}

const getServerSnapshot = () => EMPTY;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function write(next: HistoryEntry[]) {
  cache = next;
  if (next.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  else localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((listener) => listener());
}

// Adiciona várias entradas com uma única escrita no localStorage.
function addEntries(entries: HistoryEntry[]) {
  write([...entries, ...getSnapshot()].slice(0, MAX_ENTRIES));
}

function clearHistory() {
  write(EMPTY);
}

export function useHistory() {
  const history = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  // As funções são de módulo, portanto estáveis entre renders.
  return { history, addEntries, clearHistory };
}
