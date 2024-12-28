"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const UpdateChapters = () => {
  const pathname = usePathname(); // Mendapatkan pathname dari URL
  const id = pathname.split("/").pop(); // Mengambil ID dari URL, anggap formatnya seperti '/admin/update-chapters/[id]'

  const [komik, setKomik] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState({ chapter_number: "", title: "", posted_on: "", file: "" });
  const [editingChapter, setEditingChapter] = useState(null); // Menambahkan state untuk bab yang sedang diedit

  const router = useRouter();

  useEffect(() => {
    const fetchKomik = async () => {
      if (id) {
        const response = await fetch(`/api/v1/komik`);
        const data = await response.json();
        const foundKomik = data.find((k) => k.id === parseInt(id));
        if (foundKomik) {
          setKomik(foundKomik);
          const komikChapters = foundKomik.chapters || []; // Pastikan chapters adalah array
          setChapters(komikChapters);
          // Mengatur nomor bab berikutnya secara otomatis
          const nextChapterNumber = komikChapters.length > 0 ? komikChapters.length + 1 : 1; // Cek panjang array
          // Mengatur tanggal terbit berdasarkan tanggal saat ini
          const today = new Date();
          const formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
          const formattedTime = today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0');
          // Mengatur judul bab berdasarkan nomor bab
          const chapterTitle = `Ch.${nextChapterNumber}`;
          setNewChapter({ chapter_number: nextChapterNumber, posted_on: `${formattedDate}T${formattedTime}`, title: chapterTitle, file: "" });
        }
      }
    };

    fetchKomik();
  }, [id]); // Menjalankan ulang saat ID berubah

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewChapter({ ...newChapter, [name]: value });
  };

  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter); // Mengatur bab yang sedang diedit
    setNewChapter(chapter); // Mengatur state newChapter dengan data bab yang sedang diedit
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (id && komik) {
      let updatedChapters;
      if (editingChapter) {
        // Jika sedang mengedit chapter yang sudah ada
        updatedChapters = chapters.map(chapter =>
          chapter.chapter_number === editingChapter.chapter_number ? newChapter : chapter
        );
      } else {
        // Jika menambahkan chapter baru
        updatedChapters = [...chapters, newChapter];
      }

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
        setEditingChapter(null);
        // Reset newChapter setelah berhasil menambahkan
        const nextChapterNumber = updatedChapters.length + 1;
        const today = new Date();
        const formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
        const formattedTime = today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0');
        const chapterTitle = `Ch.${nextChapterNumber}`;
        setNewChapter({ chapter_number: nextChapterNumber, posted_on: `${formattedDate}T${formattedTime}`, title: chapterTitle, file: "" });
      } else {
        console.error('Gagal memperbarui komik:', response.statusText);
      }
    }
  };

  const handleDeleteChapter = async (chapterNumber) => {
    if (id && komik) {
        const updatedChapters = chapters.filter(chapter => chapter.chapter_number !== chapterNumber);
        const updatedKomik = {
            id: komik.id, // Menyertakan ID komik untuk pembaruan
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
            // Mengatur ulang nomor bab berikutnya dan tanggal terbit setelah hapus
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

  return (
    <div className="container mx-auto h-full p-12 my-10 flex justify-end bg-gray-800 rounded-lg shadow-md">
      <div className="w-full pr-4">
        ja<h1 className="text-3xl font-bold mb-4">Update Chapter {id}</h1>
        {/* Render Chapter List atau Komik yang ditemukan */}
        {komik && (
          <div className="mb-6 overflow-y-auto max-h-72">
            <h2 className="text-2xl font-bold mb-2">{komik.title}</h2>
            <ul className="list-none mb-4">
              {chapters && chapters.length > 0 ? (
                chapters.sort((a, b) => b.chapter_number - a.chapter_number).map((chapter) => (
                  <li key={chapter.id} className="py-2 border-b border-gray-200 flex justify-between">
                    <div>
                      <p>{chapter.title}</p>
                      <p className="text-blue-500 hover:text-blue-700">file komik: {chapter.file}</p>
                    </div>
                    <div className="flex gap-x-4 items-center">
                      <button onClick={() => handleEditChapter(chapter)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edit File</button>
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
      </div>
      <div className="w-1/2 pl-4">
        <div className="flex justify-end mb-4">
          <button onClick={() => router.back()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {faArrowLeft ? <FontAwesomeIcon icon={faArrowLeft} /> : "Kembali"}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label htmlFor="chapter_number" className="block text-gray-700 text-sm font-bold mb-2">Nomor Bab:</label>
            <input type="number" id="chapter_number" name="chapter_number" value={newChapter.chapter_number} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Judul Bab:</label>
            <input type="text" id="title" name="title" value={newChapter.title} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="posted_on" className="block text-gray-700 text-sm font-bold mb-2">Tanggal Terbit:</label>
            <input type="datetime-local" id="posted_on" name="posted_on" value={newChapter.posted_on} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">File Komik:</label>
            <input type="text" id="file" name="file" value={newChapter.file} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Tambah Bab Baru</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateChapters;
