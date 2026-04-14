import React, { useState, useEffect } from 'react';
import { HiOutlineEye } from "react-icons/hi2";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import formatNumber from "../../modules/formatNumber";

const AssetStats = ({ views = 0, likes = 0, assetId, assetType }) => {
    const { user, token, isAuthenticated, refreshUser } = useAuth();
    const navigate = useNavigate();
    
    const [localLikes, setLocalLikes] = useState(likes);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        setLocalLikes(likes);
    }, [likes]);

    useEffect(() => {
        if (user && user.favorites && assetId) {
            const isFav = user.favorites.some(fav =>
                fav.assetId && (fav.assetId === assetId || fav.assetId.toString() === assetId)
            );
            setIsLiked(isFav);
        }
    }, [user, assetId]);

    const handleLikeClick = async (e) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            alert("Please log in to like this asset.");
            navigate('/login');
            return;
        }

        // Optimistic UI update for heart
        const previousIsLiked = isLiked;
        setIsLiked(!isLiked);

        // Determine if we should increment or decrement local count
        // Note: The /api/assets/:type/:id/like only increments.
        // But if we use toggle-favorite it doesn't return count.
        
        try {
            // 1. Toggle favorite status (like AssetCard)
            const favResponse = await fetch('/api/auth/toggle-favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    assetId: assetId,
                    assetModel: assetType // e.g., CarAsset
                })
            });

            if (!favResponse.ok) throw new Error('Failed to toggle favorite');
            
            // 2. Increment like count on the asset itself (if liking)
            // If already liked, we just untoggle but the /like endpoint only increments.
            // Usually, /like should be separate. The user asked for it to be like AssetCard.
            // AssetCard only toggles favorites. But the prompt says "update the like numbers".
            
            if (!previousIsLiked) {
                const typeMap = {
                    'CarAsset': 'cars',
                    'EstateAsset': 'estates',
                    'BikeAsset': 'bikes',
                    'YachtAsset': 'yachts'
                };
                const urlType = typeMap[assetType] || assetType.toLowerCase().replace('asset', 's');

                const likeResponse = await fetch(`/api/assets/${urlType}/${assetId}/like`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (likeResponse.ok) {
                    const result = await likeResponse.json();
                    setLocalLikes(result.likes);
                }
            } else {
                // If unliking, we don't have an endpoint to decrement likes in the backend based on my search
                // So we just keep the local count or decrement it locally if we want to be optimistic
                setLocalLikes(prev => Math.max(0, prev - 1));
            }

            refreshUser();
        } catch (error) {
            console.error(error);
            setIsLiked(previousIsLiked);
        }
    };

    return (
        <div className="w-full px-6 md:px-10 flex items-center gap-6 text-gray-600 mt-2 mb-2">
            <div className="flex items-center gap-2">
                <HiOutlineEye className="text-xl" />
                <span className="font-medium montserrat text-sm md:text-base">
                    {formatNumber(views)} views
                </span>
            </div>
            <button 
                onClick={handleLikeClick}
                className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors focus:outline-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isLiked ? "#ef4444" : "none"}
                    stroke={isLiked ? "none" : "currentColor"}
                    strokeWidth="2"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                </svg>
                <span className="font-medium montserrat text-sm md:text-base">
                    {formatNumber(localLikes)} likes
                </span>
            </button>
        </div>
    );
};

export default AssetStats;
