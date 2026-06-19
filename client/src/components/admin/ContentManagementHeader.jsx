import React from 'react';
import { FiMenu, FiExternalLink, FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ContentManagementHeader = ({ toggleSidebar, user }) => {
    const navigate = useNavigate();
    
    return (
        <header className="h-16 bg-[#0A0E17] border-b border-[#151C2C] px-6 flex items-center justify-between sticky top-0 z-40">
            {/* Left section: mobile button & title */}
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="text-gray-400 hover:text-white lg:hidden">
                    <FiMenu className="text-lg" />
                </button>
                <h1 className="text-sm sm:text-base font-bold text-white tracking-wide canela">
                    Rankings CMS
                </h1>
            </div>

            {/* Right section: user actions */}
            <div className="flex items-center gap-4">
                {/* View Site Button */}
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111726] border border-[#1C253B] text-gray-300 rounded-lg text-[10px] font-bold uppercase hover:bg-[#1C253B] transition-all"
                >
                    View Site <FiExternalLink className="text-[9px]" />
                </button>

                {/* Notifications Alert Bell */}
                <div className="relative">
                    <button className="w-8 h-8 rounded-lg bg-[#111726] flex items-center justify-center text-gray-400 hover:text-white transition-all">
                        <FiBell className="text-sm" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-[#0A0E17] text-[8px] text-white font-black flex items-center justify-center scale-90">
                            12
                        </span>
                    </button>
                </div>

                <div className="h-6 w-px bg-[#151C2C]"></div>

                {/* User Info Profile */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gray-700 overflow-hidden border border-[#1C253B]">
                        <img 
                            src={user?.profilePicture || "https://i.pravatar.cc/150?img=68"} 
                            alt="Admin Profile" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-[10px] font-black text-white leading-none mb-0.5">{user?.name || 'Otulia Admin'}</p>
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none">Super Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ContentManagementHeader;
