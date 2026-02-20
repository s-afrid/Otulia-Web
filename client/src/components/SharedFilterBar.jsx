import React, { useState, useEffect, useRef } from 'react';

const SharedFilterBar = ({ onSearch, initialLocation = '' }) => {
    const [location, setLocation] = useState(initialLocation);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef(null);

    // Sync internal location with prop
    useEffect(() => {
        if (initialLocation !== undefined) {
            setLocation(initialLocation);
        }
    }, [initialLocation]);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (location.length > 0) {
                try {
                    const response = await fetch(`/api/assets/location-suggestions?q=${location}`);
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
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        let searchLocation = location;
        if (activeSuggestion > -1 && suggestions[activeSuggestion]) {
            searchLocation = suggestions[activeSuggestion];
        }
        onSearch({ location: searchLocation, minPrice, maxPrice });
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setActiveSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            setActiveSuggestion(prev => (prev > 0 ? prev - 1 : 0));
            e.preventDefault();
        } else if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    return (
        <div className="w-full flex justify-center p-4">
            <div
                ref={searchContainerRef}
                className="
                    w-full max-w-[1200px]
                    bg-white border border-gray-100 
                    rounded-full 
                    pl-8 pr-2 py-2
                    flex flex-row items-center justify-between
                    shadow-md transition-all duration-300
                "
            >
                {/* LABEL */}
                <div className="flex items-center gap-2 pr-4 border-r border-gray-100">
                    <span className="font-playfair text-xl text-black whitespace-nowrap font-bold">
                        Filter :
                    </span>
                </div>

                {/* INPUTS GROUP */}
                <div className="flex flex-1 items-center">

                    {/* Location Input */}
                    <div className="relative flex-1 px-4">
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onKeyDown={handleKeyDown}
                            className="w-full outline-none text-base font-sans placeholder:text-gray-300 text-black font-medium"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-[110] w-full bg-white border border-gray-100 rounded-xl mt-4 shadow-2xl left-0 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${index === activeSuggestion ? 'bg-gray-100 text-black font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                        onClick={() => {
                                            setLocation(suggestion);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="h-8 w-px bg-gray-100"></div>

                    {/* Min Price */}
                    <div className="flex-1 px-4">
                        <select
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full outline-none text-base font-sans text-gray-400 bg-transparent cursor-pointer appearance-none"
                        >
                            <option value="">Min Price ($)</option>
                            <option value="10000">$10,000</option>
                            <option value="50000">$50,000</option>
                            <option value="100000">$100,000</option>
                            <option value="500000">$500,000</option>
                            <option value="1000000">$1,000,000+</option>
                        </select>
                    </div>

                    <div className="h-8 w-px bg-gray-100"></div>

                    {/* Max Price */}
                    <div className="flex-1 px-4">
                        <select
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full outline-none text-base font-sans text-gray-400 bg-transparent cursor-pointer appearance-none"
                        >
                            <option value="">Max Price ($)</option>
                            <option value="50000">$50,000</option>
                            <option value="100000">$100,000</option>
                            <option value="500000">$500,000</option>
                            <option value="1000000">$1,000,000</option>
                            <option value="100000000">$100,000,000+</option>
                        </select>
                    </div>

                </div>

                {/* SEARCH BUTTON */}
                <button
                    onClick={handleSearch}
                    className="
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

export default SharedFilterBar;
