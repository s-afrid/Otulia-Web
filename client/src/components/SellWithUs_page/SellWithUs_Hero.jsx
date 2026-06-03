import React from "react";
import heroUrl from '../../assets/hero_banners/sell_with_us_header.jpeg';
import { FaArrowRightLong } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const SellWithUs_Hero = () => {
  return (
    <div className="relative flex flex-col bg-white h-screen w-full z-20 overflow-hidden">
      {/* Background Image - Matching the refined, high-end look */}
      <div className="absolute inset-0 -z-10">
        <img
          className="h-full w-full object-cover"
          src={heroUrl}  
          alt="luxury_heritage"
        />
        {/* Balanced Overlay for maximum clarity of the Canela typography */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      <div className="relative h-full w-full flex flex-col justify-center px-[6%] md:px-[10%] z-10 pt-20">
        <div className="max-w-4xl">
          {/* Top Label - Precise matching of the reference image */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-[1px] bg-white/60"></div>
            <p className="text-white text-[10px] md:text-xs tracking-[0.4em] uppercase montserrat font-semibold">
              Introducing Otulia
            </p>
          </div>

          {/* Main Heading - Replicating the Canela light typography and layout */}
          <div className="leading-[1.1] md:leading-[1]">
            <h1 className="text-white font-light text-[54px] sm:text-[72px] md:text-[90px] lg:text-[100px] tracking-tight canela">
              The Future
            </h1>
            <h1 className="text-white font-light text-[54px] sm:text-[72px] md:text-[90px] lg:text-[100px] tracking-tight canela">
              Marketplace
            </h1>
            <h1 className="text-white/90 italic font-light text-[44px] sm:text-[58px] md:text-[72px] lg:text-[80px] tracking-tight canela">
              for Luxury Assets.
            </h1>
          </div>

          {/* Description - Focused on AI-driven infrastructure as per reference */}
          <p className="mt-8 max-w-2xl text-white/90 text-sm md:text-lg leading-relaxed font-light montserrat">
            AI-driven luxury marketplace infrastructure designed for dealerships, real 
            estate agencies, yacht brokers, and elite asset sellers.
          </p>

          {/* Button - Exact match of the "JOIN EARLY ACCESS" style */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <NavLink to="/signup">
              <button className="group flex items-center justify-center gap-4 bg-white text-black px-10 py-5 text-[11px] tracking-[0.3em] uppercase montserrat font-bold transition-all duration-300 hover:bg-[#f0f0f0] shadow-xl">
                Join Early Access
                <FaArrowRightLong className="text-[14px] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient to blend with the trust section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default SellWithUs_Hero;
