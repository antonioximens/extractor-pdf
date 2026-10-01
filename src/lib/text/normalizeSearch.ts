// Normaliza texto para busca: sem acentos, maiúsculo e só letras/números
// ("João da Silva" -> "JOAODASILVA", "529.982.247-25" -> "52998224725").
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();
}
