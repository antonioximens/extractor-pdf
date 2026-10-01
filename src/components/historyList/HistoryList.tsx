import { memo } from "react";
import { FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryEntry } from "@/hooks/useHistory/useHistory";

interface Props {
  history: HistoryEntry[];
  onClear: () => void;
}

export const HistoryList = memo(function HistoryList({
  history,
  onClear,
}: Props) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
        <Clock className="w-4 h-4" /> Histórico
      </h3>
      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
        {history.map((entry, i) => (
          <li
            key={`${entry.processedAt}-${entry.fileName}-${i}`}
            className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition-colors gap-3"
          >
            <div className="flex items-center gap-3">
              <FileText
                className={`w-5 h-5 ${entry.status === "success" ? "text-brand-primary" : "text-red-400"}`}
              />
              <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                {entry.fileName}
              </span>
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {new Date(entry.processedAt).toLocaleString("pt-BR")}
            </span>
          </li>
        ))}
      </ul>
      <Button
        variant="outline"
        className="bg-brand-button-delete text-white hover:bg-brand-button-delete/90"
        size="sm"
        onClick={onClear}
      >
        Limpar Histórico
      </Button>
    </div>
  );
});
