import React, { useState, useEffect, useMemo, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate();
  // Automatically import all images from the home_hero directory
  // This uses Vite's glob import feature to make the slideshow flexible
  const imageModules = import.meta.glob('../../assets/hero_banners/home_hero/*.{jpeg,jpg,png,webp,svg}', { eager: true });
  
  const images = useMemo(() => {
    return Object.values(imageModules).map((mod) => mod.default);
  }, [imageModules]);

  const [currentIdx, setCurrentIdx] = useState(0);

  // Search & Suggestions State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  // Suggestions fetching logic
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const response = await fetch(`/api/assets/combined?q=${encodeURIComponent(searchQuery)}&limit=6`);
        const data = await response.json();
        if (data.data) {
          // Map to unique suggestions (titles/locations/brands)
          const results = data.data.map(item => ({
            id: item._id,
            title: item.title,
            location: item.location,
            category: item.category,
            type: item.type === 'CarAsset' ? 'car' : item.type === 'EstateAsset' ? 'estate' : item.type === 'YachtAsset' ? 'yacht' : 'bike'
          }));
          setSuggestions(results);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchClick();
  };

  return (
    <>
      <div className='flex flex-col hero-banner h-screen w-full relative overflow-hidden pt-[40px] md:pt-[80px]'>
        {/* Background Images Slideshow */}
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full -z-10 transition-opacity duration-1000 ease-in-out ${
              index === currentIdx ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={img} 
              alt={`Luxury Asset ${index + 1}`}
              className='w-full h-full object-cover'
            />
          </div>
        ))}
        
        {/* Dark Overlays for legibility */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 -z-5' />

        {/* Hero Content */}
        <div className='absolute top-[34%] md:top-[38%] left-[5%] md:left-[5%] flex flex-col gap-6 max-w-4xl'>
          <p className="text-white/70 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em]">
            Curated Globally • Est. 2025
          </p>
          <h1 className='text-white text-5xl md:text-[4.6rem] leading-[1.0] font-medium tracking-tight' style={{ fontFamily: 'Playfair Display, serif' }}>
            Discover Exceptional Assets
          </h1>
          <p className='text-white/60 montserrat text-base md:text-[19px] leading-relaxed max-w-lg mt-1 font-medium'>
            Cars, estates, yachts, and rare assets — curated globally for those who deal in the considered.
          </p>
        </div>

        {/* Search Bar & Suggestions */}
        <div className="absolute bottom-[22%] left-[5%] md:left-[5%] w-[90%] md:w-[90%] flex flex-col gap-2 z-30" ref={suggestionRef}>
          <div className="flex items-center justify-between pb-3 border-b border-white/20 hover:border-white/40 transition-colors group relative">
            <div className="flex items-center gap-5 w-full text-white/30 group-hover:text-white/60 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search by Asset ID, Location or Name" 
                className="bg-transparent border-none outline-none text-white placeholder-white/30 text-sm md:text-[15px] w-full focus:ring-0 px-0 montserrat font-medium" 
              />
            </div>
            <button 
              onClick={handleSearchClick}
              className="text-white/80 text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase hover:text-white transition-all pl-4 shrink-0"
            >
              Search
            </button>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-md mt-2 rounded-xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  {suggestions.map((s, idx) => (
                    <div 
                      key={s.id}
                      onClick={() => {
                        navigate(`/asset/${s.type}/${s.id}`);
                        setShowSuggestions(false);
                      }}
                      className="px-6 py-3 hover:bg-black/5 cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-gray-900 group-hover:text-[#D48D2A] transition-colors">{s.title}</span>
                        <span className="text-[10px] text-gray-500 font-medium">{s.location}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded tracking-widest">{s.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {loadingSuggestions && searchQuery.length >= 2 && (
              <div className="absolute right-0 bottom-[-2px] w-full h-[1px] bg-gradient-to-r from-transparent via-[#D48D2A] to-transparent animate-pulse shadow-[0_0_10px_#D48D2A]"></div>
            )}
          </div>
        </div>

        {/* Navigation Dots (Slide Show) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-auto z-20">
          <div className="flex items-center gap-2 mb-2.5">
            {images.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`h-[1.5px] cursor-pointer transition-all duration-500 rounded-full ${
                  currentIdx === idx ? 'w-12 bg-white' : 'w-8 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/40 text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-black">Scroll</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 animate-bounce mt-1">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
            </svg>
          </div>
        </div>
        
    </div>
</>
  )
}

export default Hero

