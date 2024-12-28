"use client";

import { useRouter } from "next/navigation";

const KomikCardLow = ({ title, image, chapters = [], id }) => {
  const router = useRouter();

  console.log("ID komik:", id);

  const handleChapterClick = (chapter) => {
    const chapterTitle = chapter.title.replace("Ch.", "").replace(/\s+/g, '-');
    const formattedTitle = title.replace(/\s+/g, '-').toLowerCase();
    router.push(`/${formattedTitle}/chapter/${chapterTitle}`);
  };

  const handleImageClick = () => {
    const formattedTitle = title.replace(/\s+/g, '-').toLowerCase();
    router.push(`/${formattedTitle}`);
  };

  // Mengambil chapter terbaru berdasarkan chapter_number
  const sortedChapters = Array.isArray(chapters) ? chapters.sort((a, b) => b.chapter_number - a.chapter_number) : [];

  return (
    <div className="shadow-md">
      {/* Gambar Komik */}
      <div className="cursor-pointer" onClick={handleImageClick}>
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Konten Komik */}
      <div className="flex flex-col text-gray-200">
        <h3 className="font-bold text-base h-12 line-clamp-2">{title}</h3>
        <ul className="text-sm ">
          {sortedChapters.slice(0, 2).map((chapter, index) => (
            <li 
              key={index} 
              className="bg-gray-700 p-2 rounded-lg mb-2 flex justify-between cursor-pointer" 
              onClick={() => handleChapterClick(chapter)}
            >
              <span>{` ${chapter.title.replace("Chapter", "Ch.")}`}</span>
              <span>{getTimeAgo(chapter.posted_on)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Fungsi untuk menghitung waktu yang lalu
const getTimeAgo = (dateString) => {
  const now = new Date();
  const postedDate = new Date(dateString);
  const diffInMs = now - postedDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInDays < 7) {
    return `${diffInDays} days`;
  } else {
    return `${diffInWeeks} week`;
  }
};

export default KomikCardLow;