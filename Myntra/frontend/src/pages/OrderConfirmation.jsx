import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Calendar, CheckCircle2, ArrowRight, Award, Sparkles, X, Trophy } from 'lucide-react';
import api from '../services/api';
import { resolveImageUrl } from '../services/productService';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Newly unlocked states from checkout state
  const newlyUnlockedStates = location.state?.newlyUnlockedStates || [];
  const [showCelebrationModal, setShowCelebrationModal] = useState(newlyUnlockedStates.length > 0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error('Error loading order details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="max-w-[700px] mx-auto px-4 py-16 mt-[80px] md:mt-[90px] text-center min-h-[70vh] flex flex-col items-center justify-center animate-fade-in relative">
      {/* CELEBRATION MODAL POPUP - MYNTRA PREMIUM LIGHT UI */}
      {showCelebrationModal && newlyUnlockedStates.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5 relative overflow-hidden">
            <button
              onClick={() => setShowCelebrationModal(false)}
              className="absolute top-4 right-4 p-1.5 text-myntra-gray hover:text-myntra-dark rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-pink-50 text-myntra-pink rounded-full border border-pink-200 flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-myntra-pink text-xs font-bold uppercase tracking-wider bg-pink-50 border border-pink-150 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>State Badge Unlocked!</span>
              </div>
              <h2 className="text-2xl font-black text-myntra-dark pt-2">
                🎉 Congratulations!
              </h2>
            </div>

            <div className="space-y-3 bg-slate-50 border border-gray-150 rounded-2xl p-4 text-left">
              {newlyUnlockedStates.map((unlocked, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-myntra-pink text-white flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-myntra-dark capitalize">
                      {unlocked.state} Heritage Badge
                    </h4>
                    <p className="text-xs text-myntra-pink font-semibold">{unlocked.craft}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-myntra-gray font-medium">
              Added to your <strong className="text-myntra-dark">Fashion Passport</strong>. Your cultural loyalty rewards progress has been updated!
            </p>

            <div className="flex flex-col sm:flex-row space-y-2.5 sm:space-y-0 sm:space-x-3 pt-2">
              <Link
                to="/passport"
                className="w-full py-3 bg-myntra-pink hover:bg-myntra-pinkHover text-white font-extrabold text-xs rounded-xl shadow transition uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <Award className="w-4 h-4" />
                <span>View Fashion Passport</span>
              </Link>
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-myntra-dark font-bold text-xs rounded-xl transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-sm">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <h1 className="font-extrabold text-2xl md:text-3xl text-myntra-dark mb-2">
        Thank You for Your Order!
      </h1>
      <p className="text-sm text-myntra-gray max-w-md mb-8">
        Your order has been placed successfully. You are supporting local Indian weavers and saving traditional craft traditions.
      </p>

      {/* Details Box */}
      {!loading && order && (
        <div className="w-full border border-gray-150 rounded-xl p-5 bg-gray-50/50 text-left mb-8 space-y-4 max-w-lg">
          <div className="flex justify-between items-center text-xs text-myntra-gray">
            <span>Order ID: <strong className="text-myntra-dark">{order._id}</strong></span>
            <span>Date: <strong>{new Date(order.createdAt).toLocaleDateString()}</strong></span>
          </div>

          <hr className="border-gray-200/60" />

          <div className="space-y-2">
            <h4 className="font-bold text-xs text-myntra-gray uppercase tracking-wider">Estimated Delivery</h4>
            <div className="flex items-center space-x-2 text-sm text-myntra-dark font-semibold">
              <Calendar className="w-4 h-4 text-myntra-pink" />
              <span>In 5 - 7 Business Days</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-xs text-myntra-gray uppercase tracking-wider">Delivery To</h4>
            <p className="text-sm text-myntra-dark font-medium leading-relaxed">
              {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}
            </p>
          </div>

          <hr className="border-gray-200/60" />

          {/* Items Section with Heritage Details */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-xs text-myntra-gray uppercase tracking-wider">Items Purchased & Heritage Origin</h4>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="border-b border-gray-200/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.name}
                        className="w-10 h-14 object-cover rounded-lg bg-gray-50 flex-shrink-0 border border-gray-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-myntra-dark line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-myntra-gray font-semibold mt-0.5">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-myntra-dark">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>

                  {item.product && (
                    <div className="mt-2.5 text-[10px] bg-white border border-gray-150 rounded-xl p-3 space-y-2 shadow-xs">
                      <div className="flex items-center text-myntra-pink font-extrabold uppercase tracking-wider text-[9px]">
                        <Award className="w-3.5 h-3.5 mr-1" />
                        <span>Cultural Heritage Profile</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold text-slate-700">
                        <div><strong className="text-myntra-gray font-medium">State:</strong> <span className="capitalize">{item.product.state}</span></div>
                        <div><strong className="text-myntra-gray font-medium">Craft:</strong> {item.product.craft}</div>
                        {item.product.artisanName && <div><strong className="text-myntra-gray font-medium">Artisan:</strong> {item.product.artisanName}</div>}
                        {item.product.material && <div><strong className="text-myntra-gray font-medium">Material:</strong> {item.product.material}</div>}
                      </div>
                      {item.product.story && (
                        <p className="text-slate-500 text-[9.5px] leading-relaxed border-t border-gray-150 pt-2">
                          <strong className="text-myntra-gray font-medium block mb-0.5">The Legacy Story:</strong>
                          {item.product.story}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-baseline font-black text-sm text-myntra-dark pt-2 border-t border-gray-200/60">
            <span>Total Paid</span>
            <span className="text-base text-myntra-pink">₹{order.totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Link
          to="/passport"
          className="px-6 py-3 bg-gradient-to-r from-slate-900 to-rose-950 text-white font-bold rounded shadow transition text-sm flex items-center justify-center space-x-2 border border-slate-800"
        >
          <Award className="w-4 h-4 text-myntra-pink" />
          <span>Fashion Passport</span>
        </Link>
        <Link
          to="/profile"
          className="px-6 py-3 bg-white border border-gray-300 text-myntra-dark font-bold rounded shadow-sm hover:border-gray-400 transition text-sm flex items-center justify-center space-x-2"
        >
          <span>View Orders</span>
        </Link>
        <Link
          to="/heritage"
          className="px-6 py-3 bg-myntra-pink hover:bg-myntra-pinkHover text-white font-bold rounded shadow transition text-sm flex items-center justify-center space-x-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
