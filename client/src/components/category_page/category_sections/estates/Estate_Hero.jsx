import React from "react";
import heroUrl from "../../../../assets/hero_banners/hero_estate.webp";
import Estate_Search from "./Estate_Search";
import { FiChevronDown } from "react-icons/fi";

const Estate_Hero = () => {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.92,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex flex-col hero-banner h-[90vh] md:h-[92vh] w-full z-20">
      {/* Background Image */}
      <img
        className="absolute top-0 left-0 -z-10 h-full w-full object-cover"
        src={heroUrl}
        alt="hero_estate"
      />

      {/* Centered Content: Heading, Subtitle & Search */}
      <div className="relative h-full w-full flex flex-col justify-center items-center text-center px-4 md:px-8 z-10 pt-16 pb-16 md:pt-20 md:pb-20">
        <div className="max-w-2xl flex flex-col items-center text-center gap-4 mb-6 md:mb-8 mx-auto">
          <h1 className="text-white canela text-2xl md:text-[3.25rem] font-light leading-[1.05] drop-shadow-sm">
            Otulia Luxury Real Estate
          </h1>
          <div className="w-24 h-[2px] bg-[#D48D2A] mx-auto"></div>
          <p className="text-white/90 montserrat text-lg md:text-xl font-normal tracking-wide">
            Explore curated estates, villas, penthouses, and exceptional
            properties worldwide.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto flex justify-center">
          <Estate_Search />
        </div>
      </div>

      {/* Bottom Bar: Scroll Indicator (Center) & Location (Right) */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-5 pb-5 pt-14 md:px-10 md:pb-6 pointer-events-none">
        <div className="relative w-full flex items-center justify-end min-h-[48px]">
          {/* Scroll down indicator centered */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-auto">
            <button
              onClick={handleScrollDown}
              type="button"
              aria-label="Scroll to content"
              className="flex flex-col items-center cursor-pointer text-white/80 hover:text-white transition-all duration-300 group focus:outline-none"
            >
              <span className="w-[1.25px] h-5 bg-white/75 group-hover:bg-white transition-colors" />
              <span className="w-2 h-2 rounded-full border-[1.25px] border-white/75 group-hover:border-white transition-colors -mt-1" />
              <FiChevronDown className="text-white/80 group-hover:text-white text-base mt-1 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>

          {/* Location on the right */}
          <div className="pointer-events-auto">
            <p className="montserrat text-right text-xs md:text-[15px] font-light tracking-wide text-white drop-shadow-md">
              Umm Al Sheif, Dubai, United Arab Emirates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estate_Hero;
