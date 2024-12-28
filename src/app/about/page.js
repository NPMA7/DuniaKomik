const AboutPage = () => {
  return (
    <div className="bg-[#111827] text-white min-h-screen py-10">
      <div className="container mx-auto h-full p-12 my-10">
        <h1 className="text-3xl font-bold mb-4">Tentang Proyek Ini</h1>
        <p className="mb-4">
          Proyek ini adalah platform untuk membaca dan mengelola komik secara online. 
          Kami menyediakan berbagai genre komik yang dapat diakses oleh pengguna dengan mudah.
        </p>
        <h2 className="text-2xl font-bold mb-2">Fitur Utama</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Daftar komik yang lengkap dengan berbagai genre.</li>
          <li>Pencarian komik berdasarkan judul dan genre.</li>
          <li>Halaman admin untuk mengelola komik dan chapter.</li>
          <li>Fitur rekomendasi komik berdasarkan preferensi pengguna.</li>
          <li>Antarmuka yang responsif dan mudah digunakan.</li>
          <li>Dan yang pasti tanpa iklan.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-2">Teknologi yang Digunakan</h2>
        <p className="mb-4">
          Proyek ini dibangun menggunakan teknologi modern seperti:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>React.js untuk antarmuka pengguna.</li>
          <li>Next.js untuk pengelolaan routing dan server-side rendering.</li>
          <li>Tailwind CSS untuk styling yang responsif.</li>
          <li>Node.js untuk backend dan pengelolaan API.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-2">Kontak</h2>
        <p>
          Untuk pertanyaan atau masukan, silakan hubungi kami di:
          <a href="mailto:lazyworker01@gmail.com" className="text-blue-400"> lazyworker01@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default AboutPage; 