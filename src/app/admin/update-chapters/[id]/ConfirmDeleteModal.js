import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, fileName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed text-black inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Konfirmasi Penghapusan</h2>
        <p>Apakah Anda yakin ingin menghapus {fileName}?</p>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">Batal</button>
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Hapus</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal; 