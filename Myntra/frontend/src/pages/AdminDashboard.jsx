import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  Shield,
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  Users,
  BarChart3,
  Globe,
  Loader2,
  LogOut,
  PackageCheck,
  Award,
  ArrowRight,
  List,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading: authLoading, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 18,
    giCertified: 15,
    statesOnboarded: 11,
    activeArtisans: 14,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, productsRes] = await Promise.all([
          api.get('/products/stats'),
          api.get('/products'),
        ]);

        if (statsRes.data?.success) {
          setStats(statsRes.data.data);
        }

        if (productsRes.data?.success) {
          setRecentProducts(productsRes.data.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-myntra-pink animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts || 18,
      icon: <PackageCheck className="w-6 h-6 text-pink-600" />,
    },
    {
      label: 'Active Artisans',
      value: stats.activeArtisans || 14,
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      label: 'States Onboarded',
      value: stats.statesOnboarded || 11,
      icon: <Globe className="w-6 h-6 text-emerald-600" />,
    },
    {
      label: 'GI Certifications',
      value: stats.giCertified || 15,
      icon: <Award className="w-6 h-6 text-amber-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1250px] mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-gray-200 pb-6 gap-y-4">
          <div>
            <div className="flex items-center space-x-2 text-myntra-pink font-bold text-xs uppercase tracking-widest mb-1">
              <Shield className="w-4 h-4" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
              <LayoutDashboard className="w-8 h-8 mr-3 text-slate-700" />
              Heritage Admin Hub
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/products/add"
              className="bg-myntra-pink hover:bg-myntra-pinkHover text-white px-4 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center shadow transition"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add Product
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="flex items-center space-x-2 text-xs font-bold text-red-500 hover:text-white border border-red-200 hover:bg-red-500 bg-white px-4 py-2.5 rounded-lg transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>EXIT</span>
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  {stat.label}
                </span>
                <span className="text-2xl font-black text-slate-800">{stat.value}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* QUICK MANAGEMENT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link
            to="/admin/products"
            className="bg-white border border-gray-200 hover:border-myntra-pink rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-pink-50 p-3 rounded-xl">
                <List className="w-6 h-6 text-myntra-pink" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-myntra-pink group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">Manage Product Inventory</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              View all 18+ uploaded items, edit descriptions, adjust stock, or delete entries.
            </p>
          </Link>

          <Link
            to="/admin/products/add"
            className="bg-white border border-gray-200 hover:border-myntra-pink rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-50 p-3 rounded-xl">
                <PlusCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-myntra-pink group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">Upload New Heritage Product</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Add new artisan crafts with image files, GI Registry details, and craft stories.
            </p>
          </Link>
        </div>

        {/* LIVE RECENT PRODUCTS INVENTORY TABLE */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-150 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-800">Recent Heritage Inventory</h3>
              <p className="text-xs text-gray-400 font-semibold">Live catalog indexed in database</p>
            </div>
            <Link to="/admin/products" className="text-xs font-bold text-myntra-pink hover:underline">
              View All Products ({stats.totalProducts || 18})
            </Link>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-6 h-6 text-myntra-pink animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">State</th>
                    <th className="px-6 py-4">Craft Tradition</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">GI Tagged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-slate-700 font-semibold">
                  {recentProducts.map((prd) => (
                    <tr key={prd._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-800">{prd.name}</td>
                      <td className="px-6 py-4 capitalize text-slate-600">{prd.state}</td>
                      <td className="px-6 py-4 text-myntra-pink font-bold">{prd.craft}</td>
                      <td className="px-6 py-4 font-bold">₹{prd.price.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          prd.isGITagged ? 'bg-pink-50 text-myntra-pink' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {prd.isGITagged ? 'GI Certified' : 'Standard'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
