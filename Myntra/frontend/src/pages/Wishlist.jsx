import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { resolveImageUrl, calculateDiscountedPrice } from '../services/productService';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();

  const handleMoveToCart = (product) => {
    // Check if out of stock
    if (product.stock === 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }
    addToCart(product, 1);
    toggleWishlist(product); // Remove from wishlist
    showToast('Moved item to Bag successfully!', 'success');
  };

  const handleRemove = (product) => {
    toggleWishlist(product);
    showToast('Removed from Wishlist.', 'info');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-16 mt-[80px] md:mt-[90px] min-h-[60vh] animate-fade-in">
      {/* Title block */}
      <div className="flex items-center space-x-3 mb-8">
        <Link to="/heritage" className="p-2 hover:bg-gray-100 rounded-full transition text-myntra-dark">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-extrabold text-2xl md:text-3xl text-myntra-dark">
          My Wishlist <span className="text-myntra-pink font-semibold">({wishlist.length} Items)</span>
        </h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-550 border border-dashed border-gray-200 rounded-2xl max-w-md mx-auto">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-myntra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-xl text-myntra-dark mb-2">Your wishlist is empty!</h3>
          <p className="text-sm text-myntra-gray mb-8 max-w-xs">
            Add items that you like to your wishlist to buy them later.
          </p>
          <Link
            to="/heritage"
            className="px-6 py-3 bg-myntra-pink hover:bg-myntra-pinkHover text-white font-bold rounded shadow transition-all duration-200"
          >
            Explore Heritage Hub
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const discPrice = calculateDiscountedPrice(product.price, product.discount);
            return (
              <div
                key={product._id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(product)}
                  className="absolute top-3 right-3 z-10 bg-white/95 hover:bg-red-50 p-2 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition duration-200"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Product Image Link */}
                <Link to={`/product/${product._id}`} className="relative pt-[115%] bg-gray-50 overflow-hidden block">
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                  />
                  {product.isGITagged && (
                    <span className="absolute bottom-3 left-3 bg-myntra-pink text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm tracking-wider uppercase">
                      GI Certified
                    </span>
                  )}
                </Link>

                {/* Body details */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-myntra-gray tracking-wider block mb-1">
                      {product.craft} • {product.state}
                    </span>
                    <Link
                      to={`/product/${product._id}`}
                      className="font-bold text-sm text-myntra-dark hover:text-myntra-pink transition leading-snug line-clamp-1 block"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-sm font-black text-myntra-dark">
                        ₹{discPrice.toLocaleString('en-IN')}
                      </span>
                      {product.discount > 0 && (
                        <>
                          <span className="text-xs text-myntra-gray line-through font-semibold">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] font-bold text-orange-500">
                            ({product.discount}% OFF)
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 bg-myntra-pink hover:bg-myntra-pinkHover text-white text-xs font-bold rounded flex items-center justify-center space-x-2 shadow transition duration-200 mt-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
