import {
  CPF_REGEX,
  DEFAULT_CPF,
  DEFAULT_MATRICULA,
  MATRICULA_REGEX,
} from "../constants/constants";

// Define o tipo para o pdf agrupado por cpf.
export interface PageGroup {
  cpf: string;
  matricula: string;
  pages: number[];
}

// Função que agrupa as páginas do PDF por CPF usando o regex definido.
export function groupPagesByCpf(texts: string[]): PageGroup[] {
  const groups: PageGroup[] = [];
  let currentCpf = DEFAULT_CPF;
  let currentMatricula = DEFAULT_MATRICULA;

  // Procura em cada página, extrai o texto e procura pelo CPF usando regex.
  texts.forEach((pageText, index) => {
    const cpfMatch = pageText.match(CPF_REGEX);
    const matriculaMatch = pageText.match(MATRICULA_REGEX);

    if (cpfMatch) {
      currentCpf = cpfMatch[1].replace(/\D/g, "");
      // Armazena a matrícula encontrada ou da o valor padrão.
      currentMatricula = matriculaMatch ? matriculaMatch[1] : DEFAULT_MATRICULA;

      // Cria um grupo para o CPF encontrado, ou adiciona a página ao grupo existente.
      groups.push({
        cpf: currentCpf,
        matricula: currentMatricula,
        pages: [index],
      });
    } else {
      if (groups.length === 0) {
        groups.push({
          cpf: currentCpf,
          matricula: currentMatricula,
          pages: [index],
        });
      } else {
        groups[groups.length - 1].pages.push(index);
      }
    }
  });

  return groups;
}
