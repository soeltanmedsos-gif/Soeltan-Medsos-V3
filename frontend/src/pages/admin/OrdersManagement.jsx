import { useState, useEffect } from 'react';
import { adminApi, productApi } from '../../services/api';
import { formatRupiah, formatDate, getPaymentStatusInfo, getSellerStatusInfo, shortenLink } from '../../utils/formatters';
import { PageLoader } from '../../components/LoadingSpinner';
import { Search, Eye, X, Phone, User, ExternalLink, Copy, Check, Trash2, Calendar, Image as ImageIcon } from 'lucide-react';
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
      setFilteredOrders((orders || []).filter(o => o.products?.platform === platformFilter));
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
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Grouping logic derived from filteredOrders
  const groupedOrders = (() => {
    const groups = {};
    (filteredOrders || []).forEach(order => {
      const gId = order.midtrans_order_id || order.purchase_code;
      if (!groups[gId]) {
        groups[gId] = {
          ...order,
          id: gId, // Virtual ID for the group
          items: [],
          totalAmount: 0,
          productNames: []
        };
      }
      groups[gId].items.push(order);
      groups[gId].totalAmount += order.amount;
      if (order.products?.name) groups[gId].productNames.push(order.products.name);
    });
    return Object.values(groups);
  })();

  const handleUpdateStatus = async (group, newStatus) => {
    try {
      const items = group.items || [group];
      await Promise.all(items.map(item => adminApi.updateSellerStatus(item.id, newStatus)));
      loadOrders(); 
      if (selectedOrder?.id === group.id) {
        setSelectedOrder({ ...selectedOrder, status_seller: newStatus });
        // Update individual items in selectedOrder for accurate modal view
        const updatedItems = selectedOrder.items.map(it => ({ ...it, status_seller: newStatus }));
        setSelectedOrder({ ...selectedOrder, status_seller: newStatus, items: updatedItems });
      }
      toast.success(`Status update: ${newStatus}`);
    } catch (error) {
      toast.error('Gagal update status');
    }
  };

  const handleUpdatePaymentStatus = async (group, newStatus) => {
    try {
      const items = group.items || [group];
      await Promise.all(items.map(item => adminApi.updatePaymentStatus(item.id, newStatus)));
      loadOrders(); 
      if (selectedOrder?.id === group.id) {
        const updatedItems = selectedOrder.items.map(it => ({ ...it, status_payment: newStatus }));
        setSelectedOrder({ ...selectedOrder, status_payment: newStatus, items: updatedItems });
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

  const handleDeleteOrder = async (group, e) => {
    e.stopPropagation();
    const isGroup = (group.items || []).length > 1;
    const confirmMsg = isGroup 
      ? `Hapus SEMUA (${group.items.length}) item dalam transaksi ini?`
      : 'Apakah Anda yakin ingin menghapus order ini?';
      
    if (!window.confirm(confirmMsg)) return;

    try {
      const items = group.items || [group];
      await Promise.all(items.map(item => adminApi.deleteOrder(item.id)));
      toast.success('Pesanan berhasil dihapus');
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
                <th className="px-6 py-5">Kode / Tgl</th>
                <th className="px-6 py-5">Pemesan (WA)</th>
                <th className="px-6 py-5">Item Pesanan</th>
                <th className="px-6 py-5">Pembayaran</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {groupedOrders.length === 0 ? (
                <tr>
                   <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                     {loading ? 'Memuat data...' : 'Tidak ada pesanan ditemukan.'}
                   </td>
                </tr>
              ) : (
                groupedOrders.map((group) => {
                  const paymentStatus = getPaymentStatusInfo(group.status_payment);
                  const sellerStatus = getSellerStatusInfo(group.status_seller);
                  const isManual = group.snap_token === 'MANUAL';
                  const isGroup = group.items.length > 1;

                  return (
                    <tr key={group.id} className="hover:bg-slate-800/50 transition-colors group">
                      {/* 1. Kode / Tgl */}
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-indigo-400 font-bold tracking-wider">
                          {group.midtrans_order_id || group.purchase_code}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">{formatDate(group.created_at)}</div>
                      </td>

                      {/* 2. Customer Name & WA */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-semibold text-xs">{group.buyer_name || 'Guest'}</span>
                          <div 
                            className="flex items-center gap-1.5 text-slate-400 text-xs font-mono cursor-pointer hover:text-indigo-400 mt-0.5 group/wa"
                            onClick={() => handleCopyPhone(group.buyer_phone, group.id)}
                          >
                            <Phone size={10} className="text-slate-600 group-hover/wa:text-indigo-400" />
                            <span>{group.buyer_phone}</span>
                            {copiedPhone === group.id ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="opacity-0 group-hover/wa:opacity-100 text-slate-600" />}
                          </div>
                        </div>
                      </td>

                      {/* 3. Produk Detail */}
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          {group.items.map((item, idx) => (
                            <div key={item.id} className="flex flex-col">
                              <span className="text-white font-medium text-xs leading-tight">
                                {item.products?.name}
                              </span>
                              <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className="bg-indigo-500/10 text-indigo-400 px-1 rounded border border-indigo-500/20 leading-none py-0.5 font-bold uppercase">
                                  {item.products?.platform || '-'}
                                </span>
                                <span>x{item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* 4. Pembayaran (Method & Status) */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2">
                              {/* Method Label */}
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded leading-none ${isManual ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                {isManual ? 'MANUAL' : 'MIDTRANS'}
                              </span>
                              {/* Status Badge */}
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border leading-none ${
                                paymentStatus.color === 'badge-paid' || paymentStatus.color === 'badge-success' 
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                  : paymentStatus.color === 'badge-pending' || paymentStatus.color === 'badge-waiting' || paymentStatus.color === 'badge-warning'
                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                                    : 'bg-slate-800 text-slate-500 border-slate-700'
                              }`}>
                                {paymentStatus.label}
                              </span>
                           </div>
                           
                           {/* Amount and Proof Link */}
                           <div className="flex items-center justify-between mt-1">
                              <span className="text-[11px] font-mono font-bold text-emerald-400">{formatRupiah(group.totalAmount || 0)}</span>
                              {isManual && group.snap_redirect_url && (
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setSelectedOrder(group); 
                                  }}
                                  className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 hover:border-indigo-400/50 rounded-md transition-all duration-300 group/bukti shadow-sm"
                                  title="Lihat Bukti Pembayaran"
                                >
                                  <ImageIcon size={10} className="group-hover/bukti:scale-110 transition-transform" />
                                  <span className="text-[9px] font-black uppercase tracking-wider">Bukti</span>
                                </button>
                              )}
                           </div>
                        </div>
                      </td>

                      {/* 5. Seller Status */}
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${sellerStatus.bgColor} ${sellerStatus.textColor} ${sellerStatus.borderColor}`}>
                           {sellerStatus.label}
                         </span>
                      </td>

                      {/* 6. Action */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={(e) => handleDeleteOrder(group, e)} className="p-2 bg-slate-900/50 hover:bg-red-500/20 text-slate-500 hover:text-red-500 border border-slate-700/50 hover:border-red-500/30 rounded-lg transition-all shadow-sm">
                            <Trash2 size={15} />
                          </button>
                          <button onClick={() => setSelectedOrder(group)} className="p-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-600/20 rounded-lg transition-all shadow-sm">
                            <Eye size={15} />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
               onClick={() => setSelectedOrder(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden border border-slate-700/50 flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                   <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                   Detail Transaksi
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                
                {/* TRX Code */}
                <div className="bg-slate-800/80 p-5 rounded-2xl text-center border border-indigo-500/20 shadow-inner">
                  <p className="text-[10px] font-black text-indigo-500 mb-2 uppercase tracking-[0.2em]">Kode Transaksi</p>
                  <p className="text-lg md:text-xl font-bold font-mono text-white tracking-widest break-all select-all selection:bg-indigo-500/30">
                    {selectedOrder.midtrans_order_id || selectedOrder.purchase_code}
                  </p>
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
                    <strong className="text-emerald-400 text-sm font-mono">{formatRupiah(selectedOrder.totalAmount || selectedOrder.amount)}</strong>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Search size={12} /> Daftar Item ({(selectedOrder.items || []).length || 1})
                  </span>
                  <div className="space-y-3">
                    {(selectedOrder.items || [selectedOrder]).map((item, idx) => (
                      <div key={item.id} className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                           <div className="max-w-[70%]">
                              <div className="text-white font-bold text-sm leading-tight">{item.products?.name}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{item.products?.platform} • <span className="text-indigo-400">x{item.quantity}</span></div>
                           </div>
                           <div className="text-emerald-400 font-mono font-bold text-xs">{formatRupiah(item.amount)}</div>
                        </div>
                        
                        {/* Target Link for Item */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
                           <span className="text-[9px] text-slate-600 font-bold uppercase">Target:</span>
                           <a 
                             href={item.target_link} 
                             target="_blank" 
                             rel="noreferrer"
                             className="text-indigo-400 text-[10px] truncate hover:underline flex items-center gap-1"
                             title={item.target_link}
                           >
                              <ExternalLink size={10} className="shrink-0" /> 
                              {shortenLink(item.target_link, 35)}
                           </a>
                        </div>

                        {item.notes && (
                           <div className="mt-2 p-2 bg-amber-900/5 rounded-lg border border-amber-900/20">
                              <p className="text-amber-200/70 text-[10px] leading-relaxed italic">"{item.notes}"</p>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manual Payment Proof */}
                {selectedOrder.snap_token === 'MANUAL' && selectedOrder.snap_redirect_url && (
                   <div className="space-y-4 p-5 bg-indigo-500/5 rounded-3xl border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                           <ImageIcon size={14} className="text-indigo-500" /> Bukti Pembayaran Manual
                        </span>
                        <button 
                          onClick={() => window.open(selectedOrder.snap_redirect_url, '_blank')}
                          className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 rounded-full text-[9px] font-black uppercase tracking-wider transition-all"
                        >
                          Buka Tab Baru
                        </button>
                      </div>
                      <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-video flex items-center justify-center">
                         <img 
                           src={selectedOrder.snap_redirect_url} 
                           alt="Bukti Pembayaran" 
                           className="max-w-full max-h-full object-contain cursor-zoom-in group-hover:scale-105 transition-transform duration-500"
                           onClick={() => window.open(selectedOrder.snap_redirect_url, '_blank')}
                         />
                      </div>
                   </div>
                )}
                
                {/* Status Updater */}
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-sm font-medium text-slate-400 mb-3">Update Status Pengerjaan:</p>
                  <div className="flex gap-2">
                    {['pending', 'process', 'done'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder, status)}
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
                        onClick={() => handleUpdatePaymentStatus(selectedOrder, status)}
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
