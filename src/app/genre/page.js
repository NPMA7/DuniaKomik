"use client";

import { useRouter } from "next/navigation";
import BoxGenres from "@/components/BoxGenres";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const GenreListPage = () => {
  const router = useRouter();

  return (
    <div className="bg-[#111827] text-white min-h-screen py-10">
      <div className="container mx-auto h-full p-12 my-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4">Daftar Genre</h1>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Kembali
          </button>
        </div>
        <BoxGenres />
      </div>
    </div>
  );
};

export default GenreListPage;