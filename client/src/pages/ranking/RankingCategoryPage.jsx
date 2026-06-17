import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar_Ranking from "../../components/ranking_page/Navbar_Ranking";
import Sidebar from "../../components/ranking_page/DashboardRanking";
import HeaderRanking from "../../components/ranking_page/HeaderRanking";
import RankingCard from "../../components/ranking_page/CardRanking";

export default function RankingCategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map URL category to tab/preset
  const categoryToTab = {
    "realestate": "allranking",
    "cars": "allranking",
    "hypercars": "besthypercars",
    "luxury": "bestluxurycars",
    "suv": "bestluxurysuv",
    "electric": "bestevcars",
    "sports": "bestsportcars",
    "supercars": "bestsupercars",
  };

  const tabToCategory = {
    "allranking": "cars",
    "besthypercars": "hypercars",
    "bestluxurycars": "luxury",
    "bestluxurysuv": "suv",
    "bestevcars": "electric",
    "bestsportcars": "sports",
    "bestsupercars": "supercars",
  };

  const activeTab = categoryToTab[category] || "allranking";

  const handleTabChange = (tabId) => {
    const newCategory = tabToCategory[tabId];
    if (newCategory) {
      navigate(`/ranking/${newCategory}`);
    } else {
      navigate("/ranking");
    }
  };

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/car-ranking/top?limit=20`;
        
        const presetMap = {
          besthypercars: "hypercar",
          bestluxurycars: "luxury",
          bestluxurysuv: "luxury-suv",
          bestevcars: "electric",
          bestsportcars: "sports-car",
          bestsupercars: "supercar",
        };
        const preset = presetMap[activeTab];
        if (preset) {
          url += `&preset=${preset}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch rankings");
        }
        const result = await response.json();
        setRankings(result.data || []);
      } catch (err) {
        console.error("Error fetching rankings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [category, activeTab]);

  return (
    <>
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <Navbar_Ranking hideSearch={true} />

      <main className="ml-[clamp(180px,14vw,320px)] min-h-screen bg-[#FDFDFD]">
        <HeaderRanking activeTab={activeTab} count={rankings.length} />
        
        <div className="px-8 pb-20 space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A125]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              {error}
            </div>
          ) : rankings.length > 0 ? (
            rankings.map((item) => (
              <RankingCard key={item.car._id} data={item} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-500 font-medium">
              No rankings found for this category.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
