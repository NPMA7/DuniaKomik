"use client";

import { useEffect, useState } from "react";
import KomikCard from "../components/KomikCard";

export default function Home() {
  const [komikList, setKomikList] = useState([]);

  useEffect(() => {
    const fetchKomik = async () => {
      const response = await fetch('/api/komik');
      const data = await response.json();
      setKomikList(data);
    };

    fetchKomik();
  }, []);

  return (
    <div className="bg-[#111827] text-white min-h-screen py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Komik Populer</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {komikList.map((komik, index) => (
            <KomikCard
              key={index}
              title={komik.title}
              description={komik.description}
              image={komik.image}
              onReadMore={() => alert(`Baca ${komik.title}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
