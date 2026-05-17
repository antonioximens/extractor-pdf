// Captura cpf com ou sem formatação.
export const CPF_REGEX = /\b(\d{3}\.?\d{3}\.?\d{3}-?\d{2})\b/;
// Valor para CFf não encontrado.
export const DEFAULT_CPF = "CPF NAO ENCONTRADO";

// Captura o a matricula do colaborador.
export const MATRICULA_REGEX = /[Mm]atr[íi]cula[:\s]+(\d{3,8})/;

// Valor para matricula não encontrada.
export const DEFAULT_MATRICULA = "MATRICULA NAO ENCONTRADA";
