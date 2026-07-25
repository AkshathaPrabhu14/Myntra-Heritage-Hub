import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import IndiaMap from '../components/IndiaMap';
import ProductCard from '../components/ProductCard';
import { stateMapping } from '../utils/stateMapping';
import { Sparkles, Map, ChevronRight, Loader2, ArrowRight } from 'lucide-react';

const HeritageHub = () => {
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCollectionName, setActiveCollectionName] = useState(null);
  const productGridRef = useRef(null);



  // Fetch products and select a random set of 4 for recommendation
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await api.get('/products');
        if (data.success && data.data.length > 0) {
          // Shuffle array and pick first 4
          const shuffled = [...data.data].sort(() => 0.5 - Math.random());
          setRecommended(shuffled.slice(0, 4));
        }
      } catch (error) {
        console.error('Error loading recommendations:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);


  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HEADER SECTION */}
      <section className="bg-gradient-to-b from-pink-50/50 to-white py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-50">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-pink-100 text-myntra-pink text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Map & State Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-myntra-dark tracking-tight mb-3">
            Heritage Hub Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-myntra-gray max-w-[650px] mx-auto font-semibold leading-relaxed mb-4">
            Discover authentic handlooms and certified regional handicrafts directly from cooperative societies. Hover over states on our interactive map or browse via the state selectors below.
          </p>

          <div className="pt-2">
            <Link
              to="/outfit-planner"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-myntra-pink to-orange-400 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow hover:shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Heritage Outfit Planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          {/* MAP */}
          <div>
            <IndiaMap />
          </div>
        </div>
      </section>

      {/* RECOMMENDED PRODUCTS SECTION */}
      <section ref={productGridRef} className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/30 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-myntra-dark">
                You May Also Like
              </h2>
              <p className="text-xs text-myntra-gray font-semibold">
                Curated selection of certified heritage specialties from around the country
              </p>
            </div>
            <Link
              to="/search"
              className="text-xs font-bold text-myntra-pink hover:text-myntra-pinkHover transition flex items-center"
            >
              See All Products <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="min-h-[25vh] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-myntra-pink animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommended.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HeritageHub;
