import React, { useState, useEffect, useRef } from 'react';

const PropertyFilterBar = ({ onFilter, initialLocation = '' }) => {
    const [activeFilter, setActiveFilter] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const locationRef = useRef(null);

    const [selectedFilters, setSelectedFilters] = useState({
        location: initialLocation,
        priceRange: 'Any Price',
        type: 'Any',
        bedrooms: 'Any',
        bathrooms: 'Any',
        architecture: 'Any',
        amenities: 'Any'
    });

    // Sync internal location with prop
    useEffect(() => {
        if (initialLocation !== undefined) {
            setSelectedFilters(prev => ({ ...prev, location: initialLocation }));
        }
    }, [initialLocation]);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (selectedFilters.location.length > 0) {
                try {
                    const response = await fetch(`/api/assets/location-suggestions?q=${selectedFilters.location}`);
                    const data = await response.json();
                    setSuggestions(data);
                } catch (error) {
                    console.error("Failed to fetch location suggestions", error);
                }
            } else {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [selectedFilters.location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filters = [
        { label: 'Price Range', key: 'priceRange', options: ['Any Price', '£1M - £5M', '£5M - £10M', '£10M+'] },
        { label: 'Type', key: 'type', options: ['Any', 'Villa', 'Penthouse', 'Mansion', 'Estate'] },
        { label: 'Bedrooms', key: 'bedrooms', options: ['Any', '3+', '4+', '5+'] },
        { label: 'Bathrooms', key: 'bathrooms', options: ['Any', '2+', '3+', '4+'] },
        { label: 'Architecture', key: 'architecture', options: ['Any', 'Modern', 'Classic', 'Mediterranean', 'Colonial'] },
        { label: 'Amenities', key: 'amenities', options: ['Any', 'Pool', 'Gym', 'Helipad', 'Theater'] }
    ];

    const toggleFilter = (label) => {
        setActiveFilter(activeFilter === label ? null : label);
    };

    const handleSelect = (key, value) => {
        setSelectedFilters(prev => ({ ...prev, [key]: value }));
        setActiveFilter(null);
    };

    const handleSearch = () => {
        if (onFilter) {
            onFilter(selectedFilters);
        }
    };

    return (
        <div className="w-full py-6 px-4 bg-white flex justify-center relative z-20">
            <div
                ref={locationRef}
                className="
          flex flex-wrap items-center justify-center gap-3 w-full max-w-[1400px]
          bg-white border border-gray-100 rounded-3xl p-4 shadow-md
        "
            >
                <div className="flex items-center gap-2 pr-4 border-r border-gray-100">
                    <span className="font-playfair text-xl text-black whitespace-nowrap font-bold">
                        Filter :
                    </span>
                </div>

                {/* Location Input with Suggestions */}
                <div className="relative flex-1 min-w-[200px] px-4">
                    <input
                        type="text"
                        placeholder="Location"
                        value={selectedFilters.location}
                        onChange={(e) => {
                            setSelectedFilters(prev => ({ ...prev, location: e.target.value }));
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full outline-none text-base font-sans placeholder:text-gray-300 text-black font-medium"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-[110] w-full bg-white border border-gray-100 rounded-xl mt-4 shadow-2xl left-0 p-2">
                            {suggestions.map((s, idx) => (
                                <li key={idx} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600" onClick={() => {
                                    setSelectedFilters(prev => ({ ...prev, location: s }));
                                    setShowSuggestions(false);
                                }}>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="h-8 w-px bg-gray-100 mx-2 hidden md:block"></div>

                {filters.map((filter) => (
                    <div key={filter.key} className="relative">
                        <button
                            onClick={() => toggleFilter(filter.label)}
                            className={`
                px-5 py-2
                border rounded-lg
                text-sm montserrat font-medium
                transition-all duration-300
                whitespace-nowrap
                ${(selectedFilters[filter.key] && selectedFilters[filter.key] !== 'Any' && selectedFilters[filter.key] !== 'Any Price' && selectedFilters[filter.key] !== 'Any SqFt') || activeFilter === filter.label
                  ? 'bg-black text-white border-black' // Active Style
                  : 'bg-white text-black border-gray-300 hover:border-gray-700 hover:text-gray-700' // Inactive Style
                }
              `}
                        >
                            {selectedFilters[filter.key] && !selectedFilters[filter.key].startsWith('Any')
                                ? selectedFilters[filter.key]
                                : filter.label}
                        </button>

            {/* THE DROPDOWN MENU (Only shows if active) */}
            {activeFilter === filter.label && (
              <>
                {/* Backdrop to close when clicking outside */}
                <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setActiveFilter(null)}
                ></div>

                {/* The Menu Box */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {filter.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-3 text-sm cursor-pointer transition-colors ${selectedFilters[filter.key] === option ? 'bg-gray-400/10 text-black font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-black'}`}
                      onClick={() => handleSelect(filter.key, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </>
            )}
                    </div>
                ))}

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="
                        px-8 py-2.5
                        bg-[#2C2C2C] hover:bg-black
                        rounded-lg
                        text-white montserrat text-sm md:text-base font-medium
                        shadow-sm hover:shadow-md
                        transition-all duration-300
                        uppercase tracking-widest
                        ml-2
                    "
                >
                    SEARCH
                </button>
            </div>
        </div>
    );
};

export default PropertyFilterBar;
