import React, { useRef } from "react";
import AssetCard from "./AssetCard";

const AssetSlider = ({ title, items }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative w-full px-8 md:px-12 py-8 bg-white group">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold canela text-black">
          {title}
        </h2>
      </div>

      <div className="relative">
        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="absolute cursor-pointer -left-4 md:-left-10 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none hidden md:block border border-gray-100"
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* SCROLLABLE LIST */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 px-1 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, idx) => (
            <div
              key={item._id || idx}
              className="flex-none w-full sm:w-[48%] md:w-[calc((100%-2rem)/3)]"
            >
              <AssetCard item={item} idx={idx} />
            </div>
          ))}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="absolute cursor-pointer -right-4 md:-right-10 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none hidden md:block border border-gray-100"
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default AssetSlider;
