import JSZip from "jszip";

export interface ZipEntry {
  path: string;
  data: Uint8Array | string;
}

// Monta o zip consumindo as entradas conforme são geradas.
export async function buildZip(
  entries: AsyncIterable<ZipEntry>,
): Promise<ArrayBuffer> {
  const zip = new JSZip();
  for await (const { path, data } of entries) {
    zip.file(path, data);
  }
  return zip.generateAsync({ type: "arraybuffer" });
}

// Garante caminhos únicos no zip: "pasta/holerite.pdf", "pasta/holerite_2.pdf"...
export function createUniquePath() {
  const used = new Set<string>();
  return (folder: string, baseName: string, extension: string): string => {
    let path = `${folder}/${baseName}.${extension}`;
    for (let n = 2; used.has(path); n++) {
      path = `${folder}/${baseName}_${n}.${extension}`;
    }
    used.add(path);
    return path;
  };
}
