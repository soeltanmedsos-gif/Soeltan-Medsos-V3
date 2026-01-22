const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabase');
const config = require('../config');

/**
 * Admin login
 * @route POST /api/admin/login
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Get admin by email
        const { data: admin, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !admin) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah',
            });
        }

        if (!admin.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Akun tidak aktif',
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah',
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        // Update last login
        await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', admin.id);

        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                token,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                },
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal melakukan login',
        });
    }
}

/**
 * Get current admin profile
 * @route GET /api/admin/profile
 */
async function getProfile(req, res) {
    res.json({
        success: true,
        data: req.admin,
    });
}

/**
 * Get all products (admin)
 * @route GET /api/admin/products
 */
async function getAllProducts(req, res) {
    try {
        const { page = 1, limit = 20, platform, search } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('products')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (platform) {
            query = query.eq('platform', platform);
        }
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            success: true,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data produk',
        });
    }
}

/**
 * Create product
 * @route POST /api/admin/product
 */
async function createProduct(req, res) {
    try {
        const { name, platform, sub_platform, description, price, image_url, is_active = true } = req.body;

        const { data, error } = await supabase
            .from('products')
            .insert({
                name,
                platform,
                sub_platform: sub_platform || null,
                description: description || null,
                price,
                image_url: image_url || null,
                is_active,
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: 'Produk berhasil dibuat',
            data,
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal membuat produk',
        });
    }
}

/**
 * Update product
 * @route PUT /api/admin/product/:id
 */
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove id if present in body
        delete updates.id;
        delete updates.created_at;

        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Produk berhasil diupdate',
            data,
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate produk',
        });
    }
}

/**
 * Delete product (soft delete)
 * @route DELETE /api/admin/product/:id
 */
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('products')
            .update({ is_active: false })
            .eq('id', id);

        if (error) throw error;

        res.json({
            success: true,
            message: 'Produk berhasil dihapus',
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus produk',
        });
    }
}

/**
 * Get all orders (admin)
 * @route GET /api/admin/orders
 */
async function getAllOrders(req, res) {
    try {
        const { page = 1, limit = 20, status_payment, status_seller, search } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('orders')
            .select(`
        *,
        products (id, name, platform)
      `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status_payment) {
            query = query.eq('status_payment', status_payment);
        }
        if (status_seller) {
            query = query.eq('status_seller', status_seller);
        }
        if (search) {
            query = query.or(`purchase_code.ilike.%${search}%,buyer_phone.ilike.%${search}%`);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            success: true,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data order',
        });
    }
}

/**
 * Get order detail (admin)
 * @route GET /api/admin/order/:id
 */
