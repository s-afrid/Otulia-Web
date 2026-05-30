import React from "react";
import SellWithUs_Hero from "./SellWithUs_Hero";
import CategoryCards from "../../assets/sellwithus_page/category_cards.png";
import WhatsappCard from "../../assets/sellwithus_page/whatsapp_card.png";
import SeoCard from "../../assets/sellwithus_page/seo_card.png";

const SellWithUs_Card = () => {
  return (
    <>
      {/* ONE SUBSCRIPTION SECTION */}
      <section className="w-full bg-white py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h2
              className="text-black text-[48px] md:text-[72px] leading-[1.05] font-light"
              style={{ fontFamily: "serif" }}
            >
              One Subscription
            </h2>
            <h3
              className="mt-3 text-[#D2AE68] text-[40px] md:text-[58px] italic leading-none font-light"
              style={{ fontFamily: "serif" }}
            >
              Four Categories
            </h3>
            <p className="mt-6 text-black/75 text-[15px] leading-relaxed max-w-lg">
              One subscription gives dealerships and agencies access to multiple
              luxury markets under one subscription. List in every market.
            </p>
          </div>

          {/* RIGHT CARDS */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[1000px] h-[520px] flex items-center justify-center">
              <img
                src={CategoryCards}
                className="w-full h-full object-contain"
                alt="categories"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="w-full h-[1px] bg-black/10"></div>
      {/* BUYERS CONTACT YOU */}
      <section className="w-full bg-white py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-30 items-center">
          {/* LEFT CONTENT */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[760px] h-[520px] flex items-center justify-center">
              <img
                src={WhatsappCard}
                className="w-full h-full object-contain"
                alt="categories"
              />
            </div>
          </div>

          {/* RIGHT CARDS */}
          <div className="max-w-xl">
            <h2
              className="text-black text-[48px] md:text-[72px] leading-[1.05] font-light"
              style={{ fontFamily: "serif" }}
            >
              Buyers Contact You
            </h2>
            <h3
              className="mt-4 text-[#D2AE68] text-[40px] md:text-[58px] italic leading-none font-light"
              style={{ fontFamily: "serif" }}
            >
              Directly On Whatsapp
            </h3>
            <p className="mt-6 text-black/75 text-[15px] leading-relaxed max-w-lg">
              Every Otulia listing includes WhatsApp integration. Serious buyers
              connect with your team instantly — no forms, delays, or middlemen.
              The fastest path from interest to deal.
            </p>
          </div>
        </div>
      </section>
      <div className="w-full h-[1px] bg-black/10"></div>
      {/* ONE SUBSCRIPTION SECTION */}
      <section className="w-full bg-white py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h2
              className="text-black text-[48px] md:text-[72px] leading-[1.05] font-light"
              style={{ fontFamily: "serif" }}
            >
              SEO-Ready Listing Pages
            </h2>
            <h3
              className="mt-4 text-[#D2AE68] text-[40px] md:text-[58px] italic leading-none font-light"
              style={{ fontFamily: "serif" }}
            >
              Free Backlinks
            </h3>
            <p className="mt-10 text-black/75 text-[18px] leading-relaxed max-w-lg">
              Every listing is SEO-optimised with free company profile and
              backlinks to your dealership website — boosting visibility and
              domain authority automatically.
            </p>
          </div>

          {/* RIGHT CARDS */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[760px] h-[520px] flex items-center justify-center">
              <img
                src={SeoCard}
                className="w-full h-full object-contain"
                alt="categories"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SellWithUs_Card;
