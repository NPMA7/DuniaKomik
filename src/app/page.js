"use client";

import { useEffect, useState } from "react";
import KomikCardBig from "@/components/KomikCardBig";
import KomikCardLow from "@/components/KomikCardLow";
import BoxGenres from "../components/BoxGenres";
import Loading from "@/components/loading";

export default function Home() {
  const [komikList, setKomikList] = useState([]);
  const [komikRekomendasi, setKomikRekomendasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKomik = async () => {
      try {
        const response = await fetch("/api/v1/komik");
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data komik:", data);
        setKomikList(data);

        // Mengacak dan memilih rekomendasi komik
        const shuffledKomik = data.sort(() => 0.5 - Math.random());
        setKomikRekomendasi(shuffledKomik.slice(0, 4)); // Memilih 4 komik secara acak
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKomik();
  }, []);

  const komikPopuler = komikList
    .filter((komik) => komik.chapters && komik.chapters.length > 0)
    .sort((a, b) => {
      const latestChapterA = new Date(
        a.chapters[a.chapters.length - 1].posted_on
      );
      const latestChapterB = new Date(
        b.chapters[b.chapters.length - 1].posted_on
      );
      return latestChapterB - latestChapterA;
    });

  const komikUpdate = komikList
    .filter((komik) => komik.chapters && komik.chapters.length > 0)
    .sort((a, b) => {
      const latestChapterA = new Date(
        a.chapters[a.chapters.length - 1].posted_on
      );
      const latestChapterB = new Date(
        b.chapters[b.chapters.length - 1].posted_on
      );
      return latestChapterB - latestChapterA;
    });

  const komikHiatusDropped = komikList.filter(
    (komik) => komik.status === "Hiatus" || komik.status === "Dropped"
  );
  const komikCompleted = komikList.filter(
    (komik) => komik.status === "Completed"
  );

  return (
    <div className="bg-[#111827] text-white min-h-screen py-10">
      <div className="container mx-auto h-full p-12 my-10">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex justify-between items-center bg-gray-800 p-4">
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Komik Populer</h2>
                <div className="flex flex-wrap gap-6 overflow-hidden">
                  {komikPopuler.map((komik) => (
                    <div className="w-36 h-[280px]" key={komik.id}>
                      <KomikCardLow
                        title={komik.title}
                        image={komik.image}
                        chapters={komik.chapters}
                        slug={komik.slug}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-start w-full bg-gray-800 p-4 rounded-lg shadow-md mt-10">
              <div className="w-full lg:w-2/3">
                <section className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">Komik Update</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {komikUpdate.map((komik) => (
                      <KomikCardBig
                        key={komik.id}
                        title={komik.title}
                        image={komik.image}
                        chapters={komik.chapters}
                        slug={komik.slug}
                      />
                    ))}
                  </div>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">Komik Hiatus/Dropped</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {komikHiatusDropped.map((komik) => (
                      <KomikCardBig
                        key={komik.id}
                        title={komik.title}
                        image={komik.image}
                        chapters={komik.chapters}
                        slug={komik.slug}
                      />
                    ))}
                  </div>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">Komik Completed</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {komikCompleted.map((komik) => (
                      <KomikCardBig
                        key={komik.id}
                        title={komik.title}
                        image={komik.image}
                        chapters={komik.chapters}
                        slug={komik.slug}
                      />
                    ))}
                  </div>
                </section>
              </div>
              <div className="w-full lg:w-1/3 lg:ml-10 mt-10 lg:mt-0">
                <BoxGenres />
                <section className="mt-10">
                  <h2 className="text-2xl font-bold mb-4">Rekomendasi Komik</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {komikRekomendasi.map((komik) => (
                      <KomikCardBig
                        key={komik.id}
                        title={komik.title}
                        image={komik.image}
                        chapters={komik.chapters}
                        slug={komik.slug}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
