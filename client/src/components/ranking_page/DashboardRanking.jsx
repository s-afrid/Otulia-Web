import React from "react";
import {
  FiGrid,
  FiPackage,
  FiUsers,
  FiPieChart,
  FiGlobe,
  FiCreditCard,
  FiSettings,
  FiChevronDown,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "allranking", label: "All Rankings", icon: FiGrid },
    { id: "besthypercars", label: "Best Hypercars", icon: FiPackage },
    { id: "bestluxurycars", label: "Best Luxury Cars", icon: FiUsers },
    { id: "bestluxurysuv", label: "Best Luxury SUVs", icon: FiPieChart },
    { id: "bestevcars", label: "Best Electric Cars", icon: FiGlobe },
    { id: "bestsportcars", label: "Best Sports Cars", icon: FiCreditCard },
    { id: "bestsupercars", label: "Best Supercars", icon: FiSettings },
    { id: "bestcarbrands", label: "Best Car Brands", icon: FiSettings },
  ];

  return (
    <div className="w-[clamp(180px,14vw,320px)] h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-[50] transition-all duration-300 overflow-hidden">
      {/* Logo Area */}
      <div className="h-[clamp(80px,12vh,130px)] flex items-center px-[clamp(16px,2vw,32px)] border-b border-gray-50">
        RANKING
      </div>

      <nav className="flex-1 px-[clamp(10px,1vw,20px)] space-y-[clamp(6px,1vh,12px)] overflow-y-auto custom-scrollbar pb-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-[clamp(8px,0.8vw,16px)] px-[clamp(8px,1vw,20px)] py-[clamp(8px,1.2vh,16px)] rounded-[clamp(4px,1vh,12px)] transition-all group relative ${
              activeTab === item.id
                ? "bg-[#FFF8F0] text-[#D48D2A] shadow-[inset_0_0_0_1px_rgba(212,141,42,0.05)]"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <item.icon
              className={`text-[clamp(14.28px,1.83vh,24.48px)] ${activeTab === item.id ? "text-[#D48D2A]" : "text-gray-400 group-hover:text-gray-600"}`}
            />
            <span className="inter text-[clamp(10.2px,1.53vh,20.4px)] font-semibold tracking-tight">
              {item.label}
            </span>
            {activeTab === item.id && (
              <div className="absolute right-0 top-[20%] bottom-[20%] w-[4px] bg-[#D48D2A] rounded-l-full shadow-[0_0_12px_rgba(212,141,42,0.6)] animate-in fade-in slide-in-from-right-1 duration-300" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
