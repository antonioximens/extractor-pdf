export interface ReportRow {
  arquivoOrigem: string;
  tipo: string;
  paginas: string;
  cpf: string;
  matricula: string;
  nome: string;
  arquivoGerado: string;
  observacao: string;
}

const COLUMNS: { key: keyof ReportRow; title: string }[] = [
  { key: "arquivoOrigem", title: "Arquivo de origem" },
  { key: "tipo", title: "Tipo" },
  { key: "paginas", title: "Páginas" },
  { key: "cpf", title: "CPF" },
  { key: "matricula", title: "Matrícula" },
  { key: "nome", title: "Nome" },
  { key: "arquivoGerado", title: "Arquivo gerado" },
  { key: "observacao", title: "Observação" },
];

const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

// Gera o csv com ";" e BOM para abrir corretamente no Excel em pt-BR.
export function buildReportCsv(rows: ReportRow[]): string {
  const lines = [
    COLUMNS.map((c) => escape(c.title)).join(";"),
    ...rows.map((row) => COLUMNS.map((c) => escape(row[c.key])).join(";")),
  ];
  return `﻿${lines.join("\r\n")}`;
}
