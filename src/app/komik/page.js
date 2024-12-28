"use client";

import { useEffect, useState } from "react";
import KomikCardBig from "@/components/KomikCardBig";
import Loading from "@/components/loading";

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
      <div className="container mx-auto h-full p-12 my-10">
        <h1 className="text-3xl font-bold mb-4">Daftar Komik</h1>
        <div className="flex justify-end mb-4">
          <select
            className="bg-gray-700 text-white px-4 py-2 rounded mr-2"
            onChange={(e) => handleFilterChange("genre", e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Romance">Romance</option>
            {/* Tambahkan opsi genre lainnya di sini */}
          </select>
          <select
            className="bg-gray-700 text-white px-4 py-2 rounded mr-2"
            onChange={(e) => handleFilterChange("type", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Manga">Manga</option>
            <option value="Manhwa">Manhwa</option>
            {/* Tambahkan opsi type lainnya di sini */}
          </select>
          <select
            className="bg-gray-700 text-white px-4 py-2 rounded mr-2"
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            {/* Tambahkan opsi status lainnya di sini */}
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSort}
          >
            Sort {sortOrder === "asc" ? "Z-A" : "A-Z"}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredKomikList.length > 0 ? (
            filteredKomikList.map((komik) => (
              <div className="w-full h-48" key={komik.id}>
                <KomikCardBig
                  title={komik.title}
                  image={komik.image}
                  chapters={komik.chapters.slice(-1)} // Menampilkan hanya chapter terbaru
                  slug={komik.slug}
                  imageHeight={60}
                />
              </div>
            ))
          ) : (
            <p>Tidak ada komik yang ditemukan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KomikListPage;