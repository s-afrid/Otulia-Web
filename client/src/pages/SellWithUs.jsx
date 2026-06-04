import React from "react";
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
import Sellemo2 from "../assets/sellwithus_page/sellemo_2.png";
import Sellemo3 from "../assets/sellwithus_page/sellemo_3.png";
import ChartCard from "../assets/sellwithus_page/chart_card.png";
import DashboardCard from "../assets/sellwithus_page/dashboard_card.png";
import AnalyticsCard from "../assets/sellwithus_page/analytics_card.png";
import NJMcard from "../assets/sellwithus_page/njm_card.png";
import NJM from "../assets/sellwithus_page/njm.png";
import RankingCard from "../assets/sellwithus_page/ranking_card.png";
import CreditsCard from "../assets/sellwithus_page/credits_card.png";
import GrowIcon1 from "../assets/sellwithus_page/grow_1.png";
import GrowIcon2 from "../assets/sellwithus_page/grow_2.png";
import GrowIcon3 from "../assets/sellwithus_page/grow_3.png";
import MarketingCard from "../assets/sellwithus_page/marketing_card.png";

function Sellwithus() {
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
      icon: <img src={GrowIcon1} />,
      title: "Reach the Right Customers",
      description: "Connect with qualified buyers and investors worldwide.",
    },
    {
      icon: <img src={GrowIcon2} />,
      title: "Showcase Your Business Everywhere",
      description: "Display your assets across our global luxury network.",
    },
    {
      icon: <img src={GrowIcon3} />,
      title: "Turn Interest into Sales",
      description: "Engage serious buyers and close more deals, faster.",
    },
  ];

  return (
    <>
      {/* NAVBAR */}
      <NavbarSellwithus hideSearch={true} />

      {/* HERO */}
      <SellWithUs_Hero />

      {/* MARKET VALIDATION SECTION */}
      <section className="w-full bg-white pt-16 pb-2 px-6 md:px-10 lg:px-16">
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
                className="bg-white border border-black/10 min-h-[260px] flex flex-col items-center justify-center text-center px-8 py-2 transition-all duration-300 hover:shadow-xl"
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
      <div className="w-full h-[1px] bg-black/10 my-10"></div>

      {/* GROW BUSINESS SECTION */}
      <section className="w-full bg-white py-2 px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          {/* Heading */}
          <h2
            className="text-center text-black text-[40px] md:text-[60px] font-light leading-[1.05] tracking-[-0.04em]"
            style={{ fontFamily: "serif" }}
          >
            Grow Your Business with Otulia
          </h2>

          {/* Main Box */}
          <div className="w-full mt-16 border-2 border-[#E3B24B] rounded-[28px] bg-white/40 backdrop-blur-sm px-8 md:px-12 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10">
              {growthCards.map((item, index) => (
                <div key={index} className="relative">
                  {/* Vertical Separator */}
                  {index !== growthCards.length - 1 && (
                    <div className="hidden md:block absolute top-0 -right-5 w-[1px] h-full bg-black/10"></div>
                  )}

                  <div className="flex items-start gap-6">
                    <div className="w-[90px] h-[90px] flex items-center justify-center rounded-full bg-white shadow-md shrink-0">
                      {item.icon}
                    </div>

                    <div className="flex flex-col max-w-[180px]">
                      <h3
                        className="text-black text-[24px] leading-[1.05]"
                        style={{ fontFamily: "serif" }}
                      >
                        {item.title}
                      </h3>

                      <p className="mt-3 text-black/70 text-[15px] leading-[1.6]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <SellWithUs_Card />

      {/* NUMBERED_CARDS */}

      <section className="w-full bg-white py-2 px-6 md:px-10 lg:px-16">
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
                className="mt-3 text-[45px] leading-tight font-light text-[#D4B06A]"
                style={{ fontFamily: "serif" }}
              >
                Out Reach Forms
              </h3>

              {/* Description */}
              <p className="mt-6 max-w-lg text-black/75 text-[15px] leading-relaxed font-light">
                Buyers fill out a form about their preferences, and we provide
                them with the best buyer-seller matches.Depending upon the
                requirements.
              </p>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="flex justify-center lg:justify-end">
              <img
                src={OutreachForm} //OutreachForm
                alt="Buyer Flow"
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
              <p className="mt-6 max-w-lg text-black/75 text-[15px] leading-relaxed font-light">
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
              <p className="mt-6 max-w-lg text-black/75 text-[15px] leading-relaxed font-light">
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
      <section className="w-full bg-white py-2 px-6 md:px-10 lg:px-16 overflow-hidden">
        {/* TITLE */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2
            className="text-[40px] md:text-[65px] leading-[1.05] font-light text-black"
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
              <div className="w-36 h-36 flex items-center justify-center ">
                <img
                  src={Sellemo2}
                  alt="VS"
                  className="w-50 h-50 object-contain"
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

      {/* WE CREATE MARKING  */}
      <section className="w-full bg-white py-2 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div>
            <h2
              className="text-[40px] md:text-[65px] leading-[1.05] font-light text-black"
              style={{ fontFamily: "serif" }}
            >
              We Create Marketing
              <br />
              Materials
            </h2>

            <h3
              className="mt-4 text-[32px] md:text-[42px] font-light text-[#C8A96B]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              For Every Asset
            </h3>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-black/75">
              We create premium social-ready graphics and AI walkthrough videos
              that help your listings stand out and attract serious buyers.
            </p>

            {/* FEATURES */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                {
                  title: "AI Walkthroughs",
                  desc: "Cinematic video tours that showcase every detail.",
                },
                {
                  title: "Social-Ready Designs",
                  desc: "Professionally crafted posts ready to publish.",
                },
                {
                  title: "Premium Campaigns",
                  desc: "High-quality visuals that attract serious buyers.",
                },
              ].map((item, index) => (
                <div key={index}>
                  <div className="w-12 h-12 rounded-full border border-[#C8A96B] flex items-center justify-center mb-3">
                    <div className="w-5 h-5 bg-[#C8A96B] rounded-sm" />
                  </div>

                  <h4 className="text-sm font-semibold text-black">
                    {item.title}
                  </h4>

                  <p className="text-xs text-black/70 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div>
            {/* TOP MOCKUP AREA */}
            <div className="flex items-end gap-4">
              {/* Laptop Placeholder */}
              <div className="flex-1">
                <div className="aspect-[16/10] flex items-center justify-center">
                  <img src={MarketingCard} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Line */}
      <div className="w-full h-[1px] bg-black/10"></div>

      <section className="w-full bg-white py-2 px-6 md:px-10 lg:px-16">
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
            <p className="mt-6 text-black/75 text-[15px] leading-relaxed max-w-lg">
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
      <section className="w-full bg-white py-2 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* HEADING */}
          <div className="text-center mb-24">
            <h2
              className="text-[40px] md:text-[60px] leading-[1.05] font-light text-black"
              style={{ fontFamily: "serif" }}
            >
              Sell Smarter Using Luxury Marketplace Intelligence Tools
            </h2>
          </div>

          {/* TOP ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div>
              <h3
                className="text-[#D4B06A] text-[34px] md:text-[50px] leading-[1.05] font-light"
                style={{ fontFamily: "serif" }}
              >
                Otulia Analytics and Insights
              </h3>

              <p className="mt-6 text-black/75 text-[15px] leading-relaxed max-w-lg font-light">
                A purpose-built CRM for luxury dealerships-manage inventory,
                buyer inquiries, pricing history, follow-ups, and documents from
                one dashboard.
              </p>
            </div>

            {/* RIGHT IMAGE PLACEHOLDER */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[620px] aspect-[16/9] border border-black/10 rounded-[6px] bg-white shadow-sm flex items-center justify-center">
                <img src={DashboardCard} />
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-28">
            {/* LEFT IMAGE PLACEHOLDER */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="w-full max-w-[620px] border border-black/10 rounded-[2px] bg-white shadow-sm flex items-center justify-center">
                <img src={AnalyticsCard} />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="order-1 lg:order-2">
              <h3
                className="text-[#D4B06A] text-[34px] md:text-[50px] leading-[1.05] font-light"
                style={{ fontFamily: "serif" }}
              >
                Global Google Analytics API
              </h3>

              <p className="mt-6 text-black/75 text-[15px] leading-relaxed max-w-lg font-light">
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
      <section className="w-full bg-white py-2 px-6 md:px-10 lg:px-16 overflow-hidden">
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
                className="mt-2 text-[#D4B06A] text-[20px] md:text-[40px] leading-[1.05] font-light"
                style={{ fontFamily: "serif" }}
              >
                Asset Recognition
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-6 max-w-lg text-black/75 text-[15px] leading-relaxed font-light">
                Every asset gets a unique NJM ID — making listings instantly
                searchable, shareable, and verifiable worldwide with a single
                code.
              </p>
              <img src={NJM} />
            </div>

            {/* RIGHT VISUAL AREA */}
            <div className="relative flex items-center justify-center min-h-[520px]">
              <img src={NJMcard} />
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] bg-black/10"></div>

      {/* RANKING SYSTEM SECTION */}
      <section className="w-full bg-white py-2 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* LEFT IMAGE PLACEHOLDER */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[760px] aspect-[1.15/1] bg-white/40 rounded-[8px] flex items-center justify-center">
                <img src={RankingCard} />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div>
              {/* HEADING */}
              <h2
                className="text-black text-[40px] md:text-[60px] leading-[1.05] font-light"
                style={{ fontFamily: "serif" }}
              >
                Close More Deals With
              </h2>

              {/* SUBTITLE */}
              <h3
                className="mt-4 text-[#D4B06A] text-[20px] md:text-[40px] leading-[1.05] font-light"
                style={{ fontFamily: "serif" }}
              >
                Otulia’s Ranking System
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-6 max-w-lg text-black/75 text-[15px] leading-relaxed font-light">
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

      {/* OTULIA CREDITS SECTION */}
      <section className="w-full bg-[#F8F7F4] py-2 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* LEFT CONTENT */}
            <div>
              {/* HEADING */}
              <h2
                className="text-black text-[40px] md:text-[60px] leading-[1.05] font-light"
                style={{ fontFamily: "serif" }}
              >
                Build Long-Term Buyer Engagement
                <br />
                With <span className="text-[#D4B06A]">Otulia Credits</span>
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-6 max-w-lg text-black/75 text-[15px] leading-relaxed font-light">
                Otulia's exclusive credit system lets dealerships allocate
                credits directly to buyers.Increasing the sales of dealerships.
              </p>

              {/* SUBTITLE */}
              <h3
                className="mt-6 text-black/75 text-[26px] font-light"
                style={{ fontFamily: "serif" }}
              >
                Credits Can Be Used For
              </h3>

              {/* FEATURES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-14 mt-6">
                {/* ITEM */}
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#D4B06A]"></div>

                  <p className="text-black text-[15px] leading-relaxed font-light">
                    Luxury hotels
                  </p>
                </div>

                {/* ITEM */}
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#D4B06A]"></div>

                  <p className="text-black text-[15px] leading-relaxed font-light">
                    Concierge services
                  </p>
                </div>

                {/* ITEM */}
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#D4B06A]"></div>

                  <p className="text-black text-[15px] leading-relaxed font-light">
                    Vehicle services
                  </p>
                </div>

                {/* ITEM */}
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#D4B06A]"></div>

                  <p className="text-black text-[15px] leading-relaxed font-light">
                    Experiences
                  </p>
                </div>

                {/* ITEM */}
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#D4B06A]"></div>

                  <p className="text-black text-[15px] leading-relaxed font-light">
                    Travels
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE PLACEHOLDER */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[720px] aspect-[1.45/1] rounded-[10px] bg-white/40 border border-[#D4B06A]/40 shadow-sm flex items-center justify-center">
                <img src={CreditsCard} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Line */}
      <div className="w-full h-[1px] bg-black/10"></div>

      {/* FINAL CTA SECTION */}
      <section className="w-full bg-white py-2 px-6 md:px-10 lg:px-16">
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
          <p className="mt-6 max-w-lg text-black/75 text-[15px] leading-relaxed font-light">
            Join the dealerships writing the next chapter of luxury commerce.
            List your first asset on Otulia today.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <button className="bg-black text-white px-10 py-4 text-[11px] tracking-[0.28em] uppercase transition-all duration-300 hover:bg-[#1a1a1a]">
              List Your Asset Now →
            </button>

            <button className="border border-black/30 text-black px-10 py-4 text-[11px] tracking-[0.28em] uppercase transition-all duration-300 hover:bg-black hover:text-white">
              Book a Demo
            </button>
          </div>
        </div>
      </section>
      {/* Line */}
      <div className="w-full h-[1px] bg-black/10"></div>
    </>
  );
}

export default Sellwithus;