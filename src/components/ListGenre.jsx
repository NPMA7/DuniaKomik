import React, { useState } from "react";
import { useRouter } from "next/navigation";

const genres = [
  "Action", "Adaptation", "Adult", "Adventure", "Ascension", "Blood", "Comedy",
  "Dark Fantasy", "Demon", "Drama", "Dungeons", "Ecchi", "Fantasy", "Game",
  "Gender Bender", "Genius MC", "Harem", "History", "Horror", "Isekai",
  "Josei", "Kombay", "Magic", "Manga", "Manhua", "Manhwa", "Manwha",
  "Martial Arts", "Adult", "Mecha", "Monster", "Monster Reincarnation",
  "Murim", "Mystery", "Necromancer", "Overpowered", "Psychological",
  "Regression", "Reincarnation", "Revenge", "Romantic", "School Life",
  "Sci-fi", "Seinen", "Shoujo", "Shoujo Ai", "Shounen", "Slice of Life", "Smut",
  "Sports", "Superpower", "Supernatural", "System", "Thriller", "Time Loop",
  "Time Travel", "Tragedy", "Vampire", "Vampire", "Video Game", "Villain",
  "Virtual Reality", "Webtoon", "Yuri"
];

const ListGenre = () => {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    router.push(`/genre/${genre}`);
  };

  return (
    <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg max-h-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Daftar Genre</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {genres.map((genre, index) => (
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
  );
};

export default ListGenre;
