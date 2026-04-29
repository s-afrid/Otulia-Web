import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiChevronDown, FiSearch } from 'react-icons/fi';

const Yacht_Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length > 1) {
        try {
          const response = await fetch(`/api/assets/combined?q=${query}&limit=5`);
          const data = await response.json();
          const locations = [...new Set(data.data.map(item => item.location))];
          setSuggestions(locations);
        } catch (error) {
          console.error("Failed to fetch location suggestions", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSearch = () => {
    navigate(`/category/yachts?location=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full max-w-4xl relative" ref={searchContainerRef}>
      <div className="bg-[#D9D9D9]/90 backdrop-blur-md p-1.5 rounded-full flex items-center shadow-2xl">
        
        {/* 1. Location Section */}
        <div className="flex-[2] flex items-center px-8 gap-4 border-r border-black/10">
          <FiMapPin className="text-gray-600 text-xl shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by location"
            className="bg-transparent border-none outline-none text-gray-800 text-sm font-medium placeholder-gray-500 w-full focus:ring-0 p-0 h-10"
          />
        </div>

        {/* 2. Buy Dropdown */}
        <div className="flex-1 flex items-center justify-between px-8 cursor-pointer border-r border-black/10 hover:bg-black/5 transition-colors h-10">
          <span className="text-sm font-medium text-gray-700">Buy</span>
          <FiChevronDown className="text-gray-500" />
        </div>

        {/* 3. Rent Dropdown */}
        <div className="flex-1 flex items-center justify-between px-8 cursor-pointer hover:bg-black/5 transition-colors h-10 mr-2">
          <span className="text-sm font-medium text-gray-700">Rent</span>
          <FiChevronDown className="text-gray-500" />
        </div>

        {/* 4. Circular Button */}
        <button 
          onClick={handleSearch}
          className="w-12 h-12 bg-[#2C2C2C] rounded-full flex items-center justify-center text-white hover:bg-black transition-all shadow-lg active:scale-95 shrink-0"
        >
          <FiSearch className="text-xl" />
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-fade-in left-6">
          {suggestions.map((loc, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setQuery(loc);
                setSuggestions([]);
              }}
              className="px-6 py-2 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 transition-colors"
            >
              {loc}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Yacht_Search;