import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 1. Import useParams
import AssetGallery from "../AssetGallery";
import AssetStats from "../AssetStats";
import CarDetails from "../car/CarDetails";
import CarKeyFeatures from "../car/CarKeyFeat";
import CarFeatures from "../car/CarFeatures";
import AssetCard from "../../AssetCard";
import LocationMap from "../LocationMap";
import SEO from "../../../components/SEO";
import AssetSlider from "../../AssetSlider";
import CompanyProfileSection from "../CompanyProfileSection";

const Car_Section = () => {
  const [info, setInfo] = useState(null); // Initialize as null to track loading state
  const [similarAssets, setSimilarAssets] = useState([]);
  const [agentAssets, setAgentAssets] = useState([]);

  // 1. Get ID correctly regardless of URL structure
  const { id } = useParams();


  // Car info fetching
  const infoFetch = async () => {
    // Safety check
    if (!id) return;

    const url = `/api/assets/car/${id}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();

      setInfo(result);
      // Fetch similar and agent assets once we have info
      fetchSimilar(result._id || result.id);
      if (result.agent?.id) {
        fetchAgentAssets(result.agent.id, result._id || result.id);
      }

      // Record VIEW activity
      recordView(result._id || result.id);

    } catch (error) {
      console.error("Error fetching car info:", error.message);
    }
  };

  const recordView = async (assetId) => {
    try {
      await fetch('/api/activity/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId,
          assetModel: 'CarAsset',
          activityType: 'VIEW'
        })
      });
    } catch (e) {
      console.error("Failed to record view activity", e);
    }
  };

  const fetchSimilar = async (assetId) => {
    try {
      const response = await fetch(`/api/assets/similar/car/${assetId}`);
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
      const response = await fetch(`/api/assets/agent/${agentId}/car?excludeId=${currentId}`);
      if (response.ok) {
        const data = await response.json();
        setAgentAssets(data);
      }
    } catch (error) {
      console.error("Agent Assets Fetch Error:", error);
    }
  };

  // Fetch data when ID changes
  useEffect(() => {
    infoFetch();
  }, [id]);

  // 2. Loading State: Don't render until info is loaded
  if (!info) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-xl montserrat text-gray-500">Loading Asset Details...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <SEO 
        title={info.title}
        description={info.description}
        image={info.images?.[0]}
        type="article"
      />

      {/* Pass images array safely */}
      <AssetGallery images={info.images} videoUrl={info.videoUrl} assetType="Car" />

      {/* <AssetStats views={info.views} likes={info.likes} assetId={info._id} assetType="CarAsset" /> */}

      <div className="w-[92%] md:w-[90%] h-px bg-gray-300 border-0 self-center my-5"></div>

      {/* 3. Pass the whole 'item' object (info) to children */}
      {/* This works if your CarDetails expects ({ item }) props */}
      <div className="flex w-full justify-center items-center">
      <CarDetails item={info} modelName="CarAsset" />
      </div>

      <div className="w-[92%] md:w-[90%] h-px bg-gray-300 border-0 self-center my-5"></div>

      {/* 4. Pass 'item' to features components */}
      <CarKeyFeatures item={info} />

      <CarFeatures item={info} />

      <div className="flex items-center justify-center mb-4">
        <LocationMap 
          locationName={info.location} 
          lat={info.specification?.latitude} 
          lng={info.specification?.longitude} 
        />
      </div>

      <CompanyProfileSection agent={info.agent} />

      {similarAssets.length > 0 && (
        <div className="py-8 bg-gray-50/50">
          <AssetSlider title="Similar Cars" items={similarAssets} />
        </div>
      )}

      {agentAssets.length > 0 && (
        <div className="py-8">
          <AssetSlider title={`More from ${info.agent?.name || 'this Agent'}`} items={agentAssets} />
        </div>
      )}

      <div className="w-[92%] md:w-[90%] h-px bg-gray-300 border-0 self-center my-5"></div>
      
    </div>
  );
};

export default Car_Section;