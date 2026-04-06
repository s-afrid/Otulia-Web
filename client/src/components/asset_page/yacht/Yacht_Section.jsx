import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import YachtGallery from "./YachtGallery";
import AssetStats from "../AssetStats";
import YachtDetails from "./YachtDetails";
import YachtKeyFeatures from "./YachtKeyFeat";
import YachtFeatures from "./YachtFeatures";
import AssetCard from "../../AssetCard";
import LocationMap from "../LocationMap";
import SEO from "../../../components/SEO";
import AssetSlider from "../../AssetSlider";

const Yacht_Section = () => {
    const [info, setInfo] = useState(null);
    const [similarAssets, setSimilarAssets] = useState([]);
    const [agentAssets, setAgentAssets] = useState([]);

    const { id } = useParams();

    const infoFetch = async () => {
        if (!id) return;
        const url = `/api/assets/yacht/${id}`;
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
        }
    };

    const recordView = async (assetId) => {
        try {
            await fetch('/api/activity/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assetId,
                    assetModel: 'YachtAsset',
                    activityType: 'VIEW'
                })
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
            const response = await fetch(`/api/assets/agent/${agentId}/yacht?excludeId=${currentId}`);
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
                <div className="text-xl montserrat text-gray-500">Loading Yacht Details...</div>
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
            
            <YachtGallery images={info.images} videoUrl={info.videoUrl} />

            {/* <AssetStats views={info.views} likes={info.likes} assetId={info._id} assetType="YachtAsset" /> */}

            <div className="w-[92%] md:w-[90%] h-px bg-gray-300 border-0 self-center my-5"></div>

            <YachtDetails item={info} modelName="YachtAsset" />

            <div className="w-[92%] md:w-[90%] h-px bg-gray-300 border-0 self-center my-5"></div>

            <YachtKeyFeatures item={info} />

            <YachtFeatures item={info} />

                        <div className="flex items-center justify-center mb-4">
                            <LocationMap 
                                locationName={info.location} 
                                lat={info.specification?.latitude} 
                                lng={info.specification?.longitude} 
                            />
                        </div>

            {similarAssets.length > 0 && (
                <div className="py-8 bg-gray-50/50">
                    <AssetSlider title="Similar Yachts" items={similarAssets} />
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

export default Yacht_Section;
