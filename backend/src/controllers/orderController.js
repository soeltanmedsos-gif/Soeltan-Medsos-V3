const supabase = require('../services/supabase');
const midtransService = require('../services/midtrans');
const { generatePurchaseCode, sanitizePhone, mapPaymentStatus } = require('../utils/helpers');

/**
 * Create a new order
 * @route POST /api/order/create
 */
async function createOrder(req, res) {
    try {
        const { product_id, buyer_phone, buyer_name, target_link, quantity = 1, notes, transaction_group_id } = req.body;

        // Get product
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', product_id)
            .eq('is_active', true)
            .single();

        if (productError || !product) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan',
            });
        }

        // Calculate total amount
        const amount = product.price * quantity;

        // Generate purchase code
        const purchase_code = generatePurchaseCode();

        // Sanitize phone
        const cleanPhone = sanitizePhone(buyer_phone);

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                product_id,
                purchase_code,
                buyer_phone: cleanPhone,
                buyer_name: buyer_name || null,
                target_link: target_link || null,
                quantity,
                amount,
                notes: notes || null,
                status_payment: 'pending', // Pending until payment via Midtrans
                status_seller: 'pending',
                midtrans_order_id: transaction_group_id || null, // Use this to group orders
            })
            .select()
            .single();

        if (orderError) throw orderError;

        res.status(201).json({
            success: true,
            message: 'Order berhasil dibuat',
            data: {
                order_id: order.id,
                purchase_code: order.purchase_code,
                amount: order.amount,
                product: {
                    id: product.id,
                    name: product.name,
                    platform: product.platform,
                    price: product.price,
                },
            },
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal membuat order',
        });
    }
}

/**
 * Get order status by purchase code
 * @route GET /api/order/status/:purchase_code
 */
