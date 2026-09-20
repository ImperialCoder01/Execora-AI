import { Router, Request, Response } from 'express';
import { parseDocumentBuffer } from '../docParser';

const router = Router();

router.post('/parse-doc', async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileBase64, fileName, mimeType } = req.body;
    if (!fileBase64 || typeof fileBase64 !== 'string') {
      res.status(400).json({ error: 'fileBase64 string payload is required.' });
      return;
    }

    const cleanBase64 = fileBase64.replace(/^data:.*;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const result = await parseDocumentBuffer(buffer, fileName || 'uploaded_document', mimeType);

    res.json({
      success: true,
      text: result.text,
      fileName: fileName || 'document',
      type: result.type,
      wordCount: result.text.split(/\s+/).filter(Boolean).length,
      pageCount: result.pageCount
    });
  } catch (error: any) {
    console.error('[Document Parser Route Error]:', error);
    res.status(500).json({ error: 'Failed to parse document.', details: error.message });
  }
});

export default router;
