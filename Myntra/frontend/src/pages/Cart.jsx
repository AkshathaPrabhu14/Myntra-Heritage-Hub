import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Trash2, Heart, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { resolveImageUrl, calculateDiscountedPrice } from '../services/productService';

const Cart = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    shippingPrice,
    grandTotal,
    updateQty,
    removeFromCart
  } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleMoveToWishlist = (item) => {
    if (!isInWishlist(item._id)) {
      toggleWishlist(item);
      showToast('Moved item to Wishlist.', 'success');
    } else {
      showToast('Item already in Wishlist.', 'info');
    }
    removeFromCart(item._id); // Remove from cart
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showToast('Please login to proceed with checkout.', 'info');
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 md:py-16 mt-[80px] md:mt-[90px] min-h-[70vh] animate-fade-in">
      <h1 className="font-extrabold text-2xl md:text-3xl text-myntra-dark mb-8">
        Shopping Bag <span className="text-myntra-pink font-semibold">({cart.reduce((acc, i) => acc + i.qty, 0)} Items)</span>
      </h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-2xl max-w-md mx-auto border border-gray-150">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-myntra-pink" />
          </div>
          <h3 className="font-bold text-xl text-myntra-dark mb-2">Hey, it feels so light!</h3>
          <p className="text-sm text-myntra-gray mb-8 max-w-xs">
            There is nothing in your bag. Let's add some authentic state crafts!
          </p>
          <Link
            to="/heritage"
            className="px-6 py-3 bg-myntra-pink hover:bg-myntra-pinkHover text-white font-bold rounded shadow transition-all duration-200"
          >
            Explore Heritage Hub
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const discPrice = calculateDiscountedPrice(item.price, item.discount);
              return (
                <div
                  key={item._id}
                  className="flex border border-gray-150 rounded-lg p-4 bg-white hover:shadow-sm transition relative"
                >
                  {/* Image */}
                  <Link to={`/product/${item._id}`} className="w-24 h-32 md:w-28 md:h-36 flex-shrink-0 bg-gray-50 rounded overflow-hidden mr-4">
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item._id}`}
                          className="font-extrabold text-sm md:text-base text-myntra-dark hover:text-myntra-pink transition line-clamp-1 pr-6"
                        >
                          {item.name}
                        </Link>
                        {/* Remove from Cart button */}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-400 hover:text-red-500 transition absolute top-4 right-4"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] font-bold text-myntra-gray uppercase tracking-wider mt-0.5">
                        Craft: {item.craft} • {item.state}
                      </p>

                      {/* Qty & Size dropdowns */}
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-1.5 bg-gray-100 px-2.5 py-1 rounded text-xs font-bold text-myntra-dark">
                          <span>Qty:</span>
                          <select
                            value={item.qty}
                            onChange={(e) => updateQty(item._id, Number(e.target.value))}
                            className="bg-transparent outline-none cursor-pointer"
                          >
                            {[...Array(Math.min(10, item.stock || 10)).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center space-x-1.5 bg-gray-100 px-2.5 py-1 rounded text-xs font-bold text-myntra-dark">
                          <span>Size: Free Size</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex justify-between items-end mt-4">
                      {/* Move to Wishlist */}
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="flex items-center space-x-1 text-xs font-bold text-myntra-gray hover:text-myntra-pink transition"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Move to Wishlist</span>
                      </button>

                      {/* Pricing */}
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm md:text-base font-black text-myntra-dark">
                          ₹{(discPrice * item.qty).toLocaleString('en-IN')}
                        </span>
                        {item.discount > 0 && (
                          <>
                            <span className="text-xs text-myntra-gray line-through font-semibold">
                              ₹{(item.price * item.qty).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] md:text-xs font-bold text-orange-500">
                              ({item.discount}% OFF)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PRICE DETAILS SUMMARY */}
          <div className="border border-gray-150 rounded-lg p-5 bg-gray-50/50 space-y-4">
            <h3 className="text-xs font-extrabold text-myntra-gray uppercase tracking-wider border-b border-gray-200 pb-2.5">
              Price Details ({cart.reduce((acc, i) => acc + i.qty, 0)} Items)
            </h3>

            <div className="space-y-2.5 text-sm text-myntra-dark font-medium">
              <div className="flex justify-between">
                <span className="text-myntra-gray">Total MRP</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-myntra-gray">Discount on MRP</span>
                  <span className="text-green-600">-₹{cartDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-myntra-gray">Convenience Fee</span>
                {shippingPrice === 0 ? (
                  <span className="text-green-600 font-bold uppercase text-xs">FREE</span>
                ) : (
                  <span>₹{shippingPrice}</span>
                )}
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="flex justify-between items-baseline font-black text-base text-myntra-dark">
              <span>Total Amount</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-myntra-pink hover:bg-myntra-pinkHover text-white font-bold rounded shadow transition-all duration-200 flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
            >
              <span>Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5 text-xs text-myntra-gray pt-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>100% SECURE TRANSACTIONS. Genuine handlooms guaranteed directly from certified weavers.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
