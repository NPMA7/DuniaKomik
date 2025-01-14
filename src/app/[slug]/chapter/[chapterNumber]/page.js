"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { faArrowLeft, faArrowRight, faBookOpen, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "@/components/loading";

const ChapterPage = () => {
  const { slug, chapterNumber } = useParams();
  const router = useRouter();
  const [comic, setComic] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchComic = async () => {
      const response = await fetch("/api/v1/komik");
      const data = await response.json();
      const foundComic = data.find((k) => k.slug === slug);
      if (foundComic) {
        setComic(foundComic);
        const chapter = foundComic.chapters.find(
          (ch) => ch.chapter_number === parseInt(chapterNumber)
        );
        if (chapter) {
          setCurrentChapter(chapter);
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    };

    fetchComic();
  }, [slug, chapterNumber]);

  useEffect(() => {
    const fetchImages = async () => {
      if (currentChapter) {
        const isGoogleDrive = currentChapter.file.startsWith("https://");
        const folder = isGoogleDrive
          ? currentChapter.file.split("/").pop()
          : currentChapter.file;

        try {
          const response = await fetch(
            `/api/v1/komik/images?folder=${folder}&googleDrive=${isGoogleDrive}`
          );
          const data = await response.json();
          
          // Sort images by extracting the number from the filename
          const sortedImages = data.images.sort((a, b) => {
            const fileNameA = a.name || a;
            const fileNameB = b.name || b;
          
            // Menggunakan localeCompare dengan opsi numerik
            return fileNameA.localeCompare(fileNameB, undefined, { numeric: true });
          });
          
          setImages(sortedImages || []);
        } catch (error) {
          console.error("Error fetching images:", error);
          setError(true);
        }
      }
    };

    fetchImages();
  }, [currentChapter]);

  if (!comic || !currentChapter) {
    return <Loading />;
  }

  const handleNavigation = (chapterOffset) => {
    const newChapterNumber = parseInt(chapterNumber) + chapterOffset;
    if (newChapterNumber >= 0 && newChapterNumber <= comic.chapters.length) {
      const newChapter = comic.chapters.find(
        (ch) => ch.chapter_number === newChapterNumber
      );
      if (newChapter) {
        router.push(`/${slug}/chapter/${newChapterNumber}`);
      }
    }
  };

  const isPrevDisabled = !comic.chapters.some(ch => ch.chapter_number === 0) && parseInt(chapterNumber) <= 0;

  return (
    <div className="bg-gray-900 container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-gray-400">
        {comic.title} {currentChapter.title.replace("Ch.", " Chapter ")} Bahasa
        Indonesia
      </h1>
      <p className="text-center text-gray-500 mb-2">
        Tanggal Terbit:{" "}
        {new Date(currentChapter.posted_on).toLocaleDateString()}
      </p>
      <p className="text-center text-gray-500 mb-4">
        Baca <span className="font-bold text-lg">{comic.title}</span>{" "}
        <span className="font-bold text-lg">
          {currentChapter.title.replace("Ch.", "Chapter ")}
        </span>{" "}
        bahasa Indonesia terbaru di{" "}
        <span className="font-bold text-lg">Dunia Komik</span>. Komik{" "}
        <span className="font-bold text-lg">{comic.title}</span> bahasa
        Indonesia selalu update di{" "}
        <span className="font-bold text-lg">Dunia Komik</span>.
      </p>
      <p className="text-center text-gray-500 mb-6">
        Jangan lupa membaca update komik lainnya ya 🎉🎉🎉🎉.
      </p>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 m-4">
        <div className="flex flex-col w-full">
          <select
            className="bg-gray-600 border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            value={chapterNumber}
            onChange={(e) => router.push(`/${slug}/chapter/${e.target.value}`)}
          >
            {comic.chapters.map((chapter) => (
              <option
                key={chapter.chapter_number}
                value={chapter.chapter_number}
              >
                {chapter.title.replace("Ch.", "Chapter ")}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center w-full">
          <a
            href="#"
            className="text-base bg-red-600 text-white rounded-lg p-2 w-full text-center"
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-yellow-400 mr-2"
            />
            Laporkan Ke Admin
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-yellow-400 ml-2"
            />
          </a>
        </div>
      </div>
      <div className="flex flex-row gap-4 justify-center mb-4">
        <button
          onClick={() => handleNavigation(-1)}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isPrevDisabled}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className="ml-2">Prev</span>
        </button>
        <button
          onClick={() =>
            parseInt(chapterNumber) < comic.chapters.length - 1
              ? handleNavigation(1)
              : null
          }
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            parseInt(chapterNumber) >= comic.chapters.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <span className="mr-2">Next</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <div className="image-gallery flex flex-col justify-center items-center">
        {error ? (
          <p className="flex items-center justify-center text-center min-h-20 text-red-500">
            Chapter rusak, tidak dapat menampilkan gambar.
          </p>
        ) : Array.isArray(images) && images.length > 0 ? (
          images.map((image, index) => (
            <div key={index} className="mb-4">
              <Image
                src={image.id ? image.url : image}
                alt={`Halaman ${index + 1}`}
                width={500}
                height={500}
                priority={true}
              />
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <div className="flex flex-col">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            value={chapterNumber}
            onChange={(e) => router.push(`/${slug}/chapter/${e.target.value}`)}
          >
            {comic.chapters.map((chapter) => (
              <option
                key={chapter.chapter_number}
                value={chapter.chapter_number}
              >
                {chapter.title.replace("Ch.", "Chapter ")}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => router.push(`/${slug}`)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          <FontAwesomeIcon icon={faBookOpen} />
        </button>
        <button
          onClick={() => handleNavigation(-1)}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isPrevDisabled}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button
          onClick={() =>
            parseInt(chapterNumber) < comic.chapters.length - 1
              ? handleNavigation(1)
              : null
          }
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            parseInt(chapterNumber) >= comic.chapters.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default ChapterPage;
