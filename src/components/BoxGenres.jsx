import React, { useState } from "react";
import { useRouter } from "next/navigation";

const genres = [
  "Action", "Adaptation", "Adult", "Adventure", "Ascension", "Blood", "Comedy",
  "Dark Fantasy", "Demon", "Drama", "Dungeons", "Ecchi", "Fantasy", "Game",
  "Gender Bender", "Genius MC", "Harem", "Historical", "Horror", "Isekai",
  "Josei", "Kombay", "Magic", "Manga", "Manhua", "Manhwa", "Manwha",
  "Martial Arts", "Mature", "Mecha", "Monsters", "Monsters Reincarnation",
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
  const third = Math.ceil(genres.length / 3);
  const firstThird = genres.slice(0, third);
  const secondThird = genres.slice(third, third * 2);
  const lastThird = genres.slice(third * 2);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    router.push(`/genre/${genre}`);
  };

  return (
    <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Daftar Genre</h2>
      <div className="grid grid-cols-3 gap-6">
        <ul className="list-none">
          {firstThird.map((genre, index) => (
            <li
              key={index}
              className={`py-3 px-4 border-b border-gray-300 cursor-pointer hover:bg-blue-600 transition-colors duration-200 ${selectedGenre === genre ? 'bg-blue-500' : ''}`}
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </li>
          ))}
        </ul>
        <ul className="list-none">
          {secondThird.map((genre, index) => (
            <li
              key={index}
              className={`py-3 px-4 border-b border-gray-300 cursor-pointer hover:bg-blue-600 transition-colors duration-200 ${selectedGenre === genre ? 'bg-blue-500' : ''}`}
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </li>
          ))}
        </ul>
        <ul className="list-none">
          {lastThird.map((genre, index) => (
            <li
              key={index}
              className={`py-3 px-4 border-b border-gray-300 cursor-pointer hover:bg-blue-600 transition-colors duration-200 ${selectedGenre === genre ? 'bg-blue-500' : ''}`}
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BoxGenres;
