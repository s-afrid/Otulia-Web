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
