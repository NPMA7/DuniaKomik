"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import path from 'path';
import FileList from './FileList';

const UpdateChapters = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [komik, setKomik] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState({ chapter_number: "", title: "", posted_on: "", file: "" });
  const [editingChapter, setEditingChapter] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadedFilePaths, setUploadedFilePaths] = useState([]);
  const [extractedFilePaths, setExtractedFilePaths] = useState([]);
  const [customPath, setCustomPath] = useState('');
  const [refreshFileList, setRefreshFileList] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchKomik = async () => {
      if (id) {
        const response = await fetch(`/api/v1/komik`);
        const data = await response.json();
        const foundKomik = data.find((k) => k.id === parseInt(id));
        if (foundKomik) {
          setKomik(foundKomik);
          setCustomPath(`files/${foundKomik.title.toLowerCase().replace(/\s+/g, '-')}/`);
          const komikChapters = foundKomik.chapters || [];
          setChapters(komikChapters);
          const nextChapterNumber = komikChapters.length > 0 ? Math.max(...komikChapters.map(ch => ch.chapter_number)) + 1 : 0;
          const today = new Date();
          const formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
          const formattedTime = today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0');
          const chapterTitle = `Ch.${nextChapterNumber}`;
          setNewChapter({ chapter_number: nextChapterNumber, posted_on: `${formattedDate}T${formattedTime}`, title: chapterTitle, file: "" });
        }
      }
    };

    fetchKomik();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewChapter({ ...newChapter, [name]: value });
  };

  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setNewChapter(chapter);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (id && komik) {
      let updatedChapters;
      if (editingChapter) {
        updatedChapters = chapters.map(chapter =>
          chapter.chapter_number === editingChapter.chapter_number ? newChapter : chapter
        );
      } else {
        updatedChapters = [...chapters, newChapter];
      }

      const updatedKomik = {
        id: komik.id,
        chapters: updatedChapters.map(chapter => ({
          chapter_number: parseInt(chapter.chapter_number),
          title: chapter.title,
          posted_on: chapter.posted_on,
          file: chapter.file
        }))
      };

      const response = await fetch(`/api/v1/komik`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedKomik),
      });

      if (response.ok) {
        setChapters(updatedChapters);
        const nextChapterNumber = updatedChapters.length > 0 ? Math.max(...updatedChapters.map(ch => ch.chapter_number)) + 1 : 0;
        const today = new Date();
        const formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
        const formattedTime = today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0');
        const chapterTitle = `Ch.${nextChapterNumber}`;
        setNewChapter({ chapter_number: nextChapterNumber, posted_on: `${formattedDate}T${formattedTime}`, title: chapterTitle, file: "" });
      } else {
        console.error('Gagal menghapus bab:', response.statusText);
      }
    }
  };

  const handleDeleteChapter = async (chapterNumber) => {
    if (id && komik) {
        const updatedChapters = chapters.filter(chapter => chapter.chapter_number !== chapterNumber);
        const updatedKomik = {
            id: komik.id,
            chapters: updatedChapters.map(chapter => ({
                chapter_number: chapter.chapter_number,
                title: chapter.title,
                posted_on: chapter.posted_on,
                file: chapter.file
            }))
        };
        const response = await fetch(`/api/v1/komik`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedKomik),
        });
        if (response.ok) {
            setChapters(updatedChapters);
            const nextChapterNumber = updatedChapters.length + 1;
            const today = new Date();
            const formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
            const formattedTime = today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0');
            const chapterTitle = `Ch.${nextChapterNumber}`;
            setNewChapter({ chapter_number: nextChapterNumber, posted_on: `${formattedDate}T${formattedTime}`, title: chapterTitle, file: "" });
        } else {
            console.error('Gagal menghapus bab:', response.statusText);
        }
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!fileToUpload || fileToUpload.length === 0) return;

    setIsUploading(true);
    const uploadedFilePaths = [];
    const existingFiles = [];

    const uploadPromises = Array.from(fileToUpload).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('komikTitle', customPath);

      const responseCheck = await fetch(`/api/v1/check-file?filename=${file.name}`);
      if (responseCheck.ok) {
        const resultCheck = await responseCheck.json();
        if (resultCheck.exists) {
          existingFiles.push(file.name);
          return null;
        }
      }

      const response = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        uploadedFilePaths.push(`${customPath}${file.name}`);
        return `${customPath}${file.name}`;
      } else {
        console.error('File upload failed:', response.statusText);
        return null;
      }
    });

    await Promise.all(uploadPromises);

    if (uploadedFilePaths.length > 0) {
      setUploadMessage('File berhasil diupload!');
      setRefreshFileList(prev => !prev);
    }

    if (existingFiles.length > 0) {
      alert(`File berikut sudah ada dan tidak diupload: ${existingFiles.join(', ')}`);
    }

    if (uploadedFilePaths.length === 0 && existingFiles.length === 0) {
      alert('Tidak ada file yang berhasil diupload.');
    }

    setIsUploading(false);
  };

  return (
    <div className="container mx-auto h-full p-12 my-10 flex flex-col bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Update Chapter {id}</h1>
      {komik && (
        <div className="mb-6 overflow-y-auto max-h-72 mt-12">
          <h2 className="absolute text-2xl font-bold -mt-12">{komik.title}</h2>
          <ul className="list-none my-4">
            {chapters && chapters.length > 0 ? (
              chapters.sort((a, b) => b.chapter_number - a.chapter_number).map((chapter, index) => (
                <li key={`${chapter.id}-${chapter.chapter_number}`} className="py-2 border-b border-gray-200 flex justify-between">
                  <div>
                    <p>{chapter.title}</p>
                    <p className="text-blue-500 hover:text-blue-700">file komik: {chapter.file}</p>
                  </div>
                  <div className="flex gap-x-4 items-center">
                    <button onClick={() => handleEditChapter(chapter)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edit</button>
                    <button onClick={() => handleDeleteChapter(chapter.chapter_number)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline">Delete</button>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-2 text-gray-500">Tidak ada bab yang tersedia.</li>
            )}
          </ul>
        </div>
      )}
      <div className="w-full mb-4">
        <FileList refresh={refreshFileList} />
      </div>
      <div className="w-full mb-4">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label htmlFor="chapter_number" className="block text-white text-sm font-bold mb-2">Nomor Bab:</label>
            <input type="number" id="chapter_number" name="chapter_number" value={newChapter.chapter_number} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-white text-sm font-bold mb-2">Judul Bab:</label>
            <input type="text" id="title" name="title" value={newChapter.title} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="posted_on" className="block text-white text-sm font-bold mb-2">Tanggal Terbit:</label>
            <input type="datetime-local" id="posted_on" name="posted_on" value={newChapter.posted_on} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="file" className="block text-white text-sm font-bold mb-2">File Komik:</label>
            <input type="text" id="file" name="file" value={newChapter.file} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Tambah Bab Baru</button>
        </form>
      </div>
      <div className="w-full mb-4">
        <form onSubmit={handleFileUpload} className="flex flex-col">
          <div className="mb-4">
            <label htmlFor="customPath" className="block text-white text-sm font-bold mb-2">Custom Path:</label>
            <input
              type="text"
              id="customPath"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="fileUpload" className="block text-gray-700 text-sm font-bold mb-2">Upload File (Gambar atau ZIP):</label>
            <input
              type="file"
              id="fileUpload"
              multiple
              accept="image/*,.zip"
              onChange={(e) => setFileToUpload(e.target.files)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Upload File</button>
        </form>
      </div>

      {uploadMessage && <div className="mt-4 text-green-500">{uploadMessage}</div>}
    </div>
  );
};

export default UpdateChapters;
