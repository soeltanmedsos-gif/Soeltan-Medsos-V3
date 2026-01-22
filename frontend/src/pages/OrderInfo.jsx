import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';
import OrderStatusCard from '../components/OrderStatusCard';
import Breadcrumb from '../components/Breadcrumb';
import OrderStepper from '../components/OrderStepper';
import { PageLoader } from '../components/LoadingSpinner';
import { formatRupiah, getWhatsAppLink } from '../utils/formatters';
import { AlertTriangle, ArrowLeft, CreditCard, Copy, Check, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function OrderInfo() {
  const { purchaseCode } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [purchaseCode]);

  const loadOrder = async () => {
    try {
      const response = await orderApi.getStatus(purchaseCode);
      setOrder(response.data.data);
    } catch (error) {
      setError('Pesanan tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    try {
      const response = await orderApi.refreshPaymentStatus(purchaseCode);
      setOrder(response.data.data);
      toast.success('Status berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui status');
    } finally {
      setRefreshing(false);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    setError('');

    try {
      const response = await orderApi.createPayment(purchaseCode);
      const { snap_token } = response.data.data;

      // Check if it's a dummy token
      if (snap_token && snap_token.startsWith('DUMMY-TOKEN-')) {
        await handleDummyPayment(purchaseCode, snap_token);
        return;
      }

      // Open Midtrans Snap for real payments
      if (window.snap) {
        window.snap.pay(snap_token, {
          onSuccess: () => loadOrder(),
          onPending: () => loadOrder(),
          onError: (result) => {
            setError('Pembayaran gagal. Silakan coba lagi.');
            console.error('Payment error:', result);
          },
          onClose: () => loadOrder(),
        });
      } else {
        setError('Payment gateway tidak tersedia');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal memproses pembayaran';
      setError(message);
    } finally {
      setPaying(false);
    }
  };

  // Simulate successful payment for dummy mode
  const handleDummyPayment = async (code, token) => {
    const confirm = window.confirm(
      "MODE DUMMY: Simulasikan pembayaran BERHASIL?\n\n(Klik OK untuk Paid, Cancel untuk batal)"
    );

    if (confirm) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        await axios.post(`${API_URL.replace('/api', '')}/api/dev/force-success`, {
           purchase_code: code
        });
        
        alert('Simulasi Sukses! Refreshing...');
        loadOrder();
      } catch (err) {
        console.error('Dev sim error:', err);
        alert('Gagal update status dummy');
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(purchaseCode);
    setCopied(true);
    toast.success('Kode pembelian berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppConfirmation = () => {
    const message = `Halo Admin, saya ingin konfirmasi pesanan:

Kode Pembelian: ${purchaseCode}
Nama: ${order.buyer_name || '-'}
Pesanan: ${order.product?.name || '-'} x ${order.quantity}
Total: ${formatRupiah(order.amount)}

Terima kasih!`;

    const waLink = getWhatsAppLink(message);
    window.open(waLink, '_blank');
  };

  const whatsappMessage = `Halo Admin, saya ingin konfirmasi pesanan dengan kode: ${purchaseCode}`;

  if (loading) return <PageLoader />;
  
  if (error && !order) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/products')} 
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all"
          >
            Lihat Layanan
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </button>

        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Cek Pesanan', to: '/cek-pesanan' },
            { label: purchaseCode }
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Detail Pesanan
          </h1>
          <p className="text-slate-400">Kode: <span className="text-indigo-400 font-mono font-semibold">{purchaseCode}</span></p>
        </motion.div>

        {/* Purchase Code Card with Copy Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-6"
        >
          <div className="text-center mb-4">
            <p className="text-slate-400 text-sm mb-2">Kode Pembelian Anda</p>
            <code className="text-2xl md:text-3xl font-bold text-white font-mono tracking-wider">
              {purchaseCode}
            </code>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopyCode}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-sm border border-white/10"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Tersalin!' : 'Salin Kode'}
            </button>
            <button
              onClick={handleWhatsAppConfirmation}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle size={20} />
              Konfirmasi via WhatsApp
            </button>
          </div>
        </motion.div>

        {/* Order Status Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <OrderStatusCard order={order} onRefresh={handleRefreshStatus} refreshing={refreshing} />
          
          <div className="mt-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 shadow-lg">
            <h3 className="text-white font-semibold mb-4 text-center">Riwayat Status</h3>
            <OrderStepper status={order?.status} />
          </div>
        </motion.div>

        {/* Payment Button */}
        {order?.status === 'pending' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/50"
            >
              <CreditCard size={20} />
              {paying ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center"
        >
          <p className="text-slate-300 mb-3">Butuh bantuan dengan pesanan ini?</p>
          <a
            href={getWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Hubungi Admin
          </a>
        </motion.div>
      </div>
    </div>
  );
}
