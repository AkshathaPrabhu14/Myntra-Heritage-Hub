import React from 'react';
import { Star } from 'lucide-react';

const FilterPanel = ({ filters, setFilters, uniqueCrafts = [], uniqueMaterials = [] }) => {
  const categoriesList = [
    'Handloom',
    'Traditional Wear',
    'Jewellery',
    'Handicrafts',
    'Artifacts',
    'Accessories',
    'Textiles',
  ];

  const handleCheckboxChange = (section, value) => {
    const currentList = filters[section] || [];
    let updatedList;

    if (currentList.includes(value)) {
      updatedList = currentList.filter((item) => item !== value);
    } else {
      updatedList = [...currentList, value];
    }

    setFilters({
      ...filters,
      [section]: updatedList,
    });
  };

  const handleToggleChange = (field) => {
    setFilters({
      ...filters,
      [field]: !filters[field],
    });
  };

  const handlePriceChange = (e) => {
    setFilters({
      ...filters,
      maxPrice: Number(e.target.value),
    });
  };

  const handleRatingChange = (rating) => {
    setFilters({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating,
    });
  };

  const handleClearAll = () => {
    setFilters({
      categories: [],
      crafts: [],
      materials: [],
      maxPrice: 50000,
      isEcoFriendly: false,
      isGITagged: false,
      minRating: 0,
    });
  };

  return (
    <div className="w-full bg-white border border-gray-150 rounded-xl p-5 shadow-sm space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h3 className="font-extrabold text-sm text-myntra-dark tracking-wide uppercase">
          Filters
        </h3>
        <button
          onClick={handleClearAll}
          className="text-xs font-bold text-myntra-pink hover:text-myntra-pinkHover transition"
        >
          CLEAR ALL
        </button>
      </div>

      {/* CATEGORIES */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs uppercase text-myntra-dark tracking-wide">
          Category
        </h4>
        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
          {categoriesList.map((cat, idx) => (
            <label key={idx} className="flex items-center space-x-2.5 text-xs text-[#282c3f] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => handleCheckboxChange('categories', cat)}
                className="accent-myntra-pink h-4 w-4 rounded border-gray-300 text-myntra-pink focus:ring-myntra-pink"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* PRICE RANGE */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-xs uppercase text-myntra-dark tracking-wide">
            Max Price
          </h4>
          <span className="text-xs font-bold text-myntra-pink">
            ₹{filters.maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="50000"
          step="500"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-myntra-pink h-1 bg-gray-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-myntra-gray font-bold">
          <span>₹500</span>
          <span>₹50,000</span>
        </div>
      </div>

      {/* SPECIAL PREFERENCES (GI & ECO) */}
      <div className="space-y-3 pt-3 border-t border-gray-50">
        <h4 className="font-bold text-xs uppercase text-myntra-dark tracking-wide">
          Certifications
        </h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2.5 text-xs text-[#282c3f] font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isGITagged}
              onChange={() => handleToggleChange('isGITagged')}
              className="accent-myntra-pink h-4 w-4 rounded border-gray-300 text-myntra-pink focus:ring-myntra-pink"
            />
            <span className="text-myntra-pink font-bold">GI Certified Only</span>
          </label>

          <label className="flex items-center space-x-2.5 text-xs text-[#282c3f] font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isEcoFriendly}
              onChange={() => handleToggleChange('isEcoFriendly')}
              className="accent-myntra-pink h-4 w-4 rounded border-gray-300 text-myntra-pink focus:ring-myntra-pink"
            />
            <span className="text-green-600 font-bold">Eco Friendly</span>
          </label>
        </div>
      </div>

      {/* CRAFT TRADITION */}
      {uniqueCrafts.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-gray-50">
          <h4 className="font-bold text-xs uppercase text-myntra-dark tracking-wide">
            Craft Tradition
          </h4>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {uniqueCrafts.map((craft, idx) => (
              <label key={idx} className="flex items-center space-x-2.5 text-xs text-[#282c3f] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.crafts.includes(craft)}
                  onChange={() => handleCheckboxChange('crafts', craft)}
                  className="accent-myntra-pink h-4 w-4 rounded border-gray-300 text-myntra-pink focus:ring-myntra-pink"
                />
                <span className="truncate">{craft}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* AUTHENTIC MATERIAL */}
      {uniqueMaterials.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-gray-50">
          <h4 className="font-bold text-xs uppercase text-myntra-dark tracking-wide">
            Material
          </h4>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {uniqueMaterials.map((mat, idx) => (
              <label key={idx} className="flex items-center space-x-2.5 text-xs text-[#282c3f] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.materials.includes(mat)}
                  onChange={() => handleCheckboxChange('materials', mat)}
                  className="accent-myntra-pink h-4 w-4 rounded border-gray-300 text-myntra-pink focus:ring-myntra-pink"
                />
                <span className="truncate">{mat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* RATING */}
      <div className="space-y-3 pt-3 border-t border-gray-50">
        <h4 className="font-bold text-xs uppercase text-myntra-dark tracking-wide">
          Customer Rating
        </h4>
        <div className="space-y-2">
          {[4, 3, 2].map((num) => (
            <label
              key={num}
              className="flex items-center space-x-2.5 text-xs text-[#282c3f] font-semibold cursor-pointer"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === num}
                onChange={() => handleRatingChange(num)}
                className="accent-myntra-pink h-4 w-4 border-gray-300 text-myntra-pink focus:ring-myntra-pink"
              />
              <span className="flex items-center">
                {num} <Star className="w-3 h-3 fill-amber-500 text-amber-500 mx-0.5" /> & Above
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
