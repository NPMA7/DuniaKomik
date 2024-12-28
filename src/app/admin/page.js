"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBook,
  faCode,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminPage() {
  const router = useRouter();
  const [komikList, setKomikList] = useState([]);
  const [totalChapters, setTotalChapters] = useState(0);
  const [latestKomik, setLatestKomik] = useState(null);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalOngoing, setTotalOngoing] = useState(0);
  const [totalHiatus, setTotalHiatus] = useState(0);
  const [totalDropped, setTotalDropped] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAccessExpired, setIsAccessExpired] = useState(false);
  const [totalManga, setTotalManga] = useState(0);
  const [totalManhua, setTotalManhua] = useState(0);
  const [totalManhwa, setTotalManhwa] = useState(0);
  const [totalWebcomic, setTotalWebcomic] = useState(0);

  useEffect(() => {
    const fetchKomikData = async () => {
      const response = await fetch("/api/v1/komik");
      const data = await response.json();
      setKomikList(data);
      if (data.length > 0) {
        setLatestKomik(data[data.length - 1]);
        const totalChaptersCount = data.reduce(
          (acc, komik) => acc + (komik.chapters ? komik.chapters.length : 0),
          0
        );
        setTotalChapters(totalChaptersCount);

        const completedCount = data.filter(
          (komik) => komik.status === "Completed"
        ).length;
        const ongoingCount = data.filter(
          (komik) => komik.status === "Ongoing"
        ).length;
        const hiatusCount = data.filter(
          (komik) => komik.status === "Hiatus"
        ).length;
        const droppedCount = data.filter(
          (komik) => komik.status === "Dropped"
        ).length;
        const mangaCount = data.filter(
          (komik) => komik.type === "Manga"
        ).length;
        const manhuaCount = data.filter(
          (komik) => komik.type === "Manhua"
        ).length;
        const manhwaCount = data.filter(
          (komik) => komik.type === "Manhwa"
        ).length;
        const webcomicCount = data.filter(
          (komik) => komik.type === "Webcomic"
        ).length;

        setTotalCompleted(completedCount);
        setTotalOngoing(ongoingCount);
        setTotalHiatus(hiatusCount);
        setTotalDropped(droppedCount);
        setTotalManga(mangaCount);
        setTotalManhua(manhuaCount);
        setTotalManhwa(manhwaCount);
        setTotalWebcomic(webcomicCount);
      }
    };

    fetchKomikData();
  }, []);

  useEffect(() => {
    // Ambil waktu login dari cookie
    const loginTime = document.cookie
      .split("; ")
      .find((row) => row.startsWith("temporary_key_time="))
      ?.split("=")[1];

    if (loginTime) {
      const now = Date.now();
      const timeElapsed = now - parseInt(loginTime);

      // Periksa apakah waktu lebih dari 1 menit
      if (timeElapsed > 60000) {
        setIsAccessExpired(true);
        alert("Waktu akses telah habis. Silakan login kembali.");
      } else {
        setElapsedTime(timeElapsed);
        const interval = setInterval(() => {
          setElapsedTime((prevTime) => prevTime + 1000); // Update setiap detik
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval
      }
    } else {
      // Jika tidak ada waktu login, berarti akses unlimited
      setElapsedTime(0); // Tidak ada waktu akses berlangsung
      setIsAccessExpired(false); // Pastikan tidak terjadi expired
    }
  }, []);

  // Menghitung waktu dalam format detik, menit, detik
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes} menit ${seconds} detik`;
  };

  // Menghitung waktu akses yang tersisa
  const calculateRemainingTime = () => {
    const now = Date.now();
    const loginTime = parseInt(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("temporary_key_time="))
        ?.split("=")[1]
    );
    const timeElapsed = now - loginTime;
    const remainingTime = 60000 - timeElapsed; // 1 menit dalam milidetik
    return remainingTime;
  };

  if (isAccessExpired) {
    return (
      <div className="text-white">
        Waktu akses telah habis. Silakan login kembali.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-white mb-4">Navigasi</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.back()}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Kembali
            </button>
            <a
              href="/admin/update-comics"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faBook} className="mr-2" />
              Update Komik
            </a>
            <a
              href="https://github.com/username/repo"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faCode} className="mr-2" />
              GitHub Project
            </a>
            <div className="text-white">
              {elapsedTime === 0 ? (
                <p>Waktu Akses Berlangsung: Tidak Ada</p>
              ) : (
                <p>Waktu Akses Berlangsung: {formatTime(elapsedTime)}</p>
              )}
              {elapsedTime === 0 ? (
                <p>Waktu Akses Tersisa: Tanpa Batas</p>
              ) : (
                <p>Waktu Akses Tersisa: {formatTime(calculateRemainingTime())}</p>
              )}
            </div>
            <button
              onClick={() => {
                document.cookie = "admin_key=; max-age=0; path=/";
                document.cookie = "temporary_key_time=; max-age=0; path=/";
                router.push("/admin/login");
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </button>
            <div className=" bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-white mb-4">
                Informasi Proyek
              </h2>
              <p className="text-white">
                Proyek ini adalah platform manajemen komik yang memungkinkan
                admin untuk mengelola data komik dan bab. Kunjungi{" "}
                <a
                  href="https://github.com/username/repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  GitHub Project
                </a>{" "}
                untuk informasi lebih lanjut.
              </p>
            </div>
            {latestKomik && (
            <div className="bg-gray-700 p-4 rounded-lg mt-4">
              <h3 className="text-xl font-bold text-white">Komik Terbaru</h3>
              <p className="text-white">Judul: {latestKomik.title}</p>
              <p className="text-white">Deskripsi: {latestKomik.description}</p>
            </div>
          )}
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">Statistik</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white">Total Komik</h3>
              <p className="text-white text-3xl">{komikList.length}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white">Total Chapter</h3>
              <p className="text-white text-3xl">{totalChapters}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white">Komik Tamat</h3>
              <p className="text-white text-3xl">{totalCompleted}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white">Komik Berlanjut</h3>
              <p className="text-white text-3xl">{totalOngoing}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white">Komik Hiatus</h3>
              <p className="text-white text-3xl">{totalHiatus}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white">Komik Drop</h3>
              <p className="text-white text-3xl">{totalDropped}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white">Total Manga</h3>
              <p className="text-white text-3xl">{totalManga}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white">Total Manhua</h3>
              <p className="text-white text-3xl">{totalManhua}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white">Total Manhwa</h3>
              <p className="text-white text-3xl">{totalManhwa}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white">Total Webcomic</h3>
              <p className="text-white text-3xl">{totalWebcomic}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
