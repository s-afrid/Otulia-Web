import React, { useState } from 'react';
import { 
    FiMenu, FiExternalLink, FiBell, FiChevronDown, 
    FiUser, FiShield, FiCreditCard, FiSettings, FiLogOut 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ContentManagementHeader = ({ 
    toggleSidebar, 
    user,
    isNotificationDropdownOpen,
    setIsNotificationDropdownOpen,
    notifications = [],
    handleRemoveNotification
}) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
    
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
                    <button 
                        onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                        className="relative w-8 h-8 rounded-lg bg-[#111726] flex items-center justify-center text-gray-400 hover:text-white transition-all focus:outline-none"
                    >
                        <FiBell className="text-sm" />
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border border-[#0A0E17] text-[8px] text-white font-black flex items-center justify-center scale-90">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown (exactly matching AdminNavbar) */}
                    {isNotificationDropdownOpen && (
                        <div 
                            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-[60] text-left"
                            onMouseLeave={() => setIsNotificationDropdownOpen(false)}
                        >
                            <div className="px-4 pb-2 border-b border-gray-50 flex justify-between items-center">
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Recent Alerts</h4>
                                <span className="text-[10px] font-bold text-[#D48D2A]">{notifications.length} New</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="py-8 px-4 text-center">
                                        <FiBell className="mx-auto text-gray-200 text-3xl mb-2" />
                                        <p className="text-xs text-gray-400 font-medium">No new notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div 
                                            key={notif._id} 
                                            onClick={() => {
                                                if (handleRemoveNotification) {
                                                    handleRemoveNotification(notif._id);
                                                }
                                                setIsNotificationDropdownOpen(false);
                                                // Redirect to admin pages tab if targetTab matches
                                                if (notif.targetTab) {
                                                    navigate(`/admin?tab=${notif.targetTab}`);
                                                }
                                            }}
                                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors group relative"
                                        >
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#D48D2A] shrink-0">
                                                    <FiShield className="text-sm" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900 leading-tight mb-1">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Click to view
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6 w-px bg-[#151C2C]"></div>

                {/* User Profile Section with Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsHeaderDropdownOpen(!isHeaderDropdownOpen)}
                        onBlur={() => setTimeout(() => setIsHeaderDropdownOpen(false), 200)}
                        className="flex items-center gap-[clamp(8px,1vw,16px)] hover:opacity-80 transition-opacity focus:outline-none"
                    >
                        <img 
                            src={user?.profilePicture || "https://i.pravatar.cc/150?img=68"} 
                            className="w-[clamp(30px,4vh,54px)] h-[clamp(30px,4vh,54px)] rounded-full border border-gray-200 object-cover" 
                            alt="Profile" 
                        />
                        <div className="text-left hidden sm:block">
                            <p className="text-[clamp(10px,1.4vh,18px)] font-semibold text-white inter leading-none mb-1">
                                {user?.name || 'Otulia Admin'}
                            </p>
                            <p className="text-[clamp(8px,1vh,14px)] text-[#999999] font-normal inter leading-none">
                                {user?.plan || 'Professional'} Plan
                            </p>
                        </div>
                        <FiChevronDown className={`text-gray-400 text-[clamp(10px,1.2vh,18px)] transition-transform duration-200 ${isHeaderDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu (exactly matching the style of the inventory page) */}
                    {isHeaderDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-[clamp(200px,18vw,280px)] bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50 text-left">
                            <div className="px-4 py-3 border-b border-gray-50">
                                <p className="text-[clamp(12px,1.6vh,18px)] font-bold text-gray-900 inter leading-none mb-1">
                                    {user?.name || 'Otulia Admin'}
                                </p>
                                <p className="text-[clamp(10px,1.4vh,16px)] text-[#999999] inter truncate leading-none">
                                    {user?.email || 'admin@otulia.com'}
                                </p>
                            </div>
                            <div className="py-1">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-gray-600 inter hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                >
                                    <FiUser className="text-[clamp(16px,2.2vh,24px)]" /> My Profile
                                </button>
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-gray-600 inter hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                    >
                                        <FiShield className="text-[clamp(16px,2.2vh,24px)]" /> Admin Dashboard
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate('/inventory')}
                                    className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-gray-600 inter hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                >
                                    <FiCreditCard className="text-[clamp(16px,2.2vh,24px)]" /> Subscription
                                </button>
                                <button
                                    onClick={() => navigate('/admin?tab=settings')}
                                    className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-gray-600 inter hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                >
                                    <FiSettings className="text-[clamp(16px,2.2vh,24px)]" /> Settings
                                </button>
                            </div>
                            <div className="border-t border-gray-50 py-1">
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/login');
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-red-600 inter hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <FiLogOut className="text-[clamp(16px,2.2vh,24px)]" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ContentManagementHeader;
