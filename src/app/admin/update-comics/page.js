"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AdminPage = () => {
  const router = useRouter();
  const [komikList, setKomikList] = useState([]);
  const [selectedKomik, setSelectedKomik] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [genre, setGenre] = useState("");
  const [additionalGenres, setAdditionalGenres] = useState([]);
  const [synopsis, setSynopsis] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [released, setReleased] = useState("");
  const [author, setAuthor] = useState("");
  const [postedOn, setPostedOn] = useState("");
  const [updatedOn, setUpdatedOn] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formAnimate, setFormAnimate] = useState(false);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const fetchKomik = async () => {
      const response = await fetch("/api/v1/komik");
      const data = await response.json();
      setKomikList(data);
    };

    fetchKomik();
  }, []);

  const handleEdit = (komik) => {
    setSelectedKomik(komik);
    setTitle(komik.title);
    setDescription(komik.description);
    setImage(komik.image);
    setGenre(komik.genre.join(', '));
    setAdditionalGenres([]);
    setSynopsis(komik.synopsis);
    setStatus(komik.status);
    setType(komik.type);
    setReleased(komik.released);
    setAuthor(komik.author);
    setPostedOn(komik.posted_on);
    setUpdatedOn(komik.updated_on);
    setSlug(komik.slug);
    setShowAddForm(true);
    setTimeout(() => setFormAnimate(true), 10);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedKomik = {
      ...selectedKomik,
      title,
      description,
      image,
      genre: [...new Set([...genre.split(',').map(item => item.trim()), ...additionalGenres])],
      synopsis,
      status,
      type,
      released,
      author,
      posted_on: postedOn,
      updated_on: updatedOn,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    };

    const response = await fetch("/api/v1/komik", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedKomik),
    });

    if (response.ok) {
      const updatedData = await response.json();
      setKomikList((prev) =>
        prev.map((komik) => (komik.id === updatedData.id ? updatedData : komik))
      );
      setSelectedKomik(null);
      setShowAddForm(false);
      setFormAnimate(false);
    } else {
      console.error("Gagal memperbarui komik:", response.statusText);
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch("/api/v1/komik", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setKomikList((prev) => prev.filter((komik) => komik.id !== id));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newKomik = {
      title,
      description,
      image,
      genre: [...new Set([...genre.split(',').map(item => item.trim()), ...additionalGenres])],
      synopsis,
      status,
      type,
      released,
      author,
      posted_on: postedOn,
      updated_on: updatedOn,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    };

    const response = await fetch("/api/v1/komik", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newKomik),
    });

    if (response.ok) {
      const addedKomik = await response.json();
      setKomikList((prev) => [...prev, addedKomik]);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedKomik(null);
    setTitle("");
    setDescription("");
    setImage("");
    setGenre("");
    setAdditionalGenres([]);
    setSynopsis("");
    setStatus("");
    setType("");
    setReleased("");
    setAuthor("");
    setPostedOn("");
    setUpdatedOn("");
    setSlug("");
    handleHideForm();
  };

  const handleShowForm = () => {
    setSelectedKomik(null);
    setTitle("");
    setDescription("");
    setImage("");
    setGenre("");
    setAdditionalGenres([]);
    setSynopsis("");
    setStatus("");
    setType("");
    setReleased("");
    setAuthor("");
    setPostedOn("");
    setUpdatedOn("");
    setSlug("");
    setShowAddForm(true);
    setTimeout(() => setFormAnimate(true), 10);
  };

  const handleHideForm = () => {
    setFormAnimate(false);
    setTimeout(() => setShowAddForm(false), 500);
  };

  const handleAddGenre = () => {
    if (genre.trim() !== "" && !additionalGenres.includes(genre.trim())) {
      setAdditionalGenres([...additionalGenres, genre.trim()]);
      setGenre("");
    }
  };

  const handleGenreChange = (e) => {
    const value = e.target.value;
    const suggestions = [
      "Action", "Adaptation", "Adult", "Adventure", "Ascension", "Blood", "Comedy", "Dark Fantasy", "Demon", "Drama", "Dungeons", "Ecchi", "Fantasy", "Game", "Gender Bender", "Genius MC", "Harem", "Historical", "Horror", "Isekai", "Josei", "Kombay", "Magic", "Manga", "Manhua", "Manhwa", "Manwha", "Martial Arts", "Mature", "Mecha", "Monsters", "Monsters Reincarnation", "Murim", "Mystery", "Necromancer", "Overpowered", "Psychological", "Regression", "Reincarnation", "Returner", "Revenge", "Romance", "School Life", "Sci-fi", "Seinen", "Shoujo", "Shoujo Ai", "Shounen", "Slice of Life", "Smut", "Sports", "Super Power", "Supernatural", "System", "Thriller", "Time Loop", "Time Travel", "Tragedy", "Vampire", "Vampires", "Video games", "Villainess", "Virtual Reality", "Webtoon", "Yuri"
    ];
    const filteredSuggestions = suggestions.filter(suggestion => !additionalGenres.includes(suggestion));
    if (filteredSuggestions.length === 1) {
      setGenre(filteredSuggestions[0]);
    } else {
      setGenre(value);
    }
  };

  useEffect(() => {
    if (selectedKomik) {
      setTitle(selectedKomik.title);
      setDescription(selectedKomik.description);
      setImage(selectedKomik.image);
      setGenre(selectedKomik.genre.join(', '));
      setSynopsis(selectedKomik.synopsis);
      setStatus(selectedKomik.status);
      setType(selectedKomik.type);
      setReleased(selectedKomik.released);
      setAuthor(selectedKomik.author);
      setPostedOn(selectedKomik.posted_on);
      setUpdatedOn(selectedKomik.updated_on);
      setSlug(selectedKomik.slug);
    }
  }, [selectedKomik]);

  return (
    <div className="container py-10 flex justify-end">
      <div className="flex-1 pl-52">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Admin - Update Komik</h1>
          <button
            onClick={() => router.back()}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {faArrowLeft ? <FontAwesomeIcon icon={faArrowLeft} /> : "Kembali"}
          </button>
        </div>
        <div className="flex justify-end items-center mb-6">

          <button
            onClick={handleShowForm}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Tambah Komik
          </button>
        
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {komikList.map((komik) => (
            <div key={komik.id} className="bg-gray-800 p-4 rounded-lg">
              <h1 className="font-bold text-lg text-white">id: {komik.id}</h1>
              <h2 className="text-white">Judul: {komik.title}</h2>
              <p className="text-white">Slug: {komik.slug}</p>
              <p className="text-white">Deskripsi: {komik.description}</p>
              <p className="text-white">
                Path Gambar:{" "}
                {komik.image.length > 50
                  ? `${komik.image.substring(0, 50)}...`
                  : komik.image}
              </p>
              <p className="text-white">Genre: {komik.genre.join(', ')}</p>
              <p className="text-white">Synopsis: {komik.synopsis}</p>
              <p className="text-white">Status: {komik.status}</p>
              <p className="text-white">Type: {komik.type}</p>
              <p className="text-white">Released: {komik.released}</p>
              <p className="text-white">Author: {komik.author}</p>
              <p className="text-white">Posted On: {komik.posted_on}</p>
              <p className="text-white">Updated On: {komik.updated_on}</p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(komik)}
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(komik.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded mt-2"
                >
                  Hapus
                </button>
                <button
                  onClick={() =>
                    router.push(`/admin/update-chapters/${komik.id}`)
                  }
                  className="bg-yellow-500 text-white py-2 px-4 rounded mt-2"
                >
                  Update Chapters
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {(selectedKomik || showAddForm) && (
        <div
          className={`fixed right-0 top-0 h-full w-1/3 bg-gray-900 p-6 shadow-2xl transform transition-transform duration-500 ease-in-out
      ${formAnimate ? "form-animate-enter" : "form-animate"} overflow-y-scroll`}
        >
          <form
            onSubmit={selectedKomik ? handleUpdate : handleAdd}
            className="mt-8 text-black"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">
              {selectedKomik ? "Edit Komik" : "Tambah Komik"}
            </h2>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!selectedKomik) {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
                }
              }}
              placeholder="Judul"
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi"
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="URL Gambar"
              className="
             border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={genre}
              onChange={handleGenreChange}
              placeholder="Genre (pisahkan dengan koma)"
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              list="genre-suggestions"
            />
            <button
              type="button"
              onClick={handleAddGenre}
              className="bg-blue-500 text-white py-2 px-4 rounded mb-5"
            >
              Tambah Genre
            </button>
            <div className="mb-5">
              {additionalGenres.map((gen, index) => (
                <span key={index} className="bg-gray-700 text-white py-1 px-3 rounded-full mr-2">
                  {gen}
                </span>
              ))}
            </div>
            <datalist id="genre-suggestions">
              <option value="Action" />
              <option value="Adaptation" />
              <option value="Adult" />
              <option value="Adventure" />
              <option value="Ascension" />
              <option value="Blood" />
              <option value="Comedy" />
              <option value="Dark Fantasy" />
              <option value="Demon" />
              <option value="Drama" />
              <option value="Dungeons" />
              <option value="Ecchi" />
              <option value="Fantasy" />
              <option value="Game" />
              <option value="Gender Bender" />
              <option value="Genius MC" />
              <option value="Harem" />
              <option value="Historical" />
              <option value="Horror" />
              <option value="Isekai" />
              <option value="Josei" />
              <option value="Kombay" />
              <option value="Magic" />
              <option value="Manga" />
              <option value="Manhua" />
              <option value="Manhwa" />
              <option value="Manwha" />
              <option value="Martial Arts" />
              <option value="Mature" />
              <option value="Mecha" />
              <option value="Monsters" />
              <option value="Monsters Reincarnation" />
              <option value="Murim" />
              <option value="Mystery" />
              <option value="Necromancer" />
              <option value="Overpowered" />
              <option value="Psychological" />
              <option value="Regression" />
              <option value="Reincarnation" />
              <option value="Returner" />
              <option value="Revenge" />
              <option value="Romance" />
              <option value="School Life" />
              <option value="Sci-fi" />
              <option value="Seinen" />
              <option value="Shoujo" />
              <option value="Shoujo Ai" />
              <option value="Shounen" />
              <option value="Slice of Life" />
              <option value="Smut" />
              <option value="Sports" />
              <option value="Super Power" />
              <option value="Supernatural" />
              <option value="System" />
              <option value="Thriller" />
              <option value="Time Loop" />
              <option value="Time Travel" />
              <option value="Tragedy" />
              <option value="Vampire" />
              <option value="Vampires" />
              <option value="Video games" />
              <option value="Villainess" />
              <option value="Virtual Reality" />
              <option value="Webtoon" />
              <option value="Yuri" />
            </datalist>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Synopsis"
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Status</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Hiatus">Hiatus</option>
              <option value="Dropped">Dropped</option>
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Type</option>
              <option value="Manga">Manga</option>
              <option value="Manhwa">Manhwa</option>
              <option value="Manhua">Manhua</option>
              <option value="Webtoon">Webtoon</option>
            </select>
            <input
              type="number"
              value={released}
              onChange={(e) => setReleased(e.target.value)}
              placeholder="Released"
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={postedOn}
              onChange={(e) => setPostedOn(e.target.value)}
              placeholder="Posted On"
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={updatedOn}
              onChange={(e) => setUpdatedOn(e.target.value)}
              placeholder="Updated On"
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {selectedKomik && (
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Slug"
                className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <div className="flex gap-4">
              <button
                type="submit"
                className={`${
                  selectedKomik ? "bg-green-600" : "bg-blue-600"
                } text-white py-3 px-5 rounded-lg hover:bg-opacity-90 transition`}
              >
                {selectedKomik ? "Update Komik" : "Tambah Komik"}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleHideForm();
                }}
                className="bg-red-600 text-white py-3 px-5 rounded-lg hover:bg-opacity-90 transition"
              >
                Tutup Form
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
