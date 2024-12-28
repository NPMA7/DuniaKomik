"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();
  const [komikList, setKomikList] = useState([]);
  const [selectedKomik, setSelectedKomik] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [genre, setGenre] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [released, setReleased] = useState("");
  const [author, setAuthor] = useState("");
  const [postedOn, setPostedOn] = useState("");
  const [updatedOn, setUpdatedOn] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formAnimate, setFormAnimate] = useState(false);


  useEffect(() => {
    const fetchKomik = async () => {
      const response = await fetch("/api/komik");
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
    setGenre(komik.genre);
    setSynopsis(komik.synopsis);
    setStatus(komik.status);
    setType(komik.type);
    setReleased(komik.released);
    setAuthor(komik.author);
    setPostedOn(komik.posted_on);
    setUpdatedOn(komik.updated_on);
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
      genre,
      synopsis,
      status,
      type,
      released,
      author,
      posted_on: postedOn,
      updated_on: updatedOn,
    };

    const response = await fetch("/api/komik", {
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
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch("/api/komik", {
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
      genre,
      synopsis,
      status,
      type,
      released,
      author,
      posted_on: postedOn,
      updated_on: updatedOn,
    };

    const response = await fetch("/api/komik", {
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
    setSynopsis("");
    setStatus("");
    setType("");
    setReleased("");
    setAuthor("");
    setPostedOn("");
    setUpdatedOn("");
    handleHideForm();
  };

  const handleShowForm = () => {
    setSelectedKomik(null);
    setTitle("");
    setDescription("");
    setImage("");
    setGenre("");
    setSynopsis("");
    setStatus("");
    setType("");
    setReleased("");
    setAuthor("");
    setPostedOn("");
    setUpdatedOn("");
    setShowAddForm(true);
    setTimeout(() => setFormAnimate(true), 10);
  };

  const handleHideForm = () => {
    setFormAnimate(false);
    setTimeout(() => setShowAddForm(false), 500);
  };

  return (
    <div className="container py-10 flex justify-end">
      <div className="flex-1 pl-52">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin - Update Komik</h1>
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
              <p className="text-white">Deskripsi: {komik.description}</p>
              <p className="text-white">
                Path Gambar:{" "}
                {komik.image.length > 50
                  ? `${komik.image.substring(0, 50)}...`
                  : komik.image}
              </p>
              <p className="text-white">Genre: {komik.genre}</p>
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
                onClick={() => router.push(`/update-chapters/${komik.id}`)}
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
              onChange={(e) => setTitle(e.target.value)}
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
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre"
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Synopsis"
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Status"
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Type"
              required
              className="border border-gray-700 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
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
