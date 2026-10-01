// Converte um texto livre em um trecho seguro para nome de pasta/arquivo:
// sem acentos, sem espaços e sem caracteres especiais ("João da Silva" -> "JOAO_DA_SILVA").
export function toPathSegment(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
