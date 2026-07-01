import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiAward, FiFolder } from "react-icons/fi";

function RankingSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ categories: [], nominees: [] });
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search query
  useEffect(() => {
    if (query.trim() === "") {
      setResults({ categories: [], nominees: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`/api/rankings/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get flat list of all items for keyboard navigation
  const flatItems = [
    ...results.categories.map(cat => ({ ...cat, isCategory: true })),
    ...results.nominees.map(nom => ({ ...nom, isNominee: true }))
  ];

  const handleSelect = (item) => {
    setShowDropdown(false);
    setQuery("");
    
    if (item.isCategory) {
      navigate(item.url);
    } else if (item.isNominee) {
      // Navigate to the category URL and append nominee ID hash to scroll and highlight
      navigate(`${item.url}#${item.id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || flatItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flatItems.length) {
        handleSelect(flatItems[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef} onKeyDown={handleKeyDown}>
      <div className="relative">
        <input
          type="text"
          className="w-full h-10 pl-10 pr-10 rounded-full bg-zinc-900 border border-zinc-800 text-[14px] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#D6A125] focus:ring-1 focus:ring-[#D6A125]/30 transition duration-200"
          placeholder="Search categories or nominees..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
          <FiSearch className="text-[16px]" />
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults({ categories: [], nominees: [] });
              setShowDropdown(false);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition duration-200"
          >
            <FiX className="text-[16px]" />
          </button>
        )}
      </div>

      {showDropdown && query.trim() !== "" && (
        <div className="absolute left-0 mt-2 w-full md:w-[460px] bg-zinc-900 border border-zinc-800 rounded-[12px] shadow-2xl overflow-hidden z-[100] max-h-[480px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-6 text-zinc-500 text-sm gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#D6A125]"></div>
              <span>Searching...</span>
            </div>
          ) : results.categories.length === 0 && results.nominees.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 text-sm">
              No matches found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {/* CATEGORIES SECTION */}
              {results.categories.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 text-[11px] font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5 border-b border-zinc-850 bg-zinc-950/40">
                    <FiFolder className="text-[12px] text-zinc-400" />
                    Categories
                  </div>
                  <div className="py-1">
                    {results.categories.map((cat, idx) => {
                      const overallIndex = idx;
                      const isSelected = activeIndex === overallIndex;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleSelect({ ...cat, isCategory: true })}
                          onMouseEnter={() => setActiveIndex(overallIndex)}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition ${
                            isSelected ? "bg-zinc-800 text-white" : "hover:bg-zinc-800/40 text-zinc-300"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-[6px] overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                            <img
                              src={cat.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=200&auto=format&fit=crop"}
                              alt={cat.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 font-sans">
                            <h4 className="text-[13.5px] font-bold truncate leading-tight">
                              {cat.title}
                            </h4>
                            <span className="text-[11px] text-zinc-500 font-medium">
                              {cat.type} Rankings
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* NOMINEES SECTION */}
              {results.nominees.length > 0 && (
                <div className="mt-1">
                  <div className="px-4 py-1.5 text-[11px] font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5 border-b border-zinc-850 border-t border-zinc-850/60 bg-zinc-950/40">
                    <FiAward className="text-[12px] text-zinc-400" />
                    Nominees
                  </div>
                  <div className="py-1">
                    {results.nominees.map((nom, idx) => {
                      const overallIndex = results.categories.length + idx;
                      const isSelected = activeIndex === overallIndex;
                      return (
                        <div
                          key={nom.id}
                          onClick={() => handleSelect({ ...nom, isNominee: true })}
                          onMouseEnter={() => setActiveIndex(overallIndex)}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition ${
                            isSelected ? "bg-zinc-800 text-white" : "hover:bg-zinc-800/40 text-zinc-300"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-[6px] overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                            <img
                              src={nom.image || "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=200&auto=format&fit=crop"}
                              alt={nom.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 font-sans">
                            <h4 className="text-[13.5px] font-bold truncate leading-tight">
                              {nom.name}
                            </h4>
                            <span className="text-[11px] text-[#D6A125] font-semibold truncate block">
                              {nom.brand || nom.model ? `${nom.brand} ${nom.model}`.trim() : "Nominee"} &bull; <span className="text-zinc-500 font-medium">{nom.categoryTitle}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RankingSearch;
