import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiGrid, FiChevronDown, FiChevronRight, FiUsers, FiFileText, 
    FiSettings, FiPieChart, FiCpu, FiAward, FiBookOpen, 
    FiLayers, FiMenu, FiShield, FiExternalLink 
} from 'react-icons/fi';

const ContentManagementSidebar = ({ activeTab = 'categories', onTabChange, isMobileOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
        { id: 'listings', label: 'Listings', icon: FiLayers, hasSubmenu: true },
        { 
            id: 'rankings', 
            label: 'Rankings', 
            icon: FiAward, 
            hasSubmenu: true, 
            isOpen: true,
            submenu: [
                { id: 'all-rankings', label: 'All Rankings' },
                { id: 'categories', label: 'Categories' },
                { id: 'nominations', label: 'Nominations' },
                { id: 'votes', label: 'Votes' },
                { id: 'leaderboard', label: 'Leaderboard' },
                { id: 'banners', label: 'Banners' },
                { id: 'settings', label: 'Settings' }
            ]
        },
        { id: 'content-creators', label: 'Content Creators', icon: FiUsers, hasSubmenu: true },
        { id: 'media', label: 'Media', icon: FiFileText },
        { id: 'pages', label: 'Pages', icon: FiFileText },
        { id: 'blog', label: 'Blog', icon: FiBookOpen },
        { id: 'users', label: 'Users', icon: FiUsers, path: '/admin?tab=users' },
        { id: 'settings', label: 'Settings', icon: FiSettings, path: '/admin?tab=settings' },
        { id: 'reports', label: 'Reports', icon: FiPieChart },
        { id: 'integrations', label: 'Integrations', icon: FiCpu }
    ];

    return (
        <aside className={`w-[260px] bg-[#0A0E17] border-r border-[#151C2C] flex flex-col fixed inset-y-0 z-50 transform ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out`}>
            
            {/* Header Brand Logo */}
            <div className="p-6 pb-6 border-b border-[#151C2C] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 cursor-pointer animate-in fade-in" onClick={() => navigate('/')}>
                    <img src="/logos/logo.png" alt="Otulia" className="h-[28px] object-contain" />
                    <span className="text-[8px] font-extrabold bg-[#D48D2A] text-white px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 select-none">CMS</span>
                </div>
                <button onClick={toggleSidebar} className="text-gray-400 hover:text-white lg:hidden">
                    <FiMenu className="text-xl" />
                </button>
            </div>

            {/* Navigation Lists */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                {navigationItems.map((item) => {
                    const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'all-rankings') || (item.isOpen && item.submenu?.some(s => s.id === activeTab));
                    return (
                        <div key={item.id} className="space-y-1">
                            <button
                                onClick={() => {
                                    if (item.id === 'dashboard') {
                                        if (onTabChange) onTabChange('all-rankings');
                                    } else if (item.path) {
                                        navigate(item.path);
                                    } else {
                                        if (onTabChange) onTabChange(item.id);
                                    }
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    isActive 
                                    ? 'bg-[#151D30]/80 text-[#6366F1]' 
                                    : 'text-gray-400 hover:text-white hover:bg-[#151D30]/30'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="text-sm shrink-0" />
                                    <span>{item.label}</span>
                                </div>
                                {item.hasSubmenu && (
                                    item.isOpen ? <FiChevronDown className="text-[10px]" /> : <FiChevronRight className="text-[10px]" />
                                )}
                            </button>

                            {/* Expanded Submenu */}
                            {item.isOpen && item.submenu && (
                                <div className="pl-8 space-y-1 mt-1">
                                    {item.submenu.map((sub) => {
                                        const isSubActive = activeTab === sub.id;
                                        return (
                                            <button
                                                key={sub.id}
                                                onClick={() => onTabChange && onTabChange(sub.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                                                    isSubActive 
                                                    ? 'text-white bg-[#6366F1]/20 border-l-2 border-[#6366F1]' 
                                                    : 'text-gray-500 hover:text-gray-300'
                                                }`}
                                            >
                                                {sub.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Need Help Box */}
            <div className="p-4 m-4 bg-[#111726] border border-[#1C253B] rounded-2xl shrink-0">
                <p className="text-xs font-bold text-white mb-1">Need Help?</p>
                <p className="text-[10px] text-gray-500 font-medium mb-3 leading-normal">Check our ranking system documentation</p>
                <button className="w-full py-2.5 bg-[#1C253B] border border-[#2B395B] rounded-xl text-[10px] font-bold text-white hover:bg-[#2B395B] transition-all flex items-center justify-center gap-1.5">
                    View Docs <FiExternalLink className="text-[8px]" />
                </button>
            </div>
        </aside>
    );
};

export default ContentManagementSidebar;
