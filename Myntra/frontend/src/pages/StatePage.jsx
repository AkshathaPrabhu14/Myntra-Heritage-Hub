import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import { stateMapping } from '../utils/stateMapping';
import { ChevronRight, Home, Info, Loader2, RefreshCw, CheckCircle2, Lock, Award } from 'lucide-react';

const StatePage = () => {
  const { stateName } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isCollected, setIsCollected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const currentStateInfo = stateMapping[stateName.toLowerCase()] || {
    dbName: stateName.replace(/-/g, ' '),
    title: stateName.replace(/-/g, ' ').toUpperCase(),
    desc: 'Explore authentic handlooms, handicrafts, and regional heritage treasures.',
  };

  const [filters, setFilters] = useState({
    categories: [],
    crafts: [],
    materials: [],
    maxPrice: 50000,
    isEcoFriendly: false,
    isGITagged: false,
    minRating: 0,
  });

  // Fetch all products of this state
  useEffect(() => {
    const fetchStateProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/products', { params: { state: currentStateInfo.dbName } });
        if (data.success) {
          setAllProducts(data.data);
          setFilteredProducts(data.data);
        } else {
          setError('Failed to load products.');
        }
        // Check user passport status
        try {
          const passRes = await api.get('/passport');
          if (passRes.data?.success && passRes.data?.data?.unlockedStates) {
            const dbState = currentStateInfo.dbName.toLowerCase().trim();
            const collected = passRes.data.data.unlockedStates.some(
              (s) => s.state.toLowerCase().trim() === dbState
            );
            setIsCollected(collected);
          }
        } catch (passErr) {
          setIsCollected(false);
        }
      } catch (err) {
        setError('Error fetching products from server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStateProducts();
  }, [stateName, currentStateInfo.dbName]);

  // Extract unique crafts & materials dynamically from loaded products for filter checklists
  const uniqueCrafts = [...new Set(allProducts.map((p) => p.craft))].filter(Boolean);
  const uniqueMaterials = [...new Set(allProducts.map((p) => p.material))].filter(Boolean);

  // Apply filters locally
  useEffect(() => {
    let result = [...allProducts];

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Craft filter
    if (filters.crafts.length > 0) {
      result = result.filter((p) => filters.crafts.includes(p.craft));
    }

    // Material filter
    if (filters.materials.length > 0) {
      result = result.filter((p) => filters.materials.includes(p.material));
    }

    // Price filter (calculating discount)
    result = result.filter((p) => {
      const discountedPrice = p.discount ? Math.round(p.price - (p.price * p.discount) / 100) : p.price;
      return discountedPrice <= filters.maxPrice;
    });

    // GI Certified filter
    if (filters.isGITagged) {
      result = result.filter((p) => p.isGITagged === true);
    }

    // Eco Friendly filter
    if (filters.isEcoFriendly) {
      result = result.filter((p) => p.isEcoFriendly === true);
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    setFilteredProducts(result);
  }, [filters, allProducts]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* BREADCRUMBS */}
        <nav className="flex items-center space-x-2 text-xs font-bold text-myntra-gray uppercase tracking-wider mb-6">
          <Link to="/" className="hover:text-myntra-pink flex items-center">
            <Home className="w-3.5 h-3.5 mr-1" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/heritage" className="hover:text-myntra-pink">
            Heritage Hub
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-myntra-dark">{currentStateInfo.title}</span>
        </nav>

        {/* STATE HEADER CARD */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm relative overflow-hidden">
          <div className="max-w-[800px] relative z-10">
            <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded mb-4 inline-block">
              State Heritage Profile
            </span>
            <div className="flex items-center space-x-3 mb-3 flex-wrap gap-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-myntra-dark">
                {currentStateInfo.title} Collection
              </h1>
              {isCollected ? (
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Collected ✓</span>
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Not Collected 🔒</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-myntra-gray font-semibold leading-relaxed">
              {currentStateInfo.desc}
            </p>
          </div>
          {/* Decorative faint background badge */}
          <div className="absolute right-6 bottom-4 text-gray-100/70 text-7xl font-black uppercase pointer-events-none hidden md:block select-none">
            {currentStateInfo.title.substring(0, 10)}
          </div>
        </div>

        {/* CONTENT VIEWPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* FILTER DRAWER (COL 1) */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              uniqueCrafts={uniqueCrafts}
              uniqueMaterials={uniqueMaterials}
            />
          </div>

          {/* PRODUCT VIEWPORT (COL 2-4) */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white border border-gray-150 rounded-2xl shadow-sm p-12">
                <Loader2 className="w-8 h-8 text-myntra-pink animate-spin mb-3" />
                <span className="text-xs font-bold text-myntra-gray uppercase tracking-widest">
                  Loading Local Artistry...
                </span>
              </div>
            ) : error ? (
              <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-12 text-center">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="myntra-btn-primary px-4 py-2 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-2" /> Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-12 text-center flex flex-col items-center justify-center">
                <Info className="w-12 h-12 text-myntra-gray opacity-45 mb-4" />
                <h3 className="font-extrabold text-lg text-myntra-dark mb-1">
                  No Matching Products
                </h3>
                <p className="text-xs text-myntra-gray font-semibold max-w-[360px] leading-relaxed mb-6">
                  No crafts from {currentStateInfo.title} currently match your active filters. Try adjusting price sliders or checkboxes.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      categories: [],
                      crafts: [],
                      materials: [],
                      maxPrice: 50000,
                      isEcoFriendly: false,
                      isGITagged: false,
                      minRating: 0,
                    })
                  }
                  className="text-xs font-bold text-myntra-pink border border-myntra-pink px-4 py-2.5 rounded-lg hover:bg-pink-50 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div>
                {/* SORT & COUNT HEADER */}
                <div className="flex justify-between items-center bg-white border border-gray-150 rounded-xl px-5 py-3.5 mb-6 shadow-sm">
                  <span className="text-xs font-bold text-myntra-dark">
                    Showing <span className="text-myntra-pink">{filteredProducts.length}</span> authentic items
                  </span>
                  <span className="text-[10px] text-myntra-gray font-extrabold uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded">
                    Myntra Verified
                  </span>
                </div>

                {/* PRODUCT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatePage;
