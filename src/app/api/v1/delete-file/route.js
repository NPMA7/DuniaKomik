import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('filePath'); // Ambil jalur file dari query parameter

  if (!filePath) {
    return NextResponse.json({ message: 'File path is required' }, { status: 400 });
  }

  const fullPath = path.join(process.cwd(), 'public/files', filePath); // Jalur lengkap ke file

  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ message: 'File or folder not found' }, { status: 404 });
  }

  try {
    if (fs.statSync(fullPath).isDirectory()) {
      fs.rmdirSync(fullPath, { recursive: true }); // Hapus folder beserta isinya
    } else {
      fs.unlinkSync(fullPath); // Hapus file
    }
    return NextResponse.json({ message: 'File or folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting file or folder:', error);
    return NextResponse.json({ message: 'Error deleting file or folder' }, { status: 500 });
  }
} 