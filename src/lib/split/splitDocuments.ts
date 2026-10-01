import { PDFDocument } from "pdf-lib";
import { REPORT_FILE_NAME, UNIDENTIFIED_FOLDER } from "../constants/constants";
import { buildPdfGroup } from "../pdf/buildPdfGroup";
import { extractPageTexts } from "../pdf/extractPageTexts";
import {
  groupPagesByEmployee,
  PageGroup,
} from "../pdf/groupPagesByEmployee";
import { detectProfile } from "../profiles/profiles";
import { buildReportCsv, ReportRow } from "../report/buildReportCsv";
import { formatPageRanges } from "../text/formatPageRanges";
import { toPathSegment } from "../text/toPathSegment";
import { buildZip, createUniquePath, ZipEntry } from "../zip/buildZip";
import {
  consolidateEmployees,
  describeIssues,
  employeeFolderName,
} from "./employeeFolders";

export interface InputDocument {
  fileName: string;
  bytes: Uint8Array;
}

interface AnalyzedDocument extends InputDocument {
  docType: string;
  groups: PageGroup[];
}

// Lê o texto do pdf, descobre o tipo do documento e agrupa as páginas.
async function analyzeDocument(doc: InputDocument): Promise<AnalyzedDocument> {
  const texts = await extractPageTexts(doc.bytes);
  const { docType, fields } = detectProfile(texts[0] ?? "");
  return {
    ...doc,
    // Sem perfil reconhecido, o tipo vem do nome do arquivo enviado.
    docType:
      docType ??
      (toPathSegment(doc.fileName.replace(/\.pdf$/i, "")).toLowerCase() ||
        "documento"),
    groups: groupPagesByEmployee(texts, fields),
  };
}

// Gera os pdfs separados (um pdf original carregado por vez) e, ao final, o relatório.
async function* generateEntries(
  documents: AnalyzedDocument[],
): AsyncGenerator<ZipEntry> {
  const employees = consolidateEmployees(documents.map((d) => d.groups));
  const uniquePath = createUniquePath();
  const report: ReportRow[] = [];

  for (const doc of documents) {
    const originalPdf = await PDFDocument.load(doc.bytes);

    for (const { employee, pages } of doc.groups) {
      const folderEmployee = employee && employees.get(employee.cpf);
      const path = folderEmployee
        ? uniquePath(employeeFolderName(folderEmployee), doc.docType, "pdf")
        : uniquePath(
            UNIDENTIFIED_FOLDER,
            `${doc.docType}_paginas_${formatPageRanges(pages, "_")}`,
            "pdf",
          );

      yield { path, data: await buildPdfGroup(originalPdf, pages) };

      report.push({
        arquivoOrigem: doc.fileName,
        tipo: doc.docType,
        paginas: formatPageRanges(pages),
        cpf: employee?.cpf ?? "",
        matricula: employee?.matricula ?? "",
        nome: employee?.nome ?? "",
        arquivoGerado: path,
        observacao:
          employee && folderEmployee
            ? describeIssues(employee, folderEmployee).join("; ")
            : "CPF não encontrado",
      });
    }
  }

  yield { path: REPORT_FILE_NAME, data: buildReportCsv(report) };
}

// Separa os pdfs por colaborador: uma pasta por cpf, um pdf por tipo de documento.
export async function splitDocuments(
  inputs: InputDocument[],
): Promise<ArrayBuffer> {
  // Sequencial de propósito: limita o pico de memória com vários pdfs grandes.
  const documents: AnalyzedDocument[] = [];
  for (const input of inputs) {
    documents.push(await analyzeDocument(input));
  }
  return buildZip(generateEntries(documents));
}
