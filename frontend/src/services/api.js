import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

// Public API
export const productApi = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/product/${id}`),
    getPlatforms: () => api.get('/platforms'),
    getSubPlatforms: (platform) => api.get(`/platforms/${platform}/sub-platforms`),
};

export const orderApi = {
    create: (data) => api.post('/order/create', data),
    getStatus: (purchaseCode) => api.get(`/order/status/${purchaseCode}`),
    createPayment: (purchaseCode) => api.post('/order/pay', { purchase_code: purchaseCode }),
    refreshPaymentStatus: (purchaseCode) => api.post(`/order/${purchaseCode}/refresh-status`),
};

// Admin API
export const adminApi = {
    login: (data) => api.post('/admin/login', data),
    getProfile: () => api.get('/admin/profile'),
    getDashboard: () => api.get('/admin/dashboard'),

    // Products
    getProducts: (params) => api.get('/admin/products', { params }),
    createProduct: (data) => api.post('/admin/product', data),
    updateProduct: (id, data) => api.put(`/admin/product/${id}`, data),
    deleteProduct: (id) => api.delete(`/admin/product/${id}`),

    // Orders
    getOrders: (params) => api.get('/admin/orders', { params }),
    getOrderDetail: (id) => api.get(`/admin/order/${id}`),
    updateSellerStatus: (id, status) => api.put(`/admin/order/${id}/status-seller`, { status_seller: status }),
    updatePaymentStatus: (id, status) => api.put(`/admin/order/${id}/status-payment`, { status_payment: status }),
    deleteOrder: (id) => api.delete(`/admin/order/${id}`),
    batchDeleteOrders: (criteria) => api.delete('/admin/orders/batch', { data: { criteria } }),

    // Payment logs
    getPaymentLogs: (params) => api.get('/admin/payment-logs', { params }),
};

export default api;
