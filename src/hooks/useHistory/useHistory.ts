import { useState, useEffect } from "react";
import { HistoryEntry } from "@/components/historyList/HistoryList";

const STORAGE_KEY = "pdf-splitter-history";

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Carrega do localStorage na primeira renderização
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  function addEntry(entry: HistoryEntry) {
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 20); // máximo 20 itens
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }

  return { history, addEntry, clearHistory };
}