async function getOrderDetail(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        products (*),
        payment_logs (*)
      `)
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: 'Order tidak ditemukan',
            });
        }

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Get order detail error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil detail order',
        });
    }
}

/**
 * Update seller status
 * @route PUT /api/admin/order/:id/status-seller
 */
async function updateSellerStatus(req, res) {
    try {
        const { id } = req.params;
        const { status_seller } = req.body;

        const { data, error } = await supabase
            .from('orders')
            .update({ status_seller })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Status berhasil diupdate',
            data,
        });
    } catch (error) {
        console.error('Update seller status error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate status',
        });
    }
}

/**
 * Update payment status
 * @route PUT /api/admin/order/:id/status-payment
 */
async function updatePaymentStatus(req, res) {
    try {
        const { id } = req.params;
        const { status_payment } = req.body;

        const { data, error } = await supabase
            .from('orders')
            .update({ status_payment })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Status pembayaran berhasil diupdate',
            data,
        });
    } catch (error) {
        console.error('Update payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate status pembayaran',
        });
    }
}

/**
 * Get payment logs (admin)
 * @route GET /api/admin/payment-logs
 */
async function getPaymentLogs(req, res) {
    try {
        const { page = 1, limit = 20, order_id } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('payment_logs')
            .select(`
        *,
        orders (purchase_code, amount)
      `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (order_id) {
            query = query.eq('order_id', order_id);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            success: true,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error('Get payment logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil log pembayaran',
        });
    }
}

/**
 * Get dashboard statistics
 * @route GET /api/admin/dashboard
 */
async function getDashboard(req, res) {
    try {
        // Get counts
        const [ordersResult, productsResult, todayOrdersResult, revenueResult] = await Promise.all([
            supabase.from('orders').select('*', { count: 'exact', head: true }),
            supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('orders').select('*', { count: 'exact', head: true })
                .gte('created_at', new Date().toISOString().split('T')[0]),
            supabase.from('orders').select('amount').eq('status_payment', 'paid'),
        ]);

        const totalRevenue = revenueResult.data?.reduce((sum, o) => sum + o.amount, 0) || 0;

        // Get recent orders
        const { data: recentOrders } = await supabase
            .from('orders')
            .select(`
        id, purchase_code, amount, status_payment, status_seller, created_at,
        products (name)
      `)
            .order('created_at', { ascending: false })
            .limit(10);

        // Get order status counts
        const { data: statusCounts } = await supabase
            .from('orders')
            .select('status_payment, status_seller');

        const paymentStatusCounts = {};
        const sellerStatusCounts = {};

        statusCounts?.forEach(order => {
            paymentStatusCounts[order.status_payment] = (paymentStatusCounts[order.status_payment] || 0) + 1;
            sellerStatusCounts[order.status_seller] = (sellerStatusCounts[order.status_seller] || 0) + 1;
        });

        res.json({
            success: true,
            data: {
                totalOrders: ordersResult.count || 0,
                totalProducts: productsResult.count || 0,
                todayOrders: todayOrdersResult.count || 0,
                totalRevenue,
                paymentStatusCounts,
                sellerStatusCounts,
                recentOrders,
            },
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dashboard',
        });
    }
}

/**
 * Create new admin (superadmin only)
 * @route POST /api/admin/users
 */
async function createAdmin(req, res) {
    try {
        const { email, password, name, role = 'admin' } = req.body;

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('admin_users')
            .insert({
                email: email.toLowerCase(),
                password_hash,
                name,
                role,
            })
            .select('id, email, name, role, created_at')
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({
                    success: false,
                    message: 'Email sudah terdaftar',
                });
            }
            throw error;
        }

        res.status(201).json({
            success: true,
            message: 'Admin berhasil dibuat',
            data,
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal membuat admin',
        });
    }
}

/**
 * Delete single order
 * @route DELETE /api/admin/order/:id
 */
async function deleteOrder(req, res) {
    try {
        const { id } = req.params;

        // Delete order (cascade will handle payment_logs if configured, otherwise might need manual delete)
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({
            success: true,
            message: 'Order berhasil dihapus',
        });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus order',
        });
    }
}

/**
 * Batch delete orders
 * @route DELETE /api/admin/orders/batch
 */
async function batchDeleteOrders(req, res) {
    try {
        const { criteria } = req.body; // 'week' or 'month'

        let dateThreshold;
        const now = new Date();

        if (criteria === 'week') {
            dateThreshold = new Date(now.setDate(now.getDate() - 7));
        } else if (criteria === 'month') {
            dateThreshold = new Date(now.setDate(now.getDate() - 30));
        } else {
            return res.status(400).json({
                success: false,
                message: 'Criteria tidak valid (week/month)',
            });
        }

        const { error, count } = await supabase
            .from('orders')
            .delete({ count: 'exact' })
            .lt('created_at', dateThreshold.toISOString());

        if (error) throw error;

        res.json({
            success: true,
            message: `${count || 0} order berhasil dihapus`,
            count,
        });
    } catch (error) {
        console.error('Batch delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus order secara massal',
        });
    }
}

module.exports = {
    login,
    getProfile,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    getOrderDetail,
    updateSellerStatus,
    updatePaymentStatus,
    getPaymentLogs,
    getDashboard,
    createAdmin,
    deleteOrder,
    batchDeleteOrders,
};
