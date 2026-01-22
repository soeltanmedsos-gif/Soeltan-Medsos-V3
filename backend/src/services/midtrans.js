const config = require('../config');
const midtransClient = require('midtrans-client');
const { v4: uuidv4 } = require('uuid');

class DummyMidtransService {
    constructor() {
        console.log('⚠️  USING DUMMY MIDTRANS SERVICE (No API Keys configured)');
    }

    async createSnapTransaction(order, product) {
        console.log(`[DUMMY] Creating transaction for order ${order.id}: Rp ${order.amount}`);

        // Simulate Snap Token for testing
        const snapToken = `DUMMY-TOKEN-${uuidv4()}`;
        const redirectUrl = `http://localhost:5173/cek-pesanan?code=${order.purchase_code}`;

        return {
            token: snapToken,
            redirect_url: redirectUrl
        };
    }

    async verifyNotification(notification) {
        console.log('[DUMMY] Verifying notification:', notification);
        return {
            ...notification,
            order_id: notification.order_id,
            transaction_status: notification.transaction_status || 'settlement',
            fraud_status: 'accept'
        };
    }

    async getTransactionStatus(orderId) {
        console.log('[DUMMY] Getting transaction status for:', orderId);
        return {
            transaction_status: 'settlement',
            order_id: orderId
        };
    }
}

class RealMidtransService {
    constructor() {
        console.log('✅ Using REAL Midtrans Service (Sandbox Mode:', !config.midtrans.isProduction, ')');

        this.snap = new midtransClient.Snap({
            isProduction: config.midtrans.isProduction,
            serverKey: config.midtrans.serverKey,
            clientKey: config.midtrans.clientKey,
        });

        this.core = new midtransClient.CoreApi({
            isProduction: config.midtrans.isProduction,
            serverKey: config.midtrans.serverKey,
            clientKey: config.midtrans.clientKey,
        });
    }

    async createSnapTransaction(order, product) {
        const parameter = {
            transaction_details: {
                order_id: String(order.id),
                gross_amount: order.amount,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                first_name: order.buyer_name || 'Customer',
                phone: order.buyer_phone || '',
            },
            item_details: [
                {
                    id: String(product.id),
                    name: product.name.substring(0, 50), // Midtrans max 50 chars
                    price: product.price,
                    quantity: order.quantity,
                }
            ],
            callbacks: {
                finish: `${config.frontend.url}/cek-pesanan?code=${order.purchase_code}`,
            },
        };

        console.log('Creating Midtrans transaction with params:', JSON.stringify(parameter, null, 2));
        return this.snap.createTransaction(parameter);
    }

    async verifyNotification(notification) {
        return this.core.transaction.notification(notification);
    }

    async getTransactionStatus(orderId) {
        return this.core.transaction.status(orderId);
    }
}

// Export Dummy service if keys are missing or contain placeholders
const useDummy =
    !config.midtrans.serverKey ||
    config.midtrans.serverKey.includes('your_') ||
    config.midtrans.serverKey === 'SB-Mid-server-xxxx';

module.exports = useDummy ? new DummyMidtransService() : new RealMidtransService();
