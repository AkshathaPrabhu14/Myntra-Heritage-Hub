import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { resolveImageUrl, INDIAN_STATES } from '../services/productService';
import {
  Shield,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Award,
  RefreshCw,
  Copy,
} from 'lucide-react';

const AdminProducts = () => {
  const { user, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (stateFilter) params.append('state', stateFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const { data } = await api.get(url);
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error loading admin products list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin, search, stateFilter]);

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      const { data } = await api.delete(`/products/${id}`);
      if (data.success) {
        setProducts(products.filter((p) => p._id !== id));
        setMessage({ type: 'success', text: 'Product deleted successfully.' });
        setDeleteModalId(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setMessage({ type: 'error', text: 'Failed to delete product.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (authLoading || (!user && isAdmin)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-myntra-pink animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1300px] mx-auto">
        {/* TOP NAVBAR & BACK LINK */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200 gap-y-4">
          <div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center text-xs font-bold text-myntra-pink hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center">
              <Shield className="w-7 h-7 mr-2 text-myntra-pink" />
              Manage Inventory
            </h1>
          </div>

          <Link
            to="/admin/products/add"
            className="bg-myntra-pink hover:bg-myntra-pinkHover text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center shadow-md transition"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add New Product
          </Link>
        </div>

        {/* NOTIFICATION MESSAGE */}
        {message.text && (
          <div
            className={`p-4 rounded-xl mb-6 text-xs font-bold flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-2" />
              )}
              {message.text}
            </div>
            <button onClick={() => setMessage({ type: '', text: '' })} className="font-bold text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        )}

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, craft, or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-myntra-pink"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-myntra-pink bg-white capitalize"
            >
              <option value="">All States</option>
              {INDIAN_STATES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRODUCTS TABLE */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 text-myntra-pink animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-semibold text-xs">
              No products found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">State & Craft</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Badges</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-slate-700 font-semibold">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={resolveImageUrl(p.image)}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 line-clamp-1">{p.name}</span>
                            <span className="text-[10px] text-gray-400 block">Artisan: {p.artisanName || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize block font-bold text-slate-800">{p.state}</span>
                        <span className="text-[10px] text-myntra-pink font-bold">{p.craft}</span>
                      </td>
                      <td className="px-6 py-4">{p.category}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.availability === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {p.availability} ({p.stock || 10})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.isGITagged && (
                          <span className="bg-myntra-pink text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase mr-1">
                            GI
                          </span>
                        )}
                        {p.isEcoFriendly && (
                          <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                            Eco
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          to={`/admin/products/add?clone=${p._id}`}
                          className="inline-flex p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Clone/Duplicate Product"
                        >
                          <Copy className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModalId(p._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        {deleteModalId && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">Delete Product?</h3>
              <p className="text-xs text-gray-500 mb-6">
                This action will permanently remove this item from the Heritage Hub database and state catalogs.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="flex-1 py-2.5 text-xs font-bold border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModalId)}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 flex justify-center items-center"
                >
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
