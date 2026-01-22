import { useState, useEffect } from 'react';
import { adminApi, productApi } from '../../services/api';
import { formatRupiah, formatDate, getPaymentStatusInfo, getSellerStatusInfo } from '../../utils/formatters';
import { PageLoader } from '../../components/LoadingSpinner';
import { Search, Eye, X, Phone, User, ExternalLink, Copy, Check, Trash2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // Client-side filtering output
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [search, setSearch] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [copiedPhone, setCopiedPhone] = useState(null); // ID of order whose phone was copied

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadOrders();
  }, [statusFilter, sellerFilter]); 

  // Effect for CLIENT-SIDE filters (Platform)
  useEffect(() => {
    if (platformFilter) {
      setFilteredOrders(orders.filter(o => o.products?.platform === platformFilter));
    } else {
      setFilteredOrders(orders);
    }
  }, [platformFilter, orders]);

  const loadInitialData = async () => {
    await Promise.all([loadOrders(), loadPlatforms()]);
  };

  const loadPlatforms = async () => {
    try {
      const res = await productApi.getPlatforms();
      setPlatforms(res.data.data || []);
    } catch (err) {
      console.error("Failed load platforms");
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getOrders({
        limit: 100, 
        status_payment: statusFilter || undefined,
        status_seller: sellerFilter || undefined,
        search: search || undefined,
      });
      setOrders(response.data.data);
      setFilteredOrders(response.data.data); 
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminApi.updateSellerStatus(orderId, newStatus);
      loadOrders(); 
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status_seller: newStatus });
      }
      toast.success(`Status update: ${newStatus}`);
    } catch (error) {
      toast.error('Gagal update status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await adminApi.updatePaymentStatus(orderId, newStatus);
      loadOrders(); 
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status_payment: newStatus });
      }
      toast.success(`Status pembayaran update: ${newStatus}`);
    } catch (error) {
      toast.error('Gagal update status pembayaran');
    }
  };

  const handleCopyPhone = (phone, id) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(id);
    toast.success('Nomor WA disalin!');
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleDeleteOrder = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Apakah Anda yakin ingin menghapus order ini? Data tidak dapat dikembalikan.')) return;

    try {
      await adminApi.deleteOrder(id);
      toast.success('Order berhasil dihapus');
      loadOrders();
    } catch (error) {
      toast.error('Gagal menghapus order');
    }
  };

  const handleBatchDelete = async (criteria) => {
    const label = criteria === 'week' ? '1 MINGGU' : '1 BULAN';
    const confirmText = prompt(`Konfirmasi HAPUS SEMUA order yang lebih lama dari ${label}?\n\nKetik "DELETE" untuk konfirmasi.`);
    
    if (confirmText !== 'DELETE') return;

    try {
      const res = await adminApi.batchDeleteOrders(criteria);
      toast.success(res.data.message);
      loadOrders();
    } catch (error) {
      toast.error('Gagal menghapus order massal');
    }
  };

  if (loading && orders.length === 0) return <PageLoader />;

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
        <div className="flex justify-between items-end">
          <p className="text-slate-400">Pantau dan kelola pesanan masuk.</p>
          <div className="flex gap-2">
            <button 
              onClick={() => handleBatchDelete('week')}
              className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Hapus {'>'} 1 Minggu
            </button>
            <button 
              onClick={() => handleBatchDelete('month')}
              className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Hapus {'>'} 1 Bulan
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-sm space-y-4">
        {/* ... Search ... */}
         <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input
               type="text"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
               placeholder="Cari kode TRX, nama, atau nomor telepon..."
               className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
             />
          </div>
          <button onClick={loadOrders} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition-all">
             Cari
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="">Semua Status Bayar</option>
              <option value="pending">Pending</option>
              <option value="waiting_payment">Menunggu</option>
              <option value="paid">Paid</option>
              <option value="expire">Expire</option>
            </select>

            <select 
              value={sellerFilter} 
              onChange={(e) => setSellerFilter(e.target.value)} 
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="">Semua Status Pengerjaan</option>
              <option value="pending">Pending</option>
              <option value="process">Process</option>
              <option value="done">Done</option>
            </select>

            <select 
              value={platformFilter} 
              onChange={(e) => setPlatformFilter(e.target.value)} 
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="">Semua Platform</option>
              {platforms.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-5">Kode TRX</th>
                <th className="px-6 py-5">Info Kontak</th>
                <th className="px-6 py-5">Produk</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Pembayaran</th>
                <th className="px-6 py-5">Pengerjaan</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredOrders.length === 0 ? (
                <tr>
                   <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                     {loading ? 'Memuat data...' : 'Tidak ada pesanan ditemukan.'}
                   </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const paymentStatus = getPaymentStatusInfo(order.status_payment);
                  const sellerStatus = getSellerStatusInfo(order.status_seller);
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400 group-hover:text-indigo-300 transition-colors">
                        {order.purchase_code}<br/>
                        <span className="text-[10px] text-slate-600">{formatDate(order.created_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-white font-medium text-xs flex items-center gap-1.5">
                            <User size={12} className="text-slate-500" />
                            {order.buyer_name || 'Guest'}
                          </span>
                          <div className="flex items-center gap-1.5 group/phone cursor-pointer" onClick={(e) => {
                             e.stopPropagation();
                             handleCopyPhone(order.buyer_phone, order.id);
                          }}>
                            <Phone size={12} className="text-slate-500" />
                            <span className="text-slate-400 text-xs font-mono group-hover/phone:text-indigo-400 transition-colors">
                              {order.buyer_phone}
                            </span>
                            {copiedPhone === order.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="opacity-0 group-hover/phone:opacity-100 text-slate-500" />}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium truncate max-w-[150px]">{order.products?.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{order.products?.platform} • x{order.quantity}</div>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-emerald-400">{formatRupiah(order.amount)}</td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${paymentStatus.color === 'badge-success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : paymentStatus.color === 'badge-warning' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                           {paymentStatus.label}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sellerStatus.bgColor} ${sellerStatus.textColor} ${sellerStatus.borderColor}`}>
                           {sellerStatus.label}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={(e) => handleDeleteOrder(order.id, e)} className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-500/30 rounded-lg transition-all" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                        <button onClick={() => setSelectedOrder(order)} className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg transition-all" title="Detail">
                          <Eye size={16} />
                        </button>
                      </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/70 backdrop-blur-sm"
               onClick={() => setSelectedOrder(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-slate-700 my-auto"
            >
              <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0">
                <h2 className="text-xl font-bold text-white">Detail Order</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                
                {/* TRX Code */}
                <div className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">Kode Transaksi</p>
                  <p className="text-2xl font-bold font-mono text-indigo-400 tracking-wider copy-all select-all">{selectedOrder.purchase_code}</p>
                </div>
                
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <span className="text-xs text-slate-500 block mb-1">Pembeli</span>
                    <strong className="text-white text-sm block truncate">{selectedOrder.buyer_name || '-'}</strong>
                    <div className="flex items-center gap-2 mt-1 cursor-pointer group" onClick={() => handleCopyPhone(selectedOrder.buyer_phone, 'modal')}>
                       <Phone size={12} className="text-slate-500" />
                       <span className="text-xs text-slate-400 group-hover:text-indigo-400">{selectedOrder.buyer_phone}</span>
                       <Copy size={10} className="text-slate-600 opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <span className="text-xs text-slate-500 block mb-1">Total Bayar</span>
                    <strong className="text-emerald-400 text-sm font-mono">{formatRupiah(selectedOrder.amount)}</strong>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 col-span-2">
                    <span className="text-xs text-slate-500 block mb-1">Produk</span>
                    <strong className="text-white text-sm">{selectedOrder.products?.name}</strong>
                    <div className="text-xs text-slate-500 mt-1">{selectedOrder.products?.platform} • x{selectedOrder.quantity}</div>
                  </div>
                </div>
                
                {/* Target Link */}
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-500 block mb-2">Target Link</span>
                  <a href={selectedOrder.target_link} target="_blank" className="text-indigo-400 text-sm break-all hover:underline flex items-start gap-2">
                    <ExternalLink size={14} className="mt-0.5 shrink-0" />
                    {selectedOrder.target_link}
                  </a>
                </div>
                
                {selectedOrder.notes && (
                   <div className="p-4 bg-amber-900/10 rounded-xl border border-amber-500/20">
                     <span className="text-xs text-amber-500 block mb-1">Catatan User</span>
                     <p className="text-amber-200 text-sm">{selectedOrder.notes}</p>
                   </div>
                )}
                
                {/* Status Updater */}
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-sm font-medium text-slate-400 mb-3">Update Status Pengerjaan:</p>
                  <div className="flex gap-2">
                    {['pending', 'process', 'done'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${selectedOrder.status_seller === status 
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' 
                          : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Status Payment Updater */}
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-sm font-medium text-slate-400 mb-3">Update Status Pembayaran (Manual):</p>
                  <div className="flex gap-2 flex-wrap">
                    {['pending', 'waiting_payment', 'paid', 'expire'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdatePaymentStatus(selectedOrder.id, status)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedOrder.status_payment === status 
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20' 
                          : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'}`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* WA Button */}
                <a
                  href={`https://wa.me/${selectedOrder.buyer_phone?.replace(/^0/, '62')}?text=Halo,%20pesanan%20dengan%20kode%20${selectedOrder.purchase_code}%20`}
                  target="_blank"
                  className="block w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-center font-bold shadow-lg shadow-green-600/20 transition-all"
                >
                  💬 Hubungi Pembeli (WhatsApp)
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
