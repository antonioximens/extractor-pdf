import { NextRequest, NextResponse } from "next/server";
import { InputDocument, splitDocuments } from "@/lib/split/splitDocuments";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData
      .getAll("file")
      .filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo PDF encontrado no envio." },
        { status: 400 },
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
