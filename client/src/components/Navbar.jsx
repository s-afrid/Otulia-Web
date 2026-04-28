import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import Cart from "./navbar/Cart";
import Search from "./navbar/Search";
import LoginButton from "./navbar/LoginButton";
import ProfileDropdown from "./navbar/Profile_dropdown";
import NavbarMobile from "./Navbar_mobile";
import { useAuth } from "../contexts/AuthContext";

const Navbar = ({ hideSearch = false, hideLogin = false, forceTransparent = false, customLogo = null }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [panelFlag, setpanelFlag] = useState(false);

  // 1. Get Loading State
  // We need 'loading' to prevent the UI from checking "isAuthenticated" too early
  const { isAuthenticated, loading } = useAuth();

  const location = useLocation();
  const isHeroPage = location.pathname === "/";
  const isProductPage = location.pathname.startsWith("/asset/")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Determine Text/Icon Color
  // If we are NOT on Hero, OR if we have Scrolled -> Dark Text
  // Override if forceTransparent is on
  const isDarkText = (!isHeroPage || isScrolled) && !forceTransparent;

  const navClasses = `fixed top-0 left-0 h-[40px] md:h-[80px] w-screen z-50 transition-all duration-200 flex items-center justify-between p-6 ${forceTransparent
      ? "bg-transparent text-white"
      : !isHeroPage
        ? "bg-white text-black"
        : isScrolled
          ? "bg-white text-black"
          : "bg-transparent text-white"
    }`;

  // Default logo logic (can be refined based on 'isDarkText' if you have a black logo asset)
  // For now, adhere to existing unless custom provided
  const logoSrc = (isScrolled || !isHeroPage)?"/logos/logo_inverted.png":"/logos/logo.png";

  return (
    <nav className={`${navClasses} px-[5%] md:px-[8%]`}>
      {/* 1. Logo */}
      <NavLink to={"/"} className="flex items-center">
        <span className={`text-2xl md:text-3xl tracking-[0.2em] font-medium playfair-display ${isDarkText ? 'text-black' : 'text-white'}`}>
          OTULIA
        </span>
      </NavLink>

      {/* 2. DESKTOP MENU - CENTERED */}
      <ul className="hidden md:flex items-center justify-center gap-12 absolute left-1/2 -translate-x-1/2">
        <li>
          <NavLink to="/shop" className={({ isActive }) => `text-[11px] tracking-[0.2em] font-bold montserrat transition-colors ${isActive ? 'text-[#D48D2A]' : isDarkText ? 'text-black hover:text-black/70' : 'text-white hover:text-white/70'}`}>
            SHOP ALL
          </NavLink>
        </li>
        <li>
          <NavLink to="/rent" className={({ isActive }) => `text-[11px] tracking-[0.2em] font-bold montserrat transition-colors ${isActive ? 'text-[#D48D2A]' : isDarkText ? 'text-black hover:text-black/70' : 'text-white hover:text-white/70'}`}>
            RENT
          </NavLink>
        </li>
        <li>
          <NavLink to="/pricing" className={({ isActive }) => `text-[11px] tracking-[0.2em] font-bold montserrat transition-colors ${isActive ? 'text-[#D48D2A]' : isDarkText ? 'text-black hover:text-black/70' : 'text-white hover:text-white/70'}`}>
            PLAN & PRICE
          </NavLink>
        </li>
      </ul>

      {/* 3. RIGHT ACTIONS */}
      <div className="hidden md:flex items-center gap-6">
        <NavLink 
          to="/listings" 
          className={`px-6 py-2 rounded-full border text-[10px] tracking-[0.1em] font-bold montserrat transition-all duration-300 ${
            isDarkText 
            ? 'border-black text-black hover:bg-black hover:text-white' 
            : 'border-white/50 text-white hover:bg-white hover:text-black'
          }`}
        >
          SELL WITH US
        </NavLink>

        {loading ? (
          <div className="w-8 h-8 bg-gray-200/20 rounded-full animate-pulse"></div>
        ) : (
          <div className="flex items-center gap-4">
            {!isAuthenticated && !hideLogin && (
              <LoginButton isDarkText={isDarkText} />
            )}
            {isAuthenticated && (
              <>
                <ProfileDropdown text={isDarkText ? "text-black" : "text-white"} />
                <Cart text={isDarkText ? "text-black" : "text-white"} />
              </>
            )}
          </div>
        )}
      </div>

      {/* 4. HAMBURGER (Dynamic Color) */}
      <button
        aria-label="Open menu"
        className={`block md:hidden focus:outline-none z-50 ${isDarkText ? "text-black" : "text-white"}`}
        onClick={() => setpanelFlag(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* MOBILE PANEL */}
      <div className={`fixed top-0 right-0 h-screen w-[80vw] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${panelFlag ? "translate-x-0" : "translate-x-full"}`}>
        <button aria-label="Close menu" onClick={() => setpanelFlag(false)} className="absolute top-6 right-6 text-[#2C2C2C] focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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