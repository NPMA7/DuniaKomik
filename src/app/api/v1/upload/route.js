import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const baseUploadPath = path.join(process.cwd(), 'public');

export async function POST(request) {
  const data = await request.formData();
  const file = data.get('file');
  const komikTitle = data.get('komikTitle');

  if (!file || !komikTitle) {
    return NextResponse.json({ message: 'File atau jalur upload tidak ditemukan' }, { status: 400 });
  }

  const customPath = path.join(baseUploadPath, komikTitle);
  if (!fs.existsSync(customPath)) {
    fs.mkdirSync(customPath, { recursive: true });
  }

  const filePath = path.join(customPath, file.name);

  // Simpan file ke direktori yang ditentukan
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  // Jika file yang diupload adalah ZIP, ekstrak isinya
  if (path.extname(file.name) === '.zip') {
    const unzipPath = path.join(customPath, path.basename(file.name, '.zip'));
    fs.mkdirSync(unzipPath, { recursive: true });

    // Ekstrak file ZIP menggunakan adm-zip
    const zip = new AdmZip(filePath);
    zip.extractAllTo(unzipPath, true);
    console.log(`File ZIP berhasil diekstrak ke ${unzipPath}`);

    // Hapus file ZIP setelah berhasil diekstrak
    fs.unlinkSync(filePath);
    console.log(`File ZIP ${file.name} telah dihapus.`);
  }

  return NextResponse.json({ message: 'File berhasil diupload', filePath });
} 