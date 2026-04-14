import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AssetGallery from "../AssetGallery";
import AssetStats from "../AssetStats";
import EstateDetails from "../estate/EstateDetails";
import EstateKeyFeatures from "../estate/EstateKeyFeat";
import EstateFeatures from "../estate/EstateFeatures";
import AssetCard from "../../AssetCard";
import LocationMap from "../LocationMap";
import SEO from "../../../components/SEO";
import AssetSlider from "../../AssetSlider";
import CompanyProfileSection from "../CompanyProfileSection";

const Estate_Section = () => {
  const [info, setInfo] = useState(null);
  const [similarAssets, setSimilarAssets] = useState([]);
  const [agentAssets, setAgentAssets] = useState([]);

  const { id } = useParams();

  const infoFetch = async () => {
    if (!id) return;
    const url = `/api/assets/estate/${id}`;
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
      console.error("Error fetching estate info:", error.message);
    }
  };

  const recordView = async (assetId) => {
    try {
      await fetch('/api/activity/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId,
          assetModel: 'EstateAsset',
          activityType: 'VIEW'
        })
      });
    } catch (e) {
      console.error("Failed to record view activity", e);
    }
  };

  const fetchSimilar = async (assetId) => {
    try {
      const response = await fetch(`/api/assets/similar/estate/${assetId}`);
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
      const response = await fetch(`/api/assets/agent/${agentId}/estate?excludeId=${currentId}`);
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
  }, [id]);


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
        title={`${info.title} | Luxury Estate`}
        description={info.description}
        image={info.images?.[0]}
        type="article"
        productData={info}
      />

      <AssetGallery images={info.images} videoUrl={info.videoUrl} assetType="Estate" />

      {/* <AssetStats views={info.views} likes={info.likes} assetId={info._id} assetType="EstateAsset" /> */}

      <div className="w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] h-px bg-gray-300 border-0 self-center my-5"></div>



      <EstateDetails item={info} />

      <div className="w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] h-px bg-gray-300 border-0 self-center my-5"></div>


      <EstateKeyFeatures item={info} />

      <EstateFeatures item={info} />

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
          <AssetSlider title="Similar Estates" items={similarAssets} />
        </div>
      )}

      {agentAssets.length > 0 && (
        <div className="py-8">
          <AssetSlider title={`More from ${info.agent?.name || 'this Agent'}`} items={agentAssets} />
        </div>
      )}

      <div className="w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] h-px bg-gray-300 border-0 self-center my-5"></div>
   
    </div>
  );
};

export default Estate_Section;