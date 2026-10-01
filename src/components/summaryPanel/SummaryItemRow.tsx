import { memo } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { SummaryItem } from "@/lib/split/summary";
import { formatCpf } from "@/lib/cpf/formatCpf";

interface Props {
  item: SummaryItem;
}

// Uma linha por pasta do zip: colaborador ou páginas não identificadas.
export const SummaryItemRow = memo(function SummaryItemRow({ item }: Props) {
  const identified = item.cpf !== "";
  const Icon = !identified
    ? XCircle
    : item.pendencias
      ? AlertTriangle
      : CheckCircle2;
  const iconColor = !identified
    ? "text-red-500"
    : item.pendencias
      ? "text-amber-500"
      : "text-emerald-600";

  return (
    <li className="flex gap-3 px-4 py-3 bg-white">
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold text-slate-800 truncate">
          {identified
            ? item.nome || `CPF ${formatCpf(item.cpf)}`
            : "Páginas não identificadas"}
        </p>
        {identified && (item.nome || item.matricula) && (
          <p className="text-xs text-slate-500">
            {item.nome && `CPF ${formatCpf(item.cpf)}`}
            {item.nome && item.matricula && " · "}
            {item.matricula && `Mat. ${item.matricula}`}
          </p>
        )}
        <ul className="text-xs text-slate-600 space-y-0.5">
          {item.documents.map((doc, i) => (
            <li key={i}>
              {doc.tipo} <span className="text-slate-400">(pág. {doc.paginas} de {doc.arquivoOrigem})</span>
              {doc.observacao && (
                <span className="block text-amber-700">{doc.observacao}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
});
