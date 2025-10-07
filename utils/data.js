// Sample data for the application
export const labs = [
  { id: 1, nama: 'Lab Komputer A', lokasi: 'Gedung A Lantai 1', kapasitas: 30 },
  { id: 2, nama: 'Lab Komputer B', lokasi: 'Gedung A Lantai 1', kapasitas: 25 },
  { id: 3, nama: 'Lab Jaringan', lokasi: 'Gedung B Lantai 2', kapasitas: 20 },
  { id: 4, nama: 'Lab Multimedia', lokasi: 'Gedung C Lantai 1', kapasitas: 15 },
];

export const alatList = [
  { id: 1, nama: 'Laptop', deskripsi: 'Laptop untuk praktikum', dokumen: 'https://drive.google.com/link-dokumen-alat-1' },
  { id: 2, nama: 'Proyektor', deskripsi: 'Proyektor untuk presentasi', dokumen: 'https://drive.google.com/link-dokumen-alat-2' },
  { id: 3, nama: 'Mikroskop', deskripsi: 'Mikroskop digital', dokumen: 'https://drive.google.com/link-dokumen-alat-3' },
  { id: 4, nama: 'Osiloskop', deskripsi: 'Osiloskop digital', dokumen: 'https://drive.google.com/link-dokumen-alat-4' },
  { id: 5, nama: 'Multimeter', deskripsi: 'Alat ukur listrik', dokumen: 'https://drive.google.com/link-dokumen-alat-5' },
];

export const bahanList = [
  { id: 1, nama: 'Kertas A4', deskripsi: 'Kertas HVS A4', satuan: 'rim', dokumen: 'https://drive.google.com/link-dokumen-bahan-1' },
  { id: 2, nama: 'Tinta Printer', deskripsi: 'Tinta printer warna', satuan: 'botol', dokumen: 'https://drive.google.com/link-dokumen-bahan-2' },
  { id: 3, nama: 'Pensil', deskripsi: 'Pensil 2B', satuan: 'lusin', dokumen: 'https://drive.google.com/link-dokumen-bahan-3' },
  { id: 4, nama: 'Baterai AA', deskripsi: 'Baterai alkaline AA', satuan: 'buah', dokumen: 'https://drive.google.com/link-dokumen-bahan-4' },
];

export const kelas = [
  { 
    id: 1, 
    nama: 'Praktikum Basis Data', 
    lab: 'Lab Komputer A', 
    hari: 'Senin', 
    jamMulai: '08:00', 
    jamSelesai: '10:00',
    dosen: 'Dr. Ahmad',
    semester: 'Ganjil 2023/2024'
  },
  { 
    id: 2, 
    nama: 'Praktikum Jaringan Komputer', 
    lab: 'Lab Jaringan', 
    hari: 'Selasa', 
    jamMulai: '10:00', 
    jamSelesai: '12:00',
    dosen: 'Dr. Sari',
    semester: 'Ganjil 2023/2024'
  },
  { 
    id: 3, 
    nama: 'Praktikum Multimedia', 
    lab: 'Lab Multimedia', 
    hari: 'Rabu', 
    jamMulai: '13:00', 
    jamSelesai: '15:00',
    dosen: 'Dr. Budi',
    semester: 'Ganjil 2023/2024'
  },
];

// Function to generate agenda data
export const getAgenda = (lab, month, year) => {
  // In a real app, this would fetch from an API
  // For demo, we'll generate some sample data
  
  const agenda = [];
  
  // Add kelas
  kelas.filter(k => k.lab === lab).forEach(k => {
    // Convert hari to date (simplified - in real app would use proper date logic)
    const dayMap = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6, 'Minggu': 0 };
    const baseDate = new Date(year, month, 1);
    
    // Find the first occurrence of this day in the month
    let date = new Date(baseDate);
    while (date.getDay() !== dayMap[k.hari] && date.getMonth() === month) {
      date.setDate(date.getDate() + 1);
    }
    
    // Add this class for each week of the month
    while (date.getMonth() === month) {
      agenda.push({
        id: `kelas-${k.id}-${date.getDate()}`,
        nama: k.nama,
        lab: k.lab,
        tanggal: new Date(date),
        jamMulai: k.jamMulai,
        jamSelesai: k.jamSelesai,
        tipe: 'kelas',
        dosen: k.dosen
      });
      
      date.setDate(date.getDate() + 7);
    }
  });
  
  // Add peminjaman from localStorage
  try {
    const peminjaman = JSON.parse(localStorage.getItem('pengajuan') || '[]');
    peminjaman
      .filter(p => p.lab === lab && p.status === 'diterima')
      .forEach(p => {
        const tanggal = new Date(p.tanggal);
        if (tanggal.getMonth() === month && tanggal.getFullYear() === year) {
          agenda.push({
            id: p.nomorPengajuan,
            nama: `${p.keperluan} - ${p.nama}`,
            lab: p.lab,
            tanggal: tanggal,
            jamMulai: p.jamMulai,
            jamSelesai: p.jamSelesai,
            tipe: 'peminjaman',
            alat: p.alat,
            bahan: p.bahan
          });
        }
      });
  } catch (e) {
    console.error('Error loading peminjaman data:', e);
  }
  
  return agenda;
};