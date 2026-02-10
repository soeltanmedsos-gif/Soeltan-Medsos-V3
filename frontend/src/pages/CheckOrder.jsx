import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderApi } from '../services/api';
import OrderStatusCard from '../components/OrderStatusCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button, Input } from '../components/ui';
import { Search, PackageSearch, CreditCard, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeMidtrans } from '../utils/midtransHelper';
import { 
  getWhatsAppLink, 
  formatRupiah, 
  formatDate, 
  getPaymentStatusInfo, 
  getSellerStatusInfo 
} from '../utils/formatters';
import toast from 'react-hot-toast';

export default function CheckOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [purchaseCode, setPurchaseCode] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Auto-load if code is in URL query params
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setPurchaseCode(codeFromUrl.toUpperCase());
      handleSearch(codeFromUrl.toUpperCase());
    }
    
    // Initialize Midtrans mobile enhancements
    if (window.snap) {
      initializeMidtrans();
    } else {
      // Wait for Snap to load
      const checkSnap = setInterval(() => {
        if (window.snap) {
          initializeMidtrans();
          clearInterval(checkSnap);
        }
      }, 500);
      
      setTimeout(() => clearInterval(checkSnap), 10000);
    }
  }, [searchParams]);

  const handleSearch = async (code) => {
    if (!code.trim()) return;

    setOrder(null);
    setLoading(true);

    try {
      const cleanCode = code.toUpperCase().trim();
      const response = await orderApi.getStatus(cleanCode);
      setOrder(response.data.data);
      toast.success('Pesanan ditemukan!');
    } catch (error) {
      toast.error('Pesanan tidak ditemukan. Pastikan kode pembelian benar.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSearch(purchaseCode);
  };

  const handlePayNow = async () => {
    if (!order) return;
    
    setPaymentLoading(true);
    
    try {
      const response = await orderApi.createPayment(order.purchase_code);
      const { snap_token } = response.data.data;
      
      if (snap_token && window.snap) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        window.snap.pay(snap_token, {
          // Mobile-optimized configuration
          skipOrderSummary: false,
          gopayMode: isMobile ? 'deeplink' : 'redirect',
          language: 'id',
          
          onSuccess: function(result) {
            console.log('Payment success:', result);
            toast.success('Pembayaran berhasil!');
            // Refresh order status
            handleSearch(order.purchase_code);
          },
          onPending: function(result) {
            console.log('Payment pending:', result);
            toast.info('Pembayaran pending. Silakan selesaikan pembayaran.');
          },
          onError: function(result) {
            console.error('Payment error:', result);
            toast.error('Pembayaran gagal. Silakan coba lagi.');
          },
          onClose: function() {
            console.log('Snap popup closed');
            // Mobile-friendly message - don't assume cancellation
            if (isMobile) {
              toast.info('Status pembayaran akan diperbarui otomatis');
              handleSearch(order.purchase_code);
            } else {
              toast.info('Pembayaran dibatalkan.');
            }
          }
        });
      } else {
        toast.error('Payment gateway tidak tersedia');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Gagal memulai pembayaran');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleViewDetail = () => {
    if (order) {
      navigate(`/order/${order.purchase_code}`);
    }
  };

  // Check if order needs payment
  const needsPayment = order && (
    Array.isArray(order) 
      ? order.some(o => ['pending', 'waiting_payment'].includes(o.status_payment))
      : ['pending', 'waiting_payment'].includes(order.status_payment)
  );

  return (
    <div className="min-h-screen bg-slate-900 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/50"
          >
            <PackageSearch size={40} className="text-white" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Cek Status <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Pesanan</span>
          </h1>
          <p className="text-slate-400">Masukkan kode pesanan Anda (Contoh: SM-XXXXXXXX)</p>
        </div>

        {/* Search Form */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 shadow-xl mb-6"
        >
          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Kode Pembelian (UID)
            </label>
            <div className="flex gap-3">
              <Input
                type="text"
                value={purchaseCode}
                onChange={(e) => setPurchaseCode(e.target.value.toUpperCase())}
                placeholder="SM-ABC12345 / TRX-..."
                className="flex-1 bg-slate-900/50 border-slate-600 text-white font-mono text-lg tracking-wider uppercase placeholder:text-slate-600 focus:border-indigo-500"
                maxLength={40}
              />
              <Button 
                type="submit" 
                disabled={loading ||!purchaseCode.trim()} 
                className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg"
              >
                {loading ? <LoadingSpinner size="sm" /> : <Search size={20} />}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              💡 Kode pembelian dikirim via email/WhatsApp setelah pembayaran
            </p>
          </form>

        <AnimatePresence mode="wait">
          {order && (
            <motion.div 
               key={Array.isArray(order) ? 'group' : 'single'}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-4"
            >
              {Array.isArray(order) ? (
                <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Group Header */}
                  <div className="p-5 border-b border-slate-700 bg-slate-900/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Grup Transaksi</span>
                      <span className="text-[10px] text-slate-500 font-mono tracking-tighter">{formatDate(order[0].created_at)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white font-mono tracking-tight">{order[0].midtrans_order_id}</h3>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-slate-700/50 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {order.map((item, idx) => {
                      const pStatus = getPaymentStatusInfo(item.status_payment);
                      const sStatus = getSellerStatusInfo(item.status_seller);
                      return (
                        <div key={item.id || idx} className="p-4 flex items-center gap-4 hover:bg-slate-700/20 transition-colors">
                          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700 shrink-0">
                            <span className="text-[10px] font-black text-slate-500 uppercase">{item.product?.platform?.substring(0, 2)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate">{item.product?.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded leading-none border ${
                                pStatus.color === 'badge-paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                              }`}>
                                {pStatus.label}
                              </span>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded leading-none border ${sStatus.bgColor} ${sStatus.textColor} ${sStatus.borderColor}`}>
                                {sStatus.label}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-indigo-400">{formatRupiah(item.amount)}</p>
                            <button 
                              onClick={() => navigate(`/order/${item.purchase_code}`)}
                              className="text-[9px] font-bold text-slate-500 hover:text-white underline mt-1 block"
                            >
                              Detail
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Group Footer */}
                  <div className="p-5 bg-slate-900/30 border-t border-slate-700 space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-slate-400 text-sm">Total Transaksi</span>
                      <span className="text-2xl font-black text-white">{formatRupiah(order.reduce((acc, curr) => acc + curr.amount, 0))}</span>
                    </div>

                    <a
                      href={getWhatsAppLink(`Halo Admin, saya ingin konfirmasi transaksi grup: ${order[0].midtrans_order_id}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all"
                    >
                      <MessageCircle size={20} />
                      <span>Konfirmasi via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <OrderStatusCard order={order} onViewDetail={handleViewDetail} />
                </div>
              )}
              
              {/* Payment Button if needed */}
              {needsPayment && (
                <Button
                  onClick={handlePayNow}
                  disabled={paymentLoading}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Bayar Sekarang</span>
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center"
        >
          <p className="text-slate-300 text-sm">
            Tidak menemukan kode pesanan?{' '}
            <a 
              href="https://wa.me/6282352835382" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
            >
              Hubungi Support
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
