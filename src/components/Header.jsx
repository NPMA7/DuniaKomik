"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const Header = () => {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }, []);

  return (
    <>
      <header className={`bg-[#2563EB] ${scroll ? 'fixed top-0 left-0 w-full' : ''}`}> 
        <div className="container mx-auto px-6 flex gap-10 items-center justify-between">
          <nav className="flex items-center space-x-10 text-base">
            <a href="/" className="font-bold">
              <Image src="/LogoDK.svg" alt="Logo Dunia Komik" width={100} height={100} hidden={scroll} />
            </a>
              <ul className="flex items-center space-x-10 text-base py-4">
                <a href="#" className="text-[#D1D5D8] hover:text-white">
                  Beranda
                </a>
                <a href="#" className="text-[#D1D5D8] hover:text-white">
                  Kategori
                </a>
                <a href="#" className="text-[#D1D5D8] hover:text-white">
                  Tentang
                </a>
                <a href="#" className="text-[#D1D5D8] hover:text-white">
                  Kontak
                </a>
              </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Cari..."
              className="bg-[#D1D5D8] text-white py-2 px-4 rounded-md"
            />
            <button className="bg-white text-[#2759a3] py-2 px-4 rounded-md">
              Cari
            </button>
            
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
