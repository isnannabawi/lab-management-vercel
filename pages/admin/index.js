import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Head>
        <title>Sistem Manajemen Laboratorium</title>
        <meta name="description" content="Aplikasi manajemen laboratorium" />
      </Head>

      <nav className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">LabManager</h1>
          <div className="space-x-4">
            <Link href="/" className="hover:text-green-200">Beranda</Link>
            <Link href="/dashboard" className="hover:text-green-200">Dashboard</Link>
            <Link href="/peminjaman" className="hover:text-green-200">Peminjaman</Link>
            <Link href="/tracking" className="hover:text-green-200">Tracking</Link>
            <Link href="/admin" className="hover:text-green-200">Admin</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Sistem Manajemen Laboratorium</h1>
          <p className="text-lg text-green-600 max-w-2xl mx-auto">
            Kelola peminjaman laboratorium, alat, dan bahan dengan mudah dan efisien
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <h2 className="text-xl font-semibold text-green-700 mb-3">Peminjaman Lab</h2>
            <p className="text-gray-600 mb-4">Ajukan peminjaman laboratorium untuk keperluan akademik atau penelitian</p>
            <Link href="/peminjaman" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Ajukan Peminjaman
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <h2 className="text-xl font-semibold text-green-700 mb-3">Tracking Pengajuan</h2>
            <p className="text-gray-600 mb-4">Lacak status pengajuan peminjaman Anda dengan nomor pengajuan</p>
            <Link href="/tracking" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Lacak Pengajuan
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <h2 className="text-xl font-semibold text-green-700 mb-3">Dashboard Kalender</h2>
            <p className="text-gray-600 mb-4">Lihat jadwal peminjaman dan perkuliahan di laboratorium</p>
            <Link href="/dashboard" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Lihat Jadwal
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-green-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Sistem Manajemen Laboratorium. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}