import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, CreditCard, Box, Calendar, Award } from 'lucide-react';
import api from '../services/api';
import { resolveImageUrl } from '../services/productService';

const OrderSummary = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error('Error fetching order', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 mt-[90px] text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-myntra-pink mx-auto"></div>
        <p className="mt-4 text-myntra-gray">Loading Order Summary...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 mt-[90px] text-center">
        <h2 className="text-xl font-bold text-myntra-dark mb-4">Order Not Found</h2>
        <Link to="/profile" className="px-6 py-2.5 bg-myntra-pink text-white font-bold rounded">
          Back to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[850px] mx-auto px-4 py-8 md:py-16 mt-[80px] md:mt-[90px] animate-fade-in">
      <div className="flex items-center space-x-3 mb-8">
        <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full transition text-myntra-dark">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-extrabold text-xl md:text-2xl text-myntra-dark">Order Details</h1>
          <p className="text-xs text-myntra-gray mt-0.5">Order ID: #{order._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT COLUMN: ITEMS & PROGRESS */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="border border-gray-150 rounded-lg p-5 bg-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Box className="w-5 h-5 text-myntra-pink" />
              <div>
                <p className="text-sm font-bold text-myntra-dark">Status: {order.status}</p>
                <p className="text-xs text-myntra-gray">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-50 text-orange-600">
              {order.status === 'Processing' ? 'Preparing for shipment' : order.status}
            </span>
          </div>

          {/* Items List */}
          <div className="border border-gray-150 rounded-lg p-5 bg-white space-y-4">
            <h2 className="font-bold text-sm text-myntra-dark border-b border-gray-100 pb-2.5">
              Items Ordered
            </h2>

            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="border-b border-gray-150 pb-4 last:border-0 last:pb-0 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-3.5">
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.name}
                        className="w-12 h-16 object-cover rounded-lg bg-gray-50 flex-shrink-0 border border-gray-200"
                      />
                      <div>
                        <p className="text-xs md:text-sm font-bold text-myntra-dark pr-4">{item.name}</p>
                        <p className="text-[11px] text-myntra-gray font-semibold mt-0.5">Qty: {item.qty} • Size: Free Size</p>
                      </div>
                    </div>
                    <span className="text-xs md:text-sm font-extrabold text-myntra-dark">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {item.product && (
                    <div className="text-[11px] bg-slate-50 border border-gray-150 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center text-myntra-pink font-extrabold uppercase tracking-wider text-[10px]">
                        <span className="bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md flex items-center">
                          <Award className="w-3.5 h-3.5 mr-1 text-myntra-pink" />
                          Cultural Heritage Profile
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
                        <div><strong className="text-myntra-gray font-medium">State of Origin:</strong> <span className="capitalize">{item.product.state}</span></div>
                        <div><strong className="text-myntra-gray font-medium">Craft Tradition:</strong> {item.product.craft}</div>
                        {item.product.artisanName && <div><strong className="text-myntra-gray font-medium">Master Artisan:</strong> {item.product.artisanName}</div>}
                        {item.product.material && <div><strong className="text-myntra-gray font-medium">Authentic Material:</strong> {item.product.material}</div>}
                        {item.product.craftingTime && <div><strong className="text-myntra-gray font-medium">Crafting Duration:</strong> {item.product.craftingTime}</div>}
                        {item.product.giRegistryNumber && <div><strong className="text-myntra-gray font-medium">GI Registry No:</strong> {item.product.giRegistryNumber}</div>}
                      </div>
                      {item.product.story && (
                        <p className="text-slate-500 text-[10.5px] leading-relaxed border-t border-gray-200/60 pt-2">
                          <strong className="text-myntra-gray font-medium block mb-0.5">Regional Story & Legacy:</strong>
                          {item.product.story}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PAYMENT & SHIPPING DETAILS */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="border border-gray-150 rounded-lg p-5 bg-white space-y-3">
            <h3 className="font-bold text-xs text-myntra-gray uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-myntra-pink" />
              <span>Shipping Address</span>
            </h3>
            <p className="text-xs text-myntra-dark font-medium leading-relaxed">
              {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}
            </p>
          </div>

          {/* Payment Method */}
          <div className="border border-gray-150 rounded-lg p-5 bg-white space-y-3">
            <h3 className="font-bold text-xs text-myntra-gray uppercase tracking-wider flex items-center space-x-1.5">
              <CreditCard className="w-3.5 h-3.5 text-myntra-pink" />
              <span>Payment Details</span>
            </h3>
            <div className="text-xs font-semibold text-myntra-dark">
              <p>Method: {order.paymentMethod}</p>
              <p className="text-green-600 mt-1 flex items-center space-x-1">
                <span>Status: Paid</span>
              </p>
            </div>
          </div>

          {/* Pricing Breakup */}
          <div className="border border-gray-150 rounded-lg p-5 bg-gray-50/50 space-y-3.5">
            <h3 className="font-bold text-xs text-myntra-gray uppercase tracking-wider">
              Summary
            </h3>

            <div className="space-y-2 text-xs font-medium text-myntra-dark">
              <div className="flex justify-between">
                <span className="text-myntra-gray">Items Price</span>
                <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-myntra-gray">Shipping</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="flex justify-between items-baseline font-black text-sm text-myntra-dark">
              <span>Total Paid</span>
              <span className="text-myntra-pink text-base">₹{order.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
