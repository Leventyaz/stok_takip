'use client';

import { useEffect, useState } from 'react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Istatistikler() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const categoryData = {
    labels: ['Elektronik', 'Telefon', 'Yazıcı', 'Aksesuar', 'Hırdavat'],
    datasets: [
      {
        label: 'Kategori Bazında Stok Miktarı',
        data: [25, 15, 8, 12, 120],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const stockMovementData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Stok Girişleri',
        data: [12, 19, 8, 15, 10, 20],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Stok Çıkışları',
        data: [5, 15, 10, 8, 12, 15],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const topProductsData = {
    labels: ['Laptop Dell XPS 13', 'Samsung Galaxy S21', 'HP LaserJet', 'LG 4K Monitor', 'Logitech MX Keys'],
    datasets: [
      {
        label: 'Toplam Değer (₺)',
        data: [75000, 24000, 16000, 35000, 6000],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">İstatistikler</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Kategori Bazında Stok Dağılımı</h2>
          <div className="h-80">
            <Pie data={categoryData} options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                }
              }
            }} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Aylık Stok Hareketleri</h2>
          <div className="h-80">
            <Line data={stockMovementData} options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-800 mb-4">En Değerli Ürünler</h2>
          <div className="h-80">
            <Bar data={topProductsData} options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return value + ' ₺';
                    }
                  }
                }
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.parsed.y.toLocaleString()} ₺`;
                    }
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>
    </div>
  );
} 