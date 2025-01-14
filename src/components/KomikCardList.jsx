"use client";

import { useRouter } from "next/navigation";

const KomikCardList = ({ title, image, chapters = [], id, genre, status }) => {
  const router = useRouter();

  console.log("ID komik:", id);

  const handleChapterClick = (chapter) => {
    const chapterTitle = chapter.title.replace("Ch.", "").replace(/\s+/g, "-");
    const formattedTitle = title.replace(/\s+/g, "-").toLowerCase();
    router.push(`/${formattedTitle}/chapter/${chapterTitle}`);
  };

  const handleImageClick = () => {
    const formattedTitle = title.replace(/\s+/g, "-").toLowerCase();
    router.push(`/${formattedTitle}`);
  };

  // Mengambil chapter terbaru berdasarkan chapter_number
  const sortedChapters = Array.isArray(chapters)
    ? chapters.sort((a, b) => b.chapter_number - a.chapter_number)
    : [];

  return (
    <div className="shadow-xl flex w-full transform transition-transform duration-200 hover:scale-105">
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
        <h3
          className="font-bold text-base line-clamp-1 cursor-pointer mb-2 w-full"
          onClick={handleImageClick}
        >
          {title}
        </h3>
        {sortedChapters.length > 0 && (
          <div className="text-sm">
            {sortedChapters.slice(0, 1).map((chapter, index) => (
              <span
                key={index}
                className="p-[2px] px-2 rounded-lg mb-2 flex justify-between cursor-pointer w-48"
                onClick={() => handleChapterClick(chapter)}
              >
                <span className="hover:text-white">{` ${chapter.title.replace("Chapter", "Ch.")}`}</span> <span className="text-xs">{`| ${status}`}</span>
              </span>
            ))}
            <p className="text-sm pr-2 w-full">{` ${genre} `}</p>
          </div>
        )}
      
      </div>
    </div>
  );
};

export default KomikCardList;
