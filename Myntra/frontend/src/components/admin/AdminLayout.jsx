import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  LogOut,
  Shield,
  Loader2,
} from 'lucide-react';

const AdminLayout = ({ children, title, subtitle }) => {
  const { user, loading, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-myntra-pink animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Products', path: '/admin/products', icon: Package },
    { label: 'Add Product', path: '/admin/products/add', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-myntra-pink" />
            <div>
              <h1 className="text-lg font-black text-slate-800">{title}</h1>
              {subtitle && (
                <p className="text-xs text-gray-400 font-semibold">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="flex items-center space-x-2 text-xs font-bold text-red-500 hover:text-white border border-red-200 hover:bg-red-500 bg-white px-4 py-2 rounded-lg transition duration-200 self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT ADMIN</span>
          </button>
        </div>
        <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto pb-0">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
                  active
                    ? 'border-myntra-pink text-myntra-pink'
                    : 'border-transparent text-gray-500 hover:text-myntra-pink'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
