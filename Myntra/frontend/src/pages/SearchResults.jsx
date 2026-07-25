import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import api from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [passportStates, setPassportStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = query.trim() ? { search: query.trim() } : {};
        const { data } = await getProducts(params);
        if (data.success) setProducts(data.data);

        // Fetch user passport states
        try {
          const passRes = await api.get('/passport');
          if (passRes.data?.success && passRes.data?.data?.unlockedStates) {
            const stateNames = passRes.data.data.unlockedStates.map((s) => s.state.toLowerCase().trim());
            setPassportStates(stateNames);
          }
        } catch (passErr) {}
      } catch (err) {
        console.error('Search failed:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="bg-white min-h-screen pb-20">
      <section className="bg-gradient-to-b from-pink-50/50 to-white py-10 px-4 sm:px-6 lg:px-8 border-b border-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center space-x-2 text-myntra-pink mb-2">
            <Search className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Search Results</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-myntra-dark">
            {query ? `"${query}"` : 'All Products'}
          </h1>
          <p className="text-xs text-myntra-gray font-semibold mt-1">
            {loading ? 'Searching...' : `${products.length} authentic heritage items found`}
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-myntra-pink animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-myntra-gray font-semibold text-sm">No products match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} passportStates={passportStates} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchResults;
