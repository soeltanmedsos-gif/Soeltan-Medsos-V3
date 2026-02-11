import { 
  formatRupiah, 
  formatDate, 
  getPaymentStatusInfo, 
  getSellerStatusInfo,
  getWhatsAppLink 
} from '../utils/formatters';
import { Loader2 } from 'lucide-react';

export default function OrderStatusCard({ order, onRefresh, refreshing }) {
  const paymentStatus = getPaymentStatusInfo(order.status_payment);
  const sellerStatus = getSellerStatusInfo(order.status_seller);

  const whatsappMessage = `Halo Admin, saya ingin mengecek pesanan dengan kode: ${order.purchase_code}`;

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
           <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
           Detail Pesanan
        </h2>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{formatDate(order.created_at)}</span>
      </div>

      <div className="space-y-6">
        {/* Purchase Code */}
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-700/50 text-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Kode Pembelian</p>
          <p className="text-2xl font-black text-white font-mono tracking-wider break-all">
            {order.purchase_code}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Info */}
            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Produk</p>
                <p className="font-bold text-slate-100 text-sm">{order.product?.name}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{order.product?.platform}</p>
            </div>

            {/* Amount */}
            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Pembayaran</p>
                <p className="text-xl font-black text-indigo-400">{formatRupiah(order.amount)}</p>
            </div>
        </div>

        {/* Status Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Penyelesaian Pay</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-sm ${
              paymentStatus.color === 'badge-paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
              paymentStatus.color === 'badge-waiting' || paymentStatus.color === 'badge-pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
              paymentStatus.color === 'badge-expire' || paymentStatus.color === 'badge-deny' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
              'bg-slate-700/50 text-slate-400 border-slate-600'
            }`}>
              {paymentStatus.label}
            </span>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Status Pengerjaan</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-sm ${sellerStatus.bgColor} ${sellerStatus.textColor} ${sellerStatus.borderColor}`}>
              {sellerStatus.label}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 gap-3 flex flex-col">
          {order.status_payment !== 'paid' && order.status_payment !== 'expire' && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="w-full bg-slate-700/50 hover:bg-slate-700 text-white py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-600 active:scale-95 disabled:opacity-50"
            >
              {refreshing ? (
                <>
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                  Memeriksa...
                </>
              ) : (
                <>
                  🔄 Refresh Status
                </>
              )}
            </button>
          )}
          
          <a
            href={getWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 active:scale-95"
          >
            <MessageCircle size={18} />
            Hubungi Admin via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
