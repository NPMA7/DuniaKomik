import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const baseUploadPath = path.join(process.cwd(), 'public/files');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const filePath = path.join(baseUploadPath, filename);
  const exists = fs.existsSync(filePath);

  return NextResponse.json({ exists });
} 