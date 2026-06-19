import React from "react";
import { useParams } from "react-router-dom";

import Navbar_Ranking from "../../components/ranking_page/Navbar_Ranking";
import Sidebar from "../../components/ranking_page/DashboardRanking";
import HeaderRanking from "../../components/ranking_page/HeaderRanking";
import RankingCard from "../../components/ranking_page/CardRanking";

import { rankings } from "../../data/rankings";

function RankingHome() {
  const { slug } = useParams();

  const rankingData = rankings[slug] || rankings["hypercars"];

  return (
    <>
      <Sidebar />

      <div className="ml-[300px]">
        <Navbar_Ranking hideSearch={true} />

        <div className="px-12">
          <HeaderRanking data={rankingData.header} />

          <RankingCard cars={rankingData.cards} />
        </div>
      </div>
    </>
  );
}

export default RankingHome;
