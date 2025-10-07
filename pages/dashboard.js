import { useState } from 'react';
import Head from 'next/head';
import { labs, kelas, getAgenda } from '../utils/data';

export default function Dashboard() {
  const [selectedLab, setSelectedLab] = useState(labs[0]?.nama || '');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Generate hours from 06:00 to 21:00
  const hours = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 6;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Adjust for Monday as first day of week
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  // Generate days array
  const days = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Get agenda for selected lab
  const agenda = getAgenda(selectedLab, currentMonth, currentYear);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <Head>
        <title>Dashboard - LabManager</title>
      </Head>

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-green-700 text-white p-6">
            <h1 className="text-2xl font-bold">Dashboard Kalender Laboratorium</h1>
            <p className="text-green-100">Lihat jadwal peminjaman dan perkuliahan di laboratorium</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="lab">Pilih Laboratorium:</label>
                <select
                  id="lab"
                  value={selectedLab}
                  onChange={(e) => setSelectedLab(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {labs.map(lab => (
                    <option key={lab.id} value={lab.nama}>{lab.nama}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                >
                  ‹
                </button>
                <h2 className="text-xl font-bold text-green-800">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full bg-white border border-gray-200 rounded-lg">
                {/* Calendar Header */}
                <div className="grid grid-cols-8 border-b border-gray-200">
                  <div className="p-3 font-semibold text-gray-700 border-r border-gray-200">Waktu</div>
                  {dayNames.map(day => (
                    <div key={day} className="p-3 font-semibold text-gray-700 text-center border-r border-gray-200 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Body */}
                <div className="grid grid-cols-8">
                  {/* Time Column */}
                  <div className="border-r border-gray-200">
                    {hours.map(hour => (
                      <div key={hour} className="h-16 border-b border-gray-200 p-2 text-sm text-gray-500">
                        {hour}
                      </div>
                    ))}
                  </div>

                  {/* Days Columns */}
                  {Array.from({ length: 7 }).map((_, dayIndex) => (
                    <div key={dayIndex} className="border-r border-gray-200 last:border-r-0">
                      {hours.map(hour => (
                        <div key={`${dayIndex}-${hour}`} className="h-16 border-b border-gray-200 p-1 relative">
                          {/* Render agenda items */}
                          {agenda.map((item, idx) => {
                            const itemDate = new Date(item.tanggal);
                            const itemDay = itemDate.getDate();
                            const itemDayOfWeek = itemDate.getDay();
                            const adjustedItemDayOfWeek = itemDayOfWeek === 0 ? 6 : itemDayOfWeek - 1;
                            
                            // Check if this agenda item should be displayed in this cell
                            if (
                              itemDate.getMonth() === currentMonth &&
                              itemDate.getFullYear() === currentYear &&
                              adjustedItemDayOfWeek === dayIndex &&
                              days[dayIndex] === itemDay &&
                              item.jamMulai <= hour && 
                              item.jamSelesai > hour
                            ) {
                              const isPeminjaman = item.tipe === 'peminjaman';
                              const bgColor = isPeminjaman ? 'bg-green-100 border-green-300' : 'bg-blue-100 border-blue-300';
                              const textColor = isPeminjaman ? 'text-green-800' : 'text-blue-800';
                              
                              return (
                                <div 
                                  key={idx}
                                  className={`absolute inset-1 border-l-2 ${bgColor} ${textColor} p-1 text-xs rounded overflow-hidden`}
                                  title={`${item.nama} (${item.jamMulai} - ${item.jamSelesai})`}
                                >
                                  <div className="font-semibold truncate">{item.nama}</div>
                                  <div className="truncate">{item.jamMulai} - {item.jamSelesai}</div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border-l-2 border-green-300 mr-2"></div>
                <span className="text-sm text-gray-600">Peminjaman</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 border-l-2 border-blue-300 mr-2"></div>
                <span className="text-sm text-gray-600">Kelas Perkuliahan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}