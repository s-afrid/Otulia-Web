import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiGrid, FiUsers, FiPieChart, FiDollarSign, FiSettings,
    FiXCircle, FiShoppingBag, FiShield, FiPercent
} from 'react-icons/fi';

const AdminSidebar = ({ isSidebarOpen, toggleSidebar, activeTab, setActiveTab, user }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: FiGrid },
        { id: 'users', label: 'User Management', icon: FiUsers },
        { id: 'analytics', label: 'Analytics', icon: FiPieChart },
        { id: 'payouts', label: 'Payout Management', icon: FiDollarSign },
        { id: 'partners', label: 'Partners', icon: FiShoppingBag },
        { id: 'coupons', label: 'Coupons', icon: FiPercent },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ];

    return (
        <aside className={`w-[240px] border-r flex flex-col fixed inset-y-0 z-50 bg-white border-gray-100 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out`}>
            <div className="p-6 pb-10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/logos/otulia_logo_black.png" alt="Otulia" className="h-[34px]" />
                    <div className="ml-2 px-2 py-1 bg-[#D48D2A] text-white rounded-md flex items-center gap-1 shadow-sm">
                        <FiShield className="text-[10px]" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Admin</span>
                    </div>
                </div>
                <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-900 lg:hidden">
                    <FiXCircle className="h-6 w-6" />
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            if (window.innerWidth < 1024) {
                                toggleSidebar();
                            }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                            ? 'bg-[#F2E8DB] text-gray-900 border-l-4 border-black shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <item.icon className={`text-lg ${activeTab === item.id ? 'text-black' : 'text-gray-400'}`} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 m-4 bg-gray-50 rounded-2xl border border-gray-100 shrink-0">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 p-0.5 shrink-0">
                        <img src={user?.profilePicture || "https://i.pravatar.cc/150?img=68"} alt="Admin" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                        <p className="text-[10px] text-gray-400 truncate">System Administrator</p>
                    </div>
                </div>
                <button onClick={() => navigate('/inventory')} className="w-full py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:text-[#D48D2A] hover:border-[#D48D2A] transition-all">
                    Switch to Inventory
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
