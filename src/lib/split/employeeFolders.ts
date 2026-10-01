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

// Nome e matrícula são opcionais: a pasta usa só o que foi encontrado
// ("cpf_matricula_NOME", "cpf_NOME", "cpf_matricula" ou só "cpf").
export function employeeFolderName({ cpf, matricula, nome }: Employee): string {
  return [cpf, matricula, nome && toPathSegment(nome).toUpperCase()]
    .filter(Boolean)
    .join("_");
}

// Compara nomes ignorando acentos, caixa e pontuação.
function sameName(a: string, b = ""): boolean {
  return toPathSegment(a).toUpperCase() === toPathSegment(b).toUpperCase();
}

// Aponta divergências entre o documento e a pasta final. Campo ausente no
// documento não é pendência: nem todo documento traz nome ou matrícula.
export function describeIssues(found: Employee, folder: Employee): string[] {
  const issues: string[] = [];

  if (found.nome && !sameName(found.nome, folder.nome)) {
    issues.push(`Nome divergente: "${found.nome}"`);
  }

  if (found.matricula && found.matricula !== folder.matricula) {
    issues.push(`Matrícula divergente: ${found.matricula}`);
  }

  return issues;
}
