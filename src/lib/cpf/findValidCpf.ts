import { CPF_REGEX } from "../constants/constants";

// Calcula um dígito verificador do cpf a partir dos dígitos anteriores.
function checkDigit(digits: string, length: number): number {
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += Number(digits[i]) * (length + 1 - i);
  }
  const rest = (sum * 10) % 11;
  return rest === 10 ? 0 : rest;
}

export function isValidCpf(digits: string): boolean {
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  return (
    checkDigit(digits, 9) === Number(digits[9]) &&
    checkDigit(digits, 10) === Number(digits[10])
  );
}

// Retorna o primeiro cpf válido do texto (somente dígitos), ignorando
// sequências de 11 dígitos que não são cpf (telefone, códigos etc.).
export function findValidCpf(text: string): string | undefined {
  for (const [match] of text.matchAll(CPF_REGEX)) {
    const digits = match.replace(/\D/g, "");
    if (isValidCpf(digits)) return digits;
  }
  return undefined;
}
