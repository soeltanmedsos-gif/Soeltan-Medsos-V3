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
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Detail Pesanan</h2>
        <span className="text-xs text-slate-500">{formatDate(order.created_at)}</span>
      </div>

      <div className="space-y-4">
        {/* Purchase Code */}
        <div className="bg-primary-50 p-4 rounded-lg text-center">
          <p className="text-xs text-primary-600 mb-1">Kode Pembelian</p>
          <p className="text-2xl font-bold text-primary-700 font-mono tracking-wider">
            {order.purchase_code}
          </p>
        </div>

        {/* Product Info */}
        <div className="border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">Produk</p>
          <p className="font-semibold text-slate-900">{order.product?.name}</p>
          <p className="text-xs text-slate-500">{order.product?.platform}</p>
        </div>

        {/* Amount */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
          <span className="text-slate-600">Total Pembayaran</span>
          <span className="text-xl font-bold text-primary-600">{formatRupiah(order.amount)}</span>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Status Pembayaran</p>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              paymentStatus.color === 'badge-paid' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
              paymentStatus.color === 'badge-waiting' || paymentStatus.color === 'badge-pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 
              paymentStatus.color === 'badge-expire' || paymentStatus.color === 'badge-deny' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
              'bg-slate-500/10 text-slate-600 border-slate-500/20'
            }`}>
              {paymentStatus.label}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Status Pengerjaan</p>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sellerStatus.bgColor.replace('/20', '/10')} ${sellerStatus.textColor.replace('400', '600')} ${sellerStatus.borderColor}`}>
              {sellerStatus.label}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          {order.status_payment !== 'paid' && order.status_payment !== 'expire' && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="w-full btn btn-secondary text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {refreshing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Memeriksa Status...
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
            className="w-full btn btn-success text-sm flex items-center justify-center gap-2"
          >
            💬 Hubungi Admin via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
