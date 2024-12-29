//src/app/api/v1/komik/images/route.js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const credentialsPath = path.join(process.cwd(), 'src/credentials.json');
const readLocalFolder = (folder) => {
  const folderPath = path.join(process.cwd(), 'public', folder);

  try {
    const files = fs.readdirSync(folderPath);
    return files
      .filter((file) => /\.(jpg|jpeg|png|gif)$/.test(file))
      .map((file) => `/${folder}/${file}`);
  } catch (error) {
    throw new Error("Folder tidak ditemukan.");
  }
};


const readGoogleDriveFolder = async (folderId) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  const drive = google.drive({ version: 'v3', auth });

  const response = await drive.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id, name, mimeType)',
  });

  // console.log("Google Drive API response:", response.data.files);

  return response.data.files
    .filter((file) => file.mimeType.startsWith('image/'))
    .map((file) => ({
      id: file.id,
      name: file.name,
      url: `https://drive.google.com/uc?export=view&id=${file.id}`
    }));
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder');
  const isGoogleDrive = searchParams.get('googleDrive') === 'true';

  try {
    const images = isGoogleDrive
      ? await readGoogleDriveFolder(folder)
      : readLocalFolder(folder);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
