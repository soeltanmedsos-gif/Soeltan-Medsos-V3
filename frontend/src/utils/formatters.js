/**
 * Format number to Indonesian Rupiah
 */
export function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format date to Indonesian format
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}

/**
 * Format date to relative time (e.g., "2 jam yang lalu")
 */
export function formatRelativeTime(date) {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;

    return formatDate(date);
}

/**
 * Get payment status label and color
 */
export function getPaymentStatusInfo(status) {
    const statusMap = {
        pending: { label: 'Menunggu', color: 'badge-pending' },
        waiting_payment: { label: 'Menunggu Pembayaran', color: 'badge-waiting' },
        paid: { label: 'Dibayar', color: 'badge-paid' },
        deny: { label: 'Ditolak', color: 'badge-deny' },
        expire: { label: 'Kadaluarsa', color: 'badge-expire' },
        refund: { label: 'Refund', color: 'badge-deny' },
    };
    return statusMap[status] || { label: status, color: 'badge-pending' };
}

/**
 * Get seller status label and color
 */
export function getSellerStatusInfo(status) {
    const statusMap = {
        pending: { label: 'Pending', color: 'badge-pending', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400', borderColor: 'border-blue-500/30' },
        process: { label: 'Diproses', color: 'badge-process', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/30' },
        done: { label: 'Selesai', color: 'badge-done', bgColor: 'bg-green-500/20', textColor: 'text-green-400', borderColor: 'border-green-500/30' },
    };
    return statusMap[status] || { label: status, color: 'badge-pending', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400', borderColor: 'border-blue-500/30' };
}

/**
 * Get WhatsApp link for admin
 */
export function getWhatsAppLink(message = '') {
    const phone = '6282352835382';
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Get WhatsApp confirmation link with formatted order details
 */
export function getWhatsAppConfirmationLink(orderData) {
    const { purchase_code, buyer_name, product, quantity, amount } = orderData;

    const message = `Halo Admin, saya ingin konfirmasi pesanan:

Kode Pembelian: ${purchase_code}
Nama: ${buyer_name || '-'}
Pesanan: ${product?.name || '-'} x ${quantity}
Total: ${formatRupiah(amount)}

Terima kasih!`;

    return getWhatsAppLink(message);
}


/**
 * Platform icons mapping
 */
export const platformIcons = {
    TikTok: '🎵',
    Instagram: '📸',
    YouTube: '▶️',
    Facebook: '👍',
    Whatsapp: '💬',
    Telegram: '✈️',
    'Google Maps': '📍',
    'Aplikasi Premium': '⭐',
    'Tiktok Paket FYP': '🔥',
};
