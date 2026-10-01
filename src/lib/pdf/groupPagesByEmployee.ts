import { findValidCpf } from "../cpf/findValidCpf";
import {
  extractMatricula,
  extractNome,
  FieldPatterns,
} from "../profiles/profiles";

export interface Employee {
  cpf: string;
  matricula?: string;
  nome?: string;
}

// employee undefined = páginas anteriores ao primeiro cpf encontrado.
export interface PageGroup {
  employee?: Employee;
  pages: number[];
}

// Agrupa as páginas por cpf. Páginas sem cpf continuam no grupo do último cpf
// encontrado, e um mesmo cpf em trechos diferentes do pdf cai no mesmo grupo.
export function groupPagesByEmployee(
  texts: string[],
  fields: FieldPatterns,
): PageGroup[] {
  const byCpf = new Map<string, PageGroup>();
  const unidentified: PageGroup = { pages: [] };
  let current = unidentified;

  texts.forEach((pageText, index) => {
    const cpf = findValidCpf(pageText);

    if (cpf) {
      current = byCpf.get(cpf) ?? { employee: { cpf }, pages: [] };
      byCpf.set(cpf, current);
    }

    current.pages.push(index);

    // Completa nome/matrícula com a primeira ocorrência encontrada no grupo.
    const employee = current.employee;
    if (employee) {
      employee.matricula ??= extractMatricula(pageText, fields.matricula);
      employee.nome ??= extractNome(pageText, fields.nome);
    }
  });

  const groups = [...byCpf.values()];
  return unidentified.pages.length ? [unidentified, ...groups] : groups;
}
