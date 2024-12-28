import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder');
  const folderPath = path.join(process.cwd(), 'public', folder); // Pastikan folder berada di dalam public

  try {
    const files = fs.readdirSync(folderPath);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/.test(file)) // Filter hanya gambar
      .map(file => `/${folder}/${file}`); // Buat URL gambar

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error reading folder:", error);
    return NextResponse.json({ error: "Folder tidak ditemukan" }, { status: 404 });
  }
} 