import React, { createContext, useState, useEffect } from 'react';
import { calculateDiscountedPrice } from '../services/productService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddressState] = useState(() => {
    const saved = localStorage.getItem('myntra_heritage_shipping');
    return saved ? JSON.parse(saved) : { address: '', city: '', postalCode: '', country: 'India' };
  });

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('myntra_heritage_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart', error);
      }
    }
  }, []);

  const saveToLocalStorage = (newCart) => {
    localStorage.setItem('myntra_heritage_cart', JSON.stringify(newCart));
  };

  const setShippingAddress = (address) => {
    setShippingAddressState(address);
    localStorage.setItem('myntra_heritage_shipping', JSON.stringify(address));
  };

  const addToCart = (product, qty = 1) => {
    const existingIndex = cart.findIndex((item) => item._id === product._id);
    let updatedCart;

    if (existingIndex > -1) {
      updatedCart = [...cart];
      const newQty = updatedCart[existingIndex].qty + qty;
      // Cap quantity to product stock
      updatedCart[existingIndex].qty = Math.min(newQty, product.stock || 10);
    } else {
      updatedCart = [...cart, { ...product, qty: Math.min(qty, product.stock || 10) }];
    }

    setCart(updatedCart);
    saveToLocalStorage(updatedCart);
  };

  const addOutfitToCart = (products) => {
    let updatedCart = [...cart];
    let itemsAddedCount = 0;

    (products || []).forEach((product) => {
      if (!product || product.stock <= 0) return;
      const existingIndex = updatedCart.findIndex((item) => item._id === product._id);
      if (existingIndex === -1) {
        updatedCart.push({ ...product, qty: 1 });
        itemsAddedCount++;
      }
    });

    if (itemsAddedCount > 0) {
      setCart(updatedCart);
      saveToLocalStorage(updatedCart);
    }
    return itemsAddedCount;
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    saveToLocalStorage(updatedCart);
  };

  const updateQty = (productId, qty) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        // Cap quantity to product stock
        const finalQty = Math.max(1, Math.min(qty, item.stock || 10));
        return { ...item, qty: finalQty };
      }
      return item;
    });
    setCart(updatedCart);
    saveToLocalStorage(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('myntra_heritage_cart');
  };

  // Computations
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  const cartTotal = cart.reduce((acc, item) => {
    const discPrice = calculateDiscountedPrice(item.price, item.discount);
    return acc + discPrice * item.qty;
  }, 0);

  const cartDiscount = cartSubtotal - cartTotal;

  // Let's set standard shipping: free if total > 999, else 99
  const shippingPrice = cartTotal > 999 || cartTotal === 0 ? 0 : 99;
  
  // Standard tax/GST is 5% included in prices or added. In e-commerce, it's typically added or shown as details.
  // Let's calculate standard tax (5% of discounted subtotal)
  const taxPrice = Math.round(cartTotal * 0.05);

  const grandTotal = cartTotal + shippingPrice;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        shippingPrice,
        taxPrice,
        grandTotal,
        shippingAddress,
        setShippingAddress,
        addToCart,
        addOutfitToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
