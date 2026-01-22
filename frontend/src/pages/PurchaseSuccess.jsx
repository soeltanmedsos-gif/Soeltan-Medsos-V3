import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { orderApi } from '../services/api';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Check, Download, MessageCircle, ArrowLeft, Package, User, Phone, CreditCard } from 'lucide-react';
import { formatRupiah, getWhatsAppLink } from '../utils/formatters';
import { PageLoader } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PurchaseSuccess() {
  const { purchaseCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [purchaseCode]);

  const loadOrder = async () => {
    try {
      const response = await orderApi.getStatus(purchaseCode);
      setOrder(response.data.data);
    } catch (error) {
      toast.error('Pesanan tidak ditemukan');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(purchaseCode);
    setCopied(true);
    toast.success('Kode pembelian berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    // Create a simple receipt text
    const receiptText = `
═══════════════════════════════════
        BUKTI PEMBELIAN
        SOELTAN MEDSOS
═══════════════════════════════════

Kode Pembelian: ${purchaseCode}
Tanggal: ${new Date(order.created_at).toLocaleString('id-ID')}

DETAIL PEMBELI
───────────────────────────────────
Nama     : ${order.buyer_name || '-'}
WhatsApp : ${order.buyer_phone || '-'}

DETAIL PESANAN
───────────────────────────────────
Produk   : ${order.product?.name || '-'}
Platform : ${order.product?.platform || '-'}
Kategori : ${order.product?.category || '-'}
Jumlah   : ${order.quantity}
Target   : ${order.target_link || '-'}

PEMBAYARAN
───────────────────────────────────
Total    : ${formatRupiah(order.amount)}
Status   : ${order.status === 'paid' ? 'LUNAS' : 'PENDING'}

═══════════════════════════════════
Terima kasih atas kepercayaan Anda!
Hubungi kami: wa.me/6282352835382
═══════════════════════════════════
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bukti-pembelian-${purchaseCode}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Bukti pembelian berhasil diunduh!');
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

  if (loading) return <PageLoader />;

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Kembali Berbelanja</span>
        </button>

        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-500/20">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-slate-400">
            Terima kasih, <span className="text-indigo-400 font-semibold">{order.buyer_name}</span>!
          </p>
        </motion.div>

        {/* Purchase Code Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 mb-6 shadow-2xl"
        >
          <p className="text-white/80 text-sm mb-2 text-center">Kode Pembelian Anda</p>
          <div className="text-center mb-4">
            <code className="text-3xl md:text-4xl font-bold text-white font-mono tracking-wider">
              {purchaseCode}
            </code>
          </div>
          <p className="text-white/70 text-xs text-center mb-4">
            Simpan kode ini untuk melacak pesanan Anda
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCopyCode}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Tersalin!' : 'Salin Kode'}
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Download size={20} />
              Download Bukti
            </button>
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 mb-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Package size={24} className="text-indigo-400" />
            Detail Pesanan
          </h2>
          
          <div className="space-y-4">
            {/* Product Info */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{order.product?.name}</h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                      {order.product?.platform}
                    </span>
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                      {order.product?.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Quantity</p>
                  <p className="text-white font-bold">{order.quantity}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-700 mt-3">
                <p className="text-slate-400 text-sm mb-1">Target/Link:</p>
                <p className="text-white text-sm break-all">{order.target_link}</p>
              </div>
            </div>

            {/* Buyer Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <User size={16} />
                  <span className="text-sm">Nama Pembeli</span>
                </div>
                <p className="text-white font-semibold">{order.buyer_name || '-'}</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Phone size={16} />
                  <span className="text-sm">WhatsApp</span>
                </div>
                <p className="text-white font-semibold">{order.buyer_phone || '-'}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard size={20} className="text-green-400" />
                  <span className="text-white font-semibold">Total Pembayaran</span>
                </div>
                <span className="text-2xl font-bold text-green-400">{formatRupiah(order.amount)}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-green-500/20">
                <p className="text-sm text-slate-400">
                  Status: <span className={`font-semibold ${order.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {order.status === 'paid' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp Confirmation Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleWhatsAppConfirmation}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/25 transition-all flex items-center justify-center gap-3 group"
          >
            <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
            <span>Konfirmasi via WhatsApp Admin</span>
          </button>
          <p className="text-center text-slate-500 text-xs mt-3">
            Klik tombol di atas untuk konfirmasi pesanan langsung ke admin kami
          </p>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4"
        >
          <h3 className="text-blue-400 font-semibold mb-2 text-sm">ℹ️ Informasi Penting</h3>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Simpan kode pembelian untuk melacak status pesanan</li>
            <li>• Proses akan dimulai setelah pembayaran dikonfirmasi</li>
            <li>• Hubungi admin jika ada pertanyaan atau kendala</li>
            <li>• Estimasi waktu proses: 1-24 jam setelah pembayaran</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
