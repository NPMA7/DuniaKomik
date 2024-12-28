"use client";

const Footer = () => {
    return (
      <footer className="bg-[#071129] py-6">
        {/* A-Z List */}
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-white text-xl mb-4 font-bold">A-Z LIST</h3>
          <p className="text-[#D1D5D8] mb-4">Searching series order by alphabet name A to Z.</p>
          <div className="flex justify-center flex-wrap gap-2">
            <button className="bg-[#2563EB] text-white px-4 py-2 rounded">#</button>
            <button className="bg-[#2563EB] text-white px-4 py-2 rounded">0-9</button>
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
              <button
                key={letter}
                className="bg-[#2563EB] text-white px-4 py-2 rounded hover:bg-red-700"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
  
        {/* Disclaimer */}
        <div className="container mx-auto px-6 text-center mt-6">
          <p className="text-[#9CA3AF] text-sm">
            All the comics on this website are only previews of the original comics, there may
            be many language errors, character names, and storylines. For the original version,
            please buy the comic if it's available in your city.
          </p>
        </div>
  
        {/* Scroll to Top Button */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-[#2563EB] text-white p-3 rounded-full shadow-lg hover:bg-red-700"
            aria-label="Scroll to top"
          >
            ▲
          </button>
        </div>

        {/* Scroll to Bottom Button */}
        <div className="fixed bottom-4 right-16">
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            className="bg-[#2563EB] text-white p-3 rounded-full shadow-lg hover:bg-red-700"
            aria-label="Scroll to bottom"
          >
            ▼
          </button>
        </div>
      </footer>
    );
  }
  
  export default Footer;