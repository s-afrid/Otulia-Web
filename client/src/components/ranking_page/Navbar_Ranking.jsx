import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import Cart from "../navbar/Cart";
import RankingSearch from "./RankingSearch";
import LoginButton from "../navbar/LoginButton";
import ProfileDropdown from "../navbar/Profile_dropdown";
import NavbarMobile from "../Navbar_mobile";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = ({
  hideSearch = false,
  hideLogin = false,
  forceTransparent = false,
  customLogo = null,
  isSidebarOpen = true,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [panelFlag, setpanelFlag] = useState(false);

  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenNominate = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("otulia:open-nominate-modal"));
  };

  const navClasses = `
    fixed
    top-0
    right-0
    lg:left-[240px]
    xl:left-[260px]
    left-0
    h-[76px]
    sm:h-[84px]
    md:h-[88px]
    z-50
    bg-zinc-950/95
    backdrop-blur-md
    border-b
    border-zinc-850
    flex
    items-center
    justify-between
    px-4
    sm:px-6
    md:px-8
    xl:px-10
    transition-all
    duration-200
  `;

  const logoSrc = "/logos/logo.png";

  return (
    <nav className={navClasses}>
      <div className="w-full flex items-center justify-between gap-3 sm:gap-4 relative">
        {/* 1. Left side: Logo on mobile/tablet, Search Bar on desktop */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="lg:hidden shrink-0 flex items-center">
            <img
              className="w-[110px] sm:w-[125px] h-auto object-contain transition-opacity hover:opacity-90"
              alt="Otulia Logo"
              src={logoSrc}
              title="Otulia"
            />
          </Link>
          <div className="hidden md:block w-[180px] lg:w-[220px] xl:w-[280px] 2xl:w-[320px]">
            <RankingSearch />
          </div>
        </div>

        {/* 2. Center Column: Category Links */}
        <ul className="hidden lg:flex items-center justify-center gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 mx-auto">
          <li>
            <NavLink
              to="/ranking/cars"
              className={({ isActive }) =>
                `text-[11.5px] xl:text-[13px] tracking-[0.2em] font-medium font-sans uppercase transition-all duration-200 whitespace-nowrap ${
                  isActive || (!location.pathname.includes("realestate") && !location.pathname.includes("contentcreators") && location.pathname.includes("ranking"))
                    ? "text-[#D6A125] font-bold"
                    : "text-zinc-300 hover:text-white"
                }`
              }
            >
              CARS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ranking/realestate"
              className={({ isActive }) =>
                `text-[11.5px] xl:text-[13px] tracking-[0.2em] font-medium font-sans uppercase transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-[#D6A125] font-bold"
                    : "text-zinc-300 hover:text-white"
                }`
              }
            >
              REAL ESTATE
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ranking/contentcreators"
              className={({ isActive }) =>
                `text-[11.5px] xl:text-[13px] tracking-[0.2em] font-medium font-sans uppercase transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-[#D6A125] font-bold"
                    : "text-zinc-300 hover:text-white"
                }`
              }
            >
              CONTENT CREATORS
            </NavLink>
          </li>
        </ul>

        {/* 3. Right Actions: Submit a Nominee & User Account */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3.5 xl:gap-4 shrink-0">
          <button
            type="button"
            onClick={handleOpenNominate}
            className="hidden sm:inline-flex px-3.5 xl:px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-[#D6A125]/15 hover:border-[#D6A125]/60 text-[11px] xl:text-[12px] tracking-[0.12em] font-semibold text-zinc-200 hover:text-[#D6A125] uppercase transition-all duration-200 whitespace-nowrap shadow-sm active:scale-95 cursor-pointer"
          >
            Submit a Nominee
          </button>

          {loading ? (
            <div className="w-8 h-8 bg-zinc-800 rounded-full animate-pulse"></div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {!isAuthenticated && !hideLogin && (
                <LoginButton isDark={false} />
              )}
              {isAuthenticated && (
                <>
                  <div className="hidden lg:block">
                    <ProfileDropdown isDark={false} />
                  </div>
                  <Cart isDark={false} />
                </>
              )}
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            aria-label="Open menu"
            className="lg:hidden focus:outline-none text-white p-1 hover:text-[#D6A125] transition-colors"
            onClick={() => setpanelFlag(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 sm:w-7 sm:h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE PANEL */}
      <div
        className={`fixed top-0 right-0 h-screen w-[80vw] sm:w-[360px] bg-zinc-950 border-l border-zinc-800 shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${
          panelFlag ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          aria-label="Close menu"
          onClick={() => setpanelFlag(false)}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white focus:outline-none p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="pt-20 px-4">
          <NavbarMobile />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

