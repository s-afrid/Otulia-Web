import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, NavLink, Link } from "react-router-dom";
import { FaBolt, FaHome, FaTree, FaBed, FaBath, FaUsers, FaEye, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

import Navbar_Ranking from "../../components/ranking_page/Navbar_Ranking";
import Sidebar from "../../components/ranking_page/DashboardRanking";
import HeaderRanking from "../../components/ranking_page/HeaderRanking";
import RankingCard from "../../components/ranking_page/CardRanking";
import RankingScaleWrapper from "../../components/ranking_page/RankingScaleWrapper";

import { useAuth } from "../../contexts/AuthContext";
import { rankings as staticRankings } from "../../data/rankings";

function RankingHome() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);

  const currentCategoryType = (category || "cars").toLowerCase();

  // Fetch all active categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/rankings/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (!slug) {
            setLoading(false);
          }
        } else {
          if (!slug) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        if (!slug) {
          setLoading(false);
        }
      }
    };
    fetchCategories();
  }, [slug]);

  const isTypeMatching = (type, param) => {
    if (!type || !param) return false;
    const t = type.toLowerCase().replace(/\s+/g, "").replace(/s$/, ""); // remove trailing 's'
    const p = param.toLowerCase().replace(/\s+/g, "").replace(/s$/, ""); // remove trailing 's'
    return t === p;
  };

  const filteredCategories = categories.filter(cat => 
    isTypeMatching(cat.type, category || "cars")
  );

  // Determine active slug
  let activeSlug = slug;
  if (!activeSlug && filteredCategories.length > 0) {
    activeSlug = filteredCategories[0].slug;
  }
  if (!activeSlug) {
    if (currentCategoryType.includes("estate") || currentCategoryType.includes("real")) {
      activeSlug = "best-luxury-estates";
    } else if (currentCategoryType.includes("creator")) {
      activeSlug = "top-content-creators";
    } else {
      activeSlug = "hypercars";
    }
  }

  // Resolve static fallback helper
  const getStaticFallback = (targetSlug) => {
    if (staticRankings[targetSlug]) return staticRankings[targetSlug];
    const s = (targetSlug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (s.includes("estate") || s.includes("real") || s.includes("mansion") || s.includes("villa")) {
      return staticRankings["best-luxury-estates"];
    }
    if (s.includes("creator") || s.includes("influencer") || s.includes("youtube")) {
      return staticRankings["top-content-creators"];
    }
    if (s.includes("fastest")) {
      return staticRankings["fastest-cars"];
    }
    if (s.includes("luxury")) {
      return staticRankings["luxury-cars"];
    }
    return staticRankings["hypercars"];
  };

  // Fetch detailed category details (nominees)
  const fetchCategoryDetails = async (targetSlug) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/rankings/category/${targetSlug}`);
      if (!res.ok) {
        throw new Error("Category not found in database");
      }
      const data = await res.json();
      setActiveCategory(data);
    } catch (err) {
      console.warn("DB Category fetch failed, falling back to static mockup data:", err.message);
      const staticData = getStaticFallback(targetSlug);
      if (staticData) {
        const catType = (currentCategoryType.includes("estate") || currentCategoryType.includes("real"))
          ? "Real Estate"
          : currentCategoryType.includes("creator")
          ? "Content Creator"
          : "Cars";

        setActiveCategory({
          _id: targetSlug,
          id: targetSlug,
          title: staticData.header.titleMain,
          type: catType,
          slug: targetSlug,
          bannerImage: staticData.header.bannerImage,
          categoryImage: staticData.header.bannerImage,
          detailedDescription: staticData.header.description,
          votes: staticData.header.votes,
          nominees: staticData.cards.map((card, idx) => ({
            ...card,
            _id: card.name + idx,
            id: card.name + idx,
          })),
        });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchCategoryDetails(slug);
    } else {
      setActiveCategory(null);
      setLoading(false);
    }
  }, [slug, category]);

  // Scroll to nominee if hash exists in URL
  useEffect(() => {
    if (!loading && activeCategory && location.hash) {
      const targetId = location.hash.substring(1);
      if (targetId) {
        const timer = setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("ring-2", "ring-[#D6A125]", "scale-[1.01]", "z-10");
            setTimeout(() => {
              element.classList.remove("ring-2", "ring-[#D6A125]", "scale-[1.01]", "z-10");
            }, 2500);
          }
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, activeCategory, location.hash]);

  const [votesRemaining, setVotesRemaining] = useState(3);
  const [votesToday, setVotesToday] = useState(0);

  const saveLocalDailyVotes = (count) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('otulia_daily_votes', JSON.stringify({ date: todayStr, votesToday: count }));
    } catch (e) {
      console.error("localStorage error:", e);
    }
  };

  const fetchVotesToday = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    let localVotesToday = 0;
    try {
      const saved = JSON.parse(localStorage.getItem('otulia_daily_votes') || '{}');
      if (saved.date === todayStr) {
        localVotesToday = Number(saved.votesToday) || 0;
      }
    } catch (e) {}

    if (token) {
      try {
        const res = await fetch('/api/rankings/votes-today', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const rem = data.votesRemaining !== undefined ? data.votesRemaining : Math.max(0, 3 - (data.votesToday || 0));
          const tod = data.votesToday !== undefined ? data.votesToday : (3 - rem);
          setVotesRemaining(rem);
          setVotesToday(tod);
          saveLocalDailyVotes(tod);
          return;
        }
      } catch (err) {
        console.error("Error fetching votes today:", err);
      }
    }

    setVotesToday(localVotesToday);
    setVotesRemaining(Math.max(0, 3 - localVotesToday));
  };

  useEffect(() => {
    fetchVotesToday();
  }, [token]);

  // Handle voting action
  const handleVote = async (nomineeId, catId) => {
    if (votesRemaining <= 0) {
      return;
    }

    setActiveCategory((prevCat) => {
      if (!prevCat || !prevCat.nominees) return prevCat;
      const updatedNominees = prevCat.nominees.map((nominee) => {
        if (nominee._id === nomineeId || nominee.id === nomineeId) {
          const currentVotes = nominee.votes || 0;
          const numericVotes = typeof currentVotes === "number"
            ? currentVotes
            : parseInt(currentVotes.toString().replace(/[^0-9]/g, "")) || 0;
          
          const newVotes = numericVotes + 1;
          return {
            ...nominee,
            votes: newVotes,
            rawVotes: newVotes,
          };
        }
        return nominee;
      });
      return {
        ...prevCat,
        nominees: updatedNominees,
      };
    });

    const newRem = Math.max(0, votesRemaining - 1);
    const newToday = votesToday + 1;
    setVotesRemaining(newRem);
    setVotesToday(newToday);
    saveLocalDailyVotes(newToday);

    if (!token) {
      return;
    }

    setIsVoting(true);
    try {
      const res = await fetch("/api/rankings/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ categoryId: catId, nomineeId }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.votesRemaining !== undefined) {
          setVotesRemaining(data.votesRemaining);
          setVotesToday(data.votesToday || (3 - data.votesRemaining));
          saveLocalDailyVotes(data.votesToday || (3 - data.votesRemaining));
        }
      } else {
        console.warn("Vote API warning:", data.error);
        if (data.votesRemaining !== undefined) {
          setVotesRemaining(data.votesRemaining);
          setVotesToday(data.votesToday || 3);
          saveLocalDailyVotes(data.votesToday || 3);
        }
      }
    } catch (err) {
      console.error("Error casting vote:", err);
    } finally {
      setIsVoting(false);
    }
  };

  // Map database details to Sidebar, Header, and Cards shape
  const getMappedHeaderData = () => {
    if (!activeCategory) return null;
    return {
      breadcrumbs: ["Home", "Rankings", activeCategory.type || (currentCategoryType.includes("estate") ? "Real Estate" : currentCategoryType.includes("creator") ? "Content Creators" : "Cars"), activeCategory.title],
      titleMain: activeCategory.title,
      titleHighlight: "",
      description: activeCategory.detailedDescription || activeCategory.shortDescription || "",
      nominees: activeCategory.nominees ? activeCategory.nominees.length.toString() : "0",
      votes: activeCategory.votes || "0",
      updated: activeCategory.updatedAt 
        ? new Date(activeCategory.updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "May 2026",
      categoryImage: activeCategory.categoryImage || "",
      bannerImage: activeCategory.bannerImage || activeCategory.categoryImage || "",
      coverImage: activeCategory.bannerImage || activeCategory.categoryImage || "",
    };
  };

  const getMappedCardsData = () => {
    if (!activeCategory || !activeCategory.nominees) return [];
    
    const totalVotesVal = activeCategory.nominees.reduce((acc, curr) => {
      const v = typeof curr.votes === "number" ? curr.votes : parseInt((curr.votes || "0").toString().replace(/[^0-9]/g, "")) || 0;
      return acc + v;
    }, 0);

    const isEstate = (activeCategory.type || "").toLowerCase().includes("estate") || (activeCategory.type || "").toLowerCase().includes("real") || currentCategoryType.includes("estate") || currentCategoryType.includes("real");
    const isContentCreator = (activeCategory.type || "").toLowerCase().includes("creator") || currentCategoryType.includes("creator");

    return activeCategory.nominees.map((nominee) => {
      const stats = [];
      const keyDetails = nominee.keyDetails || {};
      
      if (isEstate) {
        if (keyDetails.livingArea) stats.push({ icon: FaHome, value: keyDetails.livingArea, label: "Living Area" });
        if (keyDetails.landSize) stats.push({ icon: FaTree, value: keyDetails.landSize, label: "Land Size" });
        if (keyDetails.bedroom) stats.push({ icon: FaBed, value: keyDetails.bedroom, label: "Bedrooms" });
        if (keyDetails.bathroom) stats.push({ icon: FaBath, value: keyDetails.bathroom, label: "Bathrooms" });
      } else if (isContentCreator) {
        if (keyDetails.subscribers) stats.push({ icon: FaUsers, value: keyDetails.subscribers, label: "Subscribers" });
        if (keyDetails.views) stats.push({ icon: FaEye, value: keyDetails.views, label: "Total Views" });
        if (keyDetails.location) stats.push({ icon: FaMapMarkerAlt, value: keyDetails.location, label: "Location" });
        if (keyDetails.joinDate) stats.push({ icon: FaCalendarAlt, value: keyDetails.joinDate, label: "Joined" });
      } else {
        if (keyDetails.power) stats.push({ icon: FaBolt, value: keyDetails.power, label: "Power" });
        if (keyDetails.topSpeed) stats.push({ icon: MdOutlineSpeed, value: keyDetails.topSpeed, label: "Top Speed" });
        if (keyDetails.engine) stats.push({ icon: TbEngine, value: keyDetails.engine, label: "Engine" });
        if (keyDetails.transmission) stats.push({ icon: LuTimerReset, value: keyDetails.transmission, label: "Transmission" });
      }

      let rankColor = "#6B7280";
      if (nominee.rank === 1) rankColor = "#D6A125";
      else if (nominee.rank === 2) rankColor = "#C0C0C0";
      else if (nominee.rank === 3) rankColor = "#CD7F32";

      const votesVal = typeof nominee.votes === "number" ? nominee.votes : parseInt((nominee.votes || "0").toString().replace(/[^0-9]/g, "")) || 0;
      let formattedVotes = "0";
      if (votesVal >= 1000) {
        formattedVotes = (votesVal / 1000).toFixed(1) + "K";
      } else {
        formattedVotes = votesVal.toString();
      }

      const meta = isEstate ? [
        { label: "Category", value: activeCategory.title },
        { label: "Property Type", value: keyDetails.propertyType || "Estate" },
        { label: "Status", value: keyDetails.availabilityStatus || "For Sale" }
      ] : isContentCreator ? [
        { label: "Category", value: activeCategory.title },
        { label: "Channel", value: nominee.channelName || nominee.name },
        { label: "Genre", value: keyDetails.category || "Entertainment" },
        { label: "Status", value: nominee.status || "Active" }
      ] : [
        { label: "Category", value: activeCategory.title },
        { label: "Origin", value: nominee.brand || "Global" },
        { label: "Body Type", value: nominee.model || "Coupe" }
      ];

      const socialLinks = [];
      if (isContentCreator) {
        if (nominee.youtube) socialLinks.push({ platform: "youtube", url: nominee.youtube });
        if (nominee.instagram) socialLinks.push({ platform: "instagram", url: nominee.instagram });
        if (nominee.twitter || nominee.x) socialLinks.push({ platform: "twitter", url: nominee.twitter || nominee.x });
        if (nominee.tiktok) socialLinks.push({ platform: "tiktok", url: nominee.tiktok });
      }

      return {
        rank: nominee.rank || 1,
        rankColor,
        name: nominee.name,
        description: nominee.description || nominee.detail || "",
        detail: nominee.detail || nominee.description || "",
        image: nominee.image || "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop",
        banner: nominee.banner || nominee.bannerImage || nominee.coverImage || nominee.image || "",
        bannerImage: nominee.banner || nominee.bannerImage || nominee.coverImage || nominee.image || "",
        profilePic: nominee.profilePic || nominee.profilePicture || nominee.avatar || nominee.profileImage || "",
        stats,
        meta,
        category: activeCategory.title,
        brand: keyDetails.brand || nominee.brand || (nominee.name ? nominee.name.split(" ")[0] : "Global"),
        model: keyDetails.model || nominee.model || (nominee.name ? nominee.name.split(" ").slice(1).join(" ") : ""),
        year: keyDetails.year || nominee.year || "2026",
        productionUnits: keyDetails.productionUnits || nominee.productionUnits || keyDetails.productionLimit || nominee.productionLimit || "Bespoke",
        productionLimit: keyDetails.productionUnits || nominee.productionUnits || keyDetails.productionLimit || nominee.productionLimit || "Bespoke",
        country: keyDetails.country || nominee.country || keyDetails.origin || nominee.origin || nominee.brand || "Global",
        origin: keyDetails.country || nominee.country || keyDetails.origin || nominee.origin || nominee.brand || "Global",
        bodyType: nominee.model || "Coupe",
        price: isContentCreator 
          ? (keyDetails.subscribers ? `${keyDetails.subscribers} Subscribers` : "")
          : (keyDetails.price || nominee.price || ""),
        location: isContentCreator ? (keyDetails.location || nominee.location || nominee.brand || "") : (nominee.location || nominee.brand || ""),
        showBadgeOnImage: nominee.rank === 1 && isEstate,
        badge: isEstate ? "NEW FOR 2026" : "",
        votes: formattedVotes,
        rawVotes: votesVal,
        sourcesCount: (nominee.sources || []).length.toString(),
        sources: nominee.sources || [],
        showTagOnHeader: nominee.rank === 1,
        tag: nominee.rank === 1 ? (isEstate ? "New for 2026" : "TOP RATED") : "",
        showTopRatedBadge: nominee.rank === 1,
        status: nominee.status || (nominee.rank === 1 ? "Leading" : "Strong Contender"),
        statusIcon: nominee.rank === 1 ? "trophy" : "star",
        statusColor: nominee.rank === 1 ? "#D6A125" : "#6B7280",
        _id: nominee._id || nominee.id,
        categoryId: activeCategory._id || activeCategory.id,
        socialLinks,
        isContentCreator,
        channelName: nominee.channelName || nominee.name,
        joinDate: keyDetails.joinDate || nominee.joinDate || "",
        genre: keyDetails.category || keyDetails.genre || nominee.genre || "",
        views: keyDetails.views || "",
        subscribers: keyDetails.subscribers || "",
        isEstate,
        livingArea: keyDetails.livingArea || "",
        landSize: keyDetails.landSize || "",
        bedrooms: keyDetails.bedroom || keyDetails.bedrooms || "",
        bathrooms: keyDetails.bathroom || keyDetails.bathrooms || "",
        propertyType: keyDetails.propertyType || "Estate",
        availabilityStatus: keyDetails.availabilityStatus || "For Sale",
        isCar: !isEstate && !isContentCreator,
        engine: keyDetails.engine || "",
        power: keyDetails.power || "",
        topSpeed: keyDetails.topSpeed || "",
        acceleration: keyDetails.acceleration || "",
        listingLink: nominee.listingLink || keyDetails.listingLink || "",
        keyDetails,
      };
    });
  };

  const headerData = getMappedHeaderData();
  const cardsData = getMappedCardsData();

  return (
    <RankingScaleWrapper>
      <Sidebar categories={filteredCategories} activeSlug={activeSlug} />

      <div className="min-h-screen bg-zinc-950 text-white lg:ml-[240px] xl:ml-[260px] w-full transition-all duration-300 flex flex-col">
        <Navbar_Ranking hideSearch={true} />

        <main className="px-3.5 sm:px-6 md:px-8 xl:px-10 pt-[84px] sm:pt-[92px] md:pt-[96px] pb-16 bg-zinc-950 flex-1 max-w-[1700px]">
          {/* Mobile & Tablet Section Switcher Pills */}
          <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar pt-2 pb-3 mb-2">
            <NavLink
              to="/ranking/cars"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all border ${
                  isActive || (!category || category.toLowerCase() === "cars")
                    ? "bg-gradient-to-r from-[#B8812D] to-[#8C5E1D] text-white border-[#D6A125] shadow-sm"
                    : "bg-[#141416] text-zinc-300 border-zinc-800 hover:border-zinc-700"
                }`
              }
            >
              CARS
            </NavLink>
            <NavLink
              to="/ranking/realestate"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all border ${
                  isActive || (category && category.toLowerCase() === "realestate")
                    ? "bg-gradient-to-r from-[#B8812D] to-[#8C5E1D] text-white border-[#D6A125] shadow-sm"
                    : "bg-[#141416] text-zinc-300 border-zinc-800 hover:border-zinc-700"
                }`
              }
            >
              REAL ESTATE
            </NavLink>
            <NavLink
              to="/ranking/contentcreators"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all border ${
                  isActive || (category && category.toLowerCase() === "contentcreators")
                    ? "bg-gradient-to-r from-[#B8812D] to-[#8C5E1D] text-white border-[#D6A125] shadow-sm"
                    : "bg-[#141416] text-zinc-300 border-zinc-800 hover:border-zinc-700"
                }`
              }
            >
              CONTENT CREATORS
            </NavLink>
          </div>

          {/* Mobile Subcategories Scrollable Pill Row */}
          {filteredCategories.length > 0 && (
            <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-zinc-850">
              <Link
                to={`/ranking/${category || "cars"}`}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
                  !slug
                    ? "bg-[#D6A125]/20 text-[#D6A125] border border-[#D6A125]/50 font-bold"
                    : "text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800"
                }`}
              >
                All Rankings
              </Link>
              {filteredCategories.map((cat) => {
                const isActive = slug === cat.slug;
                const catType = cat.type ? cat.type.toLowerCase().replace(/\s+/g, "") : (category || "cars");
                return (
                  <Link
                    key={cat._id || cat.slug}
                    to={`/ranking/${catType}/${cat.slug}`}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
                      isActive
                        ? "bg-[#D6A125]/20 text-[#D6A125] border border-[#D6A125]/50 font-bold"
                        : "text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800"
                    }`}
                  >
                    {cat.title}
                  </Link>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A125]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-40 text-red-500">
              {error}
            </div>
          ) : activeCategory ? (
            <>
              <HeaderRanking data={headerData} />
              {cardsData.length > 0 ? (
                <RankingCard cars={cardsData} onVote={handleVote} isVoting={isVoting} votesRemaining={votesRemaining} />
              ) : (
                <div className="text-center py-20 text-zinc-400 font-medium">
                  No nominees found in this category.
                </div>
              )}
            </>
          ) : !slug ? (
            <div className="pt-2 sm:pt-4">
              <div className="mb-8 sm:mb-10">
                <h1 className="text-[32px] sm:text-[42px] md:text-[52px] font-bold leading-[1.1] tracking-[-0.03em] text-white">
                  {currentCategoryType.includes("realestate")
                    ? "Real Estate"
                    : currentCategoryType.includes("contentcreators")
                    ? "Content Creator"
                    : "Automotive"}{" "}
                  <span className="text-[#D6A125]">Rankings</span>
                </h1>
                <p className="mt-3 sm:mt-4 max-w-[650px] text-[15px] sm:text-[17px] leading-[1.6] text-zinc-400">
                  Explore our curated luxury ranking categories. Discover world-class benchmarks verified by global audience voting.
                </p>
              </div>

              {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                  {filteredCategories.map((cat) => {
                    const nomineeCount = cat.nomineeLimit || (cat.assetNominees || []).length || 10;
                    const catType = cat.type ? cat.type.toLowerCase().replace(/\s+/g, "") : (category || "cars");
                    const targetPath = `/ranking/${catType}/${cat.slug}`;
                    const fallbackImg = (cat.type || "").toLowerCase().includes("estate") || (cat.type || "").toLowerCase().includes("real")
                      ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"
                      : (cat.type || "").toLowerCase().includes("creator")
                      ? "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1200&auto=format&fit=crop"
                      : "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop";

                    return (
                      <div 
                        key={cat._id || cat.slug} 
                        onClick={() => navigate(targetPath)}
                        className="overflow-hidden rounded-[14px] border border-zinc-800 bg-[#121214] flex flex-col shadow-sm hover:shadow-xl hover:border-zinc-700 transition duration-300 cursor-pointer group"
                      >
                        <div className="h-[180px] sm:h-[200px] w-full bg-zinc-950 relative overflow-hidden">
                          <img 
                            src={cat.categoryImage || cat.bannerImage || fallbackImg} 
                            alt={cat.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-black/75 text-white text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px] backdrop-blur-xs border border-white/10">
                            {cat.type}
                          </div>
                        </div>
                        
                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 group-hover:text-[#D6A125] transition duration-200">{cat.title}</h3>
                            <p className="text-[13px] sm:text-[13.5px] text-zinc-400 line-clamp-2 mb-4">
                              {cat.shortDescription || "Explore verified rankings and nominees."}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-zinc-850 pt-3.5 mt-auto">
                            <div className="text-[12px] sm:text-[13px] text-zinc-400">
                              <span className="font-bold text-white">{nomineeCount}</span> Nominees
                            </div>
                            <span 
                              className="flex items-center gap-1 text-[13px] sm:text-[13.5px] font-semibold text-[#D6A125] group-hover:text-[#F3B344] transition duration-200"
                            >
                              Explore Rankings &rsaquo;
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 text-zinc-400 font-medium border border-dashed border-zinc-800 rounded-xl">
                  No ranking categories found for this section.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-40 text-zinc-400">
              No active rankings found.
            </div>
          )}
        </main>
      </div>
    </RankingScaleWrapper>
  );
}

export default RankingHome;