async function getOrderStatus(req, res) {
    try {
        const { purchase_code } = req.params;
        const cleanCode = purchase_code.toUpperCase();

        let orders = [];
        let isGroup = cleanCode.startsWith('TRX-') || cleanCode.startsWith('SM-GROUP-');

        if (isGroup) {
            // Search by Group ID
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id, purchase_code, buyer_phone, target_link, quantity, amount,
                    status_payment, status_seller, created_at, midtrans_order_id,
                    products (id, name, platform, price, description)
                `)
                .eq('midtrans_order_id', cleanCode);

            if (data) orders = data;
        }

        // If not found as group, or not a group format, search by single purchase code
        if (orders.length === 0) {
            const { data: order, error } = await supabase
                .from('orders')
                .select(`
                    id, purchase_code, buyer_phone, target_link, quantity, amount,
                    status_payment, status_seller, created_at, midtrans_order_id,
                    products (id, name, platform, price, description)
                `)
                .eq('purchase_code', cleanCode)
                .single();

            if (order) orders = [order];
        }

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order tidak ditemukan. Pastikan kode pembelian benar.',
            });
        }

        // Return data. If only one order, you can still return it as an array or object.
        // To be safe for the current frontend, if it's not a group, we can return the object.
        // But better return consistent structure or handle it in frontend.
        // Let's return the list and let frontend handle it.
        res.json({
            success: true,
            data: orders.length === 1 ? {
                ...orders[0],
                product: orders[0].products // Maintain compatibility
            } : orders.map(o => ({
                ...o,
                product: o.products
            })),
        });
    } catch (error) {
        console.error('Get order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil status order',
        });
    }
}

/**
 * Generate payment token for an order
 * @route POST /api/order/pay
 */
async function createPayment(req, res) {
    try {
        const { purchase_code } = req.body;

        // Get order with product
        const { data: order, error } = await supabase
            .from('orders')
            .select(`
        *,
        products (*)
      `)
            .eq('purchase_code', purchase_code.toUpperCase())
            .single();

        if (error || !order) {
            return res.status(404).json({
                success: false,
                message: 'Order tidak ditemukan',
            });
        }

        // Check if already paid
        if (order.status_payment === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Order sudah dibayar',
            });
        }

        // Check if expired
        if (order.status_payment === 'expire') {
            return res.status(400).json({
                success: false,
                message: 'Order sudah kadaluarsa. Silakan buat order baru.',
            });
        }

        // If already has snap token, return it
        if (order.snap_token) {
            return res.json({
                success: true,
                data: {
                    snap_token: order.snap_token,
                    snap_redirect_url: order.snap_redirect_url,
                },
            });
        }

        // Create Midtrans transaction
        const transaction = await midtransService.createSnapTransaction(order, order.products);

        // Update order with snap token
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                snap_token: transaction.token,
                snap_redirect_url: transaction.redirect_url,
                midtrans_order_id: order.id,
                status_payment: 'waiting_payment',
            })
            .eq('id', order.id);

        if (updateError) throw updateError;

        res.json({
            success: true,
            data: {
                snap_token: transaction.token,
                snap_redirect_url: transaction.redirect_url,
            },
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal membuat pembayaran',
        });
    }
}

/**
 * Get order by ID (for internal use)
 */
async function getOrderById(orderId) {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Refresh payment status from Midtrans (for development/manual check)
 * @route POST /api/orders/:purchaseCode/refresh-status
 */
async function refreshPaymentStatus(req, res) {
    try {
        const { purchaseCode } = req.params;

        // Get order by purchase code
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('purchase_code', purchaseCode)
            .single();

        if (orderError || !order) {
            return res.status(404).json({
                success: false,
                message: 'Order tidak ditemukan',
            });
        }

        // Check Midtrans transaction status
        const transactionStatus = await midtransService.getTransactionStatus(order.id);

        // Map to internal status
        const newStatus = mapPaymentStatus(
            transactionStatus.transaction_status,
            transactionStatus.fraud_status
        );

        // Update order status
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ status_payment: newStatus })
            .eq('id', order.id)
            .select('*, product:product_id(*)')
            .single();

        if (updateError) throw updateError;

        res.json({
            success: true,
            message: 'Status berhasil diperbarui',
            data: updatedOrder,
        });

    } catch (error) {
        console.error('Refresh payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui status pembayaran',
        });
    }
}

/**
 * Submit manual payment proof
 * @route POST /api/order/submit-proof
 */
async function submitPaymentProof(req, res) {
    try {
        const { purchase_code } = req.body;
        const file = req.file;

        if (!purchase_code || !file) {
            return res.status(400).json({
                success: false,
                message: 'Purchase code dan bukti pembayaran wajib diisi',
            });
        }

        // Try to find orders by Group ID (midtrans_order_id) OR Purchase Code
        // First, check if input looks like a Group ID (e.g., starts with TRX-)
        const isGroupTransaction = purchase_code.startsWith('TRX-') || purchase_code.startsWith('SM-GROUP-');

        let ordersToUpdate = [];

        if (isGroupTransaction) {
            const { data: orders, error: groupError } = await supabase
                .from('orders')
                .select('*')
                .eq('midtrans_order_id', purchase_code);

            if (groupError || !orders || orders.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Kode Transaksi tidak ditemukan',
                });
            }
            ordersToUpdate = orders;
        } else {
            // Fallback to single purchase code
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('purchase_code', purchase_code)
                .single();

            if (orderError || !order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order tidak ditemukan',
                });
            }
            ordersToUpdate = [order];
        }

        // Upload to Supabase Storage
        const fileExt = file.originalname.split('.').pop();
        // Use the first order's code or the input code for filename
        const fileName = `${purchase_code}_${Date.now()}.${fileExt}`;
        const filePath = `proofs/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('payment-proofs')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengupload bukti pembayaran',
                debug: uploadError.message
            });
        }

        // Get Public URL
        const { data: publicUrlData } = supabase.storage
            .from('payment-proofs')
            .getPublicUrl(filePath);

        const proofUrl = publicUrlData.publicUrl;

        // Update ALL Orders found
        const orderIds = ordersToUpdate.map(o => o.id);

        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status_payment: 'waiting_payment',
                snap_token: 'MANUAL',
                snap_redirect_url: proofUrl,
                updated_at: new Date()
            })
            .in('id', orderIds);

        if (updateError) {
            throw updateError;
        }

        res.json({
            success: true,
            message: 'Bukti pembayaran berhasil dikirim. Menunggu verifikasi admin.',
            data: {
                proof_url: proofUrl,
                updated_count: orderIds.length
            }
        });

    } catch (error) {
        console.error('Submit proof error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengirim bukti pembayaran',
        });
    }
}


module.exports = {
    createOrder,
    getOrderStatus,
    createPayment,
    getOrderById,
    refreshPaymentStatus,
    submitPaymentProof,
};
