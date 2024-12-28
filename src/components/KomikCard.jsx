"use client";

import Image from "next/image";

const KomikCard = ({ title, description, image, onReadMore }) => {
  return (
    <div className="bg-[#9CA3AF] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Gambar Komik */}
      <div className="relative w-full h-64">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Konten Komik */}
      <div className="p-4">
        <h3 className="text-[#111827] font-bold text-lg mb-2">{title}</h3>
        <p className="text-[#111827] text-sm mb-4">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        <button
          onClick={onReadMore}
          className="bg-[#2563EB] text-white py-2 px-4 rounded hover:bg-[#1D4ED8] transition-colors"
        >
          Baca Sekarang
        </button>
      </div>
    </div>
  );
}

export default KomikCard;