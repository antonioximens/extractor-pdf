import { NextRequest, NextResponse } from "next/server";
import { InputDocument, splitDocuments } from "@/lib/split/splitDocuments";
import {
  formatBytes,
  MAX_TOTAL_BYTES,
  validateUpload,
} from "@/lib/upload/uploadLimits";

// Folga para os cabeçalhos do multipart além do tamanho dos arquivos.
const MULTIPART_OVERHEAD_BYTES = 1024 * 1024;

export async function POST(req: NextRequest) {
  // Recusa envios grandes demais antes de ler o corpo da requisição.
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_TOTAL_BYTES + MULTIPART_OVERHEAD_BYTES) {
    return NextResponse.json(
      {
        error: `O envio excede o limite de ${formatBytes(MAX_TOTAL_BYTES)}.`,
      },
      { status: 413 },
    );
  }

  try {
    const formData = await req.formData();
    const files = formData
      .getAll("file")
      .filter((entry): entry is File => entry instanceof File);

    const uploadError = validateUpload(files);
    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: uploadError.status },
      );
    }

    const inputs: InputDocument[] = await Promise.all(
      files.map(async (file) => ({
        fileName: file.name,
        bytes: new Uint8Array(await file.arrayBuffer()),
      })),
    );

    // Separa os PDFs por colaborador e gera o ZIP.
    const zip = await splitDocuments(inputs);

    return new NextResponse(zip, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="documentos_separados.zip"',
        "Content-Length": zip.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Erro na rota de split:", error);

    return NextResponse.json(
      {
        error: "Falha ao processar o PDF.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
