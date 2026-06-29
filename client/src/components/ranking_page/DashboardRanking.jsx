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
const logoSrc = "/logos/logo.png";

function Sidebar({ categories = [], activeSlug }) {
  const { category, slug } = useParams();
  const currentSlug = activeSlug || slug;

  let navItems = [];
  if (categories && categories.length > 0) {
    navItems = [
      {
        label: "All Rankings",
        icon: FiGrid,
        path: `/ranking/${category || "cars"}`,
        slug: undefined,
      },
      ...categories.map((cat) => ({
        label: cat.title,
        icon: FiPackage,
        path: `/ranking/${cat.type ? cat.type.toLowerCase().replace(/\s+/g, "") : "cars"}/${cat.slug}`,
        slug: cat.slug,
      }))
    ];
  } else {
    navItems = [
      {
        label: "All Rankings",
        icon: FiGrid,
        path: `/ranking/${category || "cars"}`,
        slug: undefined,
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
  }

  return (
    <aside
      className="
      fixed
      left-0
      top-0
      w-[260px]
      h-screen
      bg-zinc-950
      z-40
      flex
      flex-col
    "
    >
      {/* Header */}
      <div className="h-[88px] flex items-center px-6 border-b border-zinc-800">
        <img
          className="w-[clamp(100px,10vw,160px)] h-auto object-contain transition-all"
          alt="logo"
          src={logoSrc}
          title="Otulia"
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-2 border-r border-zinc-800">
        {navItems.map((item) => {
          const isActive =
            item.slug === undefined
              ? !slug
              : currentSlug === item.slug;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
              relative
              flex
              items-center
              gap-3
              px-4
              py-3
              
              transition-all
              ${
                isActive
                  ? "bg-zinc-900/60 text-[#D48D2A]"
                  : "text-[#A1A1AA] hover:bg-zinc-900/40 hover:text-white"
              }
            `}
            >
              <item.icon className="text-[18px]" />

              <span className="text-[15px] font-semibold">{item.label}</span>

              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#D48D2A]" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
