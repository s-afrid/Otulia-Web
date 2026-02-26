import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EstateGallery from "../estate/EstateGallery";
import AssetStats from "../AssetStats";
import EstateDetails from "../estate/EstateDetails";
import EstateKeyFeatures from "../estate/EstateKeyFeat";
import EstateFeatures from "../estate/EstateFeatures";
import AssetCard from "../../AssetCard";
import LocationMap from "../LocationMap";

const Estate_Section = () => {
  const [info, setInfo] = useState(null);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
    } catch (error) {
      console.error("Error fetching estate info:", error.message);
    }
  };


  useEffect(() => {
    infoFetch();
    setPage(1);
    dataFetch(1, true);
  }, [id]);


  const dataFetch = async (pageNum, isInitial = false) => {
    if (!isInitial) setLoadingMore(true);
    const url = `/api/assets/estate?limit=6&page=${pageNum}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      
      if (isInitial) {
        setList(result);
      } else {
        setList(prev => [...prev, ...result]);
      }
      
      setHasMore(result.length === 6);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    dataFetch(nextPage);
  };


  if (!info) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-xl montserrat text-gray-500">Loading Asset Details...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      


      <EstateGallery images={info.images} />

      {/* <AssetStats views={info.views} likes={info.likes} assetId={info._id} assetType="EstateAsset" /> */}

      <div className="w-[92%] md:w-[90%] h-px bg-gray-300 border-0 self-center my-5"></div>



      <EstateDetails item={info} />

      <div className="w-[92%] md:w-[90%] h-px bg-gray-300 border-0 self-center my-5"></div>


      <EstateKeyFeatures item={info} />

      <EstateFeatures item={info} />

       <div className="flex items-center justify-center mb-4">
        <LocationMap 
          locationName={info.location} 
          lat={info.specification?.latitude} 
          lng={info.specification?.longitude} 
        />
      </div>

      <div className="w-[92%] md:w-[90%] h-px bg-gray-300 border-0 self-center my-5"></div>

      <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 py-8 bg-white">
        <h1 className="text-3xl md:text-5xl font-bold playfair-display text-black">
          More Estates
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-7">
          {list.map((item, idx) => (
            <div key={item._id || idx}>
              <AssetCard item={item} idx={idx} />
            </div>
          ))}
        </div>

        {hasMore && list.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'View More Estates'}
            </button>
          </div>
        )}
      </div>
   
    </div>
  );
};

export default Estate_Section;