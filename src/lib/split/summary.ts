import { Employee } from "../pdf/groupPagesByEmployee";
import { ReportRow } from "../report/buildReportCsv";

export interface SummaryDocument {
  tipo: string;
  paginas: string;
  arquivoOrigem: string;
  observacao: string;
}

// Um item por pasta do zip (colaborador ou "não identificados").
export interface SummaryItem {
  folder: string;
  cpf: string;
  matricula: string;
  nome: string;
  documents: SummaryDocument[];
  pendencias: number;
}

export interface SplitSummary {
  totals: {
    arquivos: number;
    colaboradores: number;
    pdfs: number;
    pendencias: number;
  };
  items: SummaryItem[];
}

// Monta o resumo a partir das mesmas linhas do relatorio.csv.
export function buildSummary(
  rows: ReportRow[],
  employees: Map<string, Employee>,
  fileCount: number,
): SplitSummary {
  const byFolder = new Map<string, SummaryItem>();

  for (const row of rows) {
    const folder = row.arquivoGerado.split("/")[0];
    let item = byFolder.get(folder);
    if (!item) {
      const employee = employees.get(row.cpf);
      item = {
        folder,
        cpf: row.cpf,
        matricula: employee?.matricula ?? "",
        nome: employee?.nome ?? "",
        documents: [],
        pendencias: 0,
      };
      byFolder.set(folder, item);
    }
    item.documents.push({
      tipo: row.tipo,
      paginas: row.paginas,
      arquivoOrigem: row.arquivoOrigem,
      observacao: row.observacao,
    });
    if (row.observacao) item.pendencias++;
  }

  const items = [...byFolder.values()];
  return {
    totals: {
      arquivos: fileCount,
      colaboradores: employees.size,
      pdfs: rows.length,
      pendencias: items.reduce((sum, item) => sum + item.pendencias, 0),
    },
    // Pendências primeiro: é o que o RH precisa conferir.
    items: items.sort((a, b) => b.pendencias - a.pendencias),
  };
}
