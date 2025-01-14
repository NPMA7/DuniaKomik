import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderPath = searchParams.get('folderPath') || ''; // Ambil jalur folder dari query parameter

  const basePath = path.join(process.cwd(), 'public/files', folderPath); // Jalur lengkap ke folder

  if (!fs.existsSync(basePath)) {
    return NextResponse.json({ message: 'Folder not found' }, { status: 404 });
  }

  const filesAndFolders = fs.readdirSync(basePath).map(file => {
    const filePath = path.join(basePath, file);
    return {
      name: file,
      isDirectory: fs.statSync(filePath).isDirectory(),
    };
  });

  return NextResponse.json(filesAndFolders);
} 