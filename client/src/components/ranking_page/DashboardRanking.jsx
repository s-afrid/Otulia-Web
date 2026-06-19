import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiUsers,
  FiPieChart,
  FiGlobe,
  FiCreditCard,
  FiSettings,
} from "react-icons/fi";

function Sidebar() {
  const { slug } = useParams();

  const navItems = [
    {
      label: "All Rankings",
      icon: FiGrid,
      path: "/ranking",
    },
    {
      label: "Best Hypercars",
      icon: FiPackage,
      path: "/ranking/cars/hypercars",
      slug: "hypercars",
    },
    {
      label: "Best Luxury Cars",
      icon: FiUsers,
      path: "/ranking/cars/luxury-cars",
      slug: "luxury-cars",
    },
    {
      label: "Best Luxury SUVs",
      icon: FiPieChart,
      path: "/ranking/cars/luxury-suvs",
      slug: "luxury-suvs",
    },
    {
      label: "Best Electric Cars",
      icon: FiGlobe,
      path: "/ranking/cars/electric-cars",
      slug: "electric-cars",
    },
    {
      label: "Best Sports Cars",
      icon: FiCreditCard,
      path: "/ranking/cars/sports-cars",
      slug: "sports-cars",
    },
    {
      label: "Best Supercars",
      icon: FiSettings,
      path: "/ranking/cars/supercars",
      slug: "supercars",
    },
    {
      label: "Best Car Brands",
      icon: FiSettings,
      path: "/ranking/cars/car-brands",
      slug: "car-brands",
    },
  ];

  return (
    <div
      style={{ "--sidebar-width": "260px" }}
      className="
        fixed
        left-0
        top-0
        z-[50]
        h-screen
        w-[var(--sidebar-width)]
        bg-white
        border-r
        border-gray-100
        flex
        flex-col
      "
    >
      {/* Logo */}
      <div className="h-[88px] flex items-center px-6 border-b border-gray-50">
        RANKING
      </div>

      <nav className="flex-1 px-3 space-y-2 overflow-y-auto pb-8">
        {navItems.map((item) => {
          const isActive =
            item.path === "/ranking"
              ? window.location.pathname === "/ranking"
              : slug === item.slug;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                isActive
                  ? "bg-[#FFF8F0] text-[#D48D2A]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <item.icon
                className={`text-[18px] ${
                  isActive
                    ? "text-[#D48D2A]"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />

              <span className="inter text-[14px] font-semibold tracking-tight">
                {item.label}
              </span>

              {isActive && (
                <div className="absolute right-0 top-[20%] bottom-[20%] w-[4px] bg-[#D48D2A] rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
