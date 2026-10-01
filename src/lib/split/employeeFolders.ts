import { DEFAULT_MATRICULA, DEFAULT_NOME } from "../constants/constants";
import { Employee, PageGroup } from "../pdf/groupPagesByEmployee";
import { toPathSegment } from "../text/toPathSegment";

// Une os dados do mesmo cpf vindos de vários pdfs, mantendo o primeiro
// nome/matrícula encontrado.
export function consolidateEmployees(
  groupsPerDocument: PageGroup[][],
): Map<string, Employee> {
  const employees = new Map<string, Employee>();

  for (const groups of groupsPerDocument) {
    for (const { employee } of groups) {
      if (!employee) continue;
      const known = employees.get(employee.cpf);
      if (!known) {
        employees.set(employee.cpf, { ...employee });
        continue;
      }
      known.matricula ??= employee.matricula;
      known.nome ??= employee.nome;
    }
  }

  return employees;
}

export function employeeFolderName({ cpf, matricula, nome }: Employee): string {
  const nomeSegment = nome ? toPathSegment(nome).toUpperCase() : DEFAULT_NOME;
  return `${cpf}_${matricula ?? DEFAULT_MATRICULA}_${nomeSegment}`;
}

// Compara nomes ignorando acentos, caixa e pontuação.
function sameName(a: string, b = ""): boolean {
  return toPathSegment(a).toUpperCase() === toPathSegment(b).toUpperCase();
}

// Descreve o que está faltando ou diverge entre o documento e a pasta final.
export function describeIssues(found: Employee, folder: Employee): string[] {
  const issues: string[] = [];

  if (!found.nome) issues.push("Nome não encontrado no documento");
  else if (!sameName(found.nome, folder.nome)) {
    issues.push(`Nome divergente: "${found.nome}"`);
  }

  if (!found.matricula) issues.push("Matrícula não encontrada no documento");
  else if (found.matricula !== folder.matricula) {
    issues.push(`Matrícula divergente: ${found.matricula}`);
  }

  return issues;
}
