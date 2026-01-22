import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import { formatRupiah, platformIcons } from '../utils/formatters';
import { PageLoader } from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Zap, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    target_link: '',
    quantity: 1,
    notes: '',
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productApi.getById(id);
      setProduct(response.data.data);
      if (response.data.data) {
        setFormData(prev => ({ 
          ...prev, 
          quantity: response.data.data.min_quantity || 1 
        }));
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Produk tidak ditemukan');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!formData.target_link) {
      toast.error('Mohon isi target link/username');
      return;
    }

    addToCart(product, {
      quantity: parseInt(formData.quantity),
      target_link: formData.target_link,
      notes: formData.notes
    });
    
    toggleCart(); 
  };

  const handleDirectBuy = async () => {
     if (!formData.target_link) {
      toast.error('Mohon isi target link/username');
      return;
    }
    
    addToCart(product, {
      quantity: parseInt(formData.quantity),
      target_link: formData.target_link,
      notes: formData.notes
    });
    navigate('/checkout');
  };

  const getInputConfig = (platform) => {
    const p = platform?.toLowerCase() || '';
    if (p.includes('followers')) return { label: 'Username', placeholder: 'Masukkan username tanpa @' };
    if (p.includes('premium') || p.includes('aplikasi')) return { label: 'Email / ID Akun', placeholder: 'contoh@email.com' };
    if (p.includes('tiktok')) return { label: 'Link Video / Profil TikTok', placeholder: 'https://vt.tiktok.com/... atau username' };
    if (p.includes('instagram')) return { label: 'Link Post / Profil Instagram', placeholder: 'https://instagram.com/...' };
    if (p.includes('youtube')) return { label: 'Link Video / Channel', placeholder: 'https://youtu.be/...' };
    if (p.includes('maps')) return { label: 'Link Lokasi Maps', placeholder: 'https://maps.google.com/...' };
    return { label: 'Target Link / Username', placeholder: 'Masukkan link target...' };
  };

  const totalPrice = product ? product.price * (parseInt(formData.quantity) || 1) : 0;
  
  const icon = product?.platform ? (platformIcons[product.platform] || '📦') : '📦';
  const inputConfig = product ? getInputConfig(product.platform) : {};

  if (loading) return <PageLoader />;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Layanan</span>
        </button>

        <Breadcrumb 
          items={[
            { label: 'Layanan', to: '/products' },
            { label: product?.name || 'Detail Produk' }
          ]}
        />

        <div className="grid md:grid-cols-2 gap-12 items-start mt-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-28"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-3 bg-slate-800 rounded-bl-2xl border-b border-l border-slate-700">
                 <span className="text-sm font-bold text-indigo-400">{product.platform}</span>
               </div>
               
               <div className="w-20 h-20 bg-slate-900 rounded-2xl shadow-inner flex items-center justify-center text-4xl mb-6 border border-slate-700">
                 {icon}
               </div>
               
               <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
               <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full mb-6"></div>
               
               <p className="text-slate-400 text-lg leading-relaxed mb-8">
                 {product.description || 'Layanan ini memiliki kualitas terbaik dengan proses otomatis.'}
               </p>

               <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Check size={18} className="text-green-400" /> Keunggulan Layanan
                  </h3>
                  <ul className="space-y-3">
                     {['Proses Otomatis & Cepat', 'Privasi 100% Aman', 'Garansi Refill (S&K Berlaku)', 'Customer Support Ready'].map((item, i) => (
                       <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> {item}
                       </li>
                     ))}
                  </ul>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Formulir Pemesanan</h2>
                <p className="text-slate-400 text-sm mt-1">Lengkapi data di bawah untuk memproses pesanan.</p>
              </div>

              <form onSubmit={handleAddToCart} className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">
                      {inputConfig.label} <span className="text-red-500">*</span>
                   </label>
                   <input
                      type="text"
                      name="target_link"
                      value={formData.target_link}
                      onChange={handleChange}
                      placeholder={inputConfig.placeholder}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-slate-300 mb-2">
                        Jumlah <span className="text-red-500">*</span>
                     </label>
                     <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min={product.min_quantity || 1}
                        max={product.max_quantity || 10000}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                     />
                     <p className="text-xs text-slate-500 mt-1">
                       Min: {product.min_quantity} | Max: {product.max_quantity}
                     </p>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Total Harga</label>
                      <div className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-emerald-400 font-bold text-lg flex items-center">
                         {formatRupiah(totalPrice)}
                      </div>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">Catatan (Opsional)</label>
                   <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Catatan tambahan..."
                      rows="3"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                   ></textarea>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group border border-slate-600"
                  >
                    <ShoppingCart size={20} className="text-indigo-400 group-hover:text-white transition-colors" />
                    + Keranjang
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleDirectBuy}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                  >
                    <Zap size={20} className="fill-white" />
                    Beli Langsung
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
