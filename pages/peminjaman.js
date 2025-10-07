import { useState } from 'react';
import Head from 'next/head';
import { labs, alatList, bahanList } from '../utils/data';

export default function Peminjaman() {
  const [formData, setFormData] = useState({
    nama: '',
    keperluan: '',
    lab: '',
    alat: [],
    bahan: [],
    surat: '',
    tanggal: '',
    jamMulai: '',
    jamSelesai: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [nomorPengajuan, setNomorPengajuan] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAlatChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, alat: selectedOptions }));
  };

  const handleBahanChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newBahan = [...prev.bahan];
      const index = newBahan.findIndex(item => item.nama === name);
      
      if (index >= 0) {
        newBahan[index].jumlah = value;
      } else {
        newBahan.push({ nama: name, jumlah: value });
      }
      
      return { ...prev, bahan: newBahan };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate nomor pengajuan
    const newNomor = `LAB-${Date.now()}`;
    setNomorPengajuan(newNomor);
    setSubmitted(true);
    
    // Simpan data ke localStorage (dalam implementasi nyata, kirim ke backend)
    const pengajuan = {
      ...formData,
      nomorPengajuan: newNomor,
      status: 'diajukan',
      tanggalPengajuan: new Date().toISOString()
    };
    
    const existingPengajuan = JSON.parse(localStorage.getItem('pengajuan') || '[]');
    localStorage.setItem('pengajuan', JSON.stringify([...existingPengajuan, pengajuan]));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-800 mb-4">Pengajuan Berhasil!</h1>
            <p className="text-gray-600 mb-6">Pengajuan peminjaman laboratorium Anda telah berhasil dikirim.</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-600 mb-2">Nomor Pengajuan:</p>
              <p className="text-xl font-bold text-green-800">{nomorPengajuan}</p>
            </div>
            <p className="text-gray-600 mb-6">Gunakan nomor ini untuk melacak status pengajuan Anda.</p>
            <div className="flex space-x-4 justify-center">
              <a href="/tracking" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                Lacak Pengajuan
              </a>
              <a href="/peminjaman" className="bg-white text-green-600 border border-green-600 px-6 py-2 rounded hover:bg-green-50 transition">
                Ajukan Lagi
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12">
      <Head>
        <title>Form Peminjaman - LabManager</title>
      </Head>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-700 text-white p-6">
            <h1 className="text-2xl font-bold">Form Peminjaman Laboratorium</h1>
            <p className="text-green-100">Isi form berikut untuk mengajukan peminjaman laboratorium</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="nama">Nama Peminjam *</label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="keperluan">Keperluan *</label>
                <input
                  type="text"
                  id="keperluan"
                  name="keperluan"
                  value={formData.keperluan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="lab">Laboratorium *</label>
              <select
                id="lab"
                name="lab"
                value={formData.lab}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Pilih Laboratorium</option>
                {labs.map(lab => (
                  <option key={lab.id} value={lab.nama}>{lab.nama}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="alat">Alat yang Dipinjam (Opsional)</label>
              <select
                id="alat"
                name="alat"
                multiple
                value={formData.alat}
                onChange={handleAlatChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                size="4"
              >
                {alatList.map(item => (
                  <option key={item.id} value={item.nama}>{item.nama}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">Gunakan Ctrl/Cmd untuk memilih beberapa alat</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Bahan Habis Pakai yang Diminta (Opsional)</label>
              <div className="space-y-3">
                {bahanList.map(item => (
                  <div key={item.id} className="flex items-center">
                    <span className="w-1/3">{item.nama} ({item.satuan})</span>
                    <input
                      type="number"
                      name={item.nama}
                      placeholder="Jumlah"
                      onChange={handleBahanChange}
                      className="ml-4 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="surat">Link Surat Peminjaman (Google Drive) *</label>
              <input
                type="url"
                id="surat"
                name="surat"
                value={formData.surat}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://drive.google.com/..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="tanggal">Tanggal Peminjaman *</label>
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="jamMulai">Jam Mulai *</label>
                <input
                  type="time"
                  id="jamMulai"
                  name="jamMulai"
                  value={formData.jamMulai}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="jamSelesai">Jam Selesai *</label>
                <input
                  type="time"
                  id="jamSelesai"
                  name="jamSelesai"
                  value={formData.jamSelesai}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Ajukan Peminjaman
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}