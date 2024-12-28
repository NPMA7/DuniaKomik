'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [key, setKey] = useState('');

  const handleLogin = async () => {
    if (key === process.env.NEXT_PUBLIC_UNLIMITED_ADMIN_KEY) {
      document.cookie = `admin_key=${key}; path=/; max-age=31536000`; // 1 tahun
      alert('Login sebagai admin tanpa batas waktu berhasil!');
      window.location.href = '/admin';
    } else if (key === process.env.NEXT_PUBLIC_TEMPORARY_ADMIN_KEY) {
      const now = Date.now();
      document.cookie = `admin_key=${key}; path=/; max-age=60`; // 1 menit
      document.cookie = `temporary_key_time=${now}; path=/; max-age=60`; // Set waktu login
      alert('Login sebagai admin sementara berhasil!');
      window.location.href = '/admin';
    } else {
      alert('API key tidak valid!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-2xl mb-4">Admin Login</h1>
      <input
        type="text"
        placeholder="Masukkan API Key"
        className="p-2 mb-4 bg-gray-700 rounded border border-gray-600"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
      >
        Login
      </button>
    </div>
  );
}
