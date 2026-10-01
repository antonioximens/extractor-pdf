// Padrões usados para extrair os dados do colaborador de uma página.
// Precisam da flag "g", pois são percorridos com matchAll.
export interface FieldPatterns {
  nome: RegExp;
  matricula: RegExp;
}

// Um perfil identifica um tipo de documento e, se preciso, sobrescreve os padrões.
export interface DocumentProfile {
  id: string;
  detect: RegExp;
  fields?: Partial<FieldPatterns>;
}

const LETTER = "A-Za-zÀ-ÖØ-öø-ÿ";

// Rótulos que antecedem o nome. "Nome da Empresa", "Nome da Mãe" etc. são ignorados.
const NOME_LABEL =
  "(?:Nome(?!\\s+d[aoe]\\s+(?:Empresa|M[ãa]e|Pai|Banco|Fantasia))(?:\\s+do\\s+(?:Funcion[áa]rio|Colaborador|Empregado|Servidor))?|Funcion[áa]rio|Colaborador|Empregado|Servidor)";

// Onde o nome termina: fim da linha, coluna (2+ espaços), número ou outro rótulo.
const NOME_END =
  "(?=[ \\t]{2,}|[ \\t]*(?:\\n|$)|\\d|[ \\t]*(?:CPF|Matr[íi]cula|Mat\\.|Cargo|Fun[çc][ãa]o|Admiss[ãa]o|Setor|Depto|Departamento|CBO|PIS|Data|C[óo]d|Empresa|CNPJ|Registro|Chapa)\\b)";

export const DEFAULT_FIELDS: FieldPatterns = {
  nome: new RegExp(
    `${NOME_LABEL}[ \\t]*:?[ \\t]*([${LETTER}'][${LETTER}' \\t-]+?)${NOME_END}`,
    "gi",
  ),
  matricula:
    /(?:Matr[íi]cula|Matr?\.|Registro|Chapa|C[óo]d(?:igo)?\.?\s*(?:do\s+)?(?:Func(?:ion[áa]rio)?|Colab(?:orador)?|Empregado))\s*:?\s*(\d{1,10})\b/gi,
};

// A ordem importa: o primeiro perfil cujo "detect" casar com a primeira página vence.
export const PROFILES: DocumentProfile[] = [
  { id: "ferias", detect: /aviso de f[ée]rias|recibo de f[ée]rias/i },
  {
    id: "informe-rendimentos",
    detect: /informe de rendimentos|comprovante de rendimentos/i,
  },
  {
    id: "espelho-ponto",
    detect: /espelho de ponto|cart[ãa]o de ponto|folha de ponto/i,
  },
  {
    id: "holerite",
    detect:
      /holerite|contracheque|recibo de pagamento|demonstrativo de pagamento|folha de pagamento/i,
  },
  { id: "demonstrativo", detect: /demonstrativo/i },
];

export interface ResolvedProfile {
  // Tipo do documento, ou undefined quando nenhum perfil reconhece o pdf.
  docType?: string;
  fields: FieldPatterns;
}

export function detectProfile(firstPageText: string): ResolvedProfile {
  const profile = PROFILES.find((p) => p.detect.test(firstPageText));
  return {
    docType: profile?.id,
    fields: { ...DEFAULT_FIELDS, ...profile?.fields },
  };
}

// Palavras que indicam que o texto capturado não é nome de pessoa.
const NOT_A_NAME = /\b(?:LTDA|EIRELI|EMPRESA|S\/A|FUNCION[ÁA]RIO|COLABORADOR)\b/i;

export function extractNome(text: string, pattern: RegExp): string | undefined {
  for (const [, raw] of text.matchAll(pattern)) {
    const nome = raw.replace(/\s+/g, " ").trim();
    // Exige ao menos nome e sobrenome para evitar capturar cabeçalhos soltos.
    if (nome.split(" ").length >= 2 && !NOT_A_NAME.test(nome)) return nome;
  }
  return undefined;
}

export function extractMatricula(
  text: string,
  pattern: RegExp,
): string | undefined {
  return text.matchAll(pattern).next().value?.[1];
}
