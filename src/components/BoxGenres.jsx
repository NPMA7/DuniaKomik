import React, { useState } from "react";
import { useRouter } from "next/navigation";

const genres = [
  "Action", "Adaptation", "Adult", "Adventure", "Ascension", "Blood", "Comedy",
  "Dark Fantasy", "Demon", "Drama", "Dungeons", "Ecchi", "Fantasy", "Game",
  "Gender Bender", "Genius MC", "Harem", "Historical", "Horror", "Isekai",
  "Josei", "Kombay", "Magic", "Manga", "Manhua", "Manhwa", "Manwha",
  "Martial Arts", "Adult", "Mecha", "Monsters", "Monsters Reincarnation",
  "Murim", "Mystery", "Necromancer", "Overpowered", "Psychological",
  "Regression", "Reincarnation", "Returner", "Revenge", "Romance", "School Life",
  "Sci-fi", "Seinen", "Shoujo", "Shoujo Ai", "Shounen", "Slice of Life", "Smut",
  "Sports", "Super Power", "Supernatural", "System", "Thriller", "Time Loop",
  "Time Travel", "Tragedy", "Vampire", "Vampires", "Video games", "Villainess",
  "Virtual Reality", "Webtoon", "Yuri"
];

const BoxGenres = () => {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    router.push(`/genre/${genre}`);
  };

  return (
    <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg max-h-screen overflow-y-scroll no-scrollbar">
      <h2 className="text-2xl font-bold text-center">Daftar Genre</h2>
      <h2 className="text-base font-semibold mb-6 text-center">Scroll Untuk Melihat Genre Lainnya</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="grid grid-cols-1 gap-6">
          {genres.slice(0, genres.length / 2).map((genre, index) => (
            <div
              key={index}
              className={`py-3 px-4 border-b border-gray-300 cursor-pointer hover:bg-blue-600 transition-colors duration-200 ${selectedGenre === genre ? 'bg-blue-500' : ''}`}
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6">
          {genres.slice(genres.length / 2).map((genre, index) => (
            <div
              key={index}
              className={`py-3 px-4 border-b border-gray-300 cursor-pointer hover:bg-blue-600 transition-colors duration-200 ${selectedGenre === genre ? 'bg-blue-500' : ''}`}
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoxGenres;
