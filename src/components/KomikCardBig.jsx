"use client";

import { useRouter } from "next/navigation";

const KomikCardBig = ({ title, image, chapters = [], id }) => {
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
    <div className="shadow-xl flex transform transition-transform duration-200 hover:scale-105">
      {/* Gambar Komik */}
      <div className="cursor-pointer" onClick={handleImageClick}>
        <img
          src={image}
          alt={title}
          className="w-24 h-32 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Konten Komik */}
      <div className="flex flex-col text-gray-200 ml-4 w-2/3">
        <h3 className="font-bold text-base line-clamp-1 cursor-pointer mb-2" onClick={handleImageClick}>{title}</h3>
        {sortedChapters.length > 0 && (
          <div className="text-sm">
            {sortedChapters.slice(0, 3).map((chapter, index) => (
              <span key={index} className="p-[2px] px-2 rounded-lg mb-2 flex justify-between hover:bg-gray-700 cursor-pointer transform transition-transform duration-200 hover:scale-105" onClick={() => handleChapterClick(chapter)}>
                <span>{` ${chapter.title.replace("Chapter", "Ch.")}`}</span>
                <span>{getTimeAgo(chapter.posted_on)}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Fungsi untuk menghitung waktu yang lalu
const getTimeAgo = (dateString) => {
  const now = new Date();
  const postedDate = new Date(dateString);
  const diffInMs = now - postedDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInMinutes / (60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam lalu`;
  } else if (diffInDays < 7) {
    return `${diffInDays} hari lalu`;
  } else {
    return `${diffInWeeks} minggu lalu`;
  }
};

export default KomikCardBig;