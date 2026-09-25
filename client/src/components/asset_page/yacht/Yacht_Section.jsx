import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import AssetGallery from "../AssetGallery";
import AssetStats from "../AssetStats";
import YachtDetails from "./YachtDetails";
import YachtKeyFeatures from "./YachtKeyFeat";
import YachtFeatures from "./YachtFeatures";
import AssetCard from "../../AssetCard";
import LocationMap from "../LocationMap";
import PriceHistoryChart from "../PriceHistoryChart";
import SEO from "../../../components/SEO";
import AssetSlider from "../../AssetSlider";
import CompanyProfileSection from "../CompanyProfileSection";
import AssetUnavailable from "../AssetUnavailable";

const Yacht_Section = () => {
  const [info, setInfo] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [similarAssets, setSimilarAssets] = useState([]);
  const [agentAssets, setAgentAssets] = useState([]);

  const { id } = useParams();
  const location = useLocation();
  const targetId = location.state?.id || id;

  const infoFetch = async () => {
    if (!targetId) return;
    const url = `/api/assets/yacht/${encodeURIComponent(targetId)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      setInfo(result);
      fetchSimilar(result._id || result.id);
      if (result.agent?.id) {
        fetchAgentAssets(result.agent.id, result._id || result.id);
      }

      // Record VIEW activity
      recordView(result._id || result.id);
    } catch (error) {
      console.error("Error fetching yacht info:", error.message);
      setLoadFailed(true);
    }
  };

  const recordView = async (assetId) => {
    try {
      await fetch("/api/activity/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId,
          assetModel: "YachtAsset",
          activityType: "VIEW",
        }),
      });
    } catch (e) {
      console.error("Failed to record view activity", e);
    }
  };

  const fetchSimilar = async (assetId) => {
    try {
      const response = await fetch(`/api/assets/similar/yacht/${assetId}`);
      if (response.ok) {
        const data = await response.json();
        setSimilarAssets(data);
      }
    } catch (error) {
      console.error("Similar Fetch Error:", error);
    }
  };

  const fetchAgentAssets = async (agentId, currentId) => {
    try {
      const response = await fetch(
        `/api/assets/agent/${agentId}/yacht?excludeId=${currentId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setAgentAssets(data);
      }
    } catch (error) {
      console.error("Agent Assets Fetch Error:", error);
    }
  };

  useEffect(() => {
    infoFetch();
  }, [id, location.state?.id]);

  if (loadFailed) return <AssetUnavailable />;

  if (!info) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-white text-black min-h-screen">
        <SEO
          title="Luxury Yacht Listing"
          description="View this luxury yacht listing on Otulia, the global luxury marketplace for cars, real estate, yachts and bikes."
        />
        <div className="text-xl montserrat text-gray-500">
          Loading Yacht Details...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white text-black min-h-screen">
      <SEO
        title={info.title}
        description={info.description}
        image={info.images?.[0]}
        type="article"
        productData={info}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Listings', path: '/shop' },
          { label: info.title },
        ]}
      />

      <AssetGallery
        images={info.images}
        videoUrl={info.videoUrl}
        assetType="Yacht"
      />

      <YachtDetails item={info} modelName="YachtAsset" />

      <YachtKeyFeatures item={info} />

      <YachtFeatures item={info} />

      {info.priceHistory && info.priceHistory.length > 0 && (
        <PriceHistoryChart
          priceHistory={info.priceHistory}
          options={info.priceHistoryOptions}
        />
      )}

      <div className="w-full mt-10">
        <LocationMap
          locationName={info.location}
          lat={info.specification?.latitude}
          lng={info.specification?.longitude}
        />
      </div>

      <CompanyProfileSection agent={info.agent} />

      {similarAssets.length > 0 && (
        <div className="py-16 border-t border-gray-100">
          <AssetSlider title="Similar Yachts" items={similarAssets} />
        </div>
      )}

      {agentAssets.length > 0 && (
        <div className="py-16 bg-gray-50/30">
          <AssetSlider
            title={`More from ${info.agent?.company || "this Agency"}`}
            items={agentAssets}
          />
        </div>
      )}
    </div>
  );
};

export default Yacht_Section;
