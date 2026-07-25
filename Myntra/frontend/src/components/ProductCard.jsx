import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Sparkles } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { calculateDiscountedPrice, resolveImageUrl } from '../services/productService';

const ProductCard = ({ product, passportStates = null }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { showToast } = useToast();

  const isWishlisted = isInWishlist(product._id);
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

  const cleanState = (product.state || '').toLowerCase().trim();
  const isStateCollected = passportStates ? passportStates.includes(cleanState) : null;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    showToast(
      added ? `Added ${product.name} to Wishlist!` : `Removed ${product.name} from Wishlist.`,
      added ? 'success' : 'info'
    );
  };

  // Determine badges
  const isLimited = product.stock !== undefined && product.stock > 0 && product.stock < 8;

  return (
    <Link
      to={`/product/${product._id}`}
      className="bg-white rounded-xl border border-gray-100 hover:border-pink-150 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group relative animate-fade-in"
    >
      {/* WISHLIST BUTTON */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3.5 right-3.5 z-10 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-200"
      >
        <Heart
          className={`w-4 h-4 transition duration-200 ${
            isWishlisted ? 'fill-myntra-pink text-myntra-pink scale-110' : 'text-myntra-dark hover:text-myntra-pink'
          }`}
        />
      </button>

      {/* GI TAG BADGE */}
      {product.isGITagged && (
        <span className="absolute top-3.5 left-3.5 z-10 bg-myntra-pink text-white text-[8px] font-black px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
          GI Certified
        </span>
      )}

      {/* LIMITED EDITION BADGE */}
      {!product.isGITagged && isLimited && (
        <span className="absolute top-3.5 left-3.5 z-10 bg-amber-500 text-white text-[8px] font-black px-2.5 py-1 rounded shadow-md uppercase tracking-wider flex items-center space-x-1">
          <Sparkles className="w-2.5 h-2.5 animate-spin" />
          <span>Limited</span>
        </span>
      )}

      {/* PRODUCT IMAGE */}
      <div className="relative overflow-hidden pt-[115%] bg-gray-50">
        <img
          src={resolveImageUrl(product.image)}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.isEcoFriendly && (
          <div className="absolute bottom-2.5 left-2.5 bg-emerald-600/90 text-white text-[8px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-widest">
            Eco-Friendly
          </div>
        )}
      </div>

      {/* PRODUCT BODY */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center text-[10px] font-bold text-myntra-gray uppercase tracking-wider mb-1.5 flex-wrap gap-1">
            <span className="bg-pink-50 text-myntra-pink px-1.5 py-0.5 rounded">Heritage Craft</span>
            <span className={`px-1.5 py-0.5 rounded capitalize flex items-center space-x-1 font-extrabold ${
              isStateCollected === true
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : isStateCollected === false
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-orange-50 text-orange-600'
            }`}>
              <span>{product.state}</span>
              {isStateCollected === true && <span className="text-[8px] bg-emerald-600 text-white px-1 py-0.2 rounded-full uppercase ml-1">Collected</span>}
              {isStateCollected === false && <span className="text-[8px] bg-amber-500 text-white px-1 py-0.2 rounded-full uppercase ml-1">New State</span>}
            </span>
          </div>

          <h4 className="font-bold text-sm text-myntra-dark leading-snug group-hover:text-myntra-pink transition duration-200 line-clamp-1 mb-1">
            {product.name}
          </h4>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-1">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-[11px] font-bold text-myntra-dark">{product.rating}</span>
              <span className="text-[10px] text-myntra-gray font-medium">| {product.reviews?.length || 0} Reviews</span>
            </div>
            
            <span className="text-[9px] font-bold text-emerald-600 uppercase">100% Handmade</span>
          </div>
        </div>

        <div className="flex items-baseline space-x-2 pt-2 border-t border-gray-50 mt-auto">
          <span className="text-sm font-black text-myntra-dark">
            ₹{discountedPrice.toLocaleString('en-IN')}
          </span>
          {product.discount > 0 && (
            <>
              <span className="text-xs text-myntra-gray line-through font-semibold">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-orange-500">
                ({product.discount}% OFF)
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
