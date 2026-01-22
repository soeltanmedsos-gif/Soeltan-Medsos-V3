import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

import toast from 'react-hot-toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Memproses login...');

    try {
      await login(email, password);
      toast.success('Login berhasil!', { id: loadingToast });
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-700">
          <div className="text-center mb-10">
            <img src="/LOGO-.png" alt="Logo" className="w-32 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white">
              Admin <span className="text-indigo-500">Portal</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">Masuk untuk mengelola pesanan & produk.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
              className="bg-slate-900"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required
              className="bg-slate-900"
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-lg bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {loading ? 'Memproses...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              ← Kembali ke Website
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
