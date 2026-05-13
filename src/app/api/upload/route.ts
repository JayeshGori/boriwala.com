import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const isVideo = (file.type || '').startsWith('video/');
      const maxSize = isVideo ? 20 * 1024 * 1024 : 2 * 1024 * 1024; // 20MB videos, 2MB images
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: isVideo ? 'Video must be under 20MB. For longer videos, host on YouTube/Drive and paste the URL.' : 'Image must be under 2MB' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      const dataUrl = `data:${mimeType};base64,${base64}`;
      urls.push(dataUrl);
    }

    return NextResponse.json({ success: true, data: urls });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: `Upload failed: ${message}` }, { status: 500 });
  }
}
