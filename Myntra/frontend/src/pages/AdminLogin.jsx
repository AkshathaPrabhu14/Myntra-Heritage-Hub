import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const { login, user, isAuthenticated, isAdmin } = useContext(AuthContext);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already authenticated as admin, go straight to dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard');
    } else if (isAuthenticated && !isAdmin) {
      setError('Access Denied: This account is not authorized as an administrator.');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const result = await login(emailOrPhone.trim(), password);
      if (result.success) {
        // Logged in successfully. The useEffect hook will verify if they are admin.
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during administrator login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-[450px] w-full bg-white border border-gray-100 rounded-2xl shadow-xl p-8">
        {/* ACCESS TYPE TABS */}
        <div className="flex border-b border-gray-200 mb-6 text-center text-xs font-black uppercase tracking-wider">
          <Link
            to="/login"
            className="flex-1 pb-3 text-myntra-gray hover:text-myntra-dark transition"
          >
            User Access
          </Link>
          <Link
            to="/admin/login"
            className="flex-1 pb-3 border-b-2 border-myntra-pink text-myntra-pink"
          >
            Admin Access
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="bg-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pink-100">
            <ShieldAlert className="w-8 h-8 text-myntra-pink" />
          </div>
          <h2 className="text-2xl font-black text-myntra-dark mb-2">Admin Portal</h2>
          <p className="text-sm text-myntra-gray font-semibold">
            Authorized administrative access only
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 text-sm px-4 py-3 rounded-lg mb-6 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL OR PHONE */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Admin Email or Phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="auth-input pl-11"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pl-11 pr-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-myntra-pink transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full myntra-btn-primary py-3 rounded-lg text-sm font-extrabold tracking-wider uppercase flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              'Verify Access'
            )}
          </button>
        </form>

        <div className="text-center mt-8 text-sm text-myntra-gray font-semibold">
          Need standard access?{' '}
          <Link to="/login" className="text-myntra-pink hover:underline font-extrabold">
            User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
