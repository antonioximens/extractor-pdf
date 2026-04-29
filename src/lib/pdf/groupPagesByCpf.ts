import { CPF_REGEX, DEFAULT_CPF } from "../constants/constants";

// Define o tipo para o pdf agrupado por cpf.
export interface PageGroup {
  cpf: string;
  pages: number[];
}

// Função que agrupa as páginas do PDF por CPF usando o regex definido.
export function groupPagesByCpf(texts: string[]): PageGroup[] {
  const groups: PageGroup[] = [];
  let currentCpf = DEFAULT_CPF;

  // Procura em cada página, extrai o texto e procura pelo CPF usando regex.
  texts.forEach((pageText, index) => {
    const match = pageText.match(CPF_REGEX);

    if (match) {
      currentCpf = match[1].replace(/\D/g, "");
      groups.push({ cpf: currentCpf, pages: [index] });
    } else {
      if (groups.length === 0) {
        groups.push({ cpf: currentCpf, pages: [index] });
      } else {
        groups[groups.length - 1].pages.push(index);
      }
    }
  });

  return groups;
}
