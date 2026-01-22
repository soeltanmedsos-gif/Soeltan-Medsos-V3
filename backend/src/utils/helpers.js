const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique purchase code
 * Format: SM-XXXXXXXX (8 alphanumeric characters)
 */
function generatePurchaseCode() {
    const uuid = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    return `SM-${uuid}`;
}

/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount 
 * @returns {string}
 */
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format date to Indonesian format
 * @param {Date|string} date 
 * @returns {string}
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short',
    }).format(new Date(date));
}

/**
 * Map Midtrans transaction status to internal payment status
 * @param {string} transactionStatus 
 * @param {string} fraudStatus 
 * @returns {string}
 */
function mapPaymentStatus(transactionStatus, fraudStatus = 'accept') {
    const statusMap = {
        'capture': fraudStatus === 'accept' ? 'paid' : 'deny',
        'settlement': 'paid',
        'pending': 'waiting_payment',
        'deny': 'deny',
        'cancel': 'deny',
        'expire': 'expire',
        'refund': 'refund',
        'partial_refund': 'refund',
        'failure': 'deny',
    };
    return statusMap[transactionStatus] || 'pending';
}

/**
 * Validate phone number (Indonesian format)
 * @param {string} phone 
 * @returns {boolean}
 */
function isValidPhone(phone) {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
}

/**
 * Sanitize phone number to standard format
 * @param {string} phone 
 * @returns {string}
 */
function sanitizePhone(phone) {
    let cleaned = phone.replace(/\s|-/g, '');
    if (cleaned.startsWith('+62')) {
        cleaned = '0' + cleaned.substring(3);
    } else if (cleaned.startsWith('62')) {
        cleaned = '0' + cleaned.substring(2);
    }
    return cleaned;
}

module.exports = {
    generatePurchaseCode,
    formatRupiah,
    formatDate,
    mapPaymentStatus,
    isValidPhone,
    sanitizePhone,
};
