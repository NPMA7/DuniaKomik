"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ComicInformation from "@/components/ComicInformation";
import ComicChapter from "@/components/ComicChapter";
import Loading from "@/components/loading"; // Import komponen Loading

const ComicPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [komik, setKomik] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading

  useEffect(() => {
    const fetchKomik = async () => {
      const response = await fetch("/api/v1/komik");
      const data = await response.json();
      const foundKomik = data.find((k) => k.slug === slug);
      if (foundKomik) {
        setKomik(foundKomik);
        setChapters(foundKomik.chapters || []);
      } else {
        console.error("Komik tidak ditemukan dengan slug:", slug);
      }
      setIsLoading(false); // Set loading ke false setelah data diambil
    };

    fetchKomik();
  }, [slug]);

  if (isLoading) {
    return <Loading />; // Tampilkan komponen Loading saat isLoading true
  }

  if (!komik) {
    return <div>Komik tidak ditemukan</div>;
  }

  const handleChapterClick = (chapterNumber) => {
    router.push(`/${slug}/chapter/${chapterNumber}`);
  };

  return (
    <div className="bg-gray-900 container mx-auto sm:p-6 flex flex-col gap-6">
      <ComicInformation 
        title={komik.title} 
        image={komik.image} 
        description={komik.description} 
        chapters={chapters} 
        handleChapterClick={handleChapterClick}
        genre={komik.genre}
        status={komik.status}
        type={komik.type}
        released={komik.released}
        author={komik.author}
        postedOn={komik.posted_on}
        updatedOn={komik.updated_on}
        synopsis={komik.synopsis}
      />
      <ComicChapter
        title={komik.title}
        image={komik.image}
        description={komik.description}
        chapters={chapters}
        handleChapterClick={handleChapterClick}
      />
    </div>
  );
};

export default ComicPage;