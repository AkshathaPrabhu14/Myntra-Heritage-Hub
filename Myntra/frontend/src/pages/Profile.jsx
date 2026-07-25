import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, Shield, ShoppingBag, LogOut, Loader2, Eye, ChevronRight, Award } from 'lucide-react';
import api from '../services/api';
import { resolveImageUrl } from '../services/productService';

const Profile = () => {
  const { user, loading, logout, isAuthenticated } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      try {
        const { data } = await api.get('/orders/myorders');
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-myntra-pink animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[800px] mx-auto">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-black text-myntra-dark tracking-tight">Account Profile</h1>
          <p className="text-sm text-myntra-gray font-semibold">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* PROFILE SUMMARY CARD */}
          <div className="md:col-span-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-myntra-pink text-3xl font-black mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-bold text-lg text-myntra-dark">{user.name}</h3>
            <span className="text-xs bg-pink-50 text-myntra-pink px-2.5 py-1 rounded-full font-bold mt-2 uppercase tracking-wider">
              {user.role === 'admin' ? 'Administrator' : 'Heritage Patron'}
            </span>
            <button
              onClick={handleLogout}
              className="mt-6 flex items-center justify-center space-x-2 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 w-full py-2.5 rounded-lg transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          </div>

          {/* USER DETAILS & MOCK STATS */}
          <div className="md:col-span-2 space-y-6">
            {/* DETAILS */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-base text-myntra-dark mb-4 border-b border-gray-100 pb-3">
                Personal Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <User className="text-myntra-gray w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] text-myntra-gray font-extrabold uppercase tracking-wider">Name</span>
                    <span className="text-sm font-bold text-myntra-dark">{user.name}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="text-myntra-gray w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] text-myntra-gray font-extrabold uppercase tracking-wider">Email Address</span>
                    <span className="text-sm font-bold text-myntra-dark">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="text-myntra-gray w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] text-myntra-gray font-extrabold uppercase tracking-wider">Phone Number</span>
                    <span className="text-sm font-bold text-myntra-dark">{user.phone}</span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="flex items-center space-x-4">
                    <Shield className="text-myntra-pink w-5 h-5 flex-shrink-0" />
                    <div>
                      <span className="block text-[10px] text-myntra-gray font-extrabold uppercase tracking-wider">Privilege Access</span>
                      <span className="text-sm font-bold text-myntra-pink">Admin dashboard enabled</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FASHION PASSPORT SUMMARY CARD - MYNTRA LIGHT UI */}
            <div className="bg-gradient-to-r from-pink-50/80 via-white to-orange-50/50 border border-pink-150 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-pink-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="text-myntra-pink w-5 h-5" />
                  <h3 className="font-black text-base text-myntra-dark">Fashion Passport</h3>
                </div>
                <span className="text-[10px] font-extrabold bg-pink-100 text-myntra-pink border border-pink-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Cultural Loyalty
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="block text-[10px] text-myntra-gray font-extrabold uppercase">States</span>
                  <span className="text-xl font-black text-myntra-dark">
                    {user.passport?.totalStatesCollected || 0} <span className="text-xs text-myntra-gray font-normal">/ 28</span>
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="block text-[10px] text-myntra-gray font-extrabold uppercase">Crafts</span>
                  <span className="text-xl font-black text-myntra-dark">
                    {user.passport?.totalCraftsCollected || 0}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="block text-[10px] text-myntra-gray font-extrabold uppercase">Progress</span>
                  <span className="text-xl font-black text-myntra-pink">
                    {user.passport?.passportProgress || 0}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden p-0.5 border border-gray-200">
                <div
                  className="bg-gradient-to-r from-myntra-pink to-orange-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${user.passport?.passportProgress || 0}%` }}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-myntra-dark">
                  <span className="text-myntra-gray font-semibold">Next Reward: </span>
                  <strong className="text-myntra-pink font-extrabold">Free Shipping / Coupon</strong>
                </div>
                <Link
                  to="/passport"
                  className="px-4 py-2 bg-myntra-pink hover:bg-myntra-pinkHover text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-sm"
                >
                  <span>View Passport</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* ORDER HISTORY CONTAINER */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-base text-myntra-dark mb-4 border-b border-gray-100 pb-3">
                Heritage Orders ({orders.length})
              </h3>
              
              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-myntra-pink animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-myntra-gray opacity-50 mb-3" />
                  <h4 className="font-bold text-sm text-myntra-dark mb-1">No Orders Placed Yet</h4>
                  <p className="text-xs text-myntra-gray font-semibold max-w-[320px] mb-4">
                    You haven't bought any heritage treasures yet. Visit the Heritage Hub to explore products.
                  </p>
                  <button
                    onClick={() => navigate('/heritage')}
                    className="text-xs font-bold text-myntra-pink hover:text-white border border-myntra-pink hover:bg-myntra-pink px-4 py-2 rounded-lg transition duration-200"
                  >
                    Explore Hub
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-100 rounded-xl p-4 bg-white hover:border-pink-100 transition shadow-sm hover:shadow-md flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-myntra-dark">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-myntra-gray font-semibold">
                          Placed: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs font-bold text-myntra-dark">
                          Total: <span className="text-myntra-pink font-extrabold">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                        </p>
                      </div>

                      {/* Preview of item thumbnails */}
                      <div className="flex items-center space-x-1.5">
                        {order.orderItems.slice(0, 3).map((item) => (
                          <img
                            key={item._id}
                            src={resolveImageUrl(item.image)}
                            alt={item.name}
                            className="w-8 h-10 object-cover rounded bg-gray-50 border border-gray-100"
                            title={item.name}
                          />
                        ))}
                        {order.orderItems.length > 3 && (
                          <span className="text-[10px] font-bold text-myntra-gray pl-1">
                            +{order.orderItems.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Detail CTA */}
                      <Link
                        to={`/order-summary/${order._id}`}
                        className="flex items-center justify-center space-x-1 px-3 py-1.5 border border-gray-200 rounded text-xs font-bold text-myntra-dark hover:border-myntra-pink hover:text-myntra-pink transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
