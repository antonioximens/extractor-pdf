import { memo, useCallback, useDeferredValue, useMemo, useState } from "react";
import { Download, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SplitResult } from "@/lib/split/splitResponse";
import { downloadBlob } from "@/lib/download/downloadBlob";
import { normalizeSearch } from "@/lib/text/normalizeSearch";
import { SummaryItemRow } from "./SummaryItemRow";

// Quantidade máxima de linhas na tela: mantém a lista leve em aparelhos modestos.
const VISIBLE_LIMIT = 50;
const ZIP_FILE_NAME = "documentos_separados.zip";

interface Props {
  result: SplitResult;
  onReset: () => void;
}

export const SummaryPanel = memo(function SummaryPanel({
  result,
  onReset,
}: Props) {
  const { summary, zip } = result;
  const { totals, items } = summary;

  // A busca é estado local: digitar não re-renderiza o restante da tela.
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // Texto de busca de cada item calculado uma única vez por resultado.
  const searchIndex = useMemo(
    () =>
      items.map((item) =>
        normalizeSearch(`${item.nome}|${item.cpf}|${item.matricula}`),
      ),
    [items],
  );

  const filtered = useMemo(() => {
    const term = normalizeSearch(deferredQuery);
    return term
      ? items.filter((_, i) => searchIndex[i].includes(term))
      : items;
  }, [items, searchIndex, deferredQuery]);

  const handleDownload = useCallback(
    () => downloadBlob(zip, ZIP_FILE_NAME),
    [zip],
  );

  const tiles = [
    { label: "Arquivos", value: totals.arquivos },
    { label: "Colaboradores", value: totals.colaboradores },
    { label: "PDFs gerados", value: totals.pdfs },
    { label: "Pendências", value: totals.pendencias, alert: totals.pendencias > 0 },
  ];

  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tiles.map(({ label, value, alert }) => (
          <div
            key={label}
            className={`rounded-xl border p-3 text-center ${alert ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}
          >
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </dt>
            <dd
              className={`text-2xl font-bold ${alert ? "text-amber-700" : "text-brand-primary"}`}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="brand" size="xl" onClick={handleDownload}>
          <Download className="mr-3 h-6 w-6" />
          Baixar ZIP
        </Button>
        <Button variant="outline" size="xl" onClick={onReset}>
          <RotateCcw className="mr-2 h-5 w-5" />
          Nova separação
        </Button>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, CPF ou matrícula"
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div>

        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
          {filtered.slice(0, VISIBLE_LIMIT).map((item) => (
            <SummaryItemRow key={item.folder} item={item} />
          ))}
        </ul>

        <p className="text-xs text-slate-500 ml-1">
          {filtered.length === 0
            ? "Nenhum colaborador encontrado."
            : filtered.length > VISIBLE_LIMIT
              ? `Mostrando ${VISIBLE_LIMIT} de ${filtered.length}. Use a busca para encontrar os demais.`
              : `${filtered.length} item(ns). Detalhes completos no relatorio.csv do ZIP.`}
        </p>
      </div>
    </div>
  );
});
