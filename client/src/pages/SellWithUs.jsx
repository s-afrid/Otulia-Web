import React from "react";
import { Link } from "react-router-dom";
import NavbarSellwithus from "../components/NavbarSellwithus";
import Hero from "../components/home_page/Hero";
import {
  FaGlobeAmericas,
  FaSearch,
  FaFilm,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
} from "react-icons/fa";
import SellWithUs_Card from "../components/SellWithUs_page/SellWithUs_Card";
import SellWithUs_Hero from "../components/SellWithUs_page/SellWithUs_Hero";

import BuyerFlowImage from "../assets/sellwithus_page/buyer_flow.png";
import OutreachForm from "../assets/sellwithus_page/outreach_form.png";
import SalesCard from "../assets/sellwithus_page/sales_card.png";
import Sellemo1 from "../assets/sellwithus_page/sellemo_1.jpeg";
import Sellemo2 from "../assets/sellwithus_page/sellemo_2.jpeg";
import Sellemo3 from "../assets/sellwithus_page/sellemo_3.png";
import ChartCard from "../assets/sellwithus_page/chart_card.png";
import DashboardCard from "../assets/sellwithus_page/dashboard_card.png";
import AnalyticsCard from "../assets/sellwithus_page/analytics_card.png";
import NJMcard from "../assets/sellwithus_page/njm_card.png";
import RankingCard from "../assets/sellwithus_page/ranking_card.png";
import CreditsCard from "../assets/sellwithus_page/credits_card.png";

