import React, { useState, useRef, useEffect } from 'react';

// Reusable Chevron Icon
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

// --- NEW COMPONENT: Auto-Width Dropdown ---
const AutoWidthDropdown = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full xl:w-auto" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full xl:w-auto
          flex items-center justify-between xl:justify-start gap-2
          border border-gray-100
          rounded-xl xl:rounded-full 
          py-2.5 px-4 
          bg-white hover:bg-gray-50
          transition-colors
          whitespace-nowrap
        "
      >
        <span className="text-black montserrat text-base">
          {value || label}
        </span>
        <ChevronDown />
      </button>

      {isOpen && (
        <div className="
          absolute z-50 mt-2 min-w-[150px] w-full xl:w-auto
          bg-white border border-gray-100 rounded-xl shadow-xl 
          max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100
        ">
          <div
            className="px-4 py-3 text-gray-400 text-sm cursor-pointer hover:bg-gray-50"
            onClick={() => handleSelect('')}
          >
            {label}
          </div>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`
                px-4 py-2 cursor-pointer transition-colors montserrat text-sm
                ${value === opt ? 'bg-[#9C824A]/10 text-[#9C824A] font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-black'}
              `}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterBar = ({
  onFilter,
  categories = ['Supercars', 'Luxury Sedans', 'Ultra-Luxury'],
  brands = ['Ferrari', 'Lamborghini', 'Porsche', 'McLaren', 'Bugatti', 'Rolls-Royce', 'Aston Martin'],
  models = ['Aventador', 'Huracan', '911 GT3', 'Chiron', 'Phantom', 'DB5'],
  countries = ['Italy', 'Germany', 'UK', 'USA', 'France']
}) => {
  const [filters, setFilters] = useState({
    location: initialLocation,
    category: '',
    brand: '',
    model: '',
    country: '',
    price: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    if (onFilter) {
      onFilter(filters);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="w-full flex justify-center p-4">
      <div className="
        w-full max-w-[1400px]
        bg-white border border-gray-100 
        rounded-2xl xl:rounded-full 
        p-4 xl:p-2 xl:pl-8
        flex flex-col xl:flex-row items-center justify-between gap-4 xl:gap-2
        shadow-md transition-all duration-300
      ">
        <div className="w-full xl:w-auto flex items-center gap-2 border-b xl:border-r xl:border-b-0 border-gray-100 pb-2 xl:pb-0 pr-4">
          <span className="font-playfair text-xl text-black whitespace-nowrap font-bold">
            Filter :
          </span>
        </div>

        <div className="w-full flex flex-col md:flex-row xl:flex-1 items-center gap-4 xl:gap-0">

          {/* Location with Suggestions */}
          <div className="relative w-full xl:w-auto xl:flex-1 px-4" ref={locationRef}>
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => {
                handleFilterChange('location', e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full outline-none text-base font-sans placeholder:text-gray-300 text-black font-medium"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-[110] w-full bg-white border border-gray-100 rounded-xl mt-4 shadow-2xl left-0 p-2">
                {suggestions.map((s, idx) => (
                  <li key={idx} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600" onClick={() => {
                    handleFilterChange('location', s);
                    setShowSuggestions(false);
                  }}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="hidden xl:block h-8 w-px bg-gray-100"></div>

          <AutoWidthDropdown
            label="Category"
            value={filters.category}
            options={categories}
            onChange={(val) => handleFilterChange('category', val)}
          />

          <div className="hidden xl:block h-8 w-px bg-gray-100"></div>

          <AutoWidthDropdown
            label="Brand"
            value={filters.brand}
            options={brands}
            onChange={(val) => handleFilterChange('brand', val)}
          />

          <div className="hidden xl:block h-8 w-px bg-gray-100"></div>

          <AutoWidthDropdown
            label="Model"
            value={filters.model}
            options={models}
            onChange={(val) => handleFilterChange('model', val)}
          />

          <div className="hidden xl:block h-8 w-px bg-white mx-2"></div>

          <AutoWidthDropdown
            label="Country"
            value={filters.country}
            options={countries}
            onChange={(val) => handleFilterChange('country', val)}
          />

          <div className="hidden xl:block h-8 w-px bg-white mx-2"></div>

          {/* Price - Spans 2 cols on mobile */}
          <div className="col-span-2 md:col-span-1 xl:col-span-auto w-full xl:w-auto">
            <AutoWidthDropdown
              label="Price"
              value={filters.price}
              options={['Low to High', 'High to Low']}
              onChange={(val) => handleFilterChange('price', val)}
            />
          </div>

          {/* SEARCH BUTTON (Mobile/Tablet) */}
          <div className="xl:hidden w-full col-span-2 md:col-span-1">
            <button
              type="button"
              onClick={handleSearch}
              className="w-full bg-[#9C824A] hover:bg-[#856d3a] text-white montserrat font-medium py-2.5 rounded-lg shadow-md transition-all"
            >
              Search
            </button>
          </div>

        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="
            hidden xl:block
            w-auto 
            bg-[#9C824A] hover:bg-[#856d3a] 
            text-white montserrat text-lg 
            px-8 py-2.5 
            rounded-full 
            transition-all duration-300 
            uppercase tracking-widest
          "
        >
          SEARCH
        </button>
      </div>
    </div>
  );
};

export default FilterBar;