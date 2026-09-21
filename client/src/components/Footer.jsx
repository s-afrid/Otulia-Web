import React from "react";
import { Link } from "react-router-dom";
import { useSnackbar } from "../contexts/SnackbarContext";
import appStoreBadge from "../assets/App_Buttons/app_store.webp";
import playStoreBadge from "../assets/App_Buttons/play_store.webp";

const Footer = () => {
  const { showSnackbar } = useSnackbar();
  const discover = [
    {
      id: 1,
      name: "Explore Categories",
      navigate: "/#Category",
    },
    {
      id: 2,
      name: "Luxury Cars",
      navigate: "/category/cars",
    },
    {
      id: 3,
      name: "Luxury Real Estate",
      navigate: "/category/estates",
    },
    {
      id: 4,
      name: "Accessories",
      navigate: "/shop",
    },
    {
      id: 5,
      name: "Exclusive Collections",
      navigate: "/shop",
    },
  ];

  const company = [
    {
      id: 1,
      page: "About",
      navigate: "/about",
    },
    {
      id: 3,
      page: "Premium Membership",
      navigate: "/pricing",
    },
  ];

  const social = [
    {
      id: 1,
      name: "Facebook",
      navigate:
        "https://www.facebook.com/people/Otulia-All-In-One-Marketplace/61584376807412/",
    },
    {
      id: 2,
      name: "Instagram",
      navigate: "https://www.instagram.com/otulia.in",
    },
    {
      id: 3,
      name: "YouTube",
      navigate: "https://youtube.com/@otulia.com13",
    },
    {
      id: 4,
      name: "Twitter",
      navigate: "https://x.com/OtuliaGlobal",
    },
    {
      id: 5,
      name: "LinkedIn",
      navigate: "https://www.linkedin.com/company/otulia/",
    },
  ];

  return (
    <footer className="w-full bg-[#151515] text-white pt-13 montserrat">
      {/* Top Section */}
      <div className="px-3 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12 mb-8">
        {/* Logo Column */}
        <Link to="/" className="flex flex-col cursor-pointer">
          <img
            className="w-[200px] h-[60px] object-contain object-left"
            alt="Otulia"
            src="/logos/otulia_logo_white.png"
            title="Otulia"
          />
        </Link>

        {/* Discover */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Discover
          </h3>
          <ul className="flex flex-col gap-3">
            {discover.map((item) => (
              // <li key={item.id}><a href={`${item.navigate}`} className="text-sm text-gray-400 hover:text-white">{item.name}</a></li>
              <li key={item.id}>
                <a
                  href={`${item.navigate}`}
                  onClick={(e) => {
                    if (
                      item.navigate.includes("yachts") ||
                      item.navigate.includes("bikes")
                    ) {
                      e.preventDefault();
                      showSnackbar("COMING SOON");
                    }
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Company */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Our Company
          </h3>
          <ul className="flex flex-col gap-3">
            {company.map((item) => (
              <li key={item.id}>
                <a
                  href={`${item.navigate}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.page}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect With Us */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Connect With Us
          </h3>
          <ul className="flex flex-col gap-3">
            {social.map((item) => (
              <li key={item.id}>
                <a
                  href={item.navigate}
                  target="_blank"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience App */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Experience App
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showSnackbar("COMING SOON");
              }}
              className="inline-block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] w-fit"
              aria-label="Download on the App Store"
            >
              <img
                src={appStoreBadge}
                alt="Download on the App Store"
                className="h-10 w-auto object-contain cursor-pointer"
              />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showSnackbar("COMING SOON");
              }}
              className="inline-block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] w-fit"
              aria-label="Get it on Google Play"
            >
              <img
                src={playStoreBadge}
                alt="Get it on Google Play"
                className="h-10 w-auto object-contain cursor-pointer"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-3 md:px-6">
        <div className="w-full h-px bg-white/10"></div>
      </div>

      {/* Legal Links Section */}
      <div className="px-3 md:px-8 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
        {[
          { name: "Terms & Conditions", path: "/terms" },
          { name: "Privacy Policy", path: "/privacy-policy" },
          { name: "Shipping Information", path: "/shipping" },
          { name: "Returns & Refunds", path: "/returns" },
          { name: "Cookie Policy", path: "/cookie-policy" },
        ].map((item) => (
          <a
            key={item.name}
            href={item.path}
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 text-center"
          >
            {item.name}
          </a>
        ))}
      </div>

      {/* Divider */}
      <div className="px-3 md:px-6">
        <div className="w-full h-px bg-white/10"></div>
      </div>

      {/* Payment Options Section */}
      <div className="px-3 md:px-6 py-12 flex flex-col items-center gap-6 hidden">
        <h4 className="text-sm font-bold text-white uppercase tracking-widest">
          Payment Options
        </h4>
        <div className="flex items-center gap-8 justify-center grayscale opacity-70 flex-wrap">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="mastercard"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg"
            alt="unionpay"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Diners_Club_Logo3.svg"
            alt="diners"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
            alt="amex"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Discover_Card_logo.svg/250px-Discover_Card_logo.svg.png"
            alt="discover"
            className="h-4"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="visa"
            className="h-4"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="px-16">
        <div className="w-full h-px bg-white/10"></div>
      </div>

      {/* Copyright Bar */}
      <div className="px-16 py-8 flex flex-col items-center gap-4">
        <p className="text-sm text-gray-400 font-medium">
          © 2026 Otulia. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
