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
    <nav className={navClasses}>
      {/* 1. Logo */}
      <NavLink to={"/"}>
        <img
          className="w-[100px] md:w-[120px] h-[40px] md:h-[50px] object-contain"
          alt="logo"
          src={logoSrc}
          title="Otulia"
        />
      </NavLink>

      {/* 2. HAMBURGER (Dynamic Color) */}
      <button
        aria-label="Open menu"
        // Use 'isDarkText' to swap color so it is visible on white backgrounds
        className={`block md:hidden focus:outline-none z-50 ${isDarkText?"text-black":"text-white"}`}
        onClick={() => setpanelFlag(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* 3. MOBILE PANEL */}
      {/* Changed z-51 to z-[60] to ensure it sits on top of the navbar */}
      <div
        className={`fixed top-0 right-0 h-screen w-[80vw] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${panelFlag ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button
          aria-label="Close menu"
          onClick={() => setpanelFlag(false)}
          className="absolute top-6 right-6 text-[#2C2C2C] focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="pt-20">
          <NavbarMobile />
        </div>
      </div>

      {/* 4. CENTER MENU */}
      <ul className={`hidden md:flex items-center justify-center gap-14 absolute left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-bold tracking-[0.25em] uppercase ${isDarkText?"text-black":"text-white/90"}`}>
         <li className="hover:text-[#D48D2A] cursor-pointer transition-colors"><NavLink to="/shop">Shop All</NavLink></li>
         <li className="hover:text-[#D48D2A] cursor-pointer transition-colors"><NavLink to="/rent">Rent</NavLink></li>
         <li className="hover:text-[#D48D2A] cursor-pointer transition-colors"><NavLink to="/pricing">Plan & Price</NavLink></li>
      </ul>

      {/* 5. RIGHT MENU */}
      <ul className="hidden md:flex items-center justify-end gap-6 text-[9px] md:text-[10px] font-bold tracking-[0.15em] uppercase">
        <li className={`cursor-pointer mr-2`}>
          <NavLink 
            to="/listings" 
            className={`px-6 py-2.5 rounded-full border border-white/30 text-white/90 hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-[0.1em] text-[10px]`}
            style={isDarkText ? { borderColor: '#e5e7eb', color: '#1a1a1a' } : {}}
          >
            Sell With Us
          </NavLink>
        </li>

        {!hideSearch && (
          <li>
            <Search text={isDarkText?"text-black":"text-white"} border={isDarkText?"border-black":"border-white"} placeholder={isDarkText?"placeholder-[#2C2C2C]":"placeholder-[#dadce0]"} cross={isDarkText ? "[&::-webkit-search-cancel-button]:grayscale" : "[&::-webkit-search-cancel-button]:invert"}/>
          </li>
        )}

        {/* AUTH STATE HANDLING */}
        {loading ? (
          <li className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></li>
        ) : (
          <>
            {!isAuthenticated && !hideLogin && (
              <li>
                <LoginButton isDark={isDarkText} />
              </li>
            )}
            {isAuthenticated && (
              <li className="flex gap-4 items-center justify-center">
                <ProfileDropdown isDark={isDarkText} />
                <Cart isDark={isDarkText} />
              </li>
            )}
          </>
        )}
      </ul>

      {/* White line removed as per user request */}
    </nav >
  );
};

export default Navbar;