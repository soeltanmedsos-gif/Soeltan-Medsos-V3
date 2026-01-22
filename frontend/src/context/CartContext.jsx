import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('sm_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sm_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, details = {}) => {
    const uniqueId = details.target_link 
      ? `${product.id}-${details.target_link}` 
      : product.id;

    setCart((prev) => {
      const existing = prev.find((item) => item.uniqueId === uniqueId);
      if (existing) {
        toast.success(`Jumlah ${product.name} diupdate!`, { icon: '🛒' });
        return prev.map((item) =>
          item.uniqueId === uniqueId 
            ? { ...item, quantity: item.quantity + (details.quantity || 1) } 
            : item
        );
      }
      toast.success('Produk masuk keranjang!', { icon: '🛒' });
      return [...prev, { 
        ...product, 
        ...details,
        uniqueId,
        quantity: details.quantity || 1 
      }];
    });
  };

  const removeFromCart = (uniqueId) => {
    setCart((prev) => prev.filter((item) => item.uniqueId !== uniqueId));
  };

  const updateQuantity = (uniqueId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
