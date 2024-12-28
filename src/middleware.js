import { NextResponse } from 'next/server';

export function middleware(req) {
  const UNLIMITED_KEY = process.env.UNLIMITED_ADMIN_KEY || 'unlimited-key';
  const TEMPORARY_KEY = process.env.TEMPORARY_ADMIN_KEY || 'temporary-key';

  const apiKey =
    req.cookies.get('admin_key')?.value || // Ambil API key dari cookie
    req.nextUrl.searchParams.get('apiKey'); // Atau dari query param (opsional)

  // Jangan blokir akses ke halaman login
  if (req.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Validasi kunci
  if (apiKey === UNLIMITED_KEY) {
    return NextResponse.next(); // Tidak dibatasi
  }

  if (apiKey === TEMPORARY_KEY) {
    const tokenSetTime = req.cookies.get('temporary_key_time')?.value;

    if (!tokenSetTime) {
      // Redirect jika waktu kunci sementara belum diatur
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Cek apakah sudah lebih dari 1 menit
    const now = Date.now();
    if (now - parseInt(tokenSetTime) > 60000) {
      // Hapus cookie yang sudah kedaluwarsa
      const response = NextResponse.redirect('/admin/login');
      response.cookies.set('admin_key', '', { maxAge: 0 });
      response.cookies.set('temporary_key_time', '', { maxAge: 0 });
      return response;
    }

    return NextResponse.next(); // Berikan akses jika dalam waktu 1 menit
  }

  // Jika API key tidak valid, redirect ke login
  const loginUrl = new URL('/admin/login', req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'], // Middleware hanya berjalan di rute /admin
};
