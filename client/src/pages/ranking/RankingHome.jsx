import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/ranking_page/DashboardRanking";
import Navbar_Ranking from "../../components/ranking_page/Navbar_Ranking";
import HeaderRanking from "../../components/ranking_page/HeaderRanking";
import RankingCard from "../../components/ranking_page/CardRanking";
import RankingScaleWrapper from "../../components/ranking_page/RankingScaleWrapper";
import { mockRankingsData } from "../../data/rankings";

function RankingHome() {
  const { category, slug } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [votesRemaining, setVotesRemaining] = useState(5);

  const currentCategoryType = (category || "cars").toLowerCase();

  const getCategoryDisplayName = (catParam, allCategories = []) => {
    if (!catParam) return "Automotive";
    const p = catParam.toLowerCase().replace(/[-_]/g, " ").trim();

    const matched = allCategories.find((c) => {
      if (!c || !c.type) return false;
      const t = c.type.toLowerCase().replace(/\s+/g, "").replace(/s$/, "");
      const paramClean = p.replace(/\s+/g, "").replace(/s$/, "");
      return t === paramClean;
    });

    if (matched && matched.type) {
      if (matched.type.toLowerCase() === "cars") return "Automotive";
      return matched.type;
    }

    if (p === "cars" || p === "car" || p === "automotive") return "Automotive";
    if (p.includes("real") || p.includes("estate")) return "Real Estate";
    if (p.includes("creator") || p.includes("influencer")) return "Content Creator";
    if (p.includes("yacht")) return "Yachts";
    if (p.includes("bike")) return "Bikes";

    return p
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch all active categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/rankings/categories");
        if (!res.ok) throw new Error("Failed to fetch ranking categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.warn("DB Categories fetch failed, using fallback:", err.message);
        setCategories(mockRankingsData);
      } finally {
        if (!slug) {
          setLoading(false);
        }
      }
    };

    fetchCategories();
  }, [slug]);

  // Dynamic document.title update for ranking pages
  useEffect(() => {
    if (activeCategory && activeCategory.title) {
      document.title = `${activeCategory.title} | Otulia Rankings`;
    } else {
      const catDisplayName = getCategoryDisplayName(category, categories);
      document.title = `${catDisplayName} Rankings | Otulia`;
    }

    return () => {
      document.title = "Otulia - Buy & Sell Luxury Assets Worldwide";
    };
  }, [activeCategory, category, categories]);

  const isTypeMatching = (type, param) => {
    if (!type || !param) return false;
    const t = type.toLowerCase().replace(/\s+/g, "").replace(/s$/, "");
    const p = param.toLowerCase().replace(/\s+/g, "").replace(/s$/, "");
    if (p === "car" && t === "automotive") return true;
    if (p === "automotive" && t === "car") return true;
    return t === p || t.includes(p) || p.includes(t);
  };

  // Filter categories matching current URL category type
  const filteredCategories = categories.filter((cat) => {
    const catType = (cat.type || "").toLowerCase();
    return isTypeMatching(catType, currentCategoryType);
  });

  const getStaticFallback = (targetSlug) => {
    return mockRankingsData.find(c => c.slug === targetSlug) || mockRankingsData[0];
  };

  // Fetch category details + ranked nominees when slug is present
  useEffect(() => {
    if (!slug) {
      setActiveCategory(null);
      return;
    }

    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/rankings/categories/${slug}`);
        if (!res.ok) throw new Error("Category not found");
        const data = await res.json();
        setActiveCategory(data);
      } catch (err) {
        console.warn("DB Category fetch failed, falling back to static mockup data:", err.message);
        const staticData = getStaticFallback(slug);
        if (staticData) {
          const catType = getCategoryDisplayName(category, categories);

          setActiveCategory({
            _id: slug,
            title: staticData.title,
            slug: staticData.slug,
            type: catType,
            year: 2026,
            detailedDescription: staticData.detailedDescription,
            shortDescription: staticData.shortDescription,
            categoryImage: staticData.bannerImage,
            totalVotes: staticData.totalVotes || 0,
            viewsCount: staticData.viewsCount || 0,
            assetNominees: staticData.nominees ? staticData.nominees.map((n, i) => ({
              _id: `nom-${i}`,
              rank: i + 1,
              name: n.name,
              brand: n.brand || n.location || n.channelName || "",
              model: n.model || n.propertyType || n.genre || "",
              year: n.year || 2026,
              mainImage: n.image,
              votesCount: n.rawVotes || (n.votes ? parseInt(n.votes.replace(/,/g, '')) : 0),
              listingLink: n.listingLink || "",
              keyDetails: {
                engine: n.engine,
                power: n.power,
                topSpeed: n.topSpeed,
                price: n.price,
                country: n.origin,
                origin: n.origin,
                livingArea: n.livingArea,
                landSize: n.landSize,
                bedroom: n.bedrooms,
                bathroom: n.bathrooms,
                propertyType: n.propertyType,
                subscribers: n.subscribers,
                views: n.views,
                joinDate: n.joinDate,
                category: n.genre,
                location: n.location,
              },
              socialLinks: n.socialLinks || {}
            })) : []
          });
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [slug, category]);

  // Handle voting
  const handleVote = async (nomineeId) => {
    if (!nomineeId || !activeCategory) return;
    if (isVoting) return;

    try {
      setIsVoting(true);
      const res = await fetch(`/api/rankings/categories/${activeCategory._id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomineeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to submit vote. Please try again.");
        return;
      }

      if (data.votesRemaining !== undefined) {
        setVotesRemaining(data.votesRemaining);
      }

      if (data.updatedNominees) {
        setActiveCategory((prev) => ({
          ...prev,
          assetNominees: data.updatedNominees,
          totalVotes: (prev.totalVotes || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Voting error:", err);
      alert("Network error: Could not record your vote.");
    } finally {
      setIsVoting(false);
    }
  };

  const activeSlug = activeCategory?.slug || slug;

  // Map database details to Sidebar, Header, and Cards shape
  const getMappedHeaderData = () => {
    if (!activeCategory) return null;
    const catDisplayName = activeCategory.type || getCategoryDisplayName(category, categories);
    return {
      breadcrumbs: ["Home", "Rankings", catDisplayName, activeCategory.title],
      titleMain: activeCategory.title,
      titleHighlight: "",
      description: activeCategory.detailedDescription || activeCategory.shortDescription || "",
      coverImage: activeCategory.categoryImage || activeCategory.bannerImage || "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop",
      totalVotes: (activeCategory.totalVotes || (activeCategory.assetNominees || []).reduce((acc, curr) => acc + (curr.votesCount || 0), 0)).toLocaleString(),
      nomineesCount: (activeCategory.assetNominees || []).length.toString(),
      totalViews: (activeCategory.viewsCount || 0).toLocaleString(),
      lastUpdated: activeCategory.updatedAt ? new Date(activeCategory.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
      votingClosesIn: "2026 Season",
      sponsorBadge: "OFFICIAL BENCHMARK",
      sponsorText: "Ranked by Global Enthusiast Community",
      badgeText: "2026 OFFICIAL RANKINGS",
      stats: [
        { value: (activeCategory.totalVotes || 0).toLocaleString(), label: "Total Verified Votes" },
        { value: (activeCategory.assetNominees || []).length.toString(), label: "Vetted Nominees" },
        { value: activeCategory.viewsCount ? activeCategory.viewsCount.toLocaleString() : "14.2K", label: "Monthly Impressions" }
      ]
    };
  };

  const getMappedCardsData = () => {
    if (!activeCategory || !activeCategory.assetNominees) return [];

    const isEstate = (activeCategory.type || "").toLowerCase().includes("estate") || (activeCategory.type || "").toLowerCase().includes("real");
    const isContentCreator = (activeCategory.type || "").toLowerCase().includes("creator");

    const totalVotesVal = activeCategory.assetNominees.reduce((sum, n) => sum + (n.votesCount || 0), 0);

    return activeCategory.assetNominees.map((nominee) => {
      const votesVal = nominee.votesCount || 0;
      const formattedVotes = votesVal.toLocaleString();
      const keyDetails = nominee.keyDetails || {};
      const socialLinks = nominee.socialLinks || {};

      return {
        rank: nominee.rank || 1,
        title: nominee.name,
        name: nominee.name,
        badgeText: nominee.rank === 1 ? "Top Ranked" : "",
        image: nominee.mainImage || "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=800&auto=format&fit=crop",
        score: nominee.rank === 1 ? "9.8" : "9.2",
        brand: nominee.brand || "Exclusive",
        model: nominee.model || "Edition",
        origin: keyDetails.country || nominee.country || keyDetails.origin || nominee.origin || nominee.brand || "Global",
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
        listingLink: nominee.listingLink || keyDetails.listingLink || "",
      };
    });
  };

  const headerData = getMappedHeaderData();
  const cardsData = getMappedCardsData();

  return (
    <RankingScaleWrapper>
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
                <RankingCard cars={cardsData} onVote={handleVote} isVoting={isVoting} votesRemaining={votesRemaining} />
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
                  {getCategoryDisplayName(category, categories)}{" "}
                  <span className="text-[#C9920E]">Rankings</span>
                </h1>
                <p className="mt-5 max-w-[650px] text-[18px] leading-[1.65] text-[#A1A1AA]">
                  Explore all our curated luxury {getCategoryDisplayName(category, categories).toLowerCase()} ranking categories. See what's leading the industry based on verified votes and user popularity.
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
    </RankingScaleWrapper>
  );
}

export default RankingHome;
