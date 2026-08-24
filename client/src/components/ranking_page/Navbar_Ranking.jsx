import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import Cart from "../navbar/Cart";
import Search from "../navbar/Search";
import RankingSearch from "./RankingSearch";
import LoginButton from "../navbar/LoginButton";
import ProfileDropdown from "../navbar/Profile_dropdown";
import NavbarMobile from "../Navbar_mobile";
import { useAuth } from "../../contexts/AuthContext";
import { FaTrophy, FaTimes } from "react-icons/fa";

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

  // Close mobile drawer on route change
  useEffect(() => {
    setpanelFlag(false);
  }, [location.pathname]);

  const isDarkText = false;
  const logoSrc = "/logos/logo.png";

  return (
    <nav className="fixed top-0 left-0 lg:left-[260px] right-0 h-[64px] sm:h-[72px] lg:h-[88px] z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-850 flex items-center justify-between px-4 sm:px-6 lg:px-10 transition-all duration-300">
      <div className="w-full flex items-center justify-between relative">
        {/* Left side: Mobile Logo & Desktop Search */}
        <div className="flex items-center gap-3 z-10">
          <Link to="/" className="lg:hidden shrink-0 flex items-center">
            <img
              src={logoSrc}
              alt="Otulia Logo"
              className="w-[105px] sm:w-[125px] h-auto object-contain"
            />
          </Link>

          <div className="hidden md:block w-[220px] lg:w-[320px]">
            <RankingSearch />
          </div>
        </div>

        {/* Desktop Navigation - Center Column */}
        <ul className="hidden lg:flex items-center justify-center gap-[clamp(16px,3vw,48px)] absolute left-1/2 -translate-x-1/2 w-auto">
          <li>
            <NavLink
              to="/ranking/cars"
              className={({ isActive }) =>
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#D48D2A] font-bold"
                    : isDarkText
                    ? "text-black hover:text-black/70"
                    : "text-white hover:text-white/70"
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
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#D48D2A] font-bold"
                    : isDarkText
                    ? "text-black hover:text-black/70"
                    : "text-white hover:text-white/70"
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
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#D48D2A] font-bold"
                    : isDarkText
                    ? "text-black hover:text-black/70"
                    : "text-white hover:text-white/70"
                }`
              }
            >
              CONTENT CREATORS
            </NavLink>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-4">
          <NavLink
            to="/"
            className="hidden lg:block px-4 py-2 rounded border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black hover:border-white text-[12px] tracking-[0.18em] font-medium montserrat transition-all duration-300 whitespace-nowrap backdrop-blur-md shadow-md active:scale-95"
          >
            Submit a Nominee
          </NavLink>

          {loading ? (
            <div className="w-8 h-8 bg-zinc-800 rounded-full animate-pulse" />
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
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

          {/* Hamburger (Mobile & Tablet) */}
          <button
            aria-label="Open menu"
            className="lg:hidden text-white hover:text-[#D48D2A] p-1.5 focus:outline-none transition-colors"
            onClick={() => setpanelFlag(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
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

      {/* MOBILE DRAWER */}
      {panelFlag && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-[60] lg:hidden animate-in fade-in duration-200"
          onClick={() => setpanelFlag(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-[85vw] max-w-[340px] bg-[#0E0E11] border-l border-zinc-800 text-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          panelFlag ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-zinc-800 shrink-0">
          <Link to="/" onClick={() => setpanelFlag(false)}>
            <img src={logoSrc} alt="Otulia" className="w-[110px] h-auto object-contain" />
          </Link>
          <button
            aria-label="Close menu"
            onClick={() => setpanelFlag(false)}
            className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-900 transition"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-4 border-b border-zinc-800/80">
          <RankingSearch />
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-2">
            Ranking Categories
          </div>
          <NavLink
            to="/ranking/cars"
            onClick={() => setpanelFlag(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition ${
                isActive
                  ? "bg-[#D6A125]/15 text-[#D6A125] border border-[#D6A125]/30 font-bold"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900"
              }`
            }
          >
            Automotive Rankings
          </NavLink>
          <NavLink
            to="/ranking/realestate"
            onClick={() => setpanelFlag(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition ${
                isActive
                  ? "bg-[#D6A125]/15 text-[#D6A125] border border-[#D6A125]/30 font-bold"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900"
              }`
            }
          >
            Real Estate Rankings
          </NavLink>
          <NavLink
            to="/ranking/contentcreators"
            onClick={() => setpanelFlag(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition ${
                isActive
                  ? "bg-[#D6A125]/15 text-[#D6A125] border border-[#D6A125]/30 font-bold"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900"
              }`
            }
          >
            Content Creators Rankings
          </NavLink>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-4 border-t border-zinc-850 bg-black/50 space-y-2.5">
          <Link
            to="/"
            onClick={() => setpanelFlag(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#D6A125] hover:bg-[#c4921f] text-black font-bold text-xs tracking-wider uppercase text-center block transition shadow"
          >
            Submit a Nominee
          </Link>

          {!isAuthenticated ? (
            <div className="pt-1 flex justify-center">
              <LoginButton isDark={false} />
            </div>
          ) : (
            <div className="pt-1">
              <ProfileDropdown isDark={false} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
