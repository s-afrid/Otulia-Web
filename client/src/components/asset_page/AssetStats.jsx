import React from 'react';
import { HiOutlineEye, HiOutlineHeart } from "react-icons/hi2";
import formatNumber from "../../modules/formatNumber";

const AssetStats = ({ views = 0, likes = 0 }) => {
    return (
        <div className="w-full max-w-[90%] mx-auto px-4 flex items-center gap-6 text-gray-600 mt-2 mb-2">
            <div className="flex items-center gap-2">
                <HiOutlineEye className="text-xl" />
                <span className="font-medium montserrat text-sm md:text-base">
                    {formatNumber(views)} views
                </span>
            </div>
            <div className="flex items-center gap-2">
                <HiOutlineHeart className="text-xl" />
                <span className="font-medium montserrat text-sm md:text-base">
                    {formatNumber(likes)} likes
                </span>
            </div>
        </div>
    );
};

export default AssetStats;