function SellWithUs() {
  const featuredBrands = [
    "Chrono24",
    "Bring a Trailer",
    "JamesEdition",
    "Sotheby's",
    "Robb Report",
    "Hodinkee",
  ];

  const stats = [
    {
      icon: <FaGlobeAmericas className="w-10 h-10 text-[#C8922A]" />,
      value: "$1.5T",
      label: "GLOBAL LUXURY MARKET VALUE",
    },
    {
      icon: <FaSearch className="w-10 h-10 text-[#C8922A]" />,
      value: "72%",
      label: "OF HNW BUYERS RESEARCH ONLINE FIRST",
    },
    {
      icon: <FaFilm className="w-10 h-10 text-[#C8922A]" />,
      value: "3.4×",
      label: "ENGAGEMENT ON CINEMATIC LISTINGS",
    },
  ];

  const growthCards = [
    {
      icon: <FaUsers className="text-[42px] text-black" />,
      title: "Reach the Right Customers",
      description:
        "Showcase your business with buyers searching for premium products and services.",
    },
    {
      icon: <FaBuilding className="text-[42px] text-black" />,
      title: "Showcase Your Business Everywhere",
      description:
        "Your listings are seen by clients near you and around the world, giving your business more opportunities to grow.",
    },
    {
      icon: <FaMoneyBillWave className="text-[42px] text-black" />,
      title: "Turn Interest into Sales",
      description:
        "Connect with people who are ready to buy, and make your products and services stand out in a competitive market.",
    },
  ];

  return (
    <>
      {/* NAVBAR */}
      <NavbarSellwithus hideSearch={true} />

      {/* HERO */}
      <SellWithUs_Hero />

      {/* MARKET VALIDATION SECTION */}
      <section className="w-full bg-white py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Top Label */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-[1px] bg-[#C8922A]" />

            <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-black/70 montserrat font-semibold">
              Market Validation
            </p>
          </div>

          {/* Heading */}
          <h2 className="text-center leading-[1.05] tracking-[-0.04em]">
            <span className="block text-black text-[42px] md:text-[64px] font-light">
              Luxury Buyers{" "}
              <span
                className="italic text-[#C8922A]"
                style={{ fontFamily: "serif" }}
              >
                Already Start Online.
              </span>
            </span>
          </h2>

          {/* Description */}
          <p className="mt-8 max-w-4xl text-center text-black/70 text-base md:text-xl leading-relaxed font-light">
            From watches to estates, the world's highest-value assets are
            increasingly discovered, researched and acquired through digital
            marketplaces. Otulia is built for the next chapter.
          </p>

          {/* Small Divider */}
          <div className="w-16 h-[2px] bg-[#C8922A] mt-10 mb-14"></div>

          {/* Brand Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
            {featuredBrands.map((brand, index) => (
              <div
                key={index}
                className="border border-black/10 bg-white h-[110px] flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg"
              >
                <p
                  className="text-black text-lg"
                  style={{ fontFamily: "serif" }}
                >
                  {brand}
                </p>

                <div className="w-10 h-[2px] bg-[#C8922A] mt-3"></div>
              </div>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl mt-10">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-black/10 min-h-[260px] flex flex-col items-center justify-center text-center px-8 py-10 transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-8">{item.icon}</div>

                <h3
                  className="text-[52px] leading-none text-black font-light"
                  style={{ fontFamily: "serif" }}
                >
                  {item.value}
                </h3>

                <p className="mt-6 text-[11px] tracking-[0.35em] uppercase text-black/70 leading-relaxed montserrat font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEPARATING LINE */}
      <div className="w-full h-[1px] bg-black/10"></div>

      {/* GROW BUSINESS SECTION */}
      <section className="w-full bg-white py-16 px-6 md:px-10 lg:px-16">
        <div className="max-w-4xl  mx-auto flex flex-col items-center">
          {/* Heading */}
          <h2
            className="text-center text-black text-[42px] md:text-[64px] font-light leading-tight"
            style={{ fontFamily: "serif" }}
          >
            Grow Your Business with Otulia
          </h2>

          {/* Main Box */}
          {/* <div className="w-full mt-16 border-2 border-[#E3B24B] rounded-[28px] bg-white/40 backdrop-blur-sm px-8 md:px-12 py-12 md:py-16">
            
          </div> */}
        </div>
      </section>

      {/* CARDS */}
      <SellWithUs_Card />

      {/* NUMBERED_CARDS */}

      <section className="w-full bg-white py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Top Line */}
          <div className="w-full h-[1px] bg-black/10 mb-10"></div>

          {/* Heading */}
          <h2
            className="text-center text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.04em] font-light"
            style={{ fontFamily: "serif" }}
          >
            We Give You Buyers In{" "}
            <span className="text-[#D4B06A]">Three Main Ways</span>
          </h2>

          {/* CARD 1 */}

          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* LEFT SIDE */}
            <div className="pt-6">
              <div className="w-10 h-10 rounded-full border border-[#D4B06A] flex items-center justify-center">
                <span
                  className="text-[#D4B06A] text-[20px] font-light"
                  style={{ fontFamily: "serif" }}
                >
                  1
                </span>
              </div>

              {/* Title */}
              <h3
                className="mt-3 text-[40px] leading-tight font-light text-[#D4B06A]"
                style={{ fontFamily: "serif" }}
              >
                Outreach Forms
              </h3>

              {/* Description */}
              <p className="mt-3 max-w-xl text-black text-[15px] leading-[1.7] font-light">
                Buyers fill out a form about their preferences, and we provide
                them with the best buyer-seller matches.Depending upon the
                requirements.
              </p>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="flex justify-center lg:justify-end">
              <img
                src={OutreachForm}
                alt="Outreach form example"
                className="w-full max-w-[640px] object-contain"
              />
            </div>
          </div>

          {/* CARD 2 */}

          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left Side */}
            <div className="flex justify-center lg:justify-end">
              <img
                src={BuyerFlowImage}
                alt="Buyer Flow"
                className="w-full max-w-[640px] object-contain"
              />
            </div>

            {/* Right Side */}
            <div className="pt-6">
              {/* Number */}
              <div className="w-10 h-10 rounded-full border border-[#D4B06A] flex items-center justify-center">
                <span
                  className="text-[#D4B06A] text-[20px] font-light"
                  style={{ fontFamily: "serif" }}
                >
                  2
                </span>
              </div>

              {/* Title */}
              <h3
                className="mt-3 text-[40px] leading-tight font-light text-[#D4B06A]"
                style={{ fontFamily: "serif" }}
              >
                Direct Enquiry
              </h3>

              {/* Description */}
              <p className="mt-4 max-w-xl text-black text-[15px] leading-[1.7] font-light">
                When buyers click “Interested” on your listing through Otulia
                Website , the enquiry and buyer details are sent directly to
                your CRM dashboard inbox, WA and Gmail.
              </p>
            </div>
          </div>

          {/* CARD 3 */}

          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* LEFT SIDE */}
            <div className="pt-6">
              <div className="w-10 h-10 rounded-full border border-[#D4B06A] flex items-center justify-center">
                <span
                  className="text-[#D4B06A] text-[20px] font-light"
                  style={{ fontFamily: "serif" }}
                >
                  3
                </span>
              </div>

              {/* Title */}
              <h3
                className="mt-3 text-[40px] leading-tight font-light text-[#D4B06A]"
                style={{ fontFamily: "serif" }}
              >
                Cross Category
              </h3>

              {/* Description */}
              <p className="mt-3 max-w-xl text-black text-[15px] leading-[1.7] font-light">
                When a sale happens in your region within your average lead
                value, you’ll be notified about the asset sold and its price to
                help you price inventory and identify top-selling assets to
                increase your stock.
              </p>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="flex justify-center lg:justify-end">
              <img
                src={SalesCard}
                alt="Buyer Flow"
                className="w-full max-w-[640px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SELL EMOTIONS VS SECTION */}
      <section className="w-full bg-white py-24 px-6 md:px-10 lg:px-16 overflow-hidden">
        {/* TITLE */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2
            className="text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.04em] font-light text-black"
            style={{ fontFamily: "serif" }}
          >
            Sell Emotions To Buyers{" "}
            <span className="text-black">Not Just Assets</span>
          </h2>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-16 items-center">
            {/* LEFT IMAGE */}
            <div className="flex flex-col justify-center">
              <p
                className="mt-8 text-[#D4B06A] text-[24px] md:text-[36px] font-light mb-2.5"
                style={{ fontFamily: "serif" }}
              >
                We believe Every asset has a Soul
              </p>
              <img
                src={Sellemo1}
                alt="Sell Emotions"
                className="w-full max-w-[720px] object-contain"
              />
            </div>

            {/* CENTER VS */}
            <div className="flex flex-col items-center justify-center">
              {/* VS Circle */}
              <div className="w-36 h-36 rounded-full bg-[#C8A15A] flex items-center justify-center shadow-sm">
                <img
                  src={Sellemo2}
                  alt="VS"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="flex justify-center">
              <img
                src={Sellemo3}
                alt="Traditional"
                className="w-full max-w-[320px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Line */}
      <div className="w-full h-[1px] bg-black/10"></div>

      <section className="w-full bg-white py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h2
              className="text-black text-[40px] md:text-[60px] leading-[1.05] font-light"
              style={{ fontFamily: "serif" }}
            >
              Pricing Charts that
            </h2>
            <h3
              className="mt-4 text-[#D2AE68] text-[20px] md:text-[40px] leading-none font-light"
              style={{ fontFamily: "serif" }}
            >
              Attract More Buyers
            </h3>
            <p className="mt-10 text-black/75 text-[15px] leading-relaxed max-w-lg">
              Give buyers access to 5–15 years of historical price data —
              increasing confidence, trust, and conversion rates.
            </p>
          </div>

          {/* RIGHT CARDS */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="relative h-auto w-full max-w-[560px]">
              <img
                src={ChartCard}
                className="w-full h-auto object-contain rounded-sm"
                alt="categories"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Line */}
      <div className="w-full h-[1px] bg-black/10"></div>

      {/* SELL SMARTER SECTION */}
      <section className="w-full bg-white py-24 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* HEADING */}
          <div className="text-center mb-24">
            <h2
              className="text-[42px] md:text-[72px] leading-[1.1] tracking-[-0.04em] font-light text-black"
              style={{ fontFamily: "serif" }}
            >
              Sell Smarter Using Luxury Marketplace Intelligence
              <br />
              Tools
            </h2>
          </div>

          {/* TOP ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div>
              <h3
                className="text-[#D4B06A] text-[34px] md:text-[50px] leading-[1.15] font-light"
                style={{ fontFamily: "serif" }}
              >
                Otulia Analytics and Insights
              </h3>

              <p className="mt-8 text-black text-[15px] leading-[1.8] max-w-xl font-light">
                A purpose-built CRM for luxury dealerships-manage inventory,
                buyer inquiries, pricing history, follow-ups, and documents from
                one dashboard.
              </p>
            </div>

            {/* RIGHT IMAGE PLACEHOLDER */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[620px] aspect-[16/9]  rounded-[6px] bg-white shadow-sm flex items-center justify-center">
                <img src={DashboardCard} alt="Otulia dashboard preview" />
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-28">
            {/* LEFT IMAGE PLACEHOLDER */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="w-full max-w-[620px]  rounded-[2px] bg-white shadow-sm flex items-center justify-center">
                <img src={AnalyticsCard} alt="Analytics preview" />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="order-1 lg:order-2">
              <h3
                className="text-[#D4B06A] text-[34px] md:text-[50px] leading-[1.15] font-light"
                style={{ fontFamily: "serif" }}
              >
                Global Google Analytics API
              </h3>

              <p className="mt-8 text-black text-[15px] leading-[1.8] max-w-xl font-light">
                The world’s first luxury marketplace with Google Trends
                Integration, live Buyer Demand Intelligence — see global search
                demand, buyer locations, price ranges, and the best time to post
                using real-time trends data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Line */}
      <div className="w-full h-[1px] bg-black/10"></div>

      {/* NJM ID SECTION */}
      <section className="w-full bg-white py-24 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* LEFT CONTENT */}
            <div>
              {/* HEADING */}
              <h2
                className="text-black text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.04em] font-light"
                style={{ fontFamily: "serif" }}
              >
                NJM IDs for Instant
              </h2>

              {/* SUBTITLE */}
              <h3
                className="mt-6 text-[#D4B06A] text-[20px] md:text-[40px] leading-[1.15] font-light"
                style={{ fontFamily: "serif" }}
              >
                Asset Recognition
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-6 max-w-xl text-black text-[15px] leading-[1.8] font-light">
                Every asset gets a unique NJM ID — making listings instantly
                searchable, shareable, and verifiable worldwide with a single
                code.
              </p>
            </div>

            {/* RIGHT VISUAL AREA */}
            <div className="relative flex items-center justify-center min-h-[520px]">
              <img src={NJMcard} alt="NJM ID card visual" />
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] bg-black/10"></div>

      {/* RANKING SYSTEM SECTION */}
      <section className="w-full bg-white py-24 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* LEFT IMAGE PLACEHOLDER */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[760px] aspect-[1.15/1] bg-white/40 rounded-[8px] flex items-center justify-center">
                <img src={RankingCard} alt="Ranking system preview" />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div>
              {/* HEADING */}
              <h2
                className="text-black text-[40px] md:text-[60px] leading-[1] font-light"
                style={{ fontFamily: "serif" }}
              >
                Close More Deals With
              </h2>

              {/* SUBTITLE */}
              <h3
                className="mt-4 text-[#D4B06A] text-[20px] md:text-[40px] leading-[1.15] font-light"
                style={{ fontFamily: "serif" }}
              >
                Otulia’s Ranking System
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-8 max-w-2xl text-black text-[15px] leading-[1.8] font-light">
                Your listings and company profile are added as nominees in
                global luxury rankings released every six months, helping drive
                millions of buyers toward your assets and increasing regional
                visibility, inquiries, and sales.
              </p>

              {/* STATS GRID */}
              <div className="grid grid-cols-2 gap-x-16 gap-y-14 mt-16">
                {/* ITEM */}
                <div className="border-l-[3px] border-[#D4B06A] pl-3 ">
                  <h4
                    className="text-[#D4B06A] text-[36px] md:text-[36px] leading-none font-light"
                    style={{ fontFamily: "serif" }}
                  >
                    3x–7x
                  </h4>

                  <p className="mt-4 text-black text-[15px] leading-relaxed font-light">
                    More Listing Visibility
                  </p>
                </div>

                {/* ITEM */}
                <div className="border-l-[3px] border-[#D4B06A] pl-3">
                  <h4
                    className="text-[#D4B06A] text-[38px] md:text-[36px] leading-none font-light"
                    style={{ fontFamily: "serif" }}
                  >
                    40% – 65%
                  </h4>

                  <p className="mt-4 text-black text-[15px] leading-relaxed font-light">
                    Organic Traffic Increase
                  </p>
                </div>

                {/* ITEM */}
                <div className="border-l-[3px] border-[#D4B06A] pl-3">
                  <h4
                    className="text-[#D4B06A] text-[38px] md:text-[36px] leading-none font-light"
                    style={{ fontFamily: "serif" }}
                  >
                    + 55%
                  </h4>

                  <p className="mt-4 text-black text-[15px] leading-relaxed font-light">
                    Buyer Inquiry Growth
                  </p>
                </div>

                {/* ITEM */}
                <div className="border-l-[3px] border-[#D4B06A] pl-3">
                  <h4
                    className="text-[#D4B06A] text-[38px] md:text-[36px] leading-none font-light"
                    style={{ fontFamily: "serif" }}
                  >
                    2.8x
                  </h4>

                  <p className="mt-4 text-black text-[15px] leading-relaxed font-light">
                    Better Buyer Discovery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Line */}
      <div className="w-full h-[1px] bg-black/10"></div>

      {/* FINAL CTA SECTION */}
      <section className="w-full bg-white py-28 px-6 md:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Small Label */}
          <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#C8922A] montserrat font-semibold">
            Take Your Position
          </p>

          {/* Heading */}
          <h2
            className="mt-6 text-[42px] md:text-[72px] leading-[1.05] font-light text-black"
            style={{ fontFamily: "serif" }}
          >
            Ready to Sell at the{" "}
            <span className="italic text-[#C8922A]">Highest Level?</span>
          </h2>

          {/* Description */}
          <p className="mt-8 max-w-2xl text-black/60 text-base md:text-lg leading-relaxed font-light">
            Join the dealerships writing the next chapter of luxury commerce.
            List your first asset on Otulia today.
          </p>

          {/* Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/seller"
                className="bg-black text-white px-10 py-4 text-[11px] tracking-[0.28em] uppercase transition-all duration-300 hover:bg-[#1a1a1a]"
              >
                List Your Asset Now →
              </Link>

              <Link
                to="/contact"
                className="border border-black/30 text-black px-10 py-4 text-[11px] tracking-[0.28em] uppercase transition-all duration-300 hover:bg-black hover:text-white"
              >
                Book a Demo
              </Link>
            </div>
        </div>
      </section>
      {/* Line */}
      <div className="w-full h-[1px] bg-black/10"></div>
    </>
  );
}

export default SellWithUs;
