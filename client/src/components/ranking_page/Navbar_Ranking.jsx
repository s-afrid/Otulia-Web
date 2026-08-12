import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import Cart from "../navbar/Cart";
import Search from "../navbar/Search";
import RankingSearch from "./RankingSearch";
import LoginButton from "../navbar/LoginButton";
import ProfileDropdown from "../navbar/Profile_dropdown";
import NavbarMobile from "../Navbar_mobile";
import { useAuth } from "../../contexts/AuthContext";
import { FaTrophy } from "react-icons/fa";

const Navbar = ({
  hideSearch = false,
  hideLogin = false,
  forceTransparent = false,
  customLogo = null,
  isSidebarOpen = true,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [panelFlag, setpanelFlag] = useState(false);

  // 1. Get Loading State
  const { isAuthenticated, loading } = useAuth();

  const location = useLocation();
  const isHeroPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDarkText = false;

  const navClasses = `
fixed
top-0
right-0
lg:left-[260px]
left-0
h-[88px]
z-50
bg-zinc-950
border-b
border-zinc-800
flex
items-center
justify-between
px-4
md:px-10
`;

  const navStyle = {
    right: 0,
  };

  const logoSrc = "/logos/logo.png";

  return (
    <nav className={navClasses} style={navStyle}>
      <div className="w-full flex items-center justify-between relative">
        {/* Left side: Logo on mobile/tablet, Search Bar on desktop */}
        <div className="flex items-center gap-3 z-10">
          <Link to="/" className="lg:hidden shrink-0 flex items-center">
            <img
              className="w-[110px] sm:w-[130px] h-auto object-contain transition-opacity hover:opacity-90"
              alt="Otulia Logo"
              src={logoSrc}
              title="Otulia"
            />
          </Link>
          <div className="hidden md:block w-[240px] lg:w-[320px]">
            <RankingSearch />
          </div>
        </div>

        {/* 2. DESKTOP MENU - Center Column (Absolute centered) */}
        <ul className="hidden lg:flex items-center justify-center gap-[clamp(16px,3vw,48px)] absolute left-1/2 -translate-x-1/2 w-auto">
          <li>
            <NavLink
              to="/ranking/cars"
              className={({ isActive }) =>
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${isActive ? "text-[#D48D2A]" : isDarkText ? "text-black hover:text-black/70" : "text-white hover:text-white/70"}`
              }
            >
              CARS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ranking/realestate"
              className={({ isActive }) =>
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${isActive ? "text-[#D48D2A]" : isDarkText ? "text-black hover:text-black/70" : "text-white hover:text-white/70"}`
              }
            >
              REAL ESTATE
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ranking/contentcreators"
              className={({ isActive }) =>
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${isActive ? "text-[#D48D2A]" : isDarkText ? "text-black hover:text-black/70" : "text-white hover:text-white/70"}`
              }
            >
              CONTENT CREATORS
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${isActive ? "text-[#D48D2A]" : isDarkText ? "text-black hover:text-black/70" : "text-white hover:text-white/70"}`
              }
            >
              MAGAZINE
            </NavLink>
          </li> */}
          {/* <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${isActive ? "text-[#D48D2A]" : isDarkText ? "text-black hover:text-black/70" : "text-white hover:text-white/70"}`
              }
            >
              ABOUT US
            </NavLink>
          </li> */}
        </ul>

        {/* 3. RIGHT ACTIONS - Right Column */}
        <div className="flex-1 flex items-center justify-end gap-[clamp(8px,1vw,24px)]">
          <NavLink
            to="/"
            className={`hidden lg:block px-[clamp(12px,1.5vw,24px)] py-[clamp(6px,1vh,12px)] rounded border text-[clamp(9px,1.1vh,13px)] tracking-[0.2em] font-medium montserrat transition-all duration-500 whitespace-nowrap backdrop-blur-md shadow-lg active:scale-95 ${
              isDarkText
                ? "border-black/10 bg-black/5 text-black hover:bg-black hover:text-white hover:border-black hover:shadow-black/10"
                : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-black hover:border-white hover:shadow-white/20"
            }`}
          >
            Submit a Nominee
          </NavLink>

          {loading ? (
            <div className="w-8 h-8 bg-gray-200/20 rounded-full animate-pulse"></div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              {!isAuthenticated && !hideLogin && (
                <LoginButton isDark={isDarkText} />
              )}
              {isAuthenticated && (
                <>
                  <div className="hidden lg:block">
                    <ProfileDropdown isDark={isDarkText} />
                  </div>
                  <Cart isDark={isDarkText} />
                </>
              )}
            </div>
          )}

          {/* 4. HAMBURGER (Visible on mobile and tablet) */}
          <button
            aria-label="Open menu"
            className={`lg:hidden focus:outline-none z-50 transition-colors ${isDarkText ? "text-black" : "text-white"}`}
            onClick={() => setpanelFlag(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 md:w-8 md:h-8"
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
        className={`fixed top-0 right-0 h-screen w-[80vw] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${panelFlag ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          aria-label="Close menu"
          onClick={() => setpanelFlag(false)}
          className="absolute top-6 right-6 text-[#2C2C2C] focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="pt-20">
          <NavbarMobile />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
