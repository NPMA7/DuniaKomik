"use client";
import { useEffect, useState } from "react";
import KomikCardLow from "@/components/KomikCardLow";
import Loading from "@/components/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const CompletedPage = () => {
  const [komikCompleted, setKomikCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchKomikCompleted = async () => {
      try {
        const response = await fetch("/api/v1/komik");
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.status}`);
        }
        const data = await response.json();
        const completedKomik = data
          .filter(
            (komik) =>
              komik.status === "Completed" &&
              komik.chapters &&
              komik.chapters.length > 0
          )
          .sort(
            (a, b) =>
              new Date(b.chapters[b.chapters.length - 1].posted_on) -
              new Date(a.chapters[a.chapters.length - 1].posted_on)
          );
        setKomikCompleted(completedKomik);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKomikCompleted();
  }, []);

  return (
    <div className="bg-[#111827] text-white min-h-screen py-10">
      <div className="container mx-auto h-full p-6 my-10">
        <div className="flex sm:flex-row justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Komik Update</h1>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Kembali
          </button>
        </div>
        <div className="flex flex-wrap gap-4 justify-start">
          {komikCompleted.length > 0 ? (
            komikCompleted.map((komik) => (
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
            <p>Tidak ada komik yang ditemukan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedPage;
