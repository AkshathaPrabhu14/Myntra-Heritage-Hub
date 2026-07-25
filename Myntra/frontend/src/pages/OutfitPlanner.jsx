import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { calculateDiscountedPrice, resolveImageUrl } from '../services/productService';
import api from '../services/api';
import {
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Award,
  RefreshCw,
  MapPin,
  Layers,
  Tag,
  ArrowRight,
  Loader2,
  ShieldCheck,
  ChevronRight,
  Briefcase,
  Heart,
  Calendar,
  Smile,
  GraduationCap,
  Users,
} from 'lucide-react';

const OCCASIONS = [
  { id: 'Wedding', name: 'Wedding', desc: 'Grand royal sarees, gold zari, and temple jewelry', icon: '💍' },
  { id: 'Festival', name: 'Festival', desc: 'Vibrant silk weaves, festive dupattas & handicrafts', icon: '🪔' },
  { id: 'Office', name: 'Office', desc: 'Elegant handloom linen, minimal heritage accessories', icon: '💼' },
  { id: 'Casual', name: 'Casual', desc: 'Comfortable printed cottons, terracotta & wooden crafts', icon: '🌿' },
  { id: 'College', name: 'College', desc: 'Trendy block-prints, leather totes & silver jewelry', icon: '🎒' },
  { id: 'Family Function', name: 'Family Function', desc: 'Classic traditional weaves & embroidered dupattas', icon: '🎉' },
];

