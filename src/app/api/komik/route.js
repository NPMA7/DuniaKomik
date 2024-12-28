import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/app/api/komik.json');

const readKomikData = () => {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
};

const writeKomikData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export async function GET() {
  const komikList = readKomikData();
  return NextResponse.json(komikList);
}

export async function POST(request) {
  const newKomik = await request.json();
  const komikList = readKomikData();
  newKomik.id = komikList.length + 1;
  komikList.push(newKomik);
  writeKomikData(komikList);
  return NextResponse.json(newKomik, { status: 201 });
}

export async function PUT(request) {
  const updatedKomik = await request.json();
  const komikList = readKomikData();
  const index = komikList.findIndex(komik => komik.id === updatedKomik.id);
  
  if (index !== -1) {
    komikList[index] = { ...komikList[index], ...updatedKomik };
    writeKomikData(komikList);
    return NextResponse.json(komikList[index]);
  }
  
  return NextResponse.json({ message: "Komik tidak ditemukan" }, { status: 404 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const komikList = readKomikData();
  const newKomikList = komikList.filter(komik => komik.id !== id);
  writeKomikData(newKomikList);
  return NextResponse.json({ message: "Komik dihapus" });
}
