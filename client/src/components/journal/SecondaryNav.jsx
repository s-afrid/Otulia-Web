import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const secondaryLinks = [
  { label: "HOME", category: null },
  { label: "CARS", category: "Cars" },
  { label: "REAL ESTATE", category: "Real Estate" },
  { label: "YACHTS", category: "Yachts" },
  { label: "WATCHES", category: "Watches" },
  { label: "GUIDES", category: "Guides" },
];

function categoryHref(category) {
  return category
    ? `/journal?category=${encodeURIComponent(category)}`
    : "/journal";
}

export default function SecondaryNavbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <nav className="w-full bg-white border-gray-200 sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="relative flex items-center h-12">
          {/* Center Nav Links */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8 overflow-x-auto scrollbar-hide">
            {secondaryLinks.map((link) => {
              const isActive = activeCategory === link.category;
              return (
                <Link
                  key={link.label}
                  to={categoryHref(link.category)}
                  className={`
                    flex-shrink-0
                    text-[11px]
                    tracking-[0.18em]
                    uppercase
                    font-medium
                    text-gray-600
                    hover:text-black
                    transition-colors
                    whitespace-nowrap
                    py-3
                    border-b-1 border-transparent
                    hover:border-gray-800
                    ${isActive ? "border-gray-900 text-gray-900" : ""}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Search */}
          <div className="ml-auto flex items-center">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search…"
                  className="text-sm  border-gray-400 outline-none py-1 pr-2 w-36 bg-transparent placeholder-gray-400 text-gray-800"
                />

                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="text-gray-500 hover:text-black transition-colors text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="text-gray-600 hover:text-black transition-colors p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
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
