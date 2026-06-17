import React, { useState, useEffect } from "react";
import Navbar_Ranking from "../../components/ranking_page/Navbar_Ranking";
import Sidebar from "../../components/ranking_page/DashboardRanking";
import HeaderRanking from "../../components/ranking_page/HeaderRanking";
import RankingCard from "../../components/ranking_page/CardRanking";

function RankingHome() {
  const [activeTab, setActiveTab] = useState("allranking");
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "/api/car-ranking/top?limit=20";
        if (activeTab !== "allranking") {
          // Map tab IDs to preset filters if needed
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
  }, [activeTab]);

  return (
    <>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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

export default RankingHome;
