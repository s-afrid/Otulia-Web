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
import { FiAward } from 'react-icons/fi';

import carIcon from '../assets/icons/car_icon.png';
import estateIcon from '../assets/icons/estate_icon.png';
import yachtIcon from '../assets/icons/yacht_icon.png';

const ContentManagement = () => {
    const { token, user, loading } = useAuth();
    const navigate = useNavigate();
    
    // Layout states
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Core Categories State (Prepopulated with User's Image design records)
    const [categories, setCategories] = useState([
        { 
            id: 1, 
            title: 'Best Hypercars of 2026', 
            slug: 'best-hypercars-of-2026', 
            type: 'Cars', 
            shortDescription: 'Recognizing the most powerful, fastest and most innovative hypercars of 2026.', 
            detailedDescription: 'This category ranks the top 10 hypercars of 2026 based on performance, design, innovation, and overall impact in the automotive world.',
            categoryImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60', // Centenario Style
            bannerImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&auto=format&fit=crop&q=60',
            icon: carIcon,
            votingPeriodStart: '2026-01-01',
            votingPeriodEnd: '2026-06-30',
            nomineeLimit: 10,
            allowMultipleVotes: true,
            showInPopularLinks: true,
            displayOrder: 1,
            featuredCategory: true,
            categoryColor: '#6366F1',
            status: 'Active',
            votes: '12.4K'
        },
        { 
            id: 2, 
            title: 'Best Luxury SUVs of 2026', 
            slug: 'best-luxury-suvs-of-2026', 
            type: 'Cars', 
            shortDescription: 'The pinnacle of high-riding luxury and power.', 
            detailedDescription: 'Ranks the top luxury sport utility vehicles with a focus on interior refinement and raw engine performance.',
            categoryImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60', 
            bannerImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&auto=format&fit=crop&q=60',
            icon: carIcon,
            votingPeriodStart: '2026-01-01',
            votingPeriodEnd: '2026-06-30',
            nomineeLimit: 10,
            allowMultipleVotes: true,
            showInPopularLinks: false,
            displayOrder: 2,
            featuredCategory: false,
            categoryColor: '#8B5CF6',
            status: 'Active',
            votes: '8.7K'
        },
        { 
            id: 3, 
            title: 'Most Beautiful Villas 2026', 
            slug: 'most-beautiful-villas-2026', 
            type: 'Real Estate', 
            shortDescription: 'Stunning luxury estates across the globe.', 
            detailedDescription: 'Highlighting architectural masterpieces and high-profile luxury villas in premier locations.',
            categoryImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60', 
            bannerImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
            icon: estateIcon,
            votingPeriodStart: '2026-01-01',
            votingPeriodEnd: '2026-06-30',
            nomineeLimit: 10,
            allowMultipleVotes: false,
            showInPopularLinks: true,
            displayOrder: 3,
            featuredCategory: true,
            categoryColor: '#F59E0B',
            status: 'Active',
            votes: '6.3K'
        },
        { 
            id: 4, 
            title: 'Best Superyachts of 2026', 
            slug: 'best-superyachts-of-2026', 
            type: 'Yachts', 
            shortDescription: 'The ultimate maritime luxury vessels.', 
            detailedDescription: 'Exploring top-tier custom superyachts built for infinite luxury cruising.',
            categoryImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=60', 
            bannerImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=60',
            icon: yachtIcon,
            votingPeriodStart: '2026-01-01',
            votingPeriodEnd: '2026-06-30',
            nomineeLimit: 10,
            allowMultipleVotes: true,
            showInPopularLinks: true,
            displayOrder: 4,
            featuredCategory: true,
            categoryColor: '#06B6D4',
            status: 'Draft',
            votes: '4.8K'
        }
    ]);

    // Currently editing record state
    const [editingCategory, setEditingCategory] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Route Gate Guarding & Notifications Fetch
    useEffect(() => {
        if (!loading) {
            if (!token || !user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchNotifications();
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
    const handleSubmitCategory = (formData) => {
        if (editingCategory) {
            // Update
            setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
            setEditingCategory(null);
            alert('Ranking Category updated successfully!');
        } else {
            // Add new
            const newCategory = {
                id: Date.now(),
                ...formData,
                votes: '0'
            };
            setCategories(prev => [...prev, newCategory]);
            alert('New Ranking Category created successfully!');
        }
    };

    const handleEditTrigger = (category) => {
        setEditingCategory(category);
        // Scroll to form fields smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteTrigger = (id) => {
        if (confirm('Are you sure you want to delete this ranking category?')) {
            setCategories(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleAddNewTrigger = () => {
        setEditingCategory(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    {activeTab === 'dashboard' ? (
                        <RankingsDashboardTab 
                            onTabChange={setActiveTab} 
                            onCreateCategoryClick={() => {
                                setEditingCategory(null);
                                setActiveTab('categories');
                            }} 
                        />
                    ) : activeTab === 'categories' ? (
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
                    ) : (
                        <div className="bg-[#111726]/60 border border-[#1C253B] p-12 rounded-[2.5rem] text-center backdrop-blur-md">
                            <FiAward className="text-4xl text-[#D48D2A] mx-auto mb-4 animate-bounce" />
                            <h3 className="text-lg font-normal text-white canela tracking-wide capitalize">{activeTab.replace('-', ' ')} Component</h3>
                            <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto mt-2 leading-relaxed">
                                The {activeTab.replace('-', ' ')} management interface is under active deployment. Data is currently live-syncing to the ranking server.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
