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
        setKomikList(data.slice(0, 15)); // Mengambil 15 komik untuk populer

        // Mengacak dan memilih rekomendasi komik
        const shuffledKomik = data.sort(() => 0.5 - Math.random());
        setKomikRekomendasi(shuffledKomik.slice(0, 5)); // Memilih 5 komik untuk rekomendasi
      } catch (error) {
        console.error("Error:", error);
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

  const komikHiatusDropped = komikList
    .filter((komik) => komik.status === "Hiatus" || komik.status === "Dropped")
    .slice(0, 10); // Mengambil 10 komik untuk hiatus/dropped
  const komikCompleted = komikList
    .filter((komik) => komik.status === "Completed")
    .slice(0, 10); // Mengambil 10 komik untuk completed

  return (
    <div className="bg-[#111827] text-white min-h-screen py-10">
      <div className="w-full h-full lg:p-10 my-10">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex justify-between items-center bg-gray-800 min-w-screen px-6 overflow-x-auto">
              <section className="mb-4">
                <h2 className="text-2xl font-bold my-4 absolute">
                  Komik Populer
                </h2>

                <div className="flex">
                  {komikPopuler.map((komik) => (
                    <div className="flex w-28 mx-4 mt-14" key={komik.id}>
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
              <div className="w-full lg:w-2/3 ">
                <section className="mb-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4">Komik Update</h2>
                    <a href="/update" className="text-white text-lg mb-4 underline">
                      Lihat Semua
                    </a>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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

                {komikHiatusDropped.length > 0 && (
                  <section className="mb-10">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold mb-4">
                        Komik Hiatus/Dropped
                      </h2>
                      <a href="/hiatus-dropped" className="text-white text-lg underline">
                        Lihat Semua
                      </a>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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
                )}

                {komikCompleted.length > 0 && (
                  <section className="mb-10">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold mb-4">
                        Komik Completed
                      </h2>
                      <a
                        href="/completed"
                        className="text-white text-lg underline"
                      >
                        Lihat Semua
                      </a>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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
                )}

                <section className="mb-10 ">
                  <h2 className="text-2xl font-bold mb-4">Rekomendasi Komik</h2>
                  <div className="flex  flex-wrap gap-6 ml-10 lg:ml-0" >
                    {komikRekomendasi.map((komik) => (
                      <div className="w-28 h-[240px] sm:w-36" key={komik.id}>
                        <KomikCardLow
                          key={komik.id}
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
              {/* Menghilangkan BoxGenres di perangkat mobile */}
              <div className="hidden lg:block w-full lg:w-[30%] lg:ml-10 mt-10 lg:mt-0">
                <BoxGenres />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
