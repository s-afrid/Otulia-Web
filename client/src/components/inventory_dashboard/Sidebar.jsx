import React from 'react';
import { FiGrid, FiPackage, FiUsers, FiPieChart, FiGlobe, FiCreditCard, FiSettings, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab, user, navigate, logout, isProfileDropdownOpen, setIsProfileDropdownOpen }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
        { id: 'inventory', label: 'My Assets', icon: FiPackage },
        { id: 'leads', label: 'Leads', icon: FiUsers },
        { id: 'analytics', label: 'Analytics & Insights', icon: FiPieChart },
        { id: 'marketplace', label: 'Public Marketplace', icon: FiGlobe },
        { id: 'subscription', label: 'Subscription', icon: FiCreditCard },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ];

    return (
        <div className="w-[clamp(180px,14vw,320px)] h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-[50] transition-all duration-300 overflow-hidden">
            {/* Logo Area */}
            <div className="h-[clamp(80px,12vh,130px)] flex items-center px-[clamp(16px,2vw,32px)] border-b border-gray-50">
                <img src="/logos/otulia_logo_black.png" alt="Otulia" className="h-[clamp(45px,6vh,95px)] object-contain cursor-pointer" onClick={() => navigate('/')} />
            </div>

            <nav className="flex-1 px-[clamp(10px,1vw,20px)] space-y-[clamp(6px,1vh,12px)] overflow-y-auto custom-scrollbar pb-8">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-[clamp(8px,0.8vw,16px)] px-[clamp(8px,1vw,20px)] py-[clamp(8px,1.2vh,16px)] rounded-[clamp(4px,1vh,12px)] transition-all group relative ${activeTab === item.id 
                            ? 'bg-[#FFF8F0] text-[#D48D2A] shadow-[inset_0_0_0_1px_rgba(212,141,42,0.05)]' 
                            : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <item.icon className={`text-[clamp(14.28px,1.83vh,24.48px)] ${activeTab === item.id ? 'text-[#D48D2A]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span className="inter text-[clamp(10.2px,1.53vh,20.4px)] font-semibold tracking-tight">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="absolute right-0 top-[20%] bottom-[20%] w-[4px] bg-[#D48D2A] rounded-l-full shadow-[0_0_12px_rgba(212,141,42,0.6)] animate-in fade-in slide-in-from-right-1 duration-300" />
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-[clamp(8px,1vw,16px)] border-t border-gray-100 space-y-[clamp(8px,1.5vh,20px)]">
                {/* User Profile Snippet */}
                <div 
                    className="flex items-center justify-between p-[clamp(4px,0.8vh,12px)] rounded-[clamp(4px,1vh,12px)] hover:bg-gray-50 cursor-pointer transition-colors relative"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                    <div className="flex items-center gap-[clamp(4px,0.6vw,12px)] overflow-hidden">
                        <img src={user?.profilePicture || '/assets/user.png'} className="w-[clamp(28px,3.5vh,48px)] h-[clamp(28px,3.5vh,48px)] rounded-full border border-gray-200 shrink-0 object-cover" alt="Profile" />
                        <div className="overflow-hidden">
                            <p className="inter text-[clamp(10px,1.4vh,18px)] font-semibold text-gray-900 truncate leading-none">{user?.name || 'Md Riyaz'}</p>
                            <p className="inter text-[clamp(8px,1vh,14px)] font-normal text-gray-400 truncate leading-none mt-[clamp(2px,0.3vh,6px)]">{user?.plan || 'Premium Basic Plan'}</p>
                        </div>
                    </div>
                    <FiChevronDown className="text-gray-400 text-[clamp(10px,1.2vh,18px)] shrink-0" />

                    {/* Profile Dropdown positioned above */}
                    {isProfileDropdownOpen && (
                        <div className="absolute left-0 bottom-full mb-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                            <div className="py-1">
                                <button onClick={(e) => { e.stopPropagation(); navigate('/profile'); }} className="w-full text-left px-4 py-2.5 text-[clamp(11px,1.5vh,18px)] font-medium text-gray-600 inter hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2">
                                    <FiUser className="text-[clamp(16px,2vh,24px)]" /> Profile Settings
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); logout(); navigate('/login'); }} className="w-full text-left px-4 py-2.5 text-[clamp(11px,1.5vh,18px)] font-medium text-red-600 inter hover:bg-red-50 flex items-center gap-2">
                                    <FiLogOut className="text-[clamp(16px,2vh,24px)]" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Premium Card */}
                <div className="bg-[#FFF8F0] border border-[#F2E8DB] rounded-[clamp(8px,1.2vh,16px)] p-[clamp(8px,1.2vh,16px)] flex items-center justify-between cursor-pointer hover:bg-[#FFF4E5] transition-colors mb-[clamp(8px,1.5vh,24px)] shadow-sm" onClick={() => setActiveTab('subscription')}>
                    <div className="flex items-center gap-[clamp(8px,1vw,16px)]">
                        <div className="w-[clamp(24px,3.2vh,48px)] h-[clamp(24px,3.2vh,48px)] rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                            <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="#D48D2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <div className="overflow-hidden">
                            <p className="inter text-[clamp(10px,1.2vh,16px)] font-semibold text-[#D48D2A] truncate leading-none">Premium Member</p>
                            <p className="text-[clamp(8px,0.9vh,12px)] font-medium text-gray-500 truncate">Access exclusive features</p>
                        </div>
                    </div>
                    <FiChevronDown className="text-[#D48D2A] text-[clamp(10px,1.2vh,18px)] -rotate-90 shrink-0" />
                </div>

                <p className="inter text-[clamp(8px,0.9vh,12px)] font-semibold text-[#BFBFBF] leading-none px-2 w-full">
                    © 2026 OTULIA · All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
