import React from 'react'
import heroUrl from '../../../../assets/hero_banners/hero_yachts.webp'
import Yacht_Search from './Yacht_Search'

const Yacht_Hero = () => {
  return (
    <div className='relative flex flex-col hero-banner h-screen w-full overflow-hidden'>
      {/* Background Image */}
      <img className='absolute top-0 left-0 -z-10 h-full w-full object-cover' src={heroUrl} alt='hero_yacht' />
      
      {/* Clearer Overlay */}
      <div className='absolute inset-0 bg-black/10 -z-5' />

      <div className='relative h-full w-full flex flex-col justify-center px-[6%] md:px-[8%] z-10 pt-20'>
        <div className='max-w-2xl flex flex-col gap-6 mb-16'>
          <h1 className='text-white playfair-display text-4xl md:text-[5rem] leading-[1.05] drop-shadow-sm'>
            Discover Your Dream <br /> Yachts With Us
          </h1>
          <div className='w-24 h-[2px] bg-[#D48D2A]'></div>
          <p className='text-white/90 montserrat text-lg md:text-xl font-normal tracking-wide'>
            Unrivaled luxury, boundless freedom.
          </p>
        </div>

        <div className='w-full max-w-4xl'>
          <Yacht_Search />
        </div>
      </div>
    </div>
  )
}

export default Yacht_Hero