import React, { useState } from "react";
import {
  FaTrophy,
  FaBolt,
  FaArrowRight,
} from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function RankingCard({ data }) {
  const { isAuthenticated, token } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [localLikes, setLocalLikes] = useState(data?.signals?.likes || 0);

  if (!data) return null;

  const { rank, car, signals, breakdown, carData } = data;
  
  // Use carData if available (it's the snapshot), otherwise fall back to car
  const displayCar = carData || car;

  const stats = [
    {
      icon: FaBolt,
      value: displayCar.keySpecifications?.power || "N/A",
      label: "Power",
    },
    {
      icon: LuTimerReset,
      value: displayCar.specification?.acceleration || "N/A",
      label: "0-100 km/h",
    },
    {
      icon: MdOutlineSpeed,
      value: displayCar.keySpecifications?.topSpeed || "N/A",
      label: "Top Speed",
    },
    {
      icon: TbEngine,
      value: displayCar.specification?.engineType || "N/A",
      label: "Engine",
    },
  ];

  const formatVotes = (val) => {
    if (val >= 1000) return (val / 1000).toFixed(1) + "K";
    return val;
  };

  const handleVote = async () => {
    if (!isAuthenticated) {
      alert("Please login to vote for your favorite nominees.");
      return;
    }

    setIsVoting(true);
    try {
      const response = await fetch(`/api/assets/cars/${displayCar._id}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const result = await response.json();
        setLocalLikes(result.likes);
        // Optionally show success toast/message
      } else {
        const err = await response.json();
        alert(err.message || "Failed to submit vote");
      }
    } catch (error) {
      console.error("Vote failed:", error);
      alert("An error occurred while submitting your vote.");
    } finally {
      setIsVoting(false);
    }
  };

  const mainImage = displayCar.images?.[0] || "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="w-full rounded-[18px] border border-[#EAEAEA] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[248px]">
        {/* LEFT IMAGE */}
        <div className="relative lg:w-[42%] shrink-0">
          <img
            src={mainImage}
            alt={displayCar.title}
            className="h-[248px] w-full object-cover"
          />

          {/* Rank Ribbon */}
          <div className="absolute left-4 top-0">
            <div className="flex w-[52px] flex-col items-center bg-[#D6A125] px-2 py-3 text-black">
              <FaTrophy className="text-[18px]" />

              <span className="mt-1 text-[34px] font-bold leading-none">
                {rank}
              </span>
            </div>

            <div
              className="mx-auto h-0 w-0 border-l-[26px] border-r-[26px]
              border-t-[14px] border-l-transparent border-r-transparent border-t-[#D6A125]"
            />
          </div>

          {/* Bottom Badge */}
          {displayCar.isTrending && (
            <div className="absolute bottom-4 left-4">
              <span className="rounded-md bg-[#4C2D95] px-3 py-2 text-[13px] font-semibold text-white">
                TRENDING
              </span>
            </div>
          )}
        </div>

        {/* MIDDLE CONTENT */}
        <div className="flex-1 px-7 py-5">
          {/* Title */}
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[24px] font-bold leading-tight text-black">
              {displayCar.title}
            </h2>

            {displayCar.status === "Active" && (
              <span className="rounded-lg bg-[#4C2D95] px-3 py-1 text-[12px] font-semibold text-white">
                AVAILABLE
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-3 text-[15px] line-clamp-2 leading-[1.5] text-[#4B5563]">
            {displayCar.description}
          </p>

          {/* Performance Stats */}
          <div className="mt-6 grid grid-cols-2 gap-y-8 md:grid-cols-4">
            {stats.map((stat, index) => {
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
              <span className="font-medium text-black">{displayCar.category || "Car"}</span>
            </span>

            <span>|</span>

            <span>
              Brand:{" "}
              <span className="font-medium text-black">{displayCar.brand}</span>
            </span>

            <span>|</span>

            <span>
              Year:{" "}
              <span className="font-medium text-black">{displayCar.specification?.yearOfConstruction || "N/A"}</span>
            </span>
          </div>

          {/* Links */}
          <div className="mt-8 flex flex-wrap gap-12">
            <Link 
              to={`/asset/${displayCar.category}/${displayCar._id}`}
              className="flex items-center gap-3 text-[18px] font-semibold text-black transition hover:text-[#D6A125]"
            >
              View Full Listing
              <FaArrowRight />
            </Link>

            <button className="flex items-center gap-3 text-[18px] font-semibold text-black transition hover:text-[#D6A125]">
              View Sources (1)
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex w-[180px] shrink-0 flex-col items-center border-l border-[#E5E7EB] px-6 py-5">
          {/* Vote Button */}
          <button 
            disabled={isVoting}
            onClick={handleVote}
            className={`w-full rounded-sm bg-black py-3 text-[16px] font-semibold text-white transition hover:bg-[#1F2937] ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isVoting ? 'Voting...' : 'Vote'}
          </button>

          {/* Votes */}
          <div className="mt-8 text-center">
            <div className="text-[32px] font-bold leading-none text-black">
              {formatVotes(localLikes)}
            </div>

            <div className="mt-2 text-[14px] text-[#6B7280]">Votes</div>
          </div>

          {/* Progress */}
          <div className="mt-8 w-full">
            <div className="h-[6px] w-full rounded-full bg-[#F3E7C3]">
              <div 
                className="h-[6px] rounded-full bg-[#D6A125]" 
                style={{ width: `${Math.min(100, (signals?.completenessRatio || 0) * 100)}%` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[18px] font-semibold text-[#D6A125]">
              <FaTrophy />
              <span>{rank === 1 ? "Leading" : rank <= 3 ? "Top Rated" : "Contender"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingCard;
