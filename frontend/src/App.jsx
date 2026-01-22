import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import OrderInfo from './pages/OrderInfo';
import CheckOrder from './pages/CheckOrder';
import Checkout from './pages/Checkout';
import PurchaseSuccess from './pages/PurchaseSuccess';
import HowToBuy from './pages/HowToBuy';
import FAQ from './pages/FAQ';
import TermsConditions from './pages/TermsConditions';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

import { Toaster } from 'react-hot-toast';

// Public Layout
function PublicLayout({ children }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 py-8 min-h-screen">
        {children}
      </main>
      <Footer />
      <Toaster position="top-center" toastOptions={{
        className: 'bg-white text-slate-900 border border-slate-200 shadow-xl rounded-xl',
        duration: 3000,
        style: {
          background: '#fff',
          color: '#0f172a',
          padding: '16px',
          borderRadius: '12px',
        },
      }} />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
      <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/order/:purchaseCode" element={<PublicLayout><OrderInfo /></PublicLayout>} />
      <Route path="/cek-pesanan" element={<PublicLayout><CheckOrder /></PublicLayout>} />
      <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
      <Route path="/purchase-success/:purchaseCode" element={<PublicLayout><PurchaseSuccess /></PublicLayout>} />
      <Route path="/cara-beli" element={<PublicLayout><HowToBuy /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
      <Route path="/syarat-ketentuan" element={<PublicLayout><TermsConditions /></PublicLayout>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PublicLayout><div className="text-center py-12"><h1 className="text-2xl font-bold">404 - Halaman tidak ditemukan</h1></div></PublicLayout>} />
    </Routes>
  );
}
