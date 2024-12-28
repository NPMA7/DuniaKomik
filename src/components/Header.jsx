"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [scroll, setScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }, []);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const response = await fetch("/api/v1/komik");
      const data = await response.json();
      const filteredSuggestions = data.filter(komik =>
        komik.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (slug) => {
    router.push(`/${slug}`);
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <>
      <header className={`bg-[#2563EB] ${scroll ? 'fixed top-0 left-0 w-full z-50' : 'z-50'}`}> 
        <div className="container mx-auto px-6 flex gap-10 items-center justify-between">
          <nav className="flex items-center space-x-10 text-base">
            <a href="/" className="font-bold">
              <Image src="/LogoDK.svg" alt="Logo Dunia Komik" width={100} height={100} hidden={scroll} />
            </a>
            <ul className="flex items-center space-x-10 text-base py-4">
              <a href="/" className="text-[#D1D5D8] hover:text-white">Beranda</a>
              <a href="/komik" className="text-[#D1D5D8] hover:text-white">Daftar Komik</a>
              <a href="/genre" className="text-[#D1D5D8] hover:text-white">Genre</a>
              <a href="/about" className="text-[#D1D5D8] hover:text-white">Tentang</a>
            </ul>
          </nav>
          <div className="relative flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Cari..."
                className="bg-[#D1D5D8] text-gray-900 py-2 px-4 rounded-md"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button type="submit" className="bg-white text-[#2759a3] py-2 px-4 rounded-md">
                Cari
              </button>
            </form>
            {suggestions.length > 0 && (
              <ul className="absolute bg-[#D1D5D8] text-black border top-10 border-gray-900 rounded-lg mb-1 w-full z-10">
                {suggestions.map((komik) => (
                  <li
                    key={komik.id}
                    className="flex items-center p-2 border-b border-gray-900 rounded-lg hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSuggestionClick(komik.slug)}
                  >
                    <div className="flex flex-shrink-0">
                    <img src={komik.image} alt={komik.title} className="w-20 h-20" />
                  </div>
                    <div className="flex flex-col ml-2">
                      <span className="text-sm font-bold">{komik.title}</span>
                      <span className="text-sm text-gray-500">{komik.chapters[komik.chapters.length - 1].title} | {komik.status}</span>
                      <span className="text-sm text-gray-500">{komik.genre.join(" ")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
