import React from "react";
import {
  FaTrophy,
  FaBolt,
  FaTachometerAlt,
  FaFlag,
  FaArrowRight,
} from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

function RankingCard() {
  const car = {
    rank: 1,
    badge: "NEW FOR 2026",
    name: "Bugatti Tourbillon",
    tag: "New for 2026",
    description: "The next era of performance and luxury.",

    image:
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop",

    stats: [
      {
        icon: FaBolt,
        value: "1,800 HP",
        label: "Power",
      },
      {
        icon: LuTimerReset,
        value: "2.0 sec",
        label: "0-100 km/h",
      },
      {
        icon: MdOutlineSpeed,
        value: "445 km/h",
        label: "Top Speed",
      },
      {
        icon: TbEngine,
        value: "8.3L V16",
        label: "Engine",
      },
    ],

    category: "Best Hypercars of 2026",
    origin: "France 🇫🇷",
    bodyType: "2-Door Coupe",

    votes: "2.4K",
    status: "Leading",
  };

  return (
    <div className="w-full rounded-[18px] border border-[#EAEAEA] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[248px]">
        {/* LEFT IMAGE */}
        <div className="relative lg:w-[42%] shrink-0">
          <img
            src={car.image}
            alt={car.name}
            className="h-[248px] w-full object-cover"
          />

          {/* Rank Ribbon */}
          <div className="absolute left-4 top-0">
            <div className="flex w-[52px] flex-col items-center bg-[#D6A125] px-2 py-3 text-black">
              <FaTrophy className="text-[18px]" />

              <span className="mt-1 text-[34px] font-bold leading-none">
                {car.rank}
              </span>
            </div>

            <div
              className="mx-auto h-0 w-0 border-l-[26px] border-r-[26px]
              border-t-[14px] border-l-transparent border-r-transparent border-t-[#D6A125]"
            />
          </div>

          {/* Bottom Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="rounded-md bg-[#4C2D95] px-3 py-2 text-[13px] font-semibold text-white">
              {car.badge}
            </span>
          </div>
        </div>

        {/* MIDDLE CONTENT */}
        <div className="flex-1 px-7 py-5">
          {/* Title */}
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[24px] font-bold leading-tight text-black">
              {car.name}
            </h2>

            <span className="rounded-lg bg-[#4C2D95] px-3 py-1 text-[12px] font-semibold text-white">
              {car.tag}
            </span>
          </div>

          {/* Description */}
          <p className="mt-3 text-[15px] leading-[1.5] text-[#4B5563]">
            {car.description}
          </p>

          {/* Performance Stats */}
          <div className="mt-6 grid grid-cols-2 gap-y-8 md:grid-cols-4">
            {car.stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div key={index} className="flex items-start gap-3">
                  <Icon className="mt-1 text-[20px] text-black" />

                  <div>
                    <div className="text-[13px] font-bold leading-none text-black">
                      {stat.value}
                    </div>

                    <div className="mt-2 text-[10px] text-[#6B7280]">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Meta */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-[13px] text-[#6B7280]">
            <span>
              Category:{" "}
              <span className="font-medium text-black">{car.category}</span>
            </span>

            <span>|</span>

            <span>
              Origin:{" "}
              <span className="font-medium text-black">{car.origin}</span>
            </span>

            <span>|</span>

            <span>
              Body Type:{" "}
              <span className="font-medium text-black">{car.bodyType}</span>
            </span>
          </div>

          {/* Links */}
          <div className="mt-8 flex flex-wrap gap-12">
            <button className="flex items-center gap-3 text-[18px] font-semibold text-black transition hover:text-[#D6A125]">
              View Full Listing
              <FaArrowRight />
            </button>

            <button className="flex items-center gap-3 text-[18px] font-semibold text-black transition hover:text-[#D6A125]">
              View Sources (5)
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex w-[180px] shrink-0 flex-col items-center border-l border-[#E5E7EB] px-6 py-5">
          {/* Vote Button */}
          <button className="w-full rounded-sm bg-black py-3 text-[16px] font-semibold text-white transition hover:bg-[#1F2937]">
            Vote
          </button>

          {/* Votes */}
          <div className="mt-8 text-center">
            <div className="text-[32px] font-bold leading-none text-black">
              {car.votes}
            </div>

            <div className="mt-2 text-[14px] text-[#6B7280]">Votes</div>
          </div>

          {/* Progress */}
          <div className="mt-8 w-full">
            <div className="h-[6px] w-full rounded-full bg-[#F3E7C3]">
              <div className="h-[6px] w-[72%] rounded-full bg-[#D6A125]" />
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[18px] font-semibold text-[#D6A125]">
              <FaTrophy />
              <span>{car.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingCard;
