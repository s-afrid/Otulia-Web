import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBolt, FaHome, FaTree, FaBed, FaBath } from "react-icons/fa";
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
  const { isAuthenticated } = useAuth();

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
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

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
    if (categories.length > 0 || slug) {
      fetchCategoryDetails(activeSlug);
    } else {
      fetchCategoryDetails("hypercars");
    }
  }, [categories, activeSlug]);

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
      
      if (isEstate) {
        if (keyDetails.livingArea) stats.push({ icon: FaHome, value: keyDetails.livingArea, label: "Living Area" });
        if (keyDetails.landSize) stats.push({ icon: FaTree, value: keyDetails.landSize, label: "Land Size" });
        if (keyDetails.bedroom) stats.push({ icon: FaBed, value: keyDetails.bedroom, label: "Bedrooms" });
        if (keyDetails.bathroom) stats.push({ icon: FaBath, value: keyDetails.bathroom, label: "Bathrooms" });
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
      ] : [
        { label: "Category", value: activeCategory.title },
        { label: "Origin", value: nominee.brand || "Global" },
        { label: "Body Type", value: nominee.model || "Coupe" }
      ];

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
        votes: formattedVotes,
        sourcesCount: (nominee.sources || []).length.toString(),
        showTagOnHeader: nominee.rank === 1,
        tag: nominee.rank === 1 ? "TOP RATED" : "",
        showTopRatedBadge: nominee.rank === 1,
        progress: `${Math.min(100, Math.max(5, (votesVal / Math.max(1, totalVotesVal)) * 100))}%`,
        progressColor: nominee.rank === 1 ? "#D6A125" : "#1F2937",
        status: nominee.rank === 1 ? "Leader" : "Contender",
        statusIcon: nominee.rank === 1 ? "trophy" : "star",
        statusColor: nominee.rank === 1 ? "#D6A125" : "#6B7280",
        _id: nominee._id,
        categoryId: activeCategory._id,
      };
    });
  };

  const headerData = getMappedHeaderData();
  const cardsData = getMappedCardsData();

  return (
    <>
      <Sidebar categories={filteredCategories} activeSlug={activeSlug} />

      <div className="ml-[300px]">
        <Navbar_Ranking hideSearch={true} />

        <div className="px-8 pb-20">
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
                <div className="text-center py-20 text-gray-500 font-medium">
                  No nominees found in this category.
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-40 text-gray-500">
              No active rankings found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RankingHome;
