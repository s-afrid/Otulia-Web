import React from "react";
import {
  FaChevronRight,
  FaShareAlt,
  FaTrophy,
  FaUsers,
  FaRegCalendarAlt,
} from "react-icons/fa";

function RankingHeader({ activeTab, count }) {
  const getTabInfo = (tab) => {
    const tabs = {
      allranking: { main: "All Car", highlight: "Rankings", desc: "Comprehensive ranking of all listed cars based on performance, engagement, and completeness." },
      besthypercars: { main: "Best Hypercars", highlight: "of 2026", desc: "The ultimate ranking of the world's most extraordinary hypercars." },
      bestluxurycars: { main: "Best Luxury Cars", highlight: "of 2026", desc: "Top-tier luxury vehicles ranked by comfort, prestige, and engineering." },
      bestluxurysuv: { main: "Best Luxury SUVs", highlight: "of 2026", desc: "Premium SUVs that define versatility and luxury." },
      bestevcars: { main: "Best Electric Cars", highlight: "of 2026", desc: "Leading sustainable performance vehicles in the electric era." },
      bestsportcars: { main: "Best Sports Cars", highlight: "of 2026", desc: "Performance-focused sports cars ranked for driving enthusiasts." },
      bestsupercars: { main: "Best Supercars", highlight: "of 2026", desc: "High-performance supercars that push the boundaries of speed." },
      bestcarbrands: { main: "Best Car Brands", highlight: "of 2026", desc: "Most influential and prestigious car manufacturers ranked." },
    };
    return tabs[tab] || tabs.allranking;
  };

  const info = getTabInfo(activeTab);

  const stats = [
    {
      icon: FaTrophy,
      value: count || "0",
      label: "Nominees",
      iconColor: "text-[#C9920E]",
    },
    {
      icon: FaUsers,
      value: "Dynamic", // Or calculate total votes if possible
      label: "Total Votes",
      iconColor: "text-black",
    },
    {
      icon: FaRegCalendarAlt,
      value: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      label: "Last Updated",
      iconColor: "text-black",
    },
  ];

  return (
    <section className="bg-[#FDFDFD] pt-[110px] px-8 pb-10">
      {/* Breadcrumb + Share */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-[14px] text-[#6B7280] mb-5">
            <span>Home</span>
            <FaChevronRight className="text-[11px]" />
            <span>Rankings</span>
            <FaChevronRight className="text-[11px]" />
            <span className="text-black font-medium">{info.main}</span>
          </div>

          {/* Title */}
          <h1 className="text-[42px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.03em]">
            <span className="text-black">{info.main} </span>
            <span className="text-[#C9920E]">{info.highlight}</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[650px] text-[18px] leading-[1.65] text-[#4B5563]">
            {info.desc}
          </p>
        </div>

        {/* Share Button */}
        <button
          className="
            flex items-center gap-3
            self-start
            rounded-xl
            border border-[#E5E7EB]
            bg-white
            px-6 py-4
            text-[16px]
            font-semibold
            hover:bg-gray-50
            transition
          "
        >
          <FaShareAlt className="text-[18px]" />
          <span>Share</span>
        </button>
      </div>

      {/* Stats */}
      <div className="mt-10 flex flex-wrap gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="
                flex items-center gap-4
                rounded-2xl
                border border-[#E7E7E7]
                bg-white
                px-5 py-4
                shadow-[0_2px_6px_rgba(0,0,0,0.03)]
                min-w-[135px]
              "
            >
              <Icon className={`text-[26px] ${stat.iconColor}`} />

              <div>
                <div className="text-[28px] font-bold leading-none text-black">
                  {stat.value}
                </div>

                <div className="mt-1 text-[15px] text-[#6B7280]">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RankingHeader;
