"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import KomikCardList from "@/components/KomikCardList";

const KomikListPage = () => {
  const [komikList, setKomikList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");
  const [filter, setFilter] = useState({ genre: "", type: "", status: "" });

  useEffect(() => {
    const fetchKomik = async () => {
      try {
        const response = await fetch("/api/v1/komik");
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.status}`);
        }
        const data = await response.json();
        setKomikList(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKomik();
  }, []);

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedList = [...komikList].sort((a, b) => {
      return newOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
    setKomikList(sortedList);
    setSortOrder(newOrder);
  };

  const handleFilterChange = (key, value) => {
    setFilter((prevFilter) => ({ ...prevFilter, [key]: value }));
  };

  const filteredKomikList = komikList.filter((komik) => {
    return (
      (filter.genre ? komik.genre.includes(filter.genre) : true) &&
      (filter.type ? komik.type === filter.type : true) &&
      (filter.status ? komik.status === filter.status : true)
    );
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-[#111827] text-white min-h-screen py-10">
      <div className="w-full h-full p-3 lg:p-10 my-10">
        <h1 className="text-3xl font-bold mb-4">Daftar Komik</h1>
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <div className="flex flex-wrap">
            <select
              className="bg-gray-700 text-white px-4 py-2 rounded mr-2 mb-2 sm:mb-0"
              onChange={(e) => handleFilterChange("genre", e.target.value)}
            >
              <option value="">All Genres</option>
              {[
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
              ].map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <select
              className="bg-gray-700 text-white px-4 py-2 rounded mr-2 mb-2 sm:mb-0"
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Manga">Manga</option>
              <option value="Manhwa">Manhwa</option>
              <option value="Manhua">Manhua</option>
            </select>
            <select
              className="bg-gray-700 text-white px-4 py-2 rounded mr-2 mb-2 sm:mb-0"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSort}
          >
            Sort {sortOrder === "asc" ? "Z-A" : "A-Z"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredKomikList.length > 0 ? (
            filteredKomikList.map((komik) => (
              <div key={komik.id} className="flex flex-col items-center">
                <KomikCardList    
                  title={komik.title}
                  image={komik.image}
                  chapters={komik.chapters}
                  slug={komik.slug}
                  genre={komik.genre}
                  status={komik.status}
                />
              </div>
            ))
          ) : (
            <p>Data tidak muncul.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KomikListPage;