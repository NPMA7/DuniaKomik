"use client";

const ComicChapter = ({
  chapters,
  handleChapterClick, 
}) => {
  // Mengurutkan chapter dari yang terbesar ke yang terkecil berdasarkan nomor chapter
  const sortedChapters = [...chapters].sort((a, b) => b.chapter_number - a.chapter_number);

  return (
    <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 text-white p-8 rounded-lg shadow-2xl w-full mx-auto">
      {/* Chapters */}
      <div className="mt-6">
        <h2 className="text-3xl font-bold mb-4 border-b-2 border-blue-500 pb-2">Daftar Chapter</h2>
        <ul className="list-none pl-0 text-gray-300 space-y-3 overflow-y-auto max-h-[500px]">
          {sortedChapters.map((chapter) => (
            <li
              key={chapter.chapter_number}
              className="cursor-pointer hover:text-blue-500 transition duration-300 ease-in-out transform scale-95 hover:scale-100 bg-gray-800 p-3 rounded-lg shadow-md"
              onClick={() => handleChapterClick(chapter.chapter_number)}
            >
              <span className="font-semibold">{chapter.title.replace("Ch.", "Chapter ")}</span>
              <span className="block text-sm text-gray-400">Updated On: {new Date(chapter.posted_on).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ComicChapter;
