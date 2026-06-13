import React from "react";
import Navbar_Ranking from "../../components/ranking_page/Navbar_Ranking";
import Sidebar from "../../components/ranking_page/DashboardRanking";
import HeaderRanking from "../../components/ranking_page/HeaderRanking";
import RankingCard from "../../components/ranking_page/CardRanking";

function RankingHome() {
  return (
    <>
      <Sidebar />
      <Navbar_Ranking hideSearch={true} />

      <HeaderRanking />
      <RankingCard />
    </>
  );
}

export default RankingHome;
