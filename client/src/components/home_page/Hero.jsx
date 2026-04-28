import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi';

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Automatically import all images from the home_hero directory
  const imageModules = import.meta.glob('../../assets/hero_banners/home_hero/*.{jpeg,jpg,png,webp,svg}', { eager: true });
  
  const images = useMemo(() => {
    return Object.values(imageModules).map((mod) => mod.default);
  }, [imageModules]);

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % images.length);
    }, 5000); 

    return () => clearInterval(timer);
  }, [images.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${query.trim()}`);
    }
  };

  return (
    <div className='h-screen w-full relative overflow-hidden'>
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
              className='w-full h-full object-cover brightness-[0.6]'
            />
          </div>
        ))}
        
        {/* Dark Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 -z-5' />

        <div className='absolute inset-0 flex flex-col justify-center px-[2%]'>
          <div className='max-w-4xl'>
            <p className='text-white/80 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-6 montserrat font-medium'>
              CURATED GLOBALLY · EST. 2025
            </p>
            
            <h1 className='text-white text-4xl md:text-7xl playfair-display mb-8 leading-tight font-normal whitespace-nowrap'>
              Discover Exceptional Assets
            </h1>
            
            <p className='text-white/90 montserrat text-base md:text-xl max-w-2xl mb-16 font-medium leading-relaxed'>
              Cars, estates, yachts, and rare assets — curated globally for those who deal in the considered.
            </p>

            {/* Underline Search Bar */}
            <form onSubmit={handleSearch} className='relative w-full max-w-2xl group'>
              <div className='flex items-center border-b border-white/30 group-focus-within:border-white transition-colors duration-300 py-4'>
                <FiSearch className='text-white/60 text-xl mr-4' />
                <input
                  type='text'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search by Asset ID, Location or Name'
                  className='bg-transparent text-white placeholder:text-white/40 outline-none w-full text-lg montserrat'
                />
                <button 
                  type='submit'
                  className='text-white tracking-[0.2em] text-xs font-medium hover:text-white/70 transition-colors uppercase ml-4'
                >
                  SEARCH
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4'>
            <div className='flex gap-2'>
                {images.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-[1px] w-8 md:w-12 transition-all duration-300 ${i === currentIdx ? 'bg-white' : 'bg-white/20'}`}
                    />
                ))}
            </div>
            <p className='text-white/60 text-[10px] tracking-[0.4em] uppercase font-medium montserrat'>SCROLL</p>
        </div>
    </div>
  )
}

export default Hero;