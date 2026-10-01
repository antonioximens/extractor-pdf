// Converte índices de página (base 0) em faixas legíveis: [0,1,2,6] -> "1-3, 7".
export function formatPageRanges(pages: number[], separator = ", "): string {
  const ranges: string[] = [];
  let start = pages[0];

  for (let i = 1; i <= pages.length; i++) {
    if (pages[i] !== pages[i - 1] + 1) {
      const end = pages[i - 1];
      ranges.push(start === end ? `${start + 1}` : `${start + 1}-${end + 1}`);
      start = pages[i];
    }
  }

  return ranges.join(separator);
}
