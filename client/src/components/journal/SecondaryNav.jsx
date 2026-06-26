import { useState } from "react";

const secondaryLinks = [
  { label: "Unique Living", href: "#" },
  { label: "Handpicked by JE", href: "#" },
  { label: "Market Trends", href: "#" },
  { label: "Local Knowledge", href: "#" },
  { label: "The Insider", href: "#" },
  { label: "Business Lens", href: "#" },
  { label: "Newsletter", href: "#" },
];

export default function SecondaryNavbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  return (
    <nav className="w-full bg-white border-gray-200 sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Nav links */}
          <div className="flex items-center overflow-x-auto scrollbar-hide gap-0">
            {secondaryLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveLink(link.label)}
                className={`
                  flex-shrink-0 text-sm font-normal text-gray-700 hover:text-gray-900
                  transition-colors whitespace-nowrap px-4 py-4
                  border-b-2 border-transparent hover:border-gray-800
                  ${activeLink === link.label ? "border-gray-900 text-gray-900 font-medium" : ""}
                `}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Search icon */}
          <div className="flex items-center pl-4 flex-shrink-0">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search…"
                  className="text-sm border-b border-gray-400 outline-none py-1 pr-2 w-36 bg-transparent placeholder-gray-400 text-gray-800"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="text-gray-500 hover:text-gray-900 transition-colors text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="text-gray-600 hover:text-gray-900 transition-colors p-1"
              >
                {/* Search icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
