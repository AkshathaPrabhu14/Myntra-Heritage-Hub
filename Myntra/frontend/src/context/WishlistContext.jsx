import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from LocalStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('myntra_heritage_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist', error);
      }
    }
  }, []);

  // Save wishlist to LocalStorage whenever it changes
  const saveToLocalStorage = (newWishlist) => {
    localStorage.setItem('myntra_heritage_wishlist', JSON.stringify(newWishlist));
  };

  const toggleWishlist = (product) => {
    let updatedWishlist;
    const exists = wishlist.some((item) => item._id === product._id);

    if (exists) {
      updatedWishlist = wishlist.filter((item) => item._id !== product._id);
    } else {
      updatedWishlist = [...wishlist, product];
    }

    setWishlist(updatedWishlist);
    saveToLocalStorage(updatedWishlist);
    return !exists; // Returns true if added, false if removed
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('myntra_heritage_wishlist');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
