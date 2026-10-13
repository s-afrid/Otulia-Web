import React from "react";
import heroUrl from "../../../../assets/hero_banners/hero_car.webp";
import Cars_Search from "./Cars_Search";
import { FiChevronDown } from "react-icons/fi";

const Cars_Hero = () => {
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
        alt="hero_car"
      />

      <div className="relative h-full w-full flex flex-col justify-start items-center text-center px-4 md:px-8 z-10 pt-34 md:pt-50">
        <div className="max-w-2xl flex flex-col items-center text-center gap-4 mb-6 md:mb-8 mx-auto">
          <h1 className="text-white canela text-2xl md:text-[3.25rem] font-light leading-[1.05] drop-shadow-sm">
            Otulia Luxury Cars
          </h1>
          <div className="w-24 h-[2px] bg-[#D48D2A] mx-auto"></div>
          <p className="text-white/90 montserrat text-lg md:text-xl font-normal tracking-wide">
            Explore curated supercars, exotic vehicles, and collector cars from
            verified sellers worldwide.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto flex justify-center">
          <Cars_Search />
        </div>
      </div>

      {/* Bottom Bar: Scroll Indicator */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-5 pb-5 pt-14 md:px-10 md:pb-6 pointer-events-none">
        <div className="relative w-full flex items-center justify-center min-h-[48px]">
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
        </div>
      </div>
    </div>
  );
};

export default Cars_Hero;
