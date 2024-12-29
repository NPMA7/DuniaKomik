import { google } from "googleapis";
import path from "path";
import { NextResponse } from 'next/server';
import fs from 'fs';

const filePath = path.join(process.cwd(), 'src/app/api/v1/komik.json');

const readKomikData = () => {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const chapterNumber = searchParams.get('chapterNumber');

  try {
    const komikList = readKomikData();
    const foundKomik = komikList.find((k) => k.slug === slug);
    
    if (!foundKomik) {
      return NextResponse.json({ error: "Komik tidak ditemukan" }, { status: 404 });
    }

    const chapter = foundKomik.chapters.find(ch => ch.chapter_number === parseInt(chapterNumber));
    
    if (!chapter) {
      return NextResponse.json({ error: "Chapter tidak ditemukan" }, { status: 404 });
    }

    const folderId = chapter.file.split('/').pop(); // Ambil folderId dari URL

    console.log("Path credentials.json:", path.join(process.cwd(), "src/credentials.json"));

    const keyFilePath = path.join(process.cwd(), "src/credentials.json");
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    console.log("Authenticating...");
    const drive = google.drive({ version: "v3", auth });

    console.log("Fetching files from folder:", folderId);

    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: "files(id, name, mimeType)",
    });

    const files = response.data.files.filter((file) =>
      file.mimeType.startsWith("image/")
    );

    return new Response(JSON.stringify(files), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in API route:", error.message, error.stack);
    return new Response(JSON.stringify({ error: "Failed to fetch images" }), {
      status: 500,
    });
  }
}
