"use client";

import { useRouter } from "next/navigation";
import ListGenre from "@/components/ListGenre";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const GenreListPage = () => {
  const router = useRouter();

  return (
    <div className="bg-[#111827] text-white min-h-screen py-10">
      <div className="container mx-auto h-full p-4 my-10">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Daftar Genre</h1>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 sm:mb-0 flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Kembali
          </button>
        </div>
        <ListGenre />
      </div>
    </div>
  );
};

export default GenreListPage;