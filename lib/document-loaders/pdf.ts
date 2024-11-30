import { pdfjs } from 'react-pdf';

import { DocumentChunkMetadata } from '@/lib/types';

export function setupPdfjsWorker() {
  pdfjs.GlobalWorkerOptions.workerSrc =
    'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';
}

export async function splitPdfToChunks(
  file: File,
  chunkSize: number = 1000,
  overlap: number = 200,
): Promise<{ content: string; loc: DocumentChunkMetadata['loc'] }[]> {
  const fileArrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: fileArrayBuffer }).promise;

  const chunks: { content: string; loc: DocumentChunkMetadata['loc'] }[] = [];
  let globalLineStart = 0;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    let pageText = '';
    const pageLines: string[] = [];

    textContent.items.forEach((item: any) => {
      pageLines.push(item.str);
      pageText += item.str + ' ';
    });

    let start = 0;
    while (start < pageText.length) {
      const chunkText = pageText.slice(start, start + chunkSize).trim();
      const lineEnd = globalLineStart + countLinesInChunk(chunkText, pageLines);

      chunks.push({
        content: chunkText,
        loc: {
          lines: {
            from: globalLineStart,
            to: lineEnd,
          },
          pageNumber: pageNumber,
        },
      });

      start += chunkSize - overlap;
      globalLineStart = lineEnd + 1;
    }
  }

  return chunks;
}

function countLinesInChunk(chunkText: string, pageLines: string[]): number {
  let lineCount = 0;
  let accumulatedText = '';

  for (const line of pageLines) {
    accumulatedText += line + ' ';
    if (accumulatedText.trim().length >= chunkText.length) {
      break;
    }
    lineCount++;
  }

  return lineCount;
}
