"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import KomikCardLow from "@/components/KomikCardLow";
import Loading from "@/components/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const GenrePage = () => {
  const { genre } = useParams();
  const router = useRouter();
  const [komikList, setKomikList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKomikByGenre = async () => {
      try {
        const response = await fetch("/api/v1/komik");
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.status}`);
        }
        const data = await response.json();
        const filteredKomik = data.filter((komik) =>
          komik.genre.includes(genre)
        );
        setKomikList(filteredKomik);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKomikByGenre();
  }, [genre]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-[#111827] text-white min-h-screen py-10">
      <div className="container mx-auto h-full p-6 my-10">
        <div className="flex sm:flex-row justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Komik Genre: {genre}</h1>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Kembali
          </button>
        </div>
        <div className="flex flex-wrap gap-4 justify-start">
          {komikList.length > 0 ? (
            komikList.map((komik) => (
              <div className="w-28 h-[240px] sm:w-36" key={komik.id}>
                <KomikCardLow
                  title={komik.title}
                  image={komik.image}
                  chapters={komik.chapters}
                  slug={komik.slug}
                />
              </div>
            ))
          ) : (
            <p>Tidak ada komik yang ditemukan untuk genre ini.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenrePage;
