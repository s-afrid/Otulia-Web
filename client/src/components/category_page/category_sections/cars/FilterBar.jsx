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
                px-4 py-3 cursor-pointer transition-colors montserrat text-sm
                ${value === opt ? 'bg-gray-100 text-black font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-black'}
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
  filterOptions,
  priceRanges = null,
  initialLocation = ''
}) => {
  const [filters, setFilters] = useState({
    location: initialLocation,
    category: '',
    brand: '',
    model: '',
    priceRange: ''
  });

  // Sync internal location with prop if it changes externally
  useEffect(() => {
    if (initialLocation !== undefined) {
      setFilters(prev => ({ ...prev, location: initialLocation }));
    }
  }, [initialLocation]);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (filters.location.length > 0) {
        try {
          const response = await fetch(`/api/assets/location-suggestions?q=${filters.location}`);
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch suggestions", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [filters.location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = filterOptions ? Object.keys(filterOptions) : [];
  const brands = filters.category && filterOptions[filters.category] ? Object.keys(filterOptions[filters.category]) : [];
  const models = filters.brand && filterOptions[filters.category] && filterOptions[filters.category][filters.brand] ? filterOptions[filters.category][filters.brand] : [];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'category') {
      newFilters.brand = '';
      newFilters.model = '';
    } else if (key === 'brand') {
      newFilters.model = '';
    }
    setFilters(newFilters);
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

          <div className="hidden xl:block h-8 w-px bg-gray-100"></div>

          <div className="w-full xl:w-auto xl:flex-1">
            <AutoWidthDropdown
              label="Price"
              value={filters.priceRange}
              options={priceRanges || ['Low to High', 'High to Low']}
              onChange={(val) => handleFilterChange('priceRange', val)}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="
            w-full xl:w-auto
            bg-black hover:bg-gray-900 
            text-white font-sans text-sm font-bold
            px-10 py-3
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