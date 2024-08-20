import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const filename = searchParams.get('filename');

  if (!url || !filename) {
    return NextResponse.json({ error: 'Missing url or filename' }, { status: 400 });
  }
  console.log("download url" + url)
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    if (response.status !== 200) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    const buffer = response.data;

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Type', 'application/octet-stream');

    return new NextResponse(Buffer.from(buffer), { headers });
  } catch (error) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}