const OutfitPlanner = () => {
  const { cart, addOutfitToCart } = useContext(CartContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedOccasion, setSelectedOccasion] = useState('Wedding');
  const [outfit, setOutfit] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seed, setSeed] = useState(0);
  const [addingToBag, setAddingToBag] = useState(false);

  useEffect(() => {
    const fetchOutfit = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(
          `/products/outfit-planner?occasion=${encodeURIComponent(selectedOccasion)}&seed=${seed}`
        );
        if (data.success) {
          setOutfit(data.data || []);
          setSummary(data.summary || null);
        }
      } catch (error) {
        console.error('Error fetching outfit:', error);
        showToast('Error loading outfit choices.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOutfit();
  }, [selectedOccasion, seed]);

  const handleOccasionSelect = (occId) => {
    setSelectedOccasion(occId);
    setSeed(0);
  };

  const handleShuffle = () => {
    setSeed((prev) => prev + 1);
  };

  // Check if all items in outfit are already in cart
  const allItemsInCart =
    outfit.length > 0 &&
    outfit.every((item) => cart.some((c) => c._id === item._id));

  const handleAddOutfitToBag = () => {
    setAddingToBag(true);
    const addedCount = addOutfitToCart(outfit);
    setTimeout(() => {
      setAddingToBag(false);
      if (addedCount > 0) {
        showToast(`🎉 Added ${addedCount} complete outfit item${addedCount > 1 ? 's' : ''} to your bag!`, 'success');
      } else {
        showToast('All items in this outfit are already in your bag.', 'info');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-myntra-dark mt-[80px] md:mt-[90px] pb-20">
      {/* HERO HEADER */}
      <section className="bg-gradient-to-r from-pink-50/80 via-white to-orange-50/60 border-b border-gray-150 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-pink-100/80 text-myntra-pink border border-pink-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered Smart Stylist</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-myntra-dark tracking-tight">
            Heritage Outfit Planner
          </h1>
          <p className="text-xs sm:text-sm text-myntra-gray max-w-[650px] mx-auto font-semibold leading-relaxed">
            Discover curated, complete heritage outfits using authentic products from the Heritage Hub. Select an occasion to generate an ensemble and add the complete outfit to your bag in one click.
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        {/* STEP 1: OCCASION SELECTOR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-myntra-pink tracking-widest">
                Step 1
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-myntra-dark">
                Select Your Occasion
              </h2>
            </div>
            <span className="text-xs font-bold text-myntra-gray bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
              {selectedOccasion} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {OCCASIONS.map((occ) => {
              const isSelected = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => handleOccasionSelect(occ.id)}
                  className={`p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-between space-y-2 cursor-pointer ${isSelected
                      ? 'bg-white border-myntra-pink shadow-md ring-2 ring-myntra-pink/20 scale-102'
                      : 'bg-white border-gray-200/80 hover:border-pink-200 hover:bg-pink-50/30'
                    }`}
                >
                  <span className="text-3xl my-1">{occ.icon}</span>
                  <div>
                    <h4
                      className={`font-black text-xs sm:text-sm ${isSelected ? 'text-myntra-pink' : 'text-myntra-dark'
                        }`}
                    >
                      {occ.name}
                    </h4>
                    <p className="text-[10px] text-myntra-gray font-medium line-clamp-2 mt-0.5">
                      {occ.desc}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-extrabold bg-myntra-pink text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Selected ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP 2: GENERATED OUTFIT SHOWCASE */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3 gap-y-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-myntra-pink tracking-widest">
                Step 2
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-myntra-dark flex items-center space-x-2">
                <span>Complete Heritage Ensemble</span>
                <span className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-0.5 rounded-full font-bold">
                  {selectedOccasion} Outfit
                </span>
              </h2>
            </div>
            <button
              onClick={handleShuffle}
              disabled={loading}
              className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-myntra-pink text-myntra-dark hover:text-myntra-pink font-bold text-xs rounded-xl shadow-xs transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate Outfit</span>
            </button>
          </div>

          {loading ? (
            <div className="min-h-[35vh] flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <Loader2 className="w-10 h-10 text-myntra-pink animate-spin mb-3" />
              <p className="text-xs font-bold text-myntra-gray">Generating authentic heritage outfit for {selectedOccasion}...</p>
            </div>
          ) : outfit.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <p className="text-xs text-myntra-gray font-semibold">No outfit items found for this occasion.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {outfit.map((item, idx) => {
                const discounted = calculateDiscountedPrice(item.price, item.discount);
                const isAlreadyInCart = cart.some((c) => c._id === item._id);

                return (
                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative"
                  >
                    {/* Item Piece Badge */}
                    <div className="absolute top-3 left-3 z-10 bg-myntra-dark/80 backdrop-blur-xs text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Piece #{idx + 1}
                    </div>

                    {isAlreadyInCart && (
                      <div className="absolute top-3 right-3 z-10 bg-emerald-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                        In Bag ✓
                      </div>
                    )}

                    {/* Image */}
                    <Link to={`/product/${item._id}`} className="block relative pt-[110%] bg-gray-50 overflow-hidden">
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.isGITagged && (
                        <div className="absolute bottom-2.5 left-2.5 bg-myntra-pink text-white text-[8px] font-black px-2 py-0.5 rounded shadow uppercase tracking-wider">
                          GI Certified
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-myntra-gray uppercase tracking-wider mb-1.5 flex-wrap gap-1">
                          <span className="bg-pink-50 text-myntra-pink px-1.5 py-0.5 rounded">
                            {item.craft}
                          </span>
                          <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded capitalize flex items-center">
                            <MapPin className="w-2.5 h-2.5 mr-0.5" /> {item.state}
                          </span>
                        </div>

                        <Link to={`/product/${item._id}`}>
                          <h4 className="font-extrabold text-sm text-myntra-dark leading-snug hover:text-myntra-pink transition line-clamp-1">
                            {item.name}
                          </h4>
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between">
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-sm font-black text-myntra-dark">
                            ₹{discounted.toLocaleString('en-IN')}
                          </span>
                          {item.discount > 0 && (
                            <span className="text-xs text-myntra-gray line-through">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        {item.discount > 0 && (
                          <span className="text-[10px] font-extrabold text-orange-500">
                            {item.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* STEP 3 & 4: TOTAL OUTFIT PRICE & ADD TO BAG BAR */}
        {summary && outfit.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-150 pb-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] font-extrabold uppercase text-myntra-pink tracking-widest block">
                  Step 4 • Dynamic Pricing
                </span>
                <div className="flex items-baseline space-x-3 justify-center md:justify-start">
                  <span className="text-xs text-myntra-gray font-bold">Total Outfit Price:</span>
                  <span className="text-3xl font-black text-myntra-dark">
                    ₹{summary.totalPrice?.toLocaleString('en-IN')}
                  </span>
                  {summary.totalSavings > 0 && (
                    <span className="text-xs text-myntra-gray line-through font-semibold">
                      ₹{summary.originalTotalPrice?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {summary.totalSavings > 0 && (
                  <p className="text-xs font-bold text-emerald-600">
                    🎉 You Save ₹{summary.totalSavings?.toLocaleString('en-IN')} on this complete ensemble!
                  </p>
                )}
              </div>

              {/* STEP 3 BUTTON: ADD COMPLETE OUTFIT TO BAG */}
              <div className="w-full md:w-auto">
                <button
                  onClick={handleAddOutfitToBag}
                  disabled={addingToBag || allItemsInCart}
                  className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center space-x-2 ${allItemsInCart
                      ? 'bg-emerald-600 text-white cursor-default'
                      : addingToBag
                        ? 'bg-pink-400 text-white cursor-wait'
                        : 'bg-myntra-pink hover:bg-myntra-pinkHover text-white'
                    }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {allItemsInCart
                      ? 'Complete Outfit in Bag ✓'
                      : addingToBag
                        ? 'Adding Items...'
                        : 'Add Complete Outfit to Bag'}
                  </span>
                </button>
              </div>
            </div>

            {/* STEP 5: HERITAGE SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-slate-50 border border-gray-150 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-myntra-gray uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-myntra-pink" />
                  <span>States Represented ({summary.statesRepresented?.length || 0})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(summary.statesRepresented || []).map((st, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-gray-200 text-myntra-dark text-xs font-bold px-3 py-1 rounded-full shadow-2xs"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-gray-150 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-myntra-gray uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-orange-500" />
                  <span>Crafts Included ({summary.craftsIncluded?.length || 0})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(summary.craftsIncluded || []).map((cr, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-gray-200 text-myntra-dark text-xs font-bold px-3 py-1 rounded-full shadow-2xs"
                    >
                      {cr}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 6: FASHION PASSPORT INTEGRATION BANNER */}
            {summary.uncollectedStatesFeatured && summary.uncollectedStatesFeatured.length > 0 && (
              <div className="bg-gradient-to-r from-pink-50 via-white to-amber-50 border border-pink-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-myntra-pink text-white flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-myntra-dark">
                      Fashion Passport Recommendation
                    </h4>
                    <p className="text-xs text-myntra-gray font-medium">
                      Complete this outfit order to unlock{' '}
                      <strong className="text-myntra-pink">
                        {summary.uncollectedStatesFeatured.join(' & ')} Heritage Badge{summary.uncollectedStatesFeatured.length > 1 ? 's' : ''}
                      </strong>{' '}
                      in your Fashion Passport.
                    </p>
                  </div>
                </div>

                <Link
                  to="/passport"
                  className="text-xs font-bold text-myntra-pink hover:text-myntra-dark flex items-center space-x-1 whitespace-nowrap"
                >
                  <span>View Passport</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default OutfitPlanner;
