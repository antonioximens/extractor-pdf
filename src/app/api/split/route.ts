import { NextRequest, NextResponse } from "next/server";
import { splitPdfByCpf } from "@/lib/pdf-service";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo PDF não encontrado no envio." },
        { status: 400 },
      );
    }

    // Converte o arquivo recebido para Buffer para processamento no Node.js
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Chama o serviço que separa os PDFs e gera o ZIP
    const zipUint8Array = await splitPdfByCpf(buffer);

    /**
     * SOLUÇÃO DO ERRO DE TIPAGEM:
     * O erro "SharedArrayBuffer" ocorre porque o TS é rigoroso com a origem do buffer.
     * Criamos um novo Blob garantindo que o conteúdo seja uma parte válida (BlobPart).
     * Usamos o construtor do Blob passando o Uint8Array diretamente,
     * o que é aceito pela maioria das versões modernas do Next.js/Node.
     */
    const blob = new Blob([zipUint8Array], { type: "application/zip" });

    // Retorna a resposta binária para o frontend
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="documentos_separados.zip"',
        // Adicionamos o Content-Length para o frontend saber o progresso se necessário
        "Content-Length": blob.size.toString(),
      },
    });
  } catch (error: any) {
    console.error("Erro na rota de split:", error);

    return NextResponse.json(
      {
        error: "Falha ao processar o PDF.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
