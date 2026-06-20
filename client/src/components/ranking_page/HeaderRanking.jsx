import React from "react";
import {
  FaChevronRight,
  FaShareAlt,
  FaTrophy,
  FaUsers,
  FaRegCalendarAlt,
} from "react-icons/fa";

function RankingHeader({ data }) {
  const stats = [
    {
      icon: FaTrophy,
      value: data.nominees,
      label: "Nominees",
      iconColor: "text-[#C9920E]",
    },
    {
      icon: FaUsers,
      value: data.votes,
      label: "Total Votes",
      iconColor: "text-black",
    },
    {
      icon: FaRegCalendarAlt,
      value: data.updated,
      label: "Last Updated",
      iconColor: "text-black",
    },
  ];
  return (
    <section className="bg-white pt-[110px] pb-12">
      {/* Breadcrumb + Share */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-[14px] text-[#6B7280] mb-5">
            {data.breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <span>{item}</span>

                {index !== data.breadcrumbs.length - 1 && (
                  <FaChevronRight className="text-[11px]" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-[42px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.03em]">
            <span className="text-black">{data.titleMain} </span>

            <span className="text-[#C9920E]">{data.titleHighlight}</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[650px] text-[18px] leading-[1.65] text-[#4B5563]">
            {data.description}
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
                rounded-xl
                border border-[#E7E7E7]
                bg-white
                px-8 py-4
                shadow-[0_2px_6px_rgba(0,0,0,0.03)]
                min-w-[135px]
              "
            >
              <Icon className={`text-[24px] ${stat.iconColor}`} />

              <div>
                <div className="text-[20px] font-bold leading-none text-black">
                  {stat.value}
                </div>

                <div className="mt-1 text-[12px] text-[#6B7280]">
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
