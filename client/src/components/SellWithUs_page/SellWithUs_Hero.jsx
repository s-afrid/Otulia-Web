import React from "react";
// import heroUrl from "../../assets/hero_banners/sell_with_us_header.jpeg";
import sellwithus from '../../assets/hero_banners/sell_with_us_header.jpeg';
import { FaArrowRightLong } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const SellWithUs_Hero = () => {
  return (
    <div className="relative flex flex-col hero-banner bg-white h-screen w-full z-20 overflow-hidden">
      {/* Background Image */}
      <img
        className="absolute top-0 left-0 -z-10 h-full w-full object-cover"
        src={sellwithus}  
        alt="hero_car"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/10 z-0" />

      {/* Left Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0  z-0" />

      <div className="relative h-full w-full flex flex-col justify-center pl-8 md:pl-12 lg:pl-16 pr-[6%] z-10 pt-20">
        <div className="max-w-4xl flex flex-col">
          {/* Top Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[1px] bg-black/40"></div>

            <p className="text-black/70 text-[10px] md:text-xs tracking-[0.35em] uppercase montserrat font-medium">
              Introducing Otulia
            </p>
          </div>

          {/* Main Heading */}
          <div className="leading-[0.95]">
            <h1 className="text-black font-light text-[58px] sm:text-[72px] md:text-[88px] lg:text-[110px] tracking-[-0.04em]">
              The 
            </h1>

            <h1 className="text-black font-light text-[58px] sm:text-[72px] md:text-[88px] lg:text-[110px] tracking-[-0.04em]">
              Marketplace
            </h1>

            <h1
              className="text-[#8B7355] italic font-light text-[48px] sm:text-[62px] md:text-[78px] lg:text-[96px] tracking-[-0.04em]"
              style={{ fontFamily: "serif" }}
            >
              for Luxury Assets.
            </h1>
          </div>

          {/* Description */}
          <p className="mt-8 max-w-2xl text-black/70 text-sm md:text-lg leading-relaxed font-light">
            luxury marketplace infrastructure designed for
            dealerships, real estate agencies, yacht brokers, and elite asset
            sellers.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <NavLink to="/signup">
              <button className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-[11px] tracking-[0.35em] uppercase montserrat font-medium transition-all duration-300 hover:bg-[#e8e8e8]">
                list your assests 
                <FaArrowRightLong className="text-[12px] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </NavLink>

            {/* <button className="group flex items-center justify-center gap-3 border border-white/20 bg-white/5 backdrop-blur-md text-white px-8 py-4 text-[11px] tracking-[0.35em] uppercase montserrat font-medium transition-all duration-300 hover:bg-white hover:text-black">
              Become A Founding Dealer
              <FaArrowRightLong className="text-[12px] transition-transform duration-300 group-hover:translate-x-1" />
            </button> */}
          </div>
        </div>

        <div className="w-full max-w-4xl"></div>
      </div>
    </div>
  );
};

export default SellWithUs_Hero;
