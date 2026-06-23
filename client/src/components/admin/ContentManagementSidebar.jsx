import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiGrid, FiChevronDown, FiChevronRight, FiUsers, FiFileText, 
    FiSettings, FiPieChart, FiCpu, FiAward, FiBookOpen, 
    FiLayers, FiMenu, FiShield, FiExternalLink 
} from 'react-icons/fi';

const ContentManagementSidebar = ({ activeTab = 'categories', onTabChange, isMobileOpen, toggleSidebar, categories = [] }) => {
    const navigate = useNavigate();

    // Menu expand/collapse states
    const [openMenus, setOpenMenus] = React.useState({
        listings: true,
    });

    // Auto-expand menus when active tab switches to a sub-tab
    React.useEffect(() => {
        if (activeTab.startsWith('listings')) {
            setOpenMenus(prev => ({ ...prev, listings: true }));
        }
    }, [activeTab]);

    const toggleMenu = (menuId) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
        { 
            id: 'listings', 
            label: 'Listings', 
            icon: FiLayers, 
            hasSubmenu: true, 
            isOpen: openMenus.listings,
            submenu: categories.map(c => ({ id: `listings-${c.id || c._id}`, label: c.title }))
        },
        { id: 'categories', label: 'Categories', icon: FiAward }
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
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
                {navigationItems.map((item) => {
                    const isActive = activeTab === item.id || item.submenu?.some(s => s.id === activeTab);
                    return (
                        <div key={item.id} className="space-y-1">
                            <button
                                onClick={() => {
                                    if (item.hasSubmenu) {
                                        toggleMenu(item.id);
                                    }
                                    if (item.id === 'dashboard') {
                                        if (onTabChange) onTabChange('dashboard');
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
        </aside>
    );
};

export default ContentManagementSidebar;
