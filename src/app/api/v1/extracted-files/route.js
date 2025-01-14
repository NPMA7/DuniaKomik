import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderPath = searchParams.get('folderPath'); // Ambil jalur folder dari query parameter

  if (!folderPath) {
    return NextResponse.json({ message: 'Folder path is required' }, { status: 400 });
  }

  const fullPath = path.join(process.cwd(), 'public', folderPath); // Jalur lengkap ke folder

  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ message: 'Folder not found' }, { status: 404 });
  }

  const files = fs.readdirSync(fullPath); // Baca semua file dalam folder
  const filePaths = files.map(file => path.join(folderPath, file)); // Buat jalur relatif untuk file

  return NextResponse.json({ files: filePaths });
} 