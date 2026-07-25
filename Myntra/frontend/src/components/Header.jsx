import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import { Search, User, Heart, ShoppingBag, Menu, X, LogOut, Shield } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { wishlistCount } = useContext(WishlistContext);
  const { cartCount } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      const q = searchQuery.trim();
      if (!q) {
        setSuggestions([]);
        return;
      }
      try {
        const { data } = await api.get(`/products/suggestions?q=${encodeURIComponent(q)}`);
        if (data.success) {
          setSuggestions(data.data);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Men', path: '/search?q=Men' },
    { label: 'Women', path: '/search?q=Women' },
    { label: 'Kids', path: '/search?q=Kids' },
    { label: 'Home & Living', path: '/search?q=Home' },
    { label: 'Beauty', path: '/search?q=Beauty' },
    { label: 'GenZ', path: '/search?q=GenZ' },
  ];

  const isLinkActive = (path) => {
    return location.pathname + location.search === path;
  };

  const isExactPathActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[80px] md:h-[90px] bg-white shadow-sm z-50 flex items-center px-4 md:px-8 border-b border-gray-100">
      <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto gap-4">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0 mr-2 md:mr-4">
          <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hdrMyntraPink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E71D73"/>
                <stop offset="100%" stopColor="#FF3F6C"/>
              </linearGradient>
              <linearGradient id="hdrMyntraOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF3F6C"/>
                <stop offset="100%" stopColor="#FF6F3C"/>
              </linearGradient>
              <linearGradient id="hdrMyntraYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6F3C"/>
                <stop offset="100%" stop-color="#FFB400"/>
              </linearGradient>
            </defs>
            <g transform="translate(5, 5)">
              <path d="M 12 80 L 12 35 C 12 18 25 8 40 8 C 55 8 62 20 62 35 L 62 55 L 48 55 L 48 35 C 48 26 43 20 40 20 C 36 20 27 26 27 35 L 27 80 Z" fill="url(#hdrMyntraPink)"/>
              <path d="M 38 80 L 38 50 C 38 36 47 28 54 28 C 61 28 70 36 70 50 L 70 80 L 57 80 L 57 50 C 57 44 55 41 54 41 C 53 41 51 44 51 50 L 51 80 Z" fill="url(#hdrMyntraOrange)"/>
              <path d="M 48 80 L 48 35 C 48 20 55 8 70 8 C 85 8 98 18 98 35 L 98 80 L 83 80 L 83 35 C 83 26 74 20 70 20 C 66 20 62 26 62 35 L 62 80 Z" fill="url(#hdrMyntraYellow)"/>
            </g>
          </svg>
          <span className="hidden sm:inline-block font-black text-lg md:text-xl tracking-tighter text-myntra-dark">
            MYNTRA<span className="text-myntra-pink text-[10px] uppercase font-bold tracking-widest block -mt-2">Heritage-Hub</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center justify-center space-x-3 xl:space-x-6 flex-grow flex-shrink-0">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className={`text-[12px] xl:text-sm font-bold tracking-wider uppercase border-b-4 py-7 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isLinkActive(link.path)
                  ? 'border-myntra-pink text-myntra-pink'
                  : 'border-transparent text-myntra-dark hover:border-myntra-pink hover:text-myntra-pink'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Heritage Hub */}
          <Link
            to="/heritage"
            className={`text-[12px] xl:text-sm font-bold tracking-wider uppercase border-b-4 py-7 transition-all duration-200 relative whitespace-nowrap ${
              isExactPathActive('/heritage')
                ? 'border-myntra-pink text-myntra-pink'
                : 'border-transparent text-myntra-dark hover:border-myntra-pink hover:text-myntra-pink'
            }`}
          >
            Heritage Hub
            <span className="absolute -top-1 -right-4 bg-myntra-pink text-white text-[8px] font-extrabold px-1 py-0.5 rounded-full animate-pulse">
              NEW
            </span>
          </Link>

          {/* Fashion Passport */}
          <Link
            to="/passport"
            className={`text-[12px] xl:text-sm font-bold tracking-wider uppercase border-b-4 py-7 transition-all duration-200 relative whitespace-nowrap ${
              isExactPathActive('/passport')
                ? 'border-myntra-pink text-myntra-pink'
                : 'border-transparent text-myntra-dark hover:border-myntra-pink hover:text-myntra-pink'
            }`}
          >
            Fashion Passport
            <span className="absolute -top-1 -right-4 bg-gradient-to-r from-amber-500 to-myntra-pink text-white text-[8px] font-extrabold px-1 py-0.5 rounded-full animate-pulse shadow-sm">
              PASSPORT
            </span>
          </Link>

          {/* Outfit Planner */}
          <Link
            to="/outfit-planner"
            className={`text-[12px] xl:text-sm font-bold tracking-wider uppercase border-b-4 py-7 transition-all duration-200 relative whitespace-nowrap ${
              isExactPathActive('/outfit-planner')
                ? 'border-myntra-pink text-myntra-pink'
                : 'border-transparent text-myntra-dark hover:border-myntra-pink hover:text-myntra-pink'
            }`}
          >
            Outfit Planner
            <span className="absolute -top-1 -right-4 bg-gradient-to-r from-orange-400 to-myntra-pink text-white text-[8px] font-extrabold px-1 py-0.5 rounded-full">
              STYLIST
            </span>
          </Link>
        </nav>

        {/* SEARCH BAR (Flexible, shrinks first) */}
        <div className="hidden md:block relative w-full min-w-[150px] max-w-[320px] xl:max-w-[400px] flex-shrink flex-grow-0 ml-4 mr-2">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-myntra-light border border-transparent focus-within:border-gray-200 focus-within:bg-white rounded-md w-full px-3 py-2 transition-all duration-200"
          >
            <Search className="text-myntra-gray w-5 h-5 mr-2 flex-shrink-0" onClick={handleSearch} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search products..."
              className="bg-transparent border-none outline-none text-sm w-full text-myntra-dark placeholder-myntra-gray text-ellipsis overflow-hidden whitespace-nowrap"
            />
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-150 rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto animate-slide-in">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-myntra-dark hover:bg-pink-50/50 hover:text-myntra-pink border-b border-gray-50 last:border-0 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* UTILITIES (Profile, Wishlist, Bag) - Strict no-shrink */}
        <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0 relative">
          
          {/* PROFILE ICON / DROPDOWN */}
          <div
            className="relative cursor-pointer group"
            onMouseEnter={() => setProfileDropdownOpen(true)}
            onMouseLeave={() => setProfileDropdownOpen(false)}
            onClick={() => {
              if (window.innerWidth < 1024) {
                 navigate(isAuthenticated ? '/profile' : '/login');
              }
            }}
          >
            <div className="flex flex-col items-center">
              <User className={`w-6 h-6 transition ${isExactPathActive('/profile') ? 'text-myntra-pink' : 'text-myntra-dark group-hover:text-myntra-pink'}`} />
              <span className={`text-[10px] font-bold mt-1 transition ${isExactPathActive('/profile') ? 'text-myntra-pink' : 'text-myntra-dark group-hover:text-myntra-pink'}`}>Profile</span>
            </div>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="hidden lg:block absolute right-[-80px] top-[40px] pt-4 w-[280px] z-50 transition-all duration-200">
                <div className="bg-white border border-gray-100 shadow-xl rounded-b-md p-5 relative before:content-[''] before:absolute before:-top-2 before:left-[140px] before:border-8 before:border-transparent before:border-b-white">
                  {isAuthenticated ? (
                    <div>
                      <h4 className="font-bold text-sm text-myntra-dark">Hello, {user.name}</h4>
                      <p className="text-xs text-myntra-gray truncate mb-3">{user.email}</p>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center space-x-2 text-xs font-bold text-myntra-pink mb-4 bg-pink-50 p-2 rounded hover:bg-pink-100 transition"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}
                      <hr className="my-3 border-gray-100" />
                      <Link
                        to="/passport"
                        className="block py-2 text-sm text-myntra-dark hover:text-myntra-pink font-semibold"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Fashion Passport
                      </Link>
                      <Link
                        to="/outfit-planner"
                        className="block py-2 text-sm text-myntra-dark hover:text-myntra-pink font-semibold"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Outfit Planner
                      </Link>
                      <Link
                        to="/profile"
                        className="block py-2 text-sm text-myntra-dark hover:text-myntra-pink font-semibold"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full text-left py-2 text-sm text-red-500 hover:text-red-700 font-semibold mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-bold text-sm text-myntra-dark">Welcome</h4>
                      <p className="text-xs text-myntra-gray mb-4">To access account and manage orders</p>
                      <Link
                        to="/login"
                        className="block w-full py-2.5 text-center text-sm font-bold border border-gray-200 rounded hover:border-myntra-pink text-myntra-pink hover:bg-pink-50 transition duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        LOGIN / SIGNUP
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* WISHLIST */}
          <Link to="/wishlist" className="flex flex-col items-center cursor-pointer relative group flex-shrink-0">
            <Heart className={`w-6 h-6 transition ${(isExactPathActive('/wishlist') || wishlistCount > 0) ? 'text-myntra-pink fill-myntra-pink' : 'text-myntra-dark group-hover:text-myntra-pink'}`} />
            <span className={`text-[10px] font-bold mt-1 transition ${isExactPathActive('/wishlist') ? 'text-myntra-pink' : 'text-myntra-dark group-hover:text-myntra-pink'}`}>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-myntra-pink text-white text-[8px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center animate-bounce shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* BAG */}
          <Link to="/cart" className="flex flex-col items-center cursor-pointer relative group flex-shrink-0">
            <ShoppingBag className={`w-6 h-6 transition ${isExactPathActive('/cart') ? 'text-myntra-pink' : 'text-myntra-dark group-hover:text-myntra-pink'}`} />
            <span className={`text-[10px] font-bold mt-1 transition ${isExactPathActive('/cart') ? 'text-myntra-pink' : 'text-myntra-dark group-hover:text-myntra-pink'}`}>Bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-myntra-pink text-white text-[8px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center animate-bounce shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="lg:hidden block p-1 focus:outline-none text-myntra-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[80px] md:top-[90px] left-0 right-0 bg-white shadow-xl border-t border-gray-100 py-4 px-4 z-40 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center bg-myntra-light border border-transparent rounded-lg px-3 py-2.5 mb-4">
              <Search className="text-myntra-gray w-5 h-5 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent border-none outline-none text-sm w-full text-myntra-dark"
              />
            </form>

            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className={`text-sm font-bold tracking-wider uppercase py-3 px-2 border-b border-gray-50 flex items-center transition-colors ${
                  isLinkActive(link.path) ? 'text-myntra-pink bg-pink-50/30' : 'text-myntra-dark hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/heritage"
              className={`text-sm font-bold tracking-wider uppercase py-3 px-2 border-b border-gray-50 flex items-center justify-between transition-colors ${
                isExactPathActive('/heritage') ? 'text-myntra-pink bg-pink-50/30' : 'text-myntra-dark hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Heritage Hub</span>
              <span className="bg-myntra-pink text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                NEW
              </span>
            </Link>

            <Link
              to="/passport"
              className={`text-sm font-bold tracking-wider uppercase py-3 px-2 border-b border-gray-50 flex items-center justify-between transition-colors ${
                isExactPathActive('/passport') ? 'text-myntra-pink bg-pink-50/30' : 'text-myntra-dark hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Fashion Passport</span>
              <span className="bg-gradient-to-r from-amber-500 to-myntra-pink text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                PASSPORT
              </span>
            </Link>

            <Link
              to="/outfit-planner"
              className={`text-sm font-bold tracking-wider uppercase py-3 px-2 flex items-center justify-between transition-colors ${
                isExactPathActive('/outfit-planner') ? 'text-myntra-pink bg-pink-50/30' : 'text-myntra-dark hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Outfit Planner</span>
              <span className="bg-gradient-to-r from-orange-400 to-myntra-pink text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                STYLIST
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
