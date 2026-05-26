import React, { useState } from "react";
import SEO from "../../components/SEO";
import Navbar from "../../components/Navbar";
import { RiArrowDropDownLine } from "react-icons/ri";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Otulia and who is it built for?",
      answer:
        "Otulia is a luxury marketplace built for extraordinary assets — including cars, estates, yachts, and collector machines. It is designed for buyers, collectors, dealers, and investors who value rarity, design, lifestyle, and intelligent ownership experiences rather than traditional classified marketplaces.",
    },
    {
      question: "How does the Buyer Demand Trends feature work?",
      answer:
        "Otulia’s Buyer Demand Trends system analyzes global search interest and buyer activity to show how much attention a specific asset is receiving worldwide. Sellers can see where buyers are searching from, preferred price ranges, and the best time to post listings for maximum visibility.",
    },
    {
      question: "Can I list multiple asset types under one subscription?",
      answer:
        "Yes. Depending on your membership tier, you can list multiple categories such as vehicles, estates, yachts, and bikes under one unified Otulia account and manage them from a single dashboard.",
    },
    {
      question: "What is the NJM ID system?",
      answer:
        "Every asset listed on Otulia receives a unique NJM ID — a proprietary identification code that makes the listing instantly searchable, shareable, and recognizable worldwide. Buyers can simply enter the NJM ID to directly access the exact listing from anywhere.",
    },
    {
      question: "How does the credit system work?",
      answer:
        "Otulia Credits are reward points earned through platform activity, verified listings, engagement, and premium memberships. Credits can unlock exclusive experiences, premium visibility, luxury partner offers, concierge services, and future ecosystem benefits.",
    },
    {
      question: "What are Soul of the Asset and Ideal Buyer?",
      answer:
        "Soul of the Asset captures the emotional identity, personality, and lifestyle behind an asset — beyond technical specifications. Ideal Buyer describes the type of person the asset is truly built for, helping buyers emotionally connect with listings that match their lifestyle and taste.",
    },
    {
      question: "How does the ranking system give 5× more visibility?",
      answer:
        "Otulia’s intelligent ranking system rewards high-quality listings with stronger visibility across the platform. Listings with complete media, detailed storytelling, pricing insights, buyer relevance, and verified information are promoted more aggressively to the right audience globally.",
    },
    {
      question: "How does Otulia help buyers discover the right assets?",
      answer:
        "Otulia combines intelligent recommendations, buyer demand analytics, emotional storytelling, and curated collections to help buyers discover assets that genuinely match their lifestyle, interests, and aspirations. Instead of endlessly scrolling through listings, buyers experience a more refined and personalized discovery journey.",
    },
  ];

  return (
    <div className="pt-40 bg-[#F8F7F4] min-h-screen">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about buying, selling, and renting luxury assets on Otulia."
      />

      <Navbar />

      <div className="max-w-4xl mx-auto px-4">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16">
          {/* Top Label */}
          <div className="flex flex-col items-center text-center">
            <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#C8922A] montserrat font-semibold">
              Frequently Asked
            </p>

            {/* Heading */}
            <h1
              className="mt-5 text-[42px] md:text-[64px] leading-none font-light text-black"
              style={{ fontFamily: "serif" }}
            >
              Common <span className="italic text-[#C8922A]">Questions</span>
            </h1>
          </div>

          {/* FAQ LIST */}
          <div className="mt-20 border-t border-[#E7DFD2]">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="border-b border-[#E7DFD2]">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <span
                      className={`text-[24px] leading-snug font-light transition-colors duration-300 ${
                        isOpen ? "text-[#C8922A]" : "text-black"
                      }`}
                      style={{ fontFamily: "serif" }}
                    >
                      {faq.question}
                    </span>

                    <RiArrowDropDownLine
                      className={`text-[35px] transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#C8922A]" : ""
                      }`}
                    />
                  </button>

                  {/* ANSWER */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-40 pb-8" : "max-h-0"
                    }`}
                  >
                    <p className="text-black/60 text-[16px] leading-relaxed pr-10">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
