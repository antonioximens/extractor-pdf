// Limites de envio compartilhados entre a tela e a api.
export const MAX_FILES = 20;
export const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50 MB somados

export interface UploadError {
  status: 400 | 413;
  message: string;
}

const sizeFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1
    ? `${sizeFormat.format(mb)} MB`
    : `${sizeFormat.format(bytes / 1024)} KB`;
}

export const LIMITS_DESCRIPTION = `Até ${MAX_FILES} arquivos, ${formatBytes(MAX_TOTAL_BYTES)} no total`;

export function totalSize(files: Pick<File, "size">[]): number {
  return files.reduce((sum, file) => sum + file.size, 0);
}

const isPdf = ({ name, type }: Pick<File, "name" | "type">) =>
  type === "application/pdf" || /\.pdf$/i.test(name);

// Retorna o primeiro problema encontrado no envio, ou null se estiver válido.
export function validateUpload(
  files: Pick<File, "name" | "type" | "size">[],
): UploadError | null {
  if (files.length === 0) {
    return { status: 400, message: "Nenhum arquivo PDF encontrado no envio." };
  }

  const notPdf = files.find((file) => !isPdf(file));
  if (notPdf) {
    return { status: 400, message: `"${notPdf.name}" não é um arquivo PDF.` };
  }

  if (files.length > MAX_FILES) {
    return {
      status: 413,
      message: `Selecione no máximo ${MAX_FILES} arquivos (${files.length} selecionados).`,
    };
  }

  const total = totalSize(files);
  if (total > MAX_TOTAL_BYTES) {
    return {
      status: 413,
      message: `O total de ${formatBytes(total)} excede o limite de ${formatBytes(MAX_TOTAL_BYTES)}.`,
    };
  }

  return null;
}
