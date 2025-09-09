import { useEffect, useState } from "react";

interface DashboardProps {
    token: string | null;
    apiUrl: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token, apiUrl }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
        renderChart(data.product_sales);
      } else {
        console.error('Gagal mengambil data dashboard: ' + data.message);
      }
    } catch (error) {
      console.error('Gagal terhubung ke server.');
    }
  };

  const renderChart = (salesData: any[]) => {
    const ctx = document.getElementById('sales-chart') as HTMLCanvasElement;
    if (!ctx) return;
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: salesData.map(d => d.name),
        datasets: [{
          label: 'Penjualan per Produk',
          data: salesData.map(d => d.total_sold),
          backgroundColor: ['#3B82F6', '#10B981', '#F97316'],
          borderColor: ['#1E40AF', '#065F46', '#9A3412'],
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } },
      },
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-500">Total Omset Hari Ini</h4>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(dashboardData.today_omset)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-500">Total Omset Bulan Ini</h4>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(dashboardData.month_omset)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-500">Total Unit Terjual</h4>
            <p className="text-3xl font-bold text-blue-600">{dashboardData.total_units_sold} unit</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-500">Produk Terlaris</h4>
            <p className="text-3xl font-bold text-blue-600">{dashboardData.best_selling_product || 'N/A'}</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Grafik Penjualan Produk</h3>
        <canvas id="sales-chart"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;