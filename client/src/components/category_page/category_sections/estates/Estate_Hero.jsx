import React from "react";
import heroUrl from "../../../../assets/hero_banners/hero_estate.webp";
import Estate_Search from "./Estate_Search";

const Estate_Hero = () => {
  return (
    <div className="relative flex flex-col hero-banner h-screen w-full z-20">
      {/* Background Image */}
      <img
        className="absolute top-0 left-0 -z-10 h-full w-full object-cover"
        src={heroUrl}
        alt="hero_estate"
      />

      <div className="relative h-full w-full flex flex-col justify-start items-center text-center px-4 md:px-8 z-10 pt-28 md:pt-32">
        <div className="max-w-2xl flex flex-col items-center text-center gap-6 mb-8 md:mb-10 mx-auto">
          <h1 className="text-white canela text-2xl md:text-[3.25rem] font-light leading-[1.05] drop-shadow-md text-center">
            Otulia Luxury Real Estate
          </h1>
          <div className="w-24 h-[2px] bg-[#D48D2A] mx-auto"></div>
          <p className="text-white/90 montserrat text-lg md:text-xl font-normal tracking-wide text-center drop-shadow-sm">
            Explore curated estates, villas, penthouses, and exceptional
            properties worldwide.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto flex justify-center">
          <Estate_Search />
        </div>
      </div>
    </div>
  );
};

export default Estate_Hero;
