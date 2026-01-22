import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { formatRupiah, formatRelativeTime, getPaymentStatusInfo, getSellerStatusInfo } from '../../utils/formatters';
import { PageLoader } from '../../components/LoadingSpinner';
import { ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminApi.getDashboard();
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in pb-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Selamat datang kembali, Admin.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Order" value={data?.totalOrders || 0} icon="🛍️" />
        <StatCard label="Order Hari Ini" value={data?.todayOrders || 0} highlight icon="⚡" />
        <StatCard label="Total Produk" value={data?.totalProducts || 0} icon="📦" />
        <StatCard label="Revenue (Paid)" value={formatRupiah(data?.totalRevenue || 0)} green icon="💰" />
      </div>

      {/* Status Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
             Status Pembayaran
          </h3>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
             {/* Chart */}
             <div className="w-48 h-48 relative shrink-0">
                <SimpleDonutChart 
                  data={data?.paymentStatusCounts || {}} 
                  colors={{
                    paid: '#10b981', // green
                    pending: '#f59e0b', // amber
                    expire: '#ef4444', // red
                    waiting_payment: '#3b82f6', // blue
                  }}
                />
             </div>
             {/* Legend */}
             <div className="w-full space-y-3">
                {Object.entries(data?.paymentStatusCounts || {}).map(([status, count]) => {
                  const info = getPaymentStatusInfo(status);
                  const total = Object.values(data?.paymentStatusCounts || {}).reduce((a, b) => a + b, 0);
                  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                  
                  return (
                    <div key={status} className="flex justify-between items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${info.color.replace('badge-', 'bg-').replace('-green', '-green-500').replace('-yellow', '-amber-500').replace('-red', '-red-500').replace('-blue', '-blue-500').replace('-slate', '-slate-500')}`}></span>
                        <span className="text-sm font-medium text-slate-300 capitalize">{info.label}</span>
                      </div>
                      <div className="text-right">
                         <span className="font-bold text-white block">{count}</span>
                         <span className="text-xs text-slate-500">{percent}%</span>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
            Status Pengerjaan
          </h3>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
             {/* Chart */}
             <div className="w-48 h-48 relative shrink-0">
                <SimpleDonutChart 
                  data={data?.sellerStatusCounts || {}} 
                  colors={{
                    done: '#10b981', // green
                    process: '#3b82f6', // blue
                    pending: '#94a3b8', // slate
                  }}
                />
             </div>
             {/* Legend */}
             <div className="w-full space-y-3">
                {Object.entries(data?.sellerStatusCounts || {}).map(([status, count]) => {
                  const info = getSellerStatusInfo(status);
                  const total = Object.values(data?.sellerStatusCounts || {}).reduce((a, b) => a + b, 0);
                  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

                  return (
                    <div key={status} className="flex justify-between items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="flex items-center gap-3">
                         <span className={`w-3 h-3 rounded-full ${info.color.replace('badge-', 'bg-').replace('-green', '-green-500').replace('-blue', '-blue-500').replace('-amber', '-amber-500').replace('-slate', '-slate-500')}`}></span>
                         <span className="text-sm font-medium text-slate-300 capitalize">{info.label}</span>
                      </div>
                      <div className="text-right">
                         <span className="font-bold text-white block">{count}</span>
                         <span className="text-xs text-slate-500">{percent}%</span>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-lg text-white">Order Terbaru</h3>
          <Link to="/admin/orders" className="text-indigo-400 font-medium text-sm hover:text-indigo-300 flex items-center gap-1">
            Lihat Semua <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
              <tr>
                <th className="pb-4 pl-4">Kode</th>
                <th className="pb-4">Produk</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {data?.recentOrders?.map((order) => {
                const paymentStatus = getPaymentStatusInfo(order.status_payment);
                return (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 pl-4 font-mono text-xs font-medium text-slate-500">{order.purchase_code}</td>
                    <td className="py-4 font-medium text-white">{order.products?.name?.substring(0, 40)}...</td>
                    <td className="py-4 text-emerald-400 font-mono">{formatRupiah(order.amount)}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${paymentStatus.color === 'badge-success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : paymentStatus.color === 'badge-warning' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                        {paymentStatus.label}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 text-xs">{formatRelativeTime(order.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight, green, icon }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-sm flex flex-col justify-between h-40 hover:translate-y-[-4px] transition-all hover:bg-slate-800 group relative overflow-hidden">
      <div className="absolute right-0 top-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">{icon}</div>
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
        <p className={`text-4xl font-extrabold tracking-tight ${highlight ? 'text-indigo-400' : green ? 'text-emerald-400' : 'text-white'}`}>
          {value}
        </p>
      </div>
      <div className={`h-1 w-12 rounded-full mt-auto ${highlight ? 'bg-indigo-500' : green ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
    </div>
  );
}

// Simple SVG Donut Chart Component
function SimpleDonutChart({ data, colors }) {
  const total = Object.values(data).reduce((acc, val) => acc + val, 0);
  let cumulativePercent = 0;

  if (total === 0) return (
     <div className="w-full h-full rounded-full border-4 border-slate-700 flex items-center justify-center text-slate-600 text-xs">No Data</div>
  );

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
      {Object.entries(data).map(([key, value], i) => {
        const percent = value / total;
        const dashArray = percent * 314; // 2 * PI * R (R=50 usually, but here path is centered at 50, radius 40 -> 2*PI*40 = 251. Wait, lets use normalized coords)
        
        // Using standard circle with r=15.9155 to make circumference 100 for easy calc?
        // Let's use simple stroke-dasharray approach on a standard circle.
        // C = 2 * PI * 40 = ~251.
        
        const C = 2 * Math.PI * 40;
        const segmentLength = percent * C;
        const offset = cumulativePercent * C;
        cumulativePercent += percent;
        
        const color = colors[key] || '#94a3b8';

        return (
          <circle
            key={key}
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${segmentLength} ${C}`}
            strokeDashoffset={-offset}
            className="transition-all duration-500"
          />
        );
      })}
       {/* Inner Circle for Donut Effect (optional) */}
    </svg>
  );
}
