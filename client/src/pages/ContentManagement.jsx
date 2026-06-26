import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

// CMS Modular Components
import ContentManagementSidebar from '../components/admin/ContentManagementSidebar';
import ContentManagementHeader from '../components/admin/ContentManagementHeader';
import RankingCategoryForm from '../components/admin/RankingCategoryForm';
import RankingCategoryTable from '../components/admin/RankingCategoryTable';
import RankingsDashboardTab from '../components/admin/RankingsDashboardTab';
import { FiAward, FiLayers, FiChevronRight } from 'react-icons/fi';

import carIcon from '../assets/icons/car_icon.png';
import estateIcon from '../assets/icons/estate_icon.png';
import yachtIcon from '../assets/icons/yacht_icon.png';

const ContentManagement = () => {
    const getTypeColor = (type) => {
        switch (type) {
            case 'Cars': return 'bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/30';
            case 'Real Estate': return 'bg-[#D48D2A]/10 text-[#F59E0B] border border-[#D48D2A]/30';
            case 'Yachts': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30';
            case 'Bikes': return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
            default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/30';
        }
    };
    const { token, user, loading } = useAuth();
    const navigate = useNavigate();
    
    // Layout states
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Core Categories State (Loaded from backend DB)
    const [categories, setCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(false);

    // Currently editing record state
    const [editingCategory, setEditingCategory] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const loadCategories = async () => {
        if (!token) return;
        setFetchingCategories(true);
        try {
            const response = await fetch('/api/admin/ranking-categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Load Categories Error:", error);
        } finally {
            setFetchingCategories(false);
        }
    };

    // Route Gate Guarding & Notifications Fetch
    useEffect(() => {
        if (!loading) {
            if (!token || !user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchNotifications();
                loadCategories();
            }
        }
    }, [token, user, loading, navigate]);

    const fetchNotifications = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const statsRes = await fetch('/api/admin/stats', { headers });
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setNotifications(statsData.notifications || []);
            }
        } catch (error) {
            console.error("CMS Notifications Fetch Error:", error);
        }
    };

    const handleRemoveNotification = async (notificationId) => {
        try {
            const response = await fetch(`/api/leads/notification/${notificationId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.filter(n => n._id !== notificationId));
            }
        } catch (error) {
            console.error("Remove Notification Error:", error);
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Action handlers
    const handleSubmitCategory = async (formData) => {
        try {
            const method = editingCategory ? 'PUT' : 'POST';
            const endpoint = editingCategory 
                ? `/api/admin/ranking-categories/${editingCategory._id || editingCategory.id}` 
                : '/api/admin/ranking-categories';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(editingCategory ? 'Ranking Category updated successfully!' : 'New Ranking Category created successfully!');
                setEditingCategory(null);
                loadCategories();
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to save ranking category.');
            }
        } catch (error) {
            console.error("Submit Category Error:", error);
            alert('Error saving ranking category.');
        }
    };

    const handleEditTrigger = (category) => {
        setEditingCategory(category);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteTrigger = async (id) => {
        if (confirm('Are you sure you want to delete this ranking category? All its nominees will be deleted too.')) {
            try {
                const response = await fetch(`/api/admin/ranking-categories/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    alert('Ranking Category deleted successfully!');
                    loadCategories();
                } else {
                    const err = await response.json();
                    alert(err.message || 'Failed to delete category.');
                }
            } catch (error) {
                console.error("Delete Category Error:", error);
                alert('Error deleting category.');
            }
        }
    };

    const handleAddNewTrigger = () => {
        setEditingCategory(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderTabContent = () => {
        if (activeTab === 'dashboard') {
            return (
                <RankingsDashboardTab 
                    onTabChange={setActiveTab} 
                    categories={categories}
                    onCreateCategoryClick={() => {
                        setEditingCategory(null);
                        setActiveTab('categories');
                    }} 
                />
            );
        }
        
        if (activeTab === 'categories') {
            return (
                <>
                    {/* Add/Edit Section Header */}
                    <div className="flex justify-between items-center text-left">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-normal tracking-wide text-white canela">
                                {editingCategory ? 'Edit Ranking Category' : 'Add New Ranking Category'}
                            </h2>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                                Rankings <span className="text-gray-600 font-semibold">&gt;</span> Categories <span className="text-gray-600 font-semibold">&gt;</span> {editingCategory ? 'Edit' : 'Add New'}
                            </p>
                        </div>
                    </div>

                    {/* Stepper Form Block */}
                    <RankingCategoryForm 
                        initialData={editingCategory} 
                        onSubmit={handleSubmitCategory} 
                        onCancel={() => setEditingCategory(null)} 
                    />

                    {/* Existing Categories Table View */}
                    <RankingCategoryTable 
                        categories={categories} 
                        onEdit={handleEditTrigger} 
                        onDelete={handleDeleteTrigger} 
                        onAddNew={handleAddNewTrigger} 
                    />
                </>
            );
        }
        
        if (activeTab === 'listings') {
            return (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center text-left">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-normal tracking-wide text-white canela">
                                Listings Management
                            </h2>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                                Listings <span className="text-gray-600 font-semibold">&gt;</span> Overview
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {categories.length === 0 ? (
                            <div className="col-span-full bg-[#111726]/60 border border-[#1C253B] p-12 rounded-[2.5rem] text-center backdrop-blur-md">
                                <p className="text-xs text-gray-400 font-medium">No categories found in the database. Go to Rankings &gt; Categories to add some.</p>
                            </div>
                        ) : (
                            categories.map((c) => {
                                const nomineeCount = c.nominees ? c.nominees.length : 0;
                                return (
                                    <div key={c.id || c._id} className="bg-[#111726]/60 border border-[#1C253B] rounded-[2.5rem] overflow-hidden group hover:border-[#2C3B5E] transition-all duration-300 backdrop-blur-md flex flex-col">
                                        {/* Cover image banner */}
                                        <div className="h-44 relative overflow-hidden border-b border-[#1C253B]/50 shrink-0">
                                            {c.categoryImage ? (
                                                <img src={c.categoryImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full bg-[#0B0F19] flex items-center justify-center text-gray-700 font-bold">No Image</div>
                                            )}
                                            {/* Overlay with type badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${getTypeColor(c.type)}`}>
                                                    {c.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div className="space-y-2">
                                                <h3 className="text-base font-normal text-white canela tracking-wide truncate" title={c.title}>{c.title}</h3>
                                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed h-10">{c.shortDescription || 'No description provided.'}</p>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-[#1B243B]/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                <div>
                                                    <span className="block text-gray-400 text-xs font-normal mb-0.5">{nomineeCount}</span>
                                                    <span>Nominees</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-white text-xs font-normal mb-0.5">{c.votes || '0'}</span>
                                                    <span>Total Votes</span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => setActiveTab(`listings-${c.id || c._id}`)}
                                                className="mt-5 w-full py-3 bg-[#151D30]/80 border border-[#2B395B] hover:border-[#6366F1] text-gray-200 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300"
                                            >
                                                View Nominees & Rankings
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            );
        }
        
        if (activeTab.startsWith('listings-')) {
            const categoryId = activeTab.split('listings-')[1];
            const category = categories.find(c => c.id === categoryId || c._id === categoryId);
            
            if (!category) {
                return (
                    <div className="bg-[#111726]/60 border border-[#1C253B] p-12 rounded-[2.5rem] text-center backdrop-blur-md">
                        <p className="text-xs text-gray-400 font-medium">Category not found.</p>
                    </div>
                );
            }

            const sortedNominees = category.nominees 
                ? [...category.nominees].sort((a, b) => (b.votes || 0) - (a.votes || 0))
                : [];

            return (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                        <div>
                            <button 
                                onClick={() => setActiveTab('listings')}
                                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-2 transition-colors"
                            >
                                &larr; Back to Listings
                            </button>
                            <h2 className="text-xl sm:text-2xl font-normal tracking-wide text-white canela">
                                {category.title}
                            </h2>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                                Listings <span className="text-gray-600 font-semibold">&gt;</span> Category Rankings <span className="text-gray-600 font-semibold">&gt;</span> {category.title}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${getTypeColor(category.type)}`}>
                                {category.type}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                category.status === 'Active' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                                {category.status}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#111726]/60 border border-[#1C253B] p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden backdrop-blur-md text-left flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {category.categoryImage && (
                            <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 border border-[#1C253B]">
                                <img src={category.categoryImage} alt={category.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="space-y-2 flex-1">
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                {category.detailedDescription || category.shortDescription || 'No description provided.'}
                            </p>
                            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                <div>
                                    <span className="text-gray-400">Voting Period: </span>
                                    <span className="text-white font-mono">{category.votingPeriodStart ? `${new Date(category.votingPeriodStart).toLocaleDateString()} - ${new Date(category.votingPeriodEnd).toLocaleDateString()}` : 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Total Votes: </span>
                                    <span className="text-[#D48D2A]">{category.votes || '0'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Nominee Limit: </span>
                                    <span className="text-white">{category.nomineeLimit || 10}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 text-left">
                        <div className="flex justify-between items-center px-4">
                            <h3 className="text-base font-normal text-white canela tracking-wide">Rankings & Leaderboard</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{sortedNominees.length} Nominees registered</p>
                        </div>

                        {sortedNominees.length === 0 ? (
                            <div className="bg-[#111726]/60 border border-[#1C253B] p-12 rounded-[2.5rem] text-center backdrop-blur-md">
                                <p className="text-xs text-gray-400 font-medium">No nominees have been added to this category yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {sortedNominees.map((nominee, idx) => {
                                    const rank = idx + 1;
                                    const rankColors = {
                                        1: { border: 'border-[#D48D2A]/50 bg-[#D48D2A]/5', badge: 'bg-[#D48D2A]/20 text-[#D48D2A]' },
                                        2: { border: 'border-slate-400/40 bg-slate-400/5', badge: 'bg-slate-400/20 text-slate-300' },
                                        3: { border: 'border-amber-700/40 bg-amber-700/5', badge: 'bg-amber-700/20 text-amber-600' }
                                    };

                                    const currentRankStyle = rankColors[rank] || { 
                                        border: 'border-[#1C253B]/50 bg-[#151D30]/20', 
                                        badge: 'bg-[#1C253B] text-gray-400' 
                                    };

                                    return (
                                        <div 
                                            key={nominee.id || nominee._id || idx} 
                                            className={`flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:border-[#2C3B5E] ${currentRankStyle.border} group`}
                                        >
                                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black uppercase tracking-wider ${currentRankStyle.badge}`}>
                                                        #{rank}
                                                    </span>
                                                </div>

                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-900 border border-[#2B395B]/40 overflow-hidden shrink-0">
                                                    {nominee.image ? (
                                                        <img src={nominee.image} alt={nominee.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-700 font-bold">No Image</div>
                                                    )}
                                                </div>

                                                <div className="text-center sm:text-left space-y-1">
                                                    <h4 className="text-sm font-bold text-white tracking-wide">{nominee.name}</h4>
                                                    <p className="text-xs text-gray-400 font-medium line-clamp-1">{nominee.detail || 'No extra details available.'}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 sm:mt-0 flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#1C253B]/50 pt-3 sm:pt-0">
                                                <div className="text-left sm:text-right">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Votes Cast</p>
                                                    <p className="text-base font-normal text-white canela tracking-wide">{nominee.votes || 0}</p>
                                                </div>

                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                    rank === 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                }`}>
                                                    {rank === 1 ? 'Leader' : 'Nominee'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Mock Fallback
        return (
            <div className="bg-[#111726]/60 border border-[#1C253B] p-12 rounded-[2.5rem] text-center backdrop-blur-md">
                <FiAward className="text-4xl text-[#D48D2A] mx-auto mb-4 animate-bounce" />
                <h3 className="text-lg font-normal text-white canela tracking-wide capitalize">{activeTab.replace('-', ' ')} Component</h3>
                <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto mt-2 leading-relaxed">
                    The {activeTab.replace('-', ' ')} management interface is under active deployment. Data is currently live-syncing to the ranking server.
                </p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!token || !user || user.role !== 'admin') {
        return null; // Gate redirects to home
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex select-none montserrat antialiased">
            <SEO title="Rankings CMS" description="Manage and organize rankings categories" />
            
            {/* Dark Theme Sidebar */}
            <ContentManagementSidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                isMobileOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                categories={categories}
            />

            {/* Main Area */}
            <div className="flex-1 min-w-0 flex flex-col min-h-screen lg:ml-[260px]">
                
                {/* CMS Premium Header */}
                <ContentManagementHeader 
                    toggleSidebar={toggleSidebar} 
                    user={user} 
                    isNotificationDropdownOpen={isNotificationDropdownOpen}
                    setIsNotificationDropdownOpen={setIsNotificationDropdownOpen}
                    notifications={notifications}
                    handleRemoveNotification={handleRemoveNotification}
                />

                {/* Sub-body CMS Workspace */}
                <div className="flex-1 p-6 sm:p-8 space-y-8 bg-[#0B0F19]">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
