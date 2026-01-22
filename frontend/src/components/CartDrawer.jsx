import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    toggleCart, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal,
    clearCart
  } = useCart();
  
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout'); // We'll create this page next, or handle logic here
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="text-indigo-500" />
                Keranjang
                <span className="text-sm font-normal text-slate-500 ml-2">({cart.length} item)</span>
              </h2>
              <button 
                onClick={toggleCart}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart size={40} className="opacity-50" />
                  </div>
                  <p className="text-lg font-medium text-white mb-1">Keranjang Kosong</p>
                  <p className="text-sm">Yuk tambah layanan social media pilihanmu!</p>
                  <button 
                    onClick={toggleCart}
                    className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cari Layanan
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.uniqueId} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex gap-4 group">
                     {/* Icon based on platform */}
                    <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 border border-slate-700">
                       <span className="text-xs font-bold text-slate-500 uppercase">{item.platform}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium line-clamp-2 text-sm mb-1">{item.name}</h4>
                      {item.target_link && (
                        <p className="text-xs text-slate-500 truncate mb-1">Target: {item.target_link}</p>
                      )}
                      <p className="text-indigo-400 font-bold text-sm">
                        Rp {item.price?.toLocaleString('id-ID')}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-1 border border-slate-700">
                          <button 
                            onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.uniqueId)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Subtotal</span>
                    <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={clearCart}
                    className="px-4 py-3 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    Hapus Semua
                  </button>
                  <button 
                    onClick={handleCheckout}
                    className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Checkout <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
