import React, { useState, useEffect, useMemo } from 'react'
import { NavLink } from 'react-router-dom'

const Hero = () => {
  // Automatically import all images from the home_hero directory
  // This uses Vite's glob import feature to make the slideshow flexible
  const imageModules = import.meta.glob('../../assets/hero_banners/home_hero/*.{jpeg,jpg,png,webp,svg}', { eager: true });
  
  const images = useMemo(() => {
    return Object.values(imageModules).map((mod) => mod.default);
  }, [imageModules]);

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [images.length]);

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
        
        {/* Dark Overlay */}
        <div className='absolute inset-0 bg-black/20 -z-5' />

        <div className='absolute top-[200px] md:top-[300px] left-[3%] md:left-[5%] flex flex-col gap-4'>
          <h1 className='text-white text-3xl md:text-6xl playfair-display'>Discovery Luxury at Otulia</h1>
          <p className='text-white/90 montserrat text-lg'>Find Your Dream Car, Bike, Yacht, House and More.</p>
        </div>
        <ul className='flex flex-wrap gap-6 md:gap-7 px-3 py-[10px] md:py-[15px] md:px-[27px] items-center justify-center md:justify-end montserrat text-white text-[14px] md:text-lg z-10'>
          <li className='cursor-pointer hover:text-white/70 transition-colors'>
            <NavLink to={'/shop'}>
            Shop All
            </NavLink>
            </li>
          <li className='cursor-pointer hover:text-white/70 transition-colors'>
            <NavLink to={'/rent'}>
            Rent
            </NavLink>
            </li>
          <li className='cursor-pointer hover:text-white/70 transition-colors'>
            <NavLink to={'/community'}>
            Community
            </NavLink>
            </li>
          <li className='cursor-pointer hover:text-white/70 transition-colors'>
            <NavLink to={'/seller'}>
            Sell With Us
            </NavLink>
            </li>
          <li className='cursor-pointer hover:text-white/70 transition-colors'>
            <NavLink to={'/pricing'}>
            Plan & Price
            </NavLink>
            </li>
        </ul>
        
    </div>
</>
  )
}

export default Hero
