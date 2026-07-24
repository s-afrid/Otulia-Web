import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaBolt, FaHome, FaTree, FaBed, FaBath, FaUsers, FaEye, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

import Navbar_Ranking from "../../components/ranking_page/Navbar_Ranking";
import Sidebar from "../../components/ranking_page/DashboardRanking";
import HeaderRanking from "../../components/ranking_page/HeaderRanking";
import RankingCard from "../../components/ranking_page/CardRanking";

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
    activeSlug = "hypercars";
  }

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
      // Fallback to static data
      const staticData = staticRankings[targetSlug] || staticRankings["hypercars"];
      if (staticData) {
        // Find if this is a first-time initialization of static values
        setActiveCategory({
          _id: targetSlug,
          id: targetSlug,
          title: staticData.header.titleMain,
          slug: targetSlug,
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
  }, [slug]);

  // Scroll to nominee if hash exists in URL
  useEffect(() => {
    if (!loading && activeCategory && location.hash) {
      const targetId = location.hash.substring(1);
      if (targetId) {
        // Wait a short moment to ensure cards are fully rendered
        const timer = setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            
            // Add premium visual flash highlight effect to the target card
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

  // Handle voting action
  const handleVote = async (nomineeId, catId) => {
    if (!isAuthenticated) {
      alert("Please sign in to vote.");
      navigate("/login");
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
      if (!res.ok) {
        alert(data.error ? data.error.replace(/_/g, " ") : "Failed to vote.");
      } else {
        alert("Thank you for your vote!");
        fetchCategoryDetails(activeSlug);
      }
    } catch (err) {
      console.error("Error casting vote:", err);
      alert("Failed to cast vote.");
    } finally {
      setIsVoting(false);
    }
  };

  // Map database details to Sidebar, Header, and Cards shape
  const getMappedHeaderData = () => {
    if (!activeCategory) return null;
    return {
      breadcrumbs: ["Home", "Rankings", activeCategory.type || "Cars", activeCategory.title],
      titleMain: activeCategory.title,
      titleHighlight: "",
      description: activeCategory.detailedDescription || activeCategory.shortDescription || "",
      nominees: activeCategory.nominees ? activeCategory.nominees.length.toString() : "0",
      votes: activeCategory.votes || "0",
      updated: activeCategory.updatedAt 
        ? new Date(activeCategory.updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "May 2026",
      categoryImage: activeCategory.categoryImage || "",
      bannerImage: activeCategory.bannerImage || "",
      coverImage: activeCategory.bannerImage || activeCategory.categoryImage || "",
    };
  };

  const getMappedCardsData = () => {
    if (!activeCategory || !activeCategory.nominees) return [];
    
    // Sum up votes for progress calculation
    const totalVotesVal = activeCategory.nominees.reduce((acc, curr) => acc + (curr.votes || 0), 0);

    return activeCategory.nominees.map((nominee) => {
      // Map stats dynamically
      const stats = [];
      const keyDetails = nominee.keyDetails || {};
      
      const isEstate = activeCategory.type === "Real Estate" || activeCategory.type === "realestate";
      const isContentCreator = activeCategory.type === "Content Creator" || activeCategory.type === "Content Creators" || activeCategory.type === "contentcreators";
      
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

      // Fallback rank color
      let rankColor = "#6B7280";
      if (nominee.rank === 1) rankColor = "#D6A125";
      else if (nominee.rank === 2) rankColor = "#C0C0C0";
      else if (nominee.rank === 3) rankColor = "#CD7F32";

      const votesVal = nominee.votes || 0;
      let formattedVotes = "0";
      if (votesVal >= 1000) {
        formattedVotes = (votesVal / 1000).toFixed(1) + "K";
      } else {
        formattedVotes = votesVal.toString();
      }

      // Meta fields
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
        image: nominee.image || "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop",
        stats,
        meta,
        category: activeCategory.title,
        origin: nominee.brand || "Global",
        bodyType: nominee.model || "Coupe",
        price: isContentCreator 
          ? (keyDetails.subscribers ? `${keyDetails.subscribers} Subscribers` : "")
          : (keyDetails.price || ""),
        location: isContentCreator ? (keyDetails.location || nominee.brand || "") : (nominee.brand || ""),
        showBadgeOnImage: nominee.rank === 1 && isEstate,
        badge: isEstate ? "NEW FOR 2026" : "",
        votes: formattedVotes,
        rawVotes: votesVal,
        sourcesCount: (nominee.sources || []).length.toString(),
        showTagOnHeader: nominee.rank === 1,
        tag: nominee.rank === 1 ? (isEstate ? "New for 2026" : "TOP RATED") : "",
        showTopRatedBadge: nominee.rank === 1,
        progress: `${Math.min(100, Math.max(5, (votesVal / Math.max(1, totalVotesVal)) * 100))}%`,
        progressColor: nominee.rank === 1 ? "#D6A125" : "#1F2937",
        status: nominee.rank === 1 ? "Leading" : "Strong Contender",
        statusIcon: nominee.rank === 1 ? "trophy" : "star",
        statusColor: nominee.rank === 1 ? "#D6A125" : "#6B7280",
        _id: nominee._id,
        categoryId: activeCategory._id,
        socialLinks,
        isContentCreator,
        channelName: nominee.channelName || nominee.name,
        joinDate: keyDetails.joinDate || "",
        genre: keyDetails.category || "",
        views: keyDetails.views || "",
        subscribers: keyDetails.subscribers || "",
        isEstate,
        livingArea: keyDetails.livingArea || "",
        landSize: keyDetails.landSize || "",
        bedrooms: keyDetails.bedroom || "",
        bathrooms: keyDetails.bathroom || "",
        propertyType: keyDetails.propertyType || "Estate",
        availabilityStatus: keyDetails.availabilityStatus || "For Sale",
        isCar: activeCategory.type === "Cars" || activeCategory.type === "cars" || activeCategory.type === "Automotive" || (!isEstate && !isContentCreator),
        engine: keyDetails.engine || "",
        power: keyDetails.power || "",
        topSpeed: keyDetails.topSpeed || "",
        acceleration: keyDetails.acceleration || "",
      };
    });
  };

  const headerData = getMappedHeaderData();
  const cardsData = getMappedCardsData();

  return (
    <>
      <Sidebar categories={filteredCategories} activeSlug={activeSlug} />

      <div style={{ marginLeft: "260px" }} className="min-h-screen bg-zinc-950 text-white">
        <Navbar_Ranking hideSearch={true} />

        <div className="px-8 pt-[88px] pb-12 bg-zinc-950">
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
                <RankingCard cars={cardsData} onVote={handleVote} isVoting={isVoting} />
              ) : (
                <div className="text-center py-20 text-zinc-400 font-medium">
                  No nominees found in this category.
                </div>
              )}
            </>
          ) : !slug ? (
            <div className="pt-4">
              <div className="mb-10">
                <h1 className="text-[42px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                  {category ? (category.toLowerCase() === "realestate" ? "Real Estate" : category.toLowerCase() === "contentcreators" ? "Content Creator" : "Automotive") : "Automotive"}{" "}
                  <span className="text-[#C9920E]">Rankings</span>
                </h1>
                <p className="mt-5 max-w-[650px] text-[18px] leading-[1.65] text-[#A1A1AA]">
                  Explore all our curated ranking categories. See what's leading the industry based on verified votes and user popularity.
                </p>
              </div>

              {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((cat) => {
                    const nomineeCount = cat.nomineeLimit || (cat.assetNominees || []).length;
                    const catType = cat.type ? cat.type.toLowerCase().replace(/\s+/g, "") : (category || "cars");
                    const targetPath = `/ranking/${catType}/${cat.slug}`;
                    const fallbackImg = (cat.type || "").toLowerCase().includes("estate") || (cat.type || "").toLowerCase().includes("real")
                      ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"
                      : (cat.type || "").toLowerCase().includes("creator")
                      ? "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1200&auto=format&fit=crop"
                      : "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop";

                    return (
                      <div 
                        key={cat._id} 
                        onClick={() => navigate(targetPath)}
                        className="overflow-hidden rounded-[12px] border border-zinc-800 bg-[#161618] flex flex-col shadow-sm hover:shadow-lg hover:border-zinc-700 transition duration-300 cursor-pointer group"
                      >
                        <div className="h-[200px] w-full bg-zinc-950 relative overflow-hidden">
                          <img 
                            src={cat.categoryImage || cat.bannerImage || fallbackImg} 
                            alt={cat.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm backdrop-blur-sm">
                            {cat.type}
                          </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D48D2A] transition duration-200">{cat.title}</h3>
                          <p className="text-[14px] text-zinc-400 line-clamp-3 mb-6 flex-1">
                            {cat.shortDescription || "No description available."}
                          </p>
                          
                          <div className="flex items-center justify-between border-t border-zinc-850 pt-4 mt-auto">
                            <div className="text-[13px] text-zinc-400">
                              <span className="font-bold text-white">{nomineeCount}</span> Nominees
                            </div>
                            <span 
                              className="flex items-center gap-1.5 text-[14px] font-semibold text-[#D48D2A] group-hover:text-[#F3B344] transition duration-200"
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
        </div>
      </div>
    </>
  );
}

export default RankingHome;
