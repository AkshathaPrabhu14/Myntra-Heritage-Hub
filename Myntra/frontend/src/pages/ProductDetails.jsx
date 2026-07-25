import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductDetailsSkeleton } from '../components/Skeleton';
import { resolveImageUrl } from '../services/productService';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  MapPin,
  UserCheck,
  Feather,
  Info,
  ChevronRight,
  ChevronLeft,
  Home,
  CheckCircle2,
  Loader2,
  MessageSquare,
  ThumbsUp,
  X,
  ZoomIn,
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [userPassport, setUserPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Interactive states
  const [activeImage, setActiveImage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('story');

  // Zoom modal state
  const [zoomOpen, setZoomOpen] = useState(false);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Build gallery images array
  const galleryImages = product
    ? [product.image, ...(product.images || [])].filter(
        (img, idx, arr) => img && arr.indexOf(img) === idx
      )
    : [];

  const goToImage = useCallback(
    (index) => {
      if (galleryImages.length === 0) return;
      const newIndex = ((index % galleryImages.length) + galleryImages.length) % galleryImages.length;
      setActiveImageIndex(newIndex);
      setActiveImage(galleryImages[newIndex]);
    },
    [galleryImages]
  );

  const goNext = useCallback(() => goToImage(activeImageIndex + 1), [activeImageIndex, goToImage]);
  const goPrev = useCallback(() => goToImage(activeImageIndex - 1), [activeImageIndex, goToImage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') setZoomOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/products/${id}`);
        if (data.success && data.data) {
          const item = data.data;
          setProduct(item);
          setActiveImage(item.image);
          setActiveImageIndex(0);
          if (item.sizes && item.sizes.length > 0) {
            setSelectedSize(item.sizes[0]);
          }

          // Fetch similar context-aware products (matching same state or craft)
          const similarRes = await api.get('/products', { params: { state: item.state } });
          if (similarRes.data?.success) {
            const filtered = similarRes.data.data
              .filter((p) => p._id !== item._id)
              .slice(0, 4);
            setSimilarProducts(filtered);
          }

          // Fetch passport status if logged in
          try {
            const passRes = await api.get('/passport');
            if (passRes.data?.success) {
              setUserPassport(passRes.data.data);
            }
          } catch (passErr) {
            // guest user or error
          }
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const isWishlisted = isInWishlist(id);

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product);
    showToast(
      added ? `Added ${product.name} to Wishlist!` : `Removed ${product.name} from Wishlist.`,
      added ? 'success' : 'info'
    );
  };

  const handleAddToBag = () => {
    if (product.stock <= 0) {
      showToast('This product is currently out of stock.', 'error');
      return;
    }
    addToCart(product, quantity);
    showToast(`Added ${quantity} × ${product.name} to Bag!`, 'success');
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      showToast('This product is currently out of stock.', 'error');
      return;
    }
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setReviewSubmitting(true);
    setReviewSuccess('');
    try {
      const { data } = await api.post(`/products/${id}/reviews`, {
        userName: 'Customer',
        rating: newRating,
        comment: newComment,
      });

      if (data.success) {
        setProduct(data.data);
        setNewComment('');
        setReviewSuccess('Thank you! Your verified review has been submitted.');
      }
    } catch (err) {
      console.error('Error adding review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white p-8 text-center">
        <Info className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-myntra-dark mb-2">Item Unavailable</h2>
        <p className="text-xs text-myntra-gray mb-6">{error || 'Unable to locate this heritage product.'}</p>
        <Link
          to="/heritage"
          className="bg-myntra-pink text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-myntra-pinkHover transition"
        >
          Return to Heritage Hub
        </Link>
      </div>
    );
  }

  const discountedPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  return (
    <div className="bg-slate-50/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1350px] mx-auto">
        {/* BREADCRUMBS */}
        <nav className="flex items-center space-x-2 text-xs font-bold text-myntra-gray uppercase tracking-wider mb-8 flex-wrap gap-y-2">
          <Link to="/" className="hover:text-myntra-pink flex items-center">
            <Home className="w-3.5 h-3.5 mr-1" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/heritage" className="hover:text-myntra-pink">
            Heritage Hub
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/heritage/${product.state}`} className="hover:text-myntra-pink capitalize">
            {product.state}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-myntra-dark line-clamp-1 max-w-[300px]">{product.name}</span>
        </nav>

        {/* MAIN PRODUCT DISPLAY GRID */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          {/* LEFT: GALLERY VIEWPORT (COL 1-6) */}
          <div className="lg:col-span-6 space-y-4">
            {/* MAIN FEATURED IMAGE WITH ZOOM AND NAV ARROWS */}
            <div
              className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 group aspect-[4/5] sm:aspect-square cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            >
              <img
                src={resolveImageUrl(activeImage)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Zoom hint */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Previous / Next navigation arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-myntra-dark p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-myntra-dark p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {galleryImages.length > 1 && (
                <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  {activeImageIndex + 1} / {galleryImages.length}
                </span>
              )}

              {/* BADGES */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.isGITagged && (
                  <span className="bg-myntra-pink text-white text-[10px] font-black uppercase px-3 py-1 rounded shadow-md tracking-wider flex items-center space-x-1">
                    <Award className="w-3 h-3" />
                    <span>GI Certified</span>
                  </span>
                )}
                {product.isEcoFriendly && (
                  <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded shadow-md tracking-wider flex items-center space-x-1">
                    <Feather className="w-3 h-3" />
                    <span>Eco-Friendly</span>
                  </span>
                )}
              </div>
            </div>

            {/* THUMBNAIL TRAY */}
            {galleryImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      activeImageIndex === idx ? 'border-myntra-pink scale-105 shadow' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={resolveImageUrl(imgUrl)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & ACTIONS (COL 7-12) */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div>
              {/* CRAFT & STATE HEADER */}
              <div className="flex items-center space-x-2 text-xs font-bold text-myntra-gray uppercase tracking-wider mb-2">
                <span className="bg-pink-50 text-myntra-pink px-2.5 py-1 rounded-md">{product.craft}</span>
                <span className="text-gray-300">•</span>
                <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md flex items-center capitalize">
                  <MapPin className="w-3 h-3 mr-1" /> {product.state}
                </span>
              </div>

              {/* PRODUCT TITLE */}
              <h1 className="text-2xl sm:text-3xl font-black text-myntra-dark leading-tight mb-3">
                {product.name}
              </h1>

              {/* RATING & REVIEWS PILL */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                  <span>{product.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span className="text-emerald-300">|</span>
                  <span>{product.reviews?.length || 1} Ratings</span>
                </div>
                {product.giRegistryNumber && (
                  <span className="text-[11px] font-bold text-myntra-gray bg-gray-100 px-3 py-1 rounded-full">
                    GI Reg: #{product.giRegistryNumber}
                  </span>
                )}
              </div>

              {/* FASHION PASSPORT BADGE STATUS INDICATOR */}
              <div className="mb-6">
                {(userPassport?.unlockedStates || []).some(
                  (s) => s.state.toLowerCase().trim() === (product.state || '').toLowerCase().trim()
                ) ? (
                  <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>✓ Already Collected</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-200 text-myntra-dark px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
                    <Award className="w-4 h-4 text-myntra-pink animate-bounce" />
                    <span>Unlock <strong className="text-myntra-pink uppercase">{product.state} Badge</strong> with this purchase.</span>
                  </div>
                )}
              </div>

              {/* PRICE SECTION */}
              <div className="bg-slate-50 border border-gray-150 rounded-xl p-4 mb-6">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black text-myntra-dark">
                    ₹{discountedPrice.toLocaleString('en-IN')}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-lg text-myntra-gray line-through font-semibold">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm font-extrabold text-orange-500 bg-orange-100/60 px-2.5 py-1 rounded">
                        ({product.discount}% OFF)
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Inclusive of all taxes. Direct Artisan Fair-Trade Price.
                </p>
              </div>

              {/* ARTISAN METADATA STRIP */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white border border-gray-150 p-3 rounded-lg flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-myntra-pink flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-myntra-gray">Artisan Master</span>
                    <span className="text-xs font-bold text-myntra-dark">{product.artisanName || 'Local Cooperative'}</span>
                  </div>
                </div>
                <div className="bg-white border border-gray-150 p-3 rounded-lg flex items-center space-x-3">
                  <Feather className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-myntra-gray">Material</span>
                    <span className="text-xs font-bold text-myntra-dark">{product.material || 'Handloom Fibres'}</span>
                  </div>
                </div>
              </div>

              {/* SIZE SELECTOR */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-black uppercase tracking-wider text-myntra-dark mb-2">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((sz, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition border ${
                          selectedSize === sz
                            ? 'border-myntra-pink bg-pink-50 text-myntra-pink shadow-sm'
                            : 'border-gray-200 text-myntra-dark hover:border-gray-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QUANTITY & STOCK */}
              <div className="flex items-center space-x-6 mb-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-myntra-gray mb-1">Quantity</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-xs font-bold hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-extrabold text-myntra-dark">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-xs font-bold hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    {product.stock ? `${product.stock} Units Ready to Ship` : 'In Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (ADD TO BAG / BUY NOW / WISHLIST) */}
            <div className="space-y-3 pt-4 border-t border-gray-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToBag}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center transition shadow-md bg-myntra-pink hover:bg-myntra-pinkHover text-white"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Bag
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center transition shadow-md"
                >
                  <Zap className="w-4 h-4 mr-2 text-yellow-400 fill-yellow-400" />
                  Buy Now
                </button>
              </div>

              <button
                onClick={handleWishlistToggle}
                className={`w-full border py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center transition ${
                  isWishlisted
                    ? 'border-myntra-pink bg-pink-50 text-myntra-pink'
                    : 'border-gray-200 hover:border-gray-300 text-myntra-dark'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-myntra-pink text-myntra-pink' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Save to Wishlist'}
              </button>
            </div>
          </div>
        </div>

        {/* STORY BEHIND THE CRAFT (PREMIUM CARD) */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-pink-500/10 border border-amber-200/60 rounded-2xl p-6 sm:p-10 mb-12 relative overflow-hidden shadow-sm">
          <div className="max-w-[900px] relative z-10">
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Story Behind the Craft</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-myntra-dark mb-4">
              Legacy of {product.craft}
            </h2>
            <blockquote className="text-xs sm:text-sm text-slate-700 italic font-semibold leading-relaxed mb-4 border-l-4 border-myntra-pink pl-4">
              "{product.story || 'This handcrafted product represents generations of artisan craftsmanship and preserves the cultural identity of its region.'}"
            </blockquote>
            <p className="text-xs text-myntra-gray font-semibold leading-relaxed">
              Preserved by the <span className="text-myntra-dark font-bold">{product.artisanCommunity || 'Local Cooperative Society'}</span> in {product.state}. Every purchase directly sustains master weavers and their families.
            </p>
          </div>
        </div>

        {/* BELOW FOLD: HISTORY, PROCESS & SPECIFICATIONS TABS */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 mb-12 shadow-sm">
          {/* TAB HEADERS */}
          <div className="flex border-b border-gray-200 space-x-8 mb-6 overflow-x-auto scrollbar-none">
            {[
              { id: 'story', label: 'History & Heritage' },
              { id: 'process', label: 'Preparation & Crafting' },
              { id: 'authenticity', label: 'GI Certification' },
              { id: 'care', label: 'Care Instructions' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-xs font-black uppercase tracking-wider transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-myntra-pink text-myntra-pink'
                    : 'border-transparent text-myntra-gray hover:text-myntra-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
            {activeTab === 'story' && (
              <div className="space-y-4">
                <p>{product.history || `${product.name} is deeply rooted in the historical loom traditions of ${product.state}. For centuries, artisans have passed down this craft through verbal instruction and hands-on practice.`}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-myntra-gray">Artisan Community</span>
                    <span className="text-myntra-dark font-bold">{product.artisanCommunity || 'State Cooperative Union'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-myntra-gray">Raw Materials</span>
                    <span className="text-myntra-dark font-bold">{product.rawMaterials || product.material || 'Organic Handloom Fibres'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'process' && (
              <div className="space-y-4">
                <p>{product.preparationProcess || 'Crafted manually using age-old hand-spinning, dyeing, and pit-loom weaving techniques requiring extreme precision.'}</p>
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Clock className="w-6 h-6 text-myntra-pink flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-myntra-gray">Estimated Crafting Time</span>
                    <span className="text-xs font-extrabold text-myntra-dark">{product.craftingTime || '2-3 weeks of skilled handwork'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'authenticity' && (
              <div className="space-y-4">
                <p>{product.authenticityDetails || 'Officially verified for origin and technique by Government of India certified craft boards.'}</p>
                {product.giCertificateInfo && (
                  <div className="bg-pink-50/60 border border-pink-100 p-4 rounded-xl flex items-center space-x-3">
                    <Award className="w-6 h-6 text-myntra-pink flex-shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-myntra-pink">GI Tag Registry</span>
                      <span className="text-xs font-bold text-myntra-dark">{product.giCertificateInfo}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-3">
                <p>{product.careInstructions || 'Dry clean recommended. Store in a dry place away from direct sunlight.'}</p>
              </div>
            )}
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 mb-12 shadow-sm">
          <h3 className="text-xl font-black text-myntra-dark mb-6 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-myntra-pink" />
            Verified Customer Reviews ({product.reviews?.length || 0})
          </h3>

          {/* REVIEWS LIST */}
          <div className="space-y-4 mb-8">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xs text-myntra-dark">{rev.userName}</span>
                    <div className="flex items-center text-amber-500 space-x-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold text-myntra-dark">{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-myntra-gray font-semibold leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-myntra-gray font-semibold">No reviews yet. Be the first to share your feedback on this craft!</p>
            )}
          </div>

          {/* SUBMIT REVIEW FORM */}
          <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-myntra-dark mb-3">Leave a Review</h4>
            {reviewSuccess && <div className="text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded mb-3">{reviewSuccess}</div>}
            
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xs font-bold text-myntra-gray">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="text-amber-500 focus:outline-none"
                >
                  <Star className={`w-4 h-4 ${star <= newRating ? 'fill-current' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Share details about the texture, craftsmanship, or delivery..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-myntra-pink mb-3 bg-white"
              required
            />

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="myntra-btn-primary px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center"
            >
              {reviewSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ThumbsUp className="w-3.5 h-3.5 mr-2" />}
              Submit Review
            </button>
          </form>
        </div>

        {/* SIMILAR PRODUCTS SECTION */}
        {similarProducts.length > 0 && (
          <div className="py-6">
            <h3 className="text-xl font-black text-myntra-dark mb-6">
              More Crafts from {product.state}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((simProd) => (
                <ProductCard key={simProd._id} product={simProd} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image counter */}
          {galleryImages.length > 1 && (
            <span className="absolute top-4 left-4 bg-white/10 text-white text-sm font-bold px-3 py-1.5 rounded-lg z-50">
              {activeImageIndex + 1} / {galleryImages.length}
            </span>
          )}

          {/* Navigation arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Zoomed image */}
          <img
            src={resolveImageUrl(activeImage)}
            alt={product.name}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Thumbnail strip at bottom */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-50">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); goToImage(idx); }}
                  className={`w-12 h-12 rounded-md overflow-hidden border-2 transition ${
                    activeImageIndex === idx ? 'border-white scale-110' : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={resolveImageUrl(imgUrl)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
