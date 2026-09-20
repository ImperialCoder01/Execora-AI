import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseDocumentBuffer(
  buffer: Buffer,
  fileName: string,
  mimeType?: string
): Promise<{ text: string; pageCount?: number; type: string }> {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // PDF Document Handling
  if (ext === 'pdf' || mimeType === 'application/pdf') {
    try {
      const data = await pdfParse(buffer);
      const text = data.text ? data.text.trim() : '';
      return {
        text: text || `[PDF Document: ${fileName}] Could not extract text from scanned images in PDF. Please ensure text is selectable.`,
        pageCount: data.numpages,
        type: 'PDF Document'
      };
    } catch (err: any) {
      console.error("PDF Parsing error:", err);
      throw new Error(`Failed to parse PDF document (${fileName}): ${err.message}`);
    }
  }

  // Word Document Handling (.docx)
  if (ext === 'docx' || ext === 'doc' || mimeType?.includes('word')) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value ? result.value.trim() : '';
      return {
        text: text || `[Word Document: ${fileName}] Text extraction returned empty content.`,
        type: 'Word Document'
      };
    } catch (err: any) {
      console.error("DOCX Parsing error:", err);
      throw new Error(`Failed to parse Word document (${fileName}): ${err.message}`);
    }
  }

  // Plain Text, Markdown, CSV, JSON, Log, HTML, XML, RTF, Code Files
  try {
    const text = buffer.toString('utf-8').trim();
    return {
      text,
      type: ext ? `${ext.toUpperCase()} File` : 'Text File'
    };
  } catch (err: any) {
    throw new Error(`Failed to read file contents: ${err.message}`);
  }
}
