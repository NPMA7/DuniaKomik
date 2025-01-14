"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const ComicInformation = ({
  title,
  image,
  description,
  chapters,
  handleChapterClick,
  genre,
  status,
  type,
  released,
  author,
  postedOn,
  updatedOn,
  synopsis
}) => {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 text-white p-8 rounded-lg shadow-lg w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Kembali
        </button>
      </div>
      <p className="text-gray-300 mb-4">{description}</p>
      
      <div className="flex my-6">
        {/* Image Section */}
        <div className="flex-shrink-0 w-40 lg:w-64 h-96">
          <img src={image} alt={title} className="w-full h-full object-cover rounded-lg shadow-md" />
        </div>

        {/* Comic Details */}
        <div className="ml-6 bg-gray-800 p-4 rounded-lg shadow-md flex-grow">
          <h2 className="text-2xl font-bold mb-3">Informasi Komik</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
            <button 
              className="col-span-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              onClick={() => handleChapterClick(chapters.length > 0 ? chapters[chapters.length - 1].chapter_number : null)}
            >
              <strong>Awal Chapter:</strong> {chapters.length > 0 ? chapters[chapters.length - 1].title : "N/A"}
            </button>
            <button 
              className="col-span-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              onClick={() => handleChapterClick(chapters.length > 0 ? chapters[0].chapter_number : null)}
            >
              <strong>Chapter Terakhir:</strong> {chapters.length > 0 ? chapters[0].title : "N/A"}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300 border border-gray-700 rounded-lg">
            <p className="col-span-1 sm:col-span-2 border-b border-gray-700 p-2 h-32 overflow-y-auto no-scrollbar"><strong>Synopsis:</strong> {synopsis}</p>
            <p className="border-b border-gray-700 pl-2 pb-2 truncate "><strong>Status:</strong> {status}</p>
            <p className="border-b border-gray-700 pl-2 pb-2 truncate"><strong>Type:</strong> {type}</p>
            <p className="border-b border-gray-700 pl-2 pb-2 truncate"><strong>Released:</strong> {released}</p>
            <p className="border-b border-gray-700 pl-2 pb-2 truncate"><strong>Author:</strong> {author}</p>
            <p className="pl-2 pb-2 truncate"><strong>Posted On:</strong> {new Date(postedOn).toLocaleDateString()}</p>
            <p className="pl-2 pb-2 truncate"><strong>Updated On:</strong> {new Date(updatedOn).toLocaleDateString()}</p>
          </div>
          <div className="border-gray-700 p-2">
            <strong>Genre:</strong>
            <div className="flex flex-wrap mt-2">
              {genre.filter(g => g !== "").map((g, index) => (
                <button
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full mr-2 mb-2 hover:bg-blue-700"
                  onClick={() => router.push(`/genre/${g.charAt(0).toUpperCase() + g.slice(1).toLowerCase().replace(/\s+/g, '-')}`)} // Mengarahkan ke halaman genre yang sesuai
                >
                  {g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicInformation;
