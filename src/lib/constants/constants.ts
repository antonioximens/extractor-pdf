// Captura cpf com ou sem formatação (todas as ocorrências da página).
export const CPF_REGEX = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g;

// Valores usados no nome da pasta quando o campo não é encontrado.
export const DEFAULT_MATRICULA = "MATRICULA_NAO_ENCONTRADA";
export const DEFAULT_NOME = "NOME_NAO_ENCONTRADO";

// Pasta que recebe as páginas sem CPF identificado.
export const UNIDENTIFIED_FOLDER = "NAO_IDENTIFICADOS";

// Nome do relatório gerado dentro do zip.
export const REPORT_FILE_NAME = "relatorio.csv";
