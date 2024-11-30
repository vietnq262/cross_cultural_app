import * as mammoth from 'mammoth';

import { DocumentChunkMetadata } from '../types';

export async function splitDocxToChunks(
  file: File,
  chunkSize: number = 1000,
  overlap: number = 200,
): Promise<{ content: string; loc: DocumentChunkMetadata['loc'] }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const { value: fullText } = await mammoth.extractRawText({ arrayBuffer });

  const lines = fullText.split('\n').filter((line) => line.trim() !== '');
  const chunks: {
    content: string;
    loc: DocumentChunkMetadata['loc'];
  }[] = [];

  let start: number = 0;
  let globalLineStart: number = 0;

  while (start < fullText.length) {
    const chunkText = lines
      .slice(globalLineStart, globalLineStart + chunkSize)
      .join(' ')
      .trim();
    const lineEnd = globalLineStart + countLinesInChunk(chunkText, lines);

    chunks.push({
      content: chunkText,
      loc: {
        lines: {
          from: globalLineStart,
          to: lineEnd,
        },
        pageNumber: 0,
      },
    });

    start += chunkSize - overlap;
    globalLineStart = lineEnd + 1;
  }

  return chunks;
}

function countLinesInChunk(chunkText: string, lines: string[]): number {
  let lineCount = 0;
  let accumulatedText = '';

  for (const line of lines) {
    accumulatedText += line + ' ';
    if (accumulatedText.trim().length >= chunkText.length) {
      break;
    }
    lineCount++;
  }

  return lineCount;
}
