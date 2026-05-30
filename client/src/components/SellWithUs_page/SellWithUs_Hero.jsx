import React from "react";
// import heroUrl from "../../assets/hero_banners/sell_with_us_hero.jpg";
import sellwithus from  "../../assets/hero_banners/sell_with_us_header.jpeg"
// import heroUrl from "../."
import { FaArrowRightLong } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const SellWithUs_Hero = () => {
  return (
    <div className="relative bg-white flex flex-col hero-banner h-screen w-full z-20">
      {/* Background Image */}
      <img
        className="absolute top-0 left-0 -z-10 h-full w-full object-cover"
        src={sellwithus }
        alt="hero_car"
      />
    {/* Gradient: left transparent (shows image) → right white */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10  z-0" />

      <div className="relative h-full w-full flex flex-col justify-center pl-8 md:pl-12 lg:pl-16 pr-[6%] z-10 pt-20">
        <div className="max-w-4xl mb-24 gap-0 flex flex-col">
          {/* Top Label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-[1px] bg-white/40"></div>

            <p className="text-white/90 text-[10px] md:text-xs tracking-[0.35em] uppercase montserrat font-medium">
              Introducing Otulia
            </p>
          </div>

          {/* Main Heading */}
          <div className="leading-[0.95]">
            <h1 className="text-white font-light drop-shadow-md text-[58px] sm:text-[72px] md:text-[88px] lg:text-[110px] tracking-[-0.04em]">
              The 
            </h1>

            <h1 className="text-white font-light drop-shadow-md text-[58px] sm:text-[72px] md:text-[88px] lg:text-[110px] tracking-[-0.04em]">
              Marketplace
            </h1>
            <h1
              className="text-[#D7C1A1] italic font-light text-[48px] sm:text-[62px] md:text-[78px] lg:text-[96px] tracking-[-0.04em]"
              style={{ fontFamily: "serif" }}
            >
              for Luxury Assets.
            </h1>
          </div>

          {/* Description */}
          <p className="mt-4 max-w-2xl text-white/90 drop-shadow-sm text-sm md:text-lg leading-relaxed font-light">
            marketplace infrastructure designed for
            dealerships, real estate agencies, yacht brokers, and elite asset
            sellers.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <NavLink to="/signup">
              <button className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-[11px] tracking-[0.35em] uppercase montserrat font-medium transition-all duration-300 hover:bg-[#e8e8e8]">
                List Your Assets
                <FaArrowRightLong className="text-[12px] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </NavLink>

            {/* <button className="group flex items-center justify-center gap-3 border border-white/60 bg-transparent text-white px-8 py-4 text-[11px] tracking-[0.35em] uppercase montserrat font-medium transition-all duration-300 hover:bg-white hover:text-black">
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
