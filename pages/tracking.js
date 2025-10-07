import { useState } from 'react';
import Head from 'next/head';

export default function Tracking() {
  const [nomorPengajuan, setNomorPengajuan] = useState('');
  const [pengajuan, setPengajuan] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Ambil data dari localStorage (dalam implementasi nyata, ambil dari backend)
    const existingPengajuan = JSON.parse(localStorage.getItem('pengajuan') || '[]');
    const found = existingPengajuan.find(p => p.nomorPengajuan === nomorPengajuan);
    
    if (found) {
      setPengajuan(found);
      setNotFound(false);
    } else {
      setPengajuan(null);
      setNotFound(true);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'diajukan': return 'bg-yellow-100 text-yellow-800';
      case 'diterima': return 'bg-green-100 text-green-800';
      case 'ditolak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'diajukan': return 'Diajukan';
      case 'diterima': return 'Diterima';
      case 'ditolak': return 'Ditolak';
      default: return 'Tidak Diketahui';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12">
      <Head>
        <title>Tracking Pengajuan - LabManager</title>
      </Head>

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-green-700 text-white p-6">
              <h1 className="text-2xl font-bold">Lacak Pengajuan Peminjaman</h1>
              <p className="text-green-100">Masukkan nomor pengajuan untuk melihat status peminjaman</p>
            </div>

            <form onSubmit={handleSearch} className="p-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={nomorPengajuan}
                  onChange={(e) => setNomorPengajuan(e.target.value)}
                  placeholder="Masukkan nomor pengajuan (contoh: LAB-123456)"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Cari
                </button>
              </div>
            </form>
          </div>

          {notFound && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-red-500 text-4xl mb-4">❌</div>
              <h2 className="text-xl font-bold text-red-700 mb-2">Pengajuan Tidak Ditemukan</h2>
              <p className="text-gray-600">Nomor pengajuan yang Anda masukkan tidak ditemukan. Pastikan nomor pengajuan benar.</p>
            </div>
          )}

          {pengajuan && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-700 text-white p-6">
                <h2 className="text-xl font-bold">Detail Pengajuan</h2>
                <p className="text-green-100">Nomor: {pengajuan.nomorPengajuan}</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pengajuan.status)}`}>
                    {getStatusText(pengajuan.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Nama Peminjam:</p>
                    <p>{pengajuan.nama}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Keperluan:</p>
                    <p>{pengajuan.keperluan}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Laboratorium:</p>
                    <p>{pengajuan.lab}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Tanggal Pengajuan:</p>
                    <p>{new Date(pengajuan.tanggalPengajuan).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Waktu Peminjaman:</p>
                    <p>{new Date(pengajuan.tanggal).toLocaleDateString('id-ID')} {pengajuan.jamMulai} - {pengajuan.jamSelesai}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Surat Peminjaman:</p>
                    <a href={pengajuan.surat} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      Lihat Surat
                    </a>
                  </div>
                </div>

                {pengajuan.alat && pengajuan.alat.length > 0 && (
                  <div>
                    <p className="font-semibold">Alat yang Dipinjam:</p>
                    <ul className="list-disc list-inside">
                      {pengajuan.alat.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {pengajuan.bahan && pengajuan.bahan.filter(b => b.jumlah > 0).length > 0 && (
                  <div>
                    <p className="font-semibold">Bahan yang Diminta:</p>
                    <ul className="list-disc list-inside">
                      {pengajuan.bahan
                        .filter(b => b.jumlah > 0)
                        .map((item, index) => (
                          <li key={index}>{item.nama}: {item.jumlah}</li>
                        ))
                      }
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}