import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiSearch } from 'react-icons/fi';

const Bike_Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [listingType, setListingType] = useState('buy'); // 'buy' or 'rent'
  
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
    navigate(`/category/bikes?location=${encodeURIComponent(query)}&acquisition=${listingType}`);
  };

  return (
    <div className="w-full max-w-4xl relative" ref={searchContainerRef}>
      <div className="bg-white/[0.06] backdrop-blur-[2px] border-[1.25px] border-white/35 p-1.5 rounded-full flex items-center shadow-2xl">
        
        {/* 1. Location Section */}
        <div className="flex-[2.5] flex items-center px-6 md:px-8 gap-3 border-r-[1.25px] border-white/25">
          <FiMapPin className="text-white text-xl shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by location"
            className="bg-transparent border-none outline-none text-white text-sm font-normal placeholder:text-white w-full focus:ring-0 p-0 h-10"
          />
        </div>

        {/* 2. Toggle Section */}
        <div className="flex-[1.5] flex items-center px-3">
          <div className="flex items-center w-full">
            <button
              onClick={() => setListingType('buy')}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                listingType === 'buy' 
                  ? 'bg-[#1e1e1e] text-white shadow-md' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setListingType('rent')}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                listingType === 'rent' 
                  ? 'bg-[#1e1e1e] text-white shadow-md' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Rent
            </button>
          </div>
        </div>

        {/* 3. Circular Button */}
        <button 
          onClick={handleSearch}
          className="w-11 h-11 md:w-12 md:h-12 bg-[#1e1e1e] hover:bg-black rounded-full flex items-center justify-center text-white transition-all shadow-md active:scale-95 shrink-0 border border-white/15"
        >
          <FiSearch className="text-xl" />
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute mt-2 w-72 bg-[#161616]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/15 py-3 z-[9999] animate-fade-in left-6">
          {suggestions.map((loc, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setQuery(loc);
                setSuggestions([]);
              }}
              className="px-6 py-2.5 hover:bg-white/10 cursor-pointer text-sm font-medium text-gray-200 hover:text-white transition-colors"
            >
              {loc}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bike_Search;