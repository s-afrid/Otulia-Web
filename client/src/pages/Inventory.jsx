import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
    FiGrid, FiPackage, FiUsers, FiPieChart,
    FiGlobe, FiCreditCard, FiSettings, FiBell,
    FiArrowUpRight, FiTrendingUp, FiTrendingDown, FiDownload, FiHome, FiAnchor,
    FiMail, FiPhone, FiShield, FiLock, FiKey,
    FiBriefcase, FiCheckCircle, FiUpload, FiCalendar, FiMapPin,
    FiSearch, FiFilter, FiPlus, FiChevronDown, FiHeart, FiEdit2, FiTrash2, FiEye,
    FiUser, FiLogOut, FiClock, FiLoader, FiMoreVertical, FiActivity
} from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import Navbar from '../components/Navbar';
import AddAssetModal from '../components/inventory/AddAssetModal';
import ConfirmationModal from '../components/ConfirmationModal';
import DealerVerificationModal from '../components/inventory/DealerVerificationModal';
import ImageCropModal from '../components/ImageCropModal';
import numberWithCommas from '../modules/numberwithcomma';
import SEO from '../components/SEO';
import ContactModal from '../components/ContactModal';


const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture"
};

const Inventory = () => {
    const { token, user, refreshUser, updateUserLocal, logout, login } = useAuth();
    const navigate = useNavigate();

    // UI State
    const [activeTab, setActiveTab] = useState('inventory');
    const [timeframe, setTimeframe] = useState('Week');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [leadStatusFilter, setLeadStatusFilter] = useState('All Status');
    const [leadCategoryFilter, setLeadCategoryFilter] = useState('All Categories');
    const [inventoryStatusFilter, setInventoryStatusFilter] = useState('All Status');
    const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('All Categories');
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactType, setContactType] = useState('Sales');
    const [isVerifiedDealer, setIsVerifiedDealer] = useState(user?.isVerified || false);
    const [upgradePlan, setUpgradePlan] = useState(null); // 'Premium Basic' or 'Business VIP'
    const [logoLoading, setLogoLoading] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [cropSrc, setCropSrc] = useState(null);
    const [leadEmailNotifications, setLeadEmailNotifications] = useState(user?.leadEmailNotifications !== false);

    // Logic to allow editing for Premium users even after verification
    const canEditProfile = !isVerifiedDealer || (user?.plan === 'Premium Basic' || user?.plan === 'Business VIP');

    // Delete Confirmation State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [listingToDelete, setListingToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

    const handleRemoveNotification = async (notificationId) => {
        try {
            const response = await fetch(`/api/leads/notification/${notificationId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                // Remove from local state immediately for snappy feel
                setData(prev => ({
                    ...prev,
                    notifications: prev.notifications.filter(n => n._id !== notificationId)
                }));
            }
        } catch (error) {
            console.error("Remove Notification Error:", error);
        }
    };

    const handleStatusChange = async (id, newStatus, isActivity) => {
        try {
            const response = await fetch(`/api/leads/status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, isActivity })
            });

            if (response.ok) {
                // Refresh data to reflect change
                fetchDashboard();
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Status Update Error:", error);
            alert("Failed to update status.");
        }
    };

    useEffect(() => {
        if (user) {
            setIsVerifiedDealer(user.isVerified);
            // If verification is pending, we can optionally show a banner or status
        }
    }, [user]);

    const [companyInfo, setCompanyInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        logo: null,
        description: '',
        businessType: 'Luxury Cars & Supercars Dealer',
        establishedYear: '2019',
        social: {
            instagram: '',
            linkedin: '',
            facebook: '',
            youtube: ''
        }
    });

    const [agentInfo, setAgentInfo] = useState({
        photo: null,
        fullName: user?.name || '',
        jobTitle: 'Luxury Asset Consultant',
        email: user?.email || '',
        phone: '',
        whatsapp: '',
        preferredContact: 'WhatsApp',
        language: 'English',
        timezone: '(GMT+4) Dubai, UAE',
        description: '',
        social: {
            instagram: '',
            linkedin: '',
            x: '',
            facebook: ''
        }
    });

    useEffect(() => {
        fetchDashboard();
    }, [token]);

    const fetchDashboard = async () => {
        try {
            const response = await fetch('/api/inventory/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const resData = await response.json();
                setData(resData);
                if (resData.userProfile) {
                    // Sync latest verification status to global user context
                    if (updateUserLocal) {
                        updateUserLocal({
                            verificationStatus: resData.userProfile.verificationStatus,
                            isVerified: resData.userProfile.isVerified,
                            plan: resData.userProfile.plan
                        });
                    }

                    const comp = resData.userProfile.company || {};
                    setCompanyInfo({
                        name: comp.companyName || '',
                        email: resData.userProfile.email || '',
                        phone: resData.userProfile.phone || '',
                        address: comp.address || '',
                        website: comp.website || '',
                        logo: comp.companyLogo || null,
                        description: comp.description || ''
                    });
                    setLeadEmailNotifications(resData.userProfile.leadEmailNotifications !== false);
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!canEditProfile) {
            alert("Verified dealers cannot change their company logo. Please contact support for assistance.");
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setCropSrc(reader.result);
            setShowCropModal(true);
        });
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (blob) => {
        setLogoLoading(true);
        const formData = new FormData();
        formData.append('companyLogo', blob, 'company_logo.png');

        try {
            const response = await fetch('/api/auth/upload-company-logo', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                setCompanyInfo(prev => ({ ...prev, logo: result.companyLogo }));
                alert("Company logo updated successfully!");
                if (refreshUser) refreshUser();
                setShowCropModal(false);
            } else {
                const err = await response.json();
                alert(err.error || "Failed to upload logo");
            }
        } catch (error) {
            console.error("Logo upload error:", error);
            alert("Error uploading logo");
        } finally {
            setLogoLoading(false);
        }
    };

    const handleTogglePublic = async (item) => {
        if (updatingId) return; // Prevent multiple clicks
        
        setUpdatingId(item.id);
        const isCurrentPublic = item.status === 'Active';
        try {
            const response = await fetch('/api/inventory/toggle-visibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemId: item.id,
                    model: item.itemModel || item.category,
                    isPublic: !isCurrentPublic
                })
            });

            if (response.ok) {
                await fetchDashboard();
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to update visibility");
            }
        } catch (error) {
            console.error("Toggle Error:", error);
            alert("Connection error while updating visibility");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleToggleLeadNotifications = () => {
        setLeadEmailNotifications(!leadEmailNotifications);
    };

    const handleSaveSettings = async () => {
        if (isVerifiedDealer) {
            // Only website is editable if verified
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone: companyInfo.phone,
                    leadEmailNotifications: leadEmailNotifications,
                    company: {
                        companyName: companyInfo.name,
                        companyLogo: companyInfo.logo,
                        address: companyInfo.address,
                        website: companyInfo.website,
                        description: companyInfo.description
                    }
                })
            });

            if (response.ok) {
                alert("Settings saved successfully!");
                await fetchDashboard();
                if (refreshUser) refreshUser();
            } else {
                const err = await response.json();
                alert(err.error || "Failed to save settings");
            }
        } catch (error) {
            console.error("Save settings error:", error);
            alert("Error saving settings");
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSubmit = async (documents) => {
        try {
            const formData = new FormData();
            Object.keys(documents).forEach(key => {
                if (documents[key]) formData.append(key, documents[key]); // field name -> file
            });

            const response = await fetch('/api/auth/submit-verification', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const updatedUser = await response.json();
                alert('Verification documents submitted successfully! Status updated to Pending.');

                // Sync latest data
                await fetchDashboard();

                setIsVerificationModalOpen(false);
                setActiveTab('settings'); // Redirect to settings to see status
            } else {
                const data = await response.json();
                alert(`Failed to submit verification documents: ${data.details || data.error || 'Please try again.'}`);
            }
        } catch (error) {
            console.error("Verification Submit Error:", error);
            alert(`An error occurred: ${error.message}`);
        }
    };

    const handlePlanChange = (newPlan) => {
        setUpgradePlan(newPlan);
    };

    const confirmDelete = (id) => {
        setListingToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!listingToDelete) return;
        const id = listingToDelete;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/listings/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await fetchDashboard();
                setDeleteModalOpen(false);
            } else {
                const errData = await response.json();
                alert(errData.error || "Failed to delete listing");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Connection error while deleting");
        } finally {
            setIsDeleting(false);
            setListingToDelete(null);
        }
    };

    const handleExportCSV = () => {
        const leadsToExport = data?.leads;
        if (!leadsToExport || leadsToExport.length === 0) {
            alert("No leads available to export.");
            return;
        }

        const headers = ['Name', 'Email', 'Phone', 'Type', 'Inquiry/Subject', 'Status', 'Date Received'];
        const csvRows = leadsToExport.map(lead => {
            return [
                `"${(lead.name || '').replace(/"/g, '""')}"`,
                `"${(lead.email || '').replace(/"/g, '""')}"`,
                `"${(lead.phone || '').replace(/"/g, '""')}"`,
                `"${(lead.userType === 'Guest' ? lead.guestType || 'Guest' : lead.userType || 'Registered').replace(/"/g, '""')}"`,
                `"${(lead.type === 'General Inquiry' ? lead.subject || 'General Inquiry' : lead.inquiryType || 'Specific Listing').replace(/"/g, '""')}"`,
                `"${(lead.status || 'New').replace(/"/g, '""')}"`,
                `"${new Date(lead.createdAt).toLocaleDateString()}"`
            ].join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `otulia_leads_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return null;

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
        <div className="min-h-screen bg-[#F9FAFB] flex montserrat">
            <SEO title="Inventory Dashboard" description="Manage your dealership inventory and leads on Otulia." />
            <SEO title="Inventory Dashboard" description="Manage your dealership inventory and leads on Otulia." />


            {/* SIDEBAR */}
            <div className={`w-72 border-r flex flex-col fixed inset-y-0 z-50 transition-colors duration-300 bg-white border-gray-100`}>
                <div className="p-8 pb-10">
                    <img src="/logos/otulia_logo_black.png" alt="Otulia" className="h-[42px] cursor-pointer" onClick={() => navigate('/')} />
                </div>

                <nav className="flex-1 px-5 space-y-2 overflow-y-auto custom-scrollbar pb-8">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                                ? 'bg-[#FFF7ED] text-gray-900 border-l-[3px] border-[#D48D2A] shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className={`text-lg ${activeTab === item.id ? 'text-gray-900' : 'text-gray-400'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="px-6 pb-6 mt-auto">
                    {/* User Profile Snippet */}
                    <div 
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors mb-4 relative"
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <img src={user?.profilePicture || '/assets/user.png'} className="w-10 h-10 rounded-full border border-gray-200 shrink-0" alt="Profile" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Md Riyaz'}</p>
                                <p className="text-[10px] text-gray-400 font-medium truncate">{user?.plan || 'Premium Basic Plan'}</p>
                            </div>
                        </div>
                        <FiChevronDown className="text-gray-400 text-sm shrink-0" />

                        {/* Profile Dropdown positioned above */}
                        {isProfileDropdownOpen && (
                            <div className="absolute left-0 bottom-full mb-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                                <div className="py-1">
                                    <button onClick={(e) => { e.stopPropagation(); navigate('/profile'); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2">
                                        <FiUser className="text-lg" /> Profile Settings
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); logout(); navigate('/login'); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <FiLogOut className="text-lg" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Premium Card */}
                    <div className="bg-[#FFF8F0] border border-[#F2E8DB] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#FFF4E5] transition-colors mb-6 shadow-sm" onClick={() => setActiveTab('subscription')}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D48D2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#D48D2A]">Premium Member</p>
                                <p className="text-[9px] font-medium text-gray-500">Access exclusive features</p>
                            </div>
                        </div>
                        <FiChevronDown className="text-[#D48D2A] text-sm -rotate-90" />
                    </div>

                    <p className="text-[10px] text-gray-400 font-bold tracking-wider leading-relaxed px-2">
                        © 2026 OTULIA <br /> All rights reserved.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            {/* MAIN CONTENT AREA */}
            <div className={`flex-1 ml-72 transition-colors duration-300 bg-[#F9FAFB]`}>

                {/* TOP HEADER BAR */}
                <header className={`h-20 border-b flex items-center justify-between px-8 sticky top-0 z-[40] transition-colors duration-300 bg-white border-gray-100`}>
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {activeTab === 'settings' ? 'Profile & Company Settings' : navItems.find(n => n.id === activeTab)?.label}
                            {activeTab === 'inventory' && (
                                <span className="text-sm font-medium text-gray-400">
                                    ({data?.inventory?.length || 0}/{user?.plan === 'Business VIP' ? 50 : user?.plan === 'Premium Basic' ? 25 : 5} used)
                                </span>
                            )}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {activeTab === 'dashboard' && (
                            <>
                                {/* Last 30 Days Dropdown */}
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-gray-600 focus:outline-none focus:border-[#D48D2A] cursor-pointer">
                                        <option>Last 30 days</option>
                                        <option>Last 7 days</option>
                                        <option>Last 90 days</option>
                                        <option>This year</option>
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
                                </div>

                                {/* Day/Week/Month Tabs */}
                                <div className="flex items-center rounded-lg bg-gray-50 p-1">
                                    {['Day', 'Week', 'Month'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTimeframe(t)}
                                            className={`px-5 py-2 text-sm font-semibold transition-all rounded-md ${timeframe === t
                                                ? 'bg-[#D48D2A] text-white shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Icons Section */}
                        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all focus:outline-none"
                                >
                                    <FiBell className="text-gray-400 text-lg" />
                                    {data?.notifications?.length > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] text-white font-bold flex items-center justify-center">
                                            {data.notifications.length}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {isNotificationDropdownOpen && (
                                    <div
                                        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]"
                                        onMouseLeave={() => setIsNotificationDropdownOpen(false)}
                                    >
                                        <div className="px-4 pb-2 border-b border-gray-50 flex justify-between items-center">
                                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Recent Notifications</h4>
                                            <span className="text-[10px] font-bold text-[#D48D2A]">{data?.notifications?.length || 0} New</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                            {(!data?.notifications || data.notifications.length === 0) ? (
                                                <div className="py-8 px-4 text-center">
                                                    <FiBell className="mx-auto text-gray-200 text-3xl mb-2" />
                                                    <p className="text-xs text-gray-400 font-medium">No new lead notifications</p>
                                                </div>
                                            ) : (
                                                data.notifications.map((notif) => (
                                                    <div
                                                        key={notif._id}
                                                        onClick={() => {
                                                            handleRemoveNotification(notif._id);
                                                            if (notif.targetTab) {
                                                                setActiveTab(notif.targetTab);
                                                            } else {
                                                                setActiveTab(notif.type === 'LEAD' ? 'leads' : 'dashboard');
                                                            }
                                                            setIsNotificationDropdownOpen(false);
                                                        }}
                                                        className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors group relative"
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                                                <FiUsers className="text-sm" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-900 leading-tight mb-1">{notif.message}</p>
                                                                <p className="text-[10px] text-gray-400 font-medium">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Click to view</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveNotification(notif._id);
                                                            }}
                                                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded text-gray-300 transition-all"
                                                        >
                                                            <FiTrash2 className="text-xs" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {data?.notifications?.length > 0 && (
                                            <div className="px-4 pt-2 text-center">
                                                <button
                                                    onClick={() => {
                                                        setActiveTab('leads');
                                                        setIsNotificationDropdownOpen(false);
                                                    }}
                                                    className="text-[10px] font-bold text-gray-400 hover:text-[#D48D2A] uppercase tracking-widest transition-colors"
                                                >
                                                    View Lead Management
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* User Profile Section */}
                        <div className="relative border-l border-gray-200 pl-4">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 200)}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
                            >
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{user?.name || 'Prestige Motors'}</p>
                                    <p className="text-xs text-gray-400 font-medium">{user?.plan || 'Professional'} Plan</p>
                                </div>
                                <img src={user?.profilePicture || '/assets/user.png'} className="w-10 h-10 rounded-full border border-gray-200" alt="Profile" />
                                <FiChevronDown className={`text-gray-400 text-sm transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-sm font-bold text-gray-900">{user?.name || 'Prestige Motors'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email || 'contact@prestigemotors.com'}</p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                        >
                                            <FiUser className="text-lg" /> My Profile
                                        </button>
                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={() => navigate('/admin')}
                                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                            >
                                                <FiShield className="text-lg" /> Admin Dashboard
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setActiveTab('subscription')}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                        >
                                            <FiCreditCard className="text-lg" /> Subscription
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('settings')}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                        >
                                            <FiSettings className="text-lg" /> Settings
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-50 py-1">
                                        <button
                                            onClick={() => {
                                                logout();
                                                navigate('/login');
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                        >
                                            <FiLogOut className="text-lg" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* TAB CONTENT */}
                <main className="p-10 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">

                    {/* DASHBOARD TAB */}
                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
                                <p className="text-gray-500 font-medium text-sm">Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</p>
                            </div>

                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                <AnalyticsCard
                                    title="Total Views"
                                    value={numberWithCommas(data.stats.totalViews)}
                                    growth="+12.5%"
                                    icon={<FiEye />}
                                    iconBgClass="bg-[#FFF4E5] text-[#D48D2A]"
                                    chartColor="#D48D2A"
                                    data={[{value:10},{value:15},{value:8},{value:20},{value:25},{value:22},{value:30}]}
                                />
                                <AnalyticsCard
                                    title="Total Leads"
                                    value={numberWithCommas(data.stats.totalLeads)}
                                    growth="+8.2%"
                                    icon={<FiUsers />}
                                    iconBgClass="bg-blue-50 text-blue-600"
                                    chartColor="#3B82F6"
                                    data={[{value:5},{value:8},{value:7},{value:15},{value:12},{value:18},{value:20}]}
                                />
                                <AnalyticsCard
                                    title="Saved / Shortlisted"
                                    value={numberWithCommas(data.stats.savedCount || 0)}
                                    growth="+5.1%"
                                    icon={<FiHeart />}
                                    iconBgClass="bg-emerald-50 text-emerald-600"
                                    chartColor="#10B981"
                                    data={[{value:20},{value:18},{value:22},{value:25},{value:22},{value:28},{value:30}]}
                                />
                                <AnalyticsCard
                                    title="Est. Lead Value"
                                    value={`$${numberWithCommas(data.stats.estLeadValue || 0)}`}
                                    growth="-2.4%"
                                    icon={<FiTrendingDown />}
                                    iconBgClass="bg-purple-50 text-purple-600"
                                    chartColor="#8B5CF6"
                                    data={[{value:30},{value:28},{value:25},{value:22},{value:20},{value:18},{value:15}]}
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Views vs Leads Line Chart */}
                                <div className="lg:col-span-2 bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-lg font-bold text-gray-900">Views vs Leads Over Time</h4>
                                        <select className="border border-gray-200 text-xs font-bold text-gray-600 rounded-lg px-3 py-1 outline-none">
                                            <option>Week</option>
                                            <option>Month</option>
                                        </select>
                                    </div>
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data.analytics?.performanceTrend || []} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} dx={-10} />
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }} />
                                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                                                <Line type="monotone" dataKey="views" name="Views" stroke="#D48D2A" strokeWidth={3} dot={{ r: 4, fill: '#D48D2A', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                                <Line type="monotone" dataKey="leads" name="Leads" stroke="#1E3A8A" strokeWidth={3} dot={{ r: 4, fill: '#1E3A8A', strokeWidth: 2, stroke: '#fff' }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Leads by Asset Category Donut Chart */}
                                <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Leads by Asset Category</h4>
                                    <div className="h-64 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={data.analytics?.leadsByCategory || [{label:'Cars',count:1}]}
                                                    cx="50%" cy="50%"
                                                    innerRadius={60} outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="count"
                                                    nameKey="label"
                                                >
                                                    {(data.analytics?.leadsByCategory || [{label:'Cars',count:1}]).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={['#D48D2A', '#1E3A8A', '#10B981', '#8B5CF6'][index % 4]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }} />
                                                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '24px' }} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-[80px]">
                                            <span className="text-2xl font-bold text-gray-900">{data.stats.totalLeads || 0}</span>
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest text-center mt-1">Total<br/>Leads</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
                                {/* Top Performing Assets */}
                                <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-lg font-bold text-gray-900">Top Performing Assets</h4>
                                    </div>
                                    <div className="overflow-y-auto custom-scrollbar flex-1 -mx-6 px-6">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset</th>
                                                    <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Views</th>
                                                    <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Change</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(data.topAssets || []).slice(0, 4).length > 0 ? (data.topAssets || []).slice(0, 4).map((asset, i) => (
                                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                                        <td className="py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                                    <img src={(asset.images && asset.images[0]) || '/assets/placeholder.jpg'} className="w-full h-full object-cover" alt="" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-900 truncate max-w-[120px]">{asset.name}</p>
                                                                    <p className="text-[9px] text-[#D48D2A] uppercase font-bold tracking-widest">{asset.category?.replace('Asset', '') || 'Cars'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <span className="text-xs font-bold text-gray-600">{numberWithCommas(asset.views || 0)}</span>
                                                        </td>
                                                        <td className="py-3 text-right">
                                                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+12%</span>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="3" className="py-8 text-center text-xs text-gray-400 font-medium">No assets performing yet.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Leads Source */}
                                <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <h4 className="text-lg font-bold text-gray-900 mb-6">Leads Source</h4>
                                    <div className="h-48 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[{name:'Website', value:45},{name:'Instagram', value:25},{name:'WhatsApp', value:20},{name:'Others', value:10}]}
                                                    cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                                                    paddingAngle={2} dataKey="value" stroke="none"
                                                >
                                                    <Cell fill="#D48D2A" />
                                                    <Cell fill="#E91E63" />
                                                    <Cell fill="#25D366" />
                                                    <Cell fill="#9CA3AF" />
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }} />
                                                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '24px' }} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Assets Overview */}
                                <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                                    <h4 className="text-lg font-bold text-gray-900 mb-4">Assets Overview</h4>
                                    <div className="grid grid-cols-2 gap-4 flex-1">
                                        <div className="bg-[#FFF8F0] rounded-xl p-4 flex flex-col justify-center items-center text-center">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1 tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-[#D48D2A]"></div> Total</span>
                                            <span className="text-2xl font-bold text-gray-900">{data.stats.totalAssets || 0}</span>
                                        </div>
                                        <div className="bg-emerald-50/50 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1 tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Live</span>
                                            <span className="text-2xl font-bold text-gray-900">{data.stats.activeAssetsCount || 0}</span>
                                        </div>
                                        <div className="bg-gray-50/80 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1 tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Drafts</span>
                                            <span className="text-2xl font-bold text-gray-900">0</span>
                                        </div>
                                        <div className="bg-blue-50/50 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1 tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Sold</span>
                                            <span className="text-2xl font-bold text-gray-900">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INVENTORY TAB */}
                    {activeTab === 'inventory' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            {/* Control Bar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6">
                                <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
                                    <div className="relative flex-1 md:max-w-xs">
                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Search assets..." className="w-full bg-gray-50 border border-transparent rounded-[1.25rem] py-3 pl-11 pr-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-[#D48D2A] focus:ring-0 transition-all outline-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={inventoryCategoryFilter}
                                            onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                                            className="appearance-none bg-gray-50 border border-transparent rounded-[1.25rem] py-3 pl-5 pr-10 text-sm font-bold text-gray-600 focus:bg-white focus:border-[#D48D2A] cursor-pointer outline-none transition-all"
                                        >
                                            <option>All Categories</option>
                                            <option>Cars</option>
                                            <option>Yachts</option>
                                            <option>Real Estate</option>
                                            <option>Bikes</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={inventoryStatusFilter}
                                            onChange={(e) => setInventoryStatusFilter(e.target.value)}
                                            className="appearance-none bg-gray-50 border border-transparent rounded-[1.25rem] py-3 pl-5 pr-10 text-sm font-bold text-gray-600 focus:bg-white focus:border-[#D48D2A] cursor-pointer outline-none transition-all"
                                        >
                                            <option>All Status</option>
                                            <option>Active</option>
                                            <option>Draft</option>
                                            <option>Sold</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const limit = user?.plan === 'Business VIP' ? 50 : user?.plan === 'Premium Basic' ? 25 : 5;
                                        if (isVerifiedDealer) {
                                            if ((data?.inventory?.length || 0) >= limit) {
                                                alert(`You have reached your limit of ${limit} listings. Please upgrade your plan.`);
                                                return;
                                            }
                                            setIsAddModalOpen(true);
                                        } else {
                                            if (user?.verificationStatus === 'Pending') {
                                                alert("Your dealer verification is currently pending approval. You will be notified once approved.");
                                            } else if (user?.verificationStatus === 'Rejected') {
                                                alert("Your previous verification documents were rejected. Please re-submit valid documents.");
                                                setIsVerificationModalOpen(true);
                                            } else {
                                                alert("Please complete dealer verification to start listing assets.");
                                                setIsVerificationModalOpen(true);
                                            }
                                        }
                                    }}
                                    className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap ${isVerifiedDealer
                                        ? 'bg-gray-900 text-white hover:bg-black shadow-[0_2px_10px_rgba(0,0,0,0.1)]'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                                        }`}
                                >
                                    <FiPlus className="text-base" /> Add New Asset
                                    {!isVerifiedDealer && <FiLock className="text-xs ml-1" />}
                                </button>
                            </div>

                            {/* Asset Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {data.inventory.filter(item => {
                                    const matchesCategory = inventoryCategoryFilter === 'All Categories' ||
                                        ((item.category === 'CarAsset' || item.category === 'vehicles') && inventoryCategoryFilter === 'Cars') ||
                                        ((item.category === 'YachtAsset' || item.category === 'yachts') && inventoryCategoryFilter === 'Yachts') ||
                                        ((item.category === 'EstateAsset' || item.category === 'estates') && inventoryCategoryFilter === 'Real Estate') ||
                                        ((item.category === 'BikeAsset' || item.category === 'bikes') && inventoryCategoryFilter === 'Bikes');

                                    const matchesStatus = inventoryStatusFilter === 'All Status' ||
                                        (inventoryStatusFilter === 'Active' && item.status === 'Active') ||
                                        item.status === inventoryStatusFilter;

                                    return matchesCategory && matchesStatus;
                                }).map((item) => {
                                    const categoryName = (item.category === 'CarAsset' || item.category === 'vehicles') ? 'CARS' :
                                        (item.category === 'YachtAsset' || item.category === 'yachts') ? 'YACHTS' :
                                        (item.category === 'BikeAsset' || item.category === 'bikes') ? 'BIKES' :
                                            (item.category === 'EstateAsset' || item.category === 'estates') ? 'REAL ESTATE' :
                                                item.category?.replace('Asset', 'S')?.toUpperCase() || 'ASSET';

                                    return (
                                        <div key={item.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden group hover:border-[#D48D2A]/30 transition-all flex flex-col">
                                            {/* Card Image Header */}
                                            <div className="relative h-48 bg-gray-100 w-full overflow-hidden">
                                                <img src={item.images?.[0] || '/assets/placeholder.jpg'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">{item.type || 'SALE'}</span>
                                                </div>
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-900 hover:bg-white transition-colors shadow-sm">
                                                        <FiMoreVertical className="text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Card Body */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <p className="text-[10px] text-[#D48D2A] uppercase font-black tracking-widest mb-1">{categoryName}</p>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate font-playfair">{item.title}</h3>
                                                <div className="flex justify-between items-end mb-5">
                                                    <p className="text-xl font-black text-gray-900">${numberWithCommas(item.price)}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Value</p>
                                                </div>
                                                
                                                <div className="border-t border-gray-100/80 py-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full shadow-inner">
                                                        <div className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                                                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{item.status === 'Active' ? 'Live' : item.status}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-gray-400 text-xs font-bold">
                                                        <span className="flex items-center gap-1.5"><FiEye className="text-[#D48D2A]" /> {item.views || 0}</span>
                                                        <span className="flex items-center gap-1.5"><FiUsers className="text-[#D48D2A]" /> {item.leads || 0}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="border-t border-gray-100/80 py-4 flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                                                        Public <FiActivity className="inline text-gray-400 ml-0.5" />
                                                    </div>
                                                    <div
                                                        onClick={() => handleTogglePublic(item)}
                                                        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${item.status === 'Active' ? 'bg-emerald-500 border border-emerald-600' : 'bg-gray-200 border border-gray-300'}`}
                                                    >
                                                        {updatingId === item.id ? (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            </div>
                                                        ) : (
                                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${item.status === 'Active' ? 'left-6' : 'left-0.5'}`}></div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-100/80 pt-4 flex items-center justify-between gap-4">
                                                    <button onClick={() => { setEditingItem(item); setIsAddModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors py-2 bg-gray-50 hover:bg-gray-100 rounded-xl">
                                                        <FiEdit2 /> Edit
                                                    </button>
                                                    <button onClick={() => confirmDelete(item.id)} className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors py-2 bg-gray-50 hover:bg-red-50 rounded-xl">
                                                        <FiTrash2 /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination (Visual Only) */}
                            <div className="flex justify-center items-center py-8 mt-8 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-900 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-200 font-bold transition-colors">1</button>
                                    <span className="text-gray-400 font-bold px-2">...</span>
                                    <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm border border-transparent font-bold transition-all">6</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LEADS TAB */}
                    {activeTab === 'leads' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
                            {/* Lead Control Bar */}
                            <div className="flex justify-between items-center bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6">
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <select
                                            value={leadStatusFilter}
                                            onChange={(e) => setLeadStatusFilter(e.target.value)}
                                            className="appearance-none bg-gray-50 border border-transparent rounded-[1.25rem] py-2.5 pl-5 pr-10 text-sm font-bold text-gray-600 focus:bg-white focus:border-[#D48D2A] cursor-pointer min-w-[140px] outline-none transition-all shadow-inner"
                                        >
                                            <option>All Status</option>
                                            <option>New</option>
                                            <option>Contacted</option>
                                            <option>Negotiating</option>
                                            <option>Closed</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={leadCategoryFilter}
                                            onChange={(e) => setLeadCategoryFilter(e.target.value)}
                                            className="appearance-none bg-gray-50 border border-transparent rounded-[1.25rem] py-2.5 pl-5 pr-10 text-sm font-bold text-gray-600 focus:bg-white focus:border-[#D48D2A] cursor-pointer min-w-[160px] outline-none transition-all shadow-inner"
                                        >
                                            <option>All Categories</option>
                                            <option>Cars</option>
                                            <option>Yachts</option>
                                            <option>Real Estate</option>
                                            <option>Bikes</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <button
                                    onClick={handleExportCSV}
                                    className="px-6 py-2.5 rounded-[1.25rem] border border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2 text-sm font-bold shadow-sm transition-all text-gray-700"
                                >
                                    <FiDownload className="text-gray-400" /> Export as CSV
                                </button>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100/80">
                                            <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">Buyer</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">Asset</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">Message</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">Date</th>
                                            <th className="px-4 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 text-center">Status</th>
                                            <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 text-right">Contact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.leads
                                            .filter(lead => {
                                                const matchesStatus = leadStatusFilter === 'All Status' || lead.status === leadStatusFilter;
                                                const cat = lead.category?.replace('Asset', 's') || 'General';
                                                const matchesCategory = leadCategoryFilter === 'All Categories' || cat.toLowerCase().includes(leadCategoryFilter.toLowerCase().replace(' ', ''));
                                                return matchesStatus && matchesCategory;
                                            })
                                            .map((lead) => (
                                                <tr key={lead.id} className="hover:bg-gray-50/50 transition-all group">
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <img
                                                                    src={lead.buyerPhoto || '/assets/user.png'}
                                                                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                                                                    alt="Buyer"
                                                                    onError={(e) => e.target.src = '/assets/user.png'}
                                                                />
                                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 mb-0.5">{lead.buyerName}</p>
                                                                {user.plan === 'Business VIP' ? (
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[11px] text-gray-500 font-medium">{lead.customerContact}</span>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-[10px] text-gray-400 font-bold italic mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">Contact Hidden (VIP Only)</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <p className="text-sm font-bold text-gray-900 mb-2 truncate max-w-[200px] font-playfair">{lead.assetName}</p>
                                                        <span className="px-3 py-1 bg-[#FFF8F0] text-[#D48D2A] rounded border border-[#D48D2A]/20 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#D48D2A]"></div>
                                                            {lead.category === 'CarAsset' ? 'CARS' : lead.category === 'YachtAsset' ? 'YACHTS' : lead.category === 'EstateAsset' ? 'REAL ESTATE' : lead.category?.replace('Asset', 'S')?.toUpperCase() || 'GENERAL'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <p className="text-sm font-bold text-gray-500 line-clamp-2 max-w-[250px] leading-relaxed">{lead.message}</p>
                                                    </td>
                                                    <td className="px-6 py-6 text-sm text-gray-500 font-bold shrink-0 font-mono tracking-tight">
                                                        {new Date(lead.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-4 py-6 text-center">
                                                        <div className="relative inline-block">
                                                            <select
                                                                value={lead.status || 'New'}
                                                                onChange={(e) => handleStatusChange(lead.id, e.target.value, lead.isActivity)}
                                                                className={`appearance-none pl-4 pr-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none border transition-all ${lead.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' :
                                                                    lead.status === 'Contacted' ? 'bg-[#FFF8F0] text-[#D48D2A] border-[#D48D2A]/20 hover:bg-[#FFF0E0]' :
                                                                        lead.status === 'Negotiating' ? 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100' :
                                                                            lead.status === 'Closed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' :
                                                                                'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                                                    }`}
                                                            >
                                                                <option value="New">NEW</option>
                                                                <option value="Contacted">CONTACTED</option>
                                                                <option value="Negotiating">NEGOTIATING</option>
                                                                <option value="Closed">CLOSED</option>
                                                            </select>
                                                            <FiChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs ${lead.status === 'New' ? 'text-blue-400' : lead.status === 'Contacted' ? 'text-[#D48D2A]/60' : lead.status === 'Negotiating' ? 'text-purple-400' : lead.status === 'Closed' ? 'text-emerald-400' : 'text-gray-400'}`} />
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {user.plan === 'Business VIP' ? (
                                                                <>
                                                                    <a
                                                                        href={`mailto:${lead.customerContact}`}
                                                                        className="px-4 py-2 bg-gray-900 text-white hover:bg-black rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
                                                                        title="Reply via Email"
                                                                    >
                                                                        <FiMail className="text-sm" /> Reply
                                                                    </a>
                                                                    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 ml-1">
                                                                        <FiMoreVertical />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    disabled
                                                                    className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl text-xs font-bold flex items-center gap-2 cursor-not-allowed border border-gray-200"
                                                                    title="Upgrade to Business VIP to Contact"
                                                                >
                                                                    <FiLock className="text-sm" /> Unlock
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ANALYTICS TAB */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-10 animate-in fade-in duration-700">

                            {/* Analytics KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                <AnalyticsCard title="Total Views" value={numberWithCommas(data.stats.totalViews)} growth="+18.2%" icon={<FiEye />} />
                                <AnalyticsCard title="Total Leads" value={data.stats.totalLeads} growth="+12.5%" icon={<FiUsers />} />
                                <AnalyticsCard title="Conversion Rate" value={`${data.stats.avgConversion}%`} growth="+0.3%" icon={<FiTrendingUp />} />
                                <AnalyticsCard title="Avg Lead Value" value="$12,426" growth="+5.8%" icon={<FiCreditCard />} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Performance Trend Line Chart */}
                                <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                    <h4 className="text-xl font-bold text-gray-900 mb-10 font-playfair">Performance Trend</h4>
                                    <div className="h-64 relative border-b border-l border-gray-100 mb-8 pt-4">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                            {[16000, 12000, 8000, 4000, 0].map(val => (
                                                <div key={val} className="w-full border-t border-gray-50 flex items-center">
                                                    <span className="text-[10px] text-gray-300 font-bold -ml-10 w-8 text-right">{val}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* SVG Chart */}
                                        {/* SVG Chart */}
                                        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            {(() => {
                                                const trend = data.analytics?.performanceTrend || [];
                                                const maxVal = Math.max(...trend.map(t => Math.max(t.views, t.leads)), 100);

                                                // Calculate points
                                                const getPoints = (key) => trend.map((t, i) => {
                                                    const x = i * 33.33;
                                                    const y = 100 - ((t[key] / maxVal) * 80); // Leave some headroom
                                                    return `${x},${y}`;
                                                });

                                                const viewsPoints = getPoints('views');
                                                const leadsPoints = getPoints('leads');
                                                const viewsPath = `M${viewsPoints.join(' L')}`;
                                                const leadsPath = `M${leadsPoints.join(' L')}`;

                                                return (
                                                    <>
                                                        {/* Views Line (Orange) */}
                                                        <path d={viewsPath} fill="none" stroke="#D48D2A" strokeWidth="2" strokeLinecap="round" />
                                                        {viewsPoints.map((p, i) => {
                                                            const [cx, cy] = p.split(',');
                                                            return <circle key={`v-${i}`} cx={cx} cy={cy} r="1.5" fill="#D48D2A" />;
                                                        })}

                                                        {/* Leads Line (Blue) */}
                                                        <path d={leadsPath} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                                                        {leadsPoints.map((p, i) => {
                                                            const [cx, cy] = p.split(',');
                                                            return <circle key={`l-${i}`} cx={cx} cy={cy} r="1.5" fill="#3B82F6" />;
                                                        })}
                                                    </>
                                                );
                                            })()}
                                        </svg>
                                    </div>
                                    <div className="flex justify-between px-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-10">
                                        <span>Week 1</span>
                                        <span>Week 2</span>
                                        <span>Week 3</span>
                                        <span>Week 4</span>
                                    </div>
                                    <div className="flex justify-center gap-10">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2.5 h-2.5 rounded-full border-2 border-[#D48D2A] bg-white"></div>
                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">views</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 bg-white"></div>
                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">leads</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Leads by Location Horizontal Bars */}
                                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                    <h4 className="text-xl font-bold text-gray-900 mb-10 font-playfair">Leads by Location</h4>
                                    <div className="space-y-8">
                                        {(data.analytics?.leadsByLocation || [
                                            { country: 'United States', count: 0 },
                                            { country: 'United Kingdom', count: 0 },
                                            { country: 'UAE', count: 0 },
                                            { country: 'France', count: 0 },
                                            { country: 'Germany', count: 0 }
                                        ]).map((loc) => {
                                            const maxLocCount = Math.max(10, ...(data.analytics?.leadsByLocation || []).map(l => l.count));
                                            return (
                                                <div key={loc.country} className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{loc.country}</span>
                                                        <span className="text-xs font-black text-gray-900">{loc.count || 0}</span>
                                                    </div>
                                                    <div className="w-full h-10 bg-gray-50/50 rounded-lg overflow-hidden flex items-center pr-2">
                                                        <div
                                                            className="h-full bg-[#D48D2A] rounded-lg transition-all duration-1000 ease-out"
                                                            style={{ width: `${maxLocCount > 0 ? (loc.count / maxLocCount) * 100 : 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between mt-6 px-1 opacity-20 text-[9px] font-black text-gray-400">
                                        <span>0</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Asset Performance Table */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-10 py-8 border-b border-gray-50">
                                    <h4 className="text-xl font-bold text-gray-900 font-playfair">Asset Performance</h4>
                                </div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/30">
                                            <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset Name</th>
                                            <th className="px-4 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Views</th>
                                            <th className="px-4 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leads</th>
                                            <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {(data.topAssets || []).map((asset, i) => (
                                            <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-10 py-6 text-sm font-bold text-gray-800">{asset.name}</td>
                                                <td className="px-4 py-6 text-sm font-medium text-gray-600">{numberWithCommas(asset.views)}</td>
                                                <td className="px-4 py-6 text-sm font-medium text-gray-600">{asset.leads}</td>
                                                <td className={`px-10 py-6 text-xs font-bold ${asset.color || 'text-gray-400'} flex items-center gap-1.5`}>
                                                    {asset.trend === 'Up' ? '↑ Up' : asset.trend === 'Down' ? '↓ Down' : '— Stable'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>



                        </div>
                    )}

                    {/* PUBLIC MARKETPLACE TAB */}
                    {activeTab === 'marketplace' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">

                            {/* Visibility Controls */}
                            <section>
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 font-playfair mb-2">Visibility Controls</h3>
                                    <p className="text-sm text-gray-400">Manage which assets appear on your public marketplace profile.</p>
                                </div>
                                <div className="space-y-4">
                                    {data.inventory.map((item) => (
                                        <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#D48D2A] transition-all duration-300">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                                                    <img src={item.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-gray-900 mb-1">{item.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-tight">
                                                        <span className="flex items-center gap-1.5">
                                                            {item.category === 'EstateAsset' ? <FiHome /> : item.category === 'YachtAsset' ? <FiAnchor /> : <FiPackage />}
                                                            {item.category === 'CarAsset' ? 'Cars' : item.category === 'YachtAsset' ? 'Yachts' : item.category === 'EstateAsset' ? 'Real Estate' : item.category?.replace('Asset', 's')}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                        <span>${numberWithCommas(item.price)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    {item.status === 'Active' ? 'Public' : 'Private'}
                                                </span>
                                                <div
                                                    onClick={() => handleTogglePublic(item)}
                                                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${updatingId === item.id ? 'opacity-50 cursor-not-allowed' : ''} ${item.status === 'Active' ? 'bg-[#D48D2A]' : 'bg-gray-200'}`}
                                                >
                                                    {updatingId === item.id ? (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        </div>
                                                    ) : (
                                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${item.status === 'Active' ? 'left-7' : 'left-1'}`}></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Public Preview */}
                            <section className="pt-8 border-t border-gray-100">
                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-gray-900 font-playfair mb-2">Public Preview</h3>
                                    <p className="text-sm text-gray-400">This is how your listings appear to potential buyers on the marketplace.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {data.inventory.filter(i => i.status === 'Active').map((item) => (
                                        <div key={item.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
                                            {/* Preview Image Area */}
                                            <div className="h-64 bg-gray-50 relative overflow-hidden">
                                                <div className="absolute top-6 left-6 z-10">
                                                    <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-gray-900 uppercase tracking-tighter shadow-sm">
                                                        {item.category === 'CarAsset' ? 'Cars' : item.category === 'YachtAsset' ? 'Yachts' : item.category === 'EstateAsset' ? 'Real Estate' : item.category?.replace('Asset', 's')}
                                                    </span>
                                                </div>
                                                <img src={item.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                            {/* Preview Content Area */}
                                            <div className="p-8">
                                                <h4 className="text-base font-bold text-gray-900 mb-3 truncate group-hover:text-[#D48D2A] transition-colors font-playfair">{item.title}</h4>
                                                <p className="text-2xl font-black text-[#D48D2A] mb-8 italic">${numberWithCommas(item.price)}</p>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <FiEye className="text-sm" />
                                                        <span className="text-[11px] font-bold">{numberWithCommas(item.views || 0)}</span>
                                                    </div>
                                                    <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                        Available
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    )}
                                {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 font-playfair">Agent Settings</h2>
                                <p className="text-sm text-gray-500 mt-1">Complete your personal and business details to build trust and attract more leads.</p>
                            </div>

                            {/* Alert Banner */}
                            {!isVerifiedDealer && (
                                <div className="bg-[#FFF8F0] border border-[#F2E8DB] rounded-[1.5rem] p-6 flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="w-6 h-6 rounded-full border-2 border-[#D48D2A] text-[#D48D2A] flex items-center justify-center font-bold text-sm">!</div>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 font-bold mb-1">Complete both sections to get verified and start receiving high-quality leads.</h4>
                                        <p className="text-gray-500 text-sm">Verified profiles get 3x more visibility and priority in lead distribution.</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {/* CARD 1: Personal Details */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-10 flex flex-col">
                                    <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">1</div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 font-playfair">Your Personal (Agent) Details</h3>
                                                <p className="text-xs text-gray-400 mt-1">This information will be visible to clients and used for communication.</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 whitespace-nowrap">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Verified
                                        </span>
                                    </div>

                                    <div className="space-y-6 flex-1">
                                        {/* Photo Upload Row */}
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Profile Photo</p>
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
                                                    {agentInfo.photo ? <img src={agentInfo.photo} className="w-full h-full object-cover" /> : <img src="/agent-placeholder.png" alt="" onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML = '<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" class="text-3xl text-gray-300" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' }} />}
                                                </div>
                                                <div>
                                                    <button className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 mb-2 transition-colors">
                                                        <FiUpload className="text-gray-400" /> Upload Photo
                                                    </button>
                                                    <p className="text-[10px] text-gray-400 font-medium tracking-wide">JPG, PNG up to 5MB</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <SettingsInputField label="Full Name" value={agentInfo.fullName} onChange={e => setAgentInfo({...agentInfo, fullName: e.target.value})} />
                                            <SettingsInputField label="Job Title / Role" value={agentInfo.jobTitle} onChange={e => setAgentInfo({...agentInfo, jobTitle: e.target.value})} />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-6">
                                            <SettingsInputField label="Email Address" value={agentInfo.email} onChange={e => setAgentInfo({...agentInfo, email: e.target.value})} />
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Phone Number</label>
                                                <div className="flex gap-2">
                                                    <button className="flex items-center justify-center gap-1 w-20 bg-gray-50/50 rounded-[1.25rem] text-sm font-bold text-gray-900 border border-gray-100 hover:border-gray-200 transition-all shadow-sm"><span className="text-lg">🇦🇪</span> <FiChevronDown className="text-gray-400 text-xs"/></button>
                                                    <input type="text" value="+971 50 123 4567" readOnly className="flex-1 border border-gray-100 rounded-[1.25rem] px-5 py-3.5 text-sm font-bold bg-white shadow-sm text-gray-900 focus:outline-none focus:border-[#D48D2A] transition-all w-full" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">WhatsApp Number</label>
                                                <div className="flex gap-2">
                                                    <button className="flex items-center justify-center gap-1 w-20 bg-gray-50/50 rounded-[1.25rem] text-sm font-bold text-gray-900 border border-gray-100 hover:border-gray-200 transition-all shadow-sm"><span className="text-lg">🇦🇪</span> <FiChevronDown className="text-gray-400 text-xs"/></button>
                                                    <input type="text" value="+971 50 123 4567" readOnly className="flex-1 border border-gray-100 rounded-[1.25rem] px-5 py-3.5 text-sm font-bold bg-white shadow-sm text-gray-900 focus:outline-none focus:border-[#D48D2A] transition-all w-full" />
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <SettingsInputField label="Preferred Contact Method" value="WhatsApp" readOnly icon={<span className="text-emerald-500 font-bold text-lg flex items-center mb-1"><svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></span>} className="shadow-sm border border-gray-100 bg-white hover:border-[#D48D2A] cursor-pointer" />
                                                <FiChevronDown className="absolute right-5 top-[50%] translate-y-[20%] text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="relative">
                                                <SettingsInputField label="Language" value="English" readOnly className="shadow-sm border border-gray-100 bg-white hover:border-[#D48D2A] cursor-pointer" />
                                                <FiChevronDown className="absolute right-5 top-[50%] translate-y-[20%] text-gray-400 pointer-events-none" />
                                            </div>
                                            <div className="relative">
                                                <SettingsInputField label="Time Zone" value="(GMT+4) Dubai, UAE" readOnly className="shadow-sm border border-gray-100 bg-white hover:border-[#D48D2A] cursor-pointer" />
                                                <FiChevronDown className="absolute right-5 top-[50%] translate-y-[20%] text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Agent Description</label>
                                                <span className="text-[10px] font-bold text-gray-400">158 / 1000</span>
                                            </div>
                                            <textarea 
                                                value={agentInfo.description || "Luxury asset consultant with 8+ years of experience in high-end cars and investment properties. Passionate about delivering a personalized, transparent, and premium experience to every client."}
                                                onChange={(e) => setAgentInfo({ ...agentInfo, description: e.target.value })}
                                                rows={4}
                                                className="w-full bg-white shadow-sm border border-gray-100 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:border-[#D48D2A] transition-all resize-none text-gray-900"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Social Profiles <span className="text-gray-400 font-medium normal-case ml-1">(Optional)</span></label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E1306C] text-lg rounded p-1 flex items-center justify-center">
                                                        <FiHeart className="text-[1rem]" />
                                                    </div>
                                                    <input type="text" value={agentInfo.social.instagram || "instagram.com/mdriyaz"} onChange={(e) => setAgentInfo({ ...agentInfo, social: { ...agentInfo.social, instagram: e.target.value } })} className="w-full pl-12 pr-4 py-3 bg-white shadow-sm border border-gray-100 text-sm font-bold text-gray-900 rounded-[1rem] outline-none hover:border-gray-200 focus:border-[#D48D2A] transition-all" />
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A66C2] text-lg rounded p-1 font-bold flex items-center justify-center">
                                                        <span className="text-sm font-black italic">in</span>
                                                    </div>
                                                    <input type="text" value={agentInfo.social.linkedin || "linkedin.com/in/mdriyaz"} onChange={(e) => setAgentInfo({ ...agentInfo, social: { ...agentInfo.social, linkedin: e.target.value } })} className="w-full pl-12 pr-4 py-3 bg-white shadow-sm border border-gray-100 text-sm font-bold text-gray-900 rounded-[1rem] outline-none hover:border-gray-200 focus:border-[#D48D2A] transition-all" />
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-lg font-black rounded p-1 flex items-center justify-center">
                                                        <span className="text-sm font-black italic">X</span>
                                                    </div>
                                                    <input type="text" value={agentInfo.social.x || "x.com/mdriyaz"} onChange={(e) => setAgentInfo({ ...agentInfo, social: { ...agentInfo.social, x: e.target.value } })} className="w-full pl-12 pr-4 py-3 bg-white shadow-sm border border-gray-100 text-sm font-bold text-gray-900 rounded-[1rem] outline-none hover:border-gray-200 focus:border-[#D48D2A] transition-all" />
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1877F2] text-lg rounded p-1 font-bold flex items-center justify-center">
                                                        <span className="text-[1.1rem] font-black italic shadow-blue-500/20 text-blue-600 px-1">f</span>
                                                    </div>
                                                    <input type="text" value={agentInfo.social.facebook || "facebook.com/mdriyaz"} onChange={(e) => setAgentInfo({ ...agentInfo, social: { ...agentInfo.social, facebook: e.target.value } })} className="w-full pl-12 pr-4 py-3 bg-white shadow-sm border border-gray-100 text-sm font-bold text-gray-900 rounded-[1rem] outline-none hover:border-gray-200 focus:border-[#D48D2A] transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-8">
                                        <button className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-md inline-flex items-center">
                                            Save Personal Details
                                        </button>
                                    </div>
                                </div>

                                {/* CARD 2: Dealer Details */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-10 flex flex-col">
                                    <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">2</div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 font-playfair">Your Dealer / Company Details</h3>
                                                <p className="text-xs text-gray-400 mt-1">This information represents your business and will be visible to clients.</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 whitespace-nowrap">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Verified
                                        </span>
                                    </div>

                                    <div className="space-y-6 flex-1">
                                        <div className="grid grid-cols-2 gap-6">
                                            <SettingsInputField label="Company / Dealership Name" value={companyInfo.name || 'Visual Business Express'} onChange={e => setCompanyInfo({...companyInfo, name: e.target.value})} />
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Company Logo</p>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 h-20 rounded-xl bg-black flex items-center justify-center shrink-0 overflow-hidden shadow-lg shadow-black/10">
                                                        {companyInfo.logo ? <img src={companyInfo.logo} className="w-full h-full object-contain p-2" /> : <div className="text-white flex flex-col items-center"><span className="text-2xl font-playfair italic font-bold text-[#D48D2A]">V</span><span className="text-[7px] font-bold tracking-widest opacity-80 mt-1">VISUAL</span><span className="text-[4px] font-medium opacity-50 uppercase tracking-[0.2em] mt-0.5">business express</span></div>}
                                                    </div>
                                                    <div>
                                                        <button className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 mb-2 transition-colors">
                                                            <FiUpload className="text-gray-400" /> Upload Logo
                                                        </button>
                                                        <p className="text-[10px] text-gray-400 font-medium tracking-wide">JPG, PNG up to 5MB</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <SettingsInputField label="Website" value={companyInfo.website || 'https://vbexpress.com'} onChange={e => setCompanyInfo({...companyInfo, website: e.target.value})} />
                                            <SettingsInputField label="Company Email" value={companyInfo.email || 'hello@vbexpress.com'} onChange={e => setCompanyInfo({...companyInfo, email: e.target.value})} />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="relative">
                                                <SettingsInputField label="Business Type" value={companyInfo.businessType || 'Luxury Cars & Supercars Dealer'} onChange={e => setCompanyInfo({...companyInfo, businessType: e.target.value})} className="shadow-sm border border-gray-100 bg-white hover:border-[#D48D2A] cursor-pointer" />
                                                <FiChevronDown className="absolute right-5 top-[50%] translate-y-[20%] text-gray-400 pointer-events-none" />
                                            </div>
                                            <div className="relative">
                                                <SettingsInputField label="Established Year" value={companyInfo.establishedYear || '2019'} onChange={e => setCompanyInfo({...companyInfo, establishedYear: e.target.value})} className="shadow-sm border border-gray-100 bg-white hover:border-[#D48D2A] cursor-pointer" />
                                                <FiCalendar className="absolute right-5 top-[50%] translate-y-[20%] text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-6">
                                            <SettingsInputField label="Office Address" value={companyInfo.address || '5930, Amariloor, Spain'} onChange={e => setCompanyInfo({...companyInfo, address: e.target.value})} />
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Phone Number</label>
                                                <div className="flex gap-2">
                                                    <button className="flex items-center justify-center gap-1 w-20 bg-gray-50/50 rounded-[1.25rem] text-sm font-bold text-gray-900 border border-gray-100 hover:border-gray-200 transition-all shadow-sm"><span className="text-lg">🇦🇪</span> <FiChevronDown className="text-gray-400 text-xs"/></button>
                                                    <input type="text" value="+44 123 456 7890" readOnly className="flex-1 border border-gray-100 rounded-[1.25rem] px-5 py-3.5 text-sm font-bold bg-white shadow-sm text-gray-900 focus:outline-none focus:border-[#D48D2A] transition-all w-full" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dealer / Agent Description</label>
                                                <span className="text-[10px] font-bold text-gray-400">176 / 1000</span>
                                            </div>
                                            <textarea 
                                                value={companyInfo.description || "Specialists in luxury cars & supercars trading, serving customers high-quality & exclusive properties on the Costa Tropical. With 10+ years of local market expertise, we ensure exceptional service and transparent deals."}
                                                onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                                                rows={4}
                                                className="w-full bg-white shadow-sm border border-gray-100 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:border-[#D48D2A] transition-all resize-none text-gray-900"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Company Social Media <span className="text-gray-400 font-medium normal-case ml-1">(Optional)</span></label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E1306C] text-lg rounded p-1 flex items-center justify-center">
                                                        <FiHeart className="text-[1rem]" />
                                                    </div>
                                                    <input type="text" value={companyInfo.social.instagram || "instagram.com/vbexpress"} onChange={(e) => setCompanyInfo({ ...companyInfo, social: { ...companyInfo.social, instagram: e.target.value } })} className="w-full pl-12 pr-4 py-3 bg-white shadow-sm border border-gray-100 text-sm font-bold text-gray-900 rounded-[1rem] outline-none hover:border-gray-200 focus:border-[#D48D2A] transition-all" />
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A66C2] text-lg rounded p-1 font-bold flex items-center justify-center">
                                                        <span className="text-sm font-black italic">in</span>
                                                    </div>
                                                    <input type="text" value={companyInfo.social.linkedin || "linkedin.com/company/vbexpress"} onChange={(e) => setCompanyInfo({ ...companyInfo, social: { ...companyInfo.social, linkedin: e.target.value } })} className="w-full pl-12 pr-4 py-3 bg-white shadow-sm border border-gray-100 text-sm font-bold text-gray-900 rounded-[1rem] outline-none hover:border-gray-200 focus:border-[#D48D2A] transition-all" />
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1877F2] text-lg rounded p-1 font-bold flex items-center justify-center">
                                                        <span className="text-[1.1rem] font-black italic shadow-blue-500/20 text-blue-600 px-1">f</span>
                                                    </div>
                                                    <input type="text" value={companyInfo.social.facebook || "facebook.com/vbexpress"} onChange={(e) => setCompanyInfo({ ...companyInfo, social: { ...companyInfo.social, facebook: e.target.value } })} className="w-full pl-12 pr-4 py-3 bg-white shadow-sm border border-gray-100 text-sm font-bold text-gray-900 rounded-[1rem] outline-none hover:border-gray-200 focus:border-[#D48D2A] transition-all" />
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 text-lg rounded p-1 font-bold flex items-center justify-center">
                                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" class="text-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>
                                                    </div>
                                                    <input type="text" value={companyInfo.social.youtube || "youtube.com/@vbexpress"} onChange={(e) => setCompanyInfo({ ...companyInfo, social: { ...companyInfo.social, youtube: e.target.value } })} className="w-full pl-12 pr-4 py-3 bg-white shadow-sm border border-gray-100 text-sm font-bold text-gray-900 rounded-[1rem] outline-none hover:border-gray-200 focus:border-[#D48D2A] transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-8">
                                        <button className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-md inline-flex items-center">
                                            Save Company Details
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Tiles Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Verification Status */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col hover:border-[#D48D2A] transition-all group">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center text-xl shadow-[0_2px_8px_rgba(16,185,129,0.15)] group-hover:scale-105 transition-transform"><FiShield /></div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900">Verification Status</h4>
                                            <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wide">Get verified to increase trust and lead priority.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600 flex items-center gap-3"><FiCheckCircle className="text-gray-400" /> Identity Verification</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Verified</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600 flex items-center gap-3"><FiCheckCircle className="text-gray-400" /> Business Verification</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Verified</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600 flex items-center gap-3"><FiCheckCircle className="text-gray-400" /> Phone Verification</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Verified</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-100/60 text-center">
                                        <button className="text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">View Verification Details</button>
                                    </div>
                                </div>

                                {/* Lead Preferences */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col hover:border-[#D48D2A] transition-all group lg:col-span-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 border border-purple-100 flex items-center justify-center text-xl shadow-[0_2px_8px_rgba(168,85,247,0.15)] group-hover:scale-105 transition-transform">
                                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900">Lead Preferences</h4>
                                            <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wide">Control how and when you receive leads.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 flex-1">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium text-gray-600">Lead Notifications</span>
                                                <div className="w-10 h-5 rounded-full bg-[#D48D2A] relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-[2px] right-[2px] shadow-sm"></div></div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium text-gray-600">Email Notifications</span>
                                                <div className="w-10 h-5 rounded-full bg-[#D48D2A] relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-[2px] right-[2px] shadow-sm"></div></div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium text-gray-600">WhatsApp Notifications</span>
                                                <div className="w-10 h-5 rounded-full bg-gray-200 relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-[2px] left-[2px] shadow-sm"></div></div>
                                            </div>
                                        </div>
                                        <div className="space-y-5 flex-1 border-l border-gray-100/60 pl-6">
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Preferred Lead Types</label>
                                                <div className="relative">
                                                    <select className="w-full appearance-none bg-transparent border-b border-gray-200 py-1.5 text-xs font-bold text-gray-600 outline-none hover:border-gray-400 cursor-pointer"><option>All Categories</option></select>
                                                    <FiChevronDown className="absolute right-0 top-2 text-[10px] text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Preferred Locations</label>
                                                <div className="relative">
                                                    <select className="w-full appearance-none bg-transparent border-b border-gray-200 py-1.5 text-xs font-bold text-gray-600 outline-none hover:border-gray-400 cursor-pointer"><option>All Locations</option></select>
                                                    <FiChevronDown className="absolute right-0 top-2 text-[10px] text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-100/60 text-center">
                                        <button className="text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Manage Lead Preferences</button>
                                    </div>
                                </div>

                                {/* Account & Security */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col hover:border-[#D48D2A] transition-all group lg:col-span-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center text-xl shadow-[0_2px_8px_rgba(59,130,246,0.15)] group-hover:scale-105 transition-transform"><FiLock /></div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900">Account & Security</h4>
                                            <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wide">Manage your account security and access.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center justify-between cursor-pointer group/link py-1">
                                            <span className="text-sm font-medium text-gray-600 flex items-center gap-3"><FiLock className="text-gray-400" /> Change Password</span>
                                            <FiChevronDown className="text-gray-400 -rotate-90 group-hover/link:text-gray-900 group-hover/link:translate-x-1 transition-all" />
                                        </div>
                                        <div className="flex items-center justify-between py-1">
                                            <span className="text-sm font-medium text-gray-600 flex items-center gap-3"><FiShield className="text-gray-400" /> Two-Factor Authentication</span>
                                            <span className="text-[10px] font-black text-emerald-500 ml-auto mr-0">Enabled</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1">
                                            <span className="text-sm font-medium text-gray-600 flex items-center gap-3"><span className="w-3.5 h-3.5 flex border-2 border-gray-400 rounded-sm"></span> Active Sessions</span>
                                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-600">2</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-100/60 text-center">
                                        <button className="text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Manage Security</button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        )
                    }
                    {/* SUBSCRIPTION TAB */}
                    {
                        activeTab === 'subscription' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                
                                <div className="mb-4 flex items-end justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 font-playfair">Subscription & Billing</h2>
                                        <p className="text-sm text-gray-500 mt-1">Manage your plan, billing details, and view payment history.</p>
                                    </div>
                                </div>

                                {/* Nested Navigation */}
                                <div className="flex border-b border-gray-100 mb-6 w-full overflow-x-auto custom-scrollbar">
                                    <button className="pb-4 px-4 whitespace-nowrap border-b-2 font-bold text-sm border-[#D48D2A] text-[#D48D2A]">Subscription Details</button>
                                    <button onClick={() => alert('Redirecting to secure billing portal...')} className="pb-4 px-4 whitespace-nowrap border-b-2 font-medium text-sm border-transparent text-gray-400 hover:text-gray-600 transition-colors">Manage Billing</button>
                                    <button onClick={() => alert('Billing history is available in the billing portal.')} className="pb-4 px-4 whitespace-nowrap border-b-2 font-medium text-sm border-transparent text-gray-400 hover:text-gray-600 transition-colors">Billing History</button>
                                    <button onClick={() => alert('Payment methods are securely managed in the billing portal.')} className="pb-4 px-4 whitespace-nowrap border-b-2 font-medium text-sm border-transparent text-gray-400 hover:text-gray-600 transition-colors">Payment Methods</button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Current Plan Section */}
                                    <div className="lg:col-span-1 border border-gray-100 bg-white rounded-[2.5rem] p-10 shadow-[0_2px_15px_rgba(0,0,0,0.03)] h-fit">
                                        <h3 className="text-xl font-bold text-gray-900 font-playfair mb-6">Current Plan</h3>
                                        
                                        <div className="bg-gradient-to-br from-[#D48D2A] to-[#B5751C] rounded-[2rem] p-8 text-white mb-6 relative overflow-hidden shadow-xl shadow-[#D48D2A]/20 hover:scale-[1.02] transition-transform">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                            <div className="flex items-center justify-between mb-4 relative z-10">
                                                <h3 className="text-2xl font-bold font-playfair">{user?.plan || 'Business VIP'}</h3>
                                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-sm">Active</span>
                                            </div>

                                            <div className="space-y-5 relative z-10">
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Listing Usage</p>
                                                        <p className="text-sm font-black tracking-wide">
                                                            {data?.inventory?.length || 0} / {user?.plan === 'Business VIP' ? 50 : user?.plan === 'Premium Basic' ? 25 : 5}
                                                        </p>
                                                    </div>
                                                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                                                        <div
                                                            className="h-full bg-white rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                                            style={{ width: `${Math.min(((data?.inventory?.length || 0) / (user?.plan === 'Business VIP' ? 50 : user?.plan === 'Premium Basic' ? 25 : 5)) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold mb-0.5">Renewal Date</p>
                                                        <p className="text-sm font-bold">{companyInfo.planExpiresAt ? new Date(companyInfo.planExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Apr 28, 2026'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold mb-0.5">Amount</p>
                                                        <p className="text-sm font-bold">${user?.plan === 'Business VIP' ? '299.00' : user?.plan === 'Premium Basic' ? '99.00' : '0.00'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="w-full py-4 text-sm font-bold text-[#D48D2A] bg-[#FDF8F0] border border-[#F2E8DB] rounded-xl hover:bg-[#F2E8DB] transition-all">Cancel Subscription</button>
                                    </div>

                                    {/* Available Plans Section */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-10">
                                            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                                                <h3 className="text-xl font-bold text-gray-900 font-playfair flex items-center gap-2">
                                                    Available Plans 
                                                </h3>
                                                
                                                {/* Billing Toggle */}
                                                <div className="bg-gray-50 border border-gray-100 p-1.5 rounded-full flex items-center shadow-sm">
                                                    <button className="px-6 py-2 rounded-full text-xs font-bold bg-white text-gray-900 shadow-sm border border-gray-100 transition-all">Monthly</button>
                                                    <button className="px-6 py-2 rounded-full text-xs font-bold text-gray-500 hover:text-gray-900 transition-all flex items-center gap-2">Annually <span className="text-[9px] font-black uppercase tracking-widest text-[#D48D2A] bg-[#FDF8F0]/80 px-2 py-0.5 rounded-full">Save 20%</span></button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Premium Basic Plan */}
                                                <div className={`rounded-[2rem] border-2 p-8 transition-all flex flex-col ${user?.plan === 'Premium Basic' ? 'border-[#D48D2A] bg-[#FDF8F0]/30 shadow-sm relative' : 'border-gray-100 bg-white hover:border-[#D48D2A] hover:shadow-xl hover:-translate-y-1 duration-300 group'}`}>
                                                    {user?.plan === 'Premium Basic' && (
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                                            <span className="px-4 py-1 bg-[#D48D2A] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">Current Plan</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="mb-6">
                                                        <div className="w-12 h-12 rounded-[1rem] bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 text-gray-400 group-hover:text-[#D48D2A] group-hover:border-[#D48D2A]/30 transition-all shadow-sm">
                                                            <FiPackage className="text-xl" />
                                                        </div>
                                                        <h4 className="text-xl font-bold text-gray-900 font-playfair mb-1">Premium Basic</h4>
                                                        <p className="text-xs text-gray-500 font-medium mb-4 min-h-[40px]">Perfect for boutique dealerships starting to scale their digital presence.</p>
                                                        <div className="flex items-baseline gap-1 py-4 border-y border-gray-100">
                                                            <span className="text-4xl font-black text-gray-900 tracking-tight">$99</span>
                                                            <span className="text-xs font-bold text-gray-400">/mo</span>
                                                        </div>
                                                    </div>

                                                    <ul className="space-y-4 mb-8 flex-1">
                                                        {['25 Active Listings', 'Advanced Analytics', 'Priority Email Support', 'Enhanced Visibility', 'Lead Management'].map((feature, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-sm">
                                                                <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50"><FiCheckCircle className="text-emerald-500 text-[10px]" /></div>
                                                                <span className="text-gray-600 font-medium">{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    {user?.plan === 'Premium Basic' ? (
                                                        <button disabled className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed uppercase tracking-widest">Current Plan</button>
                                                    ) : user?.plan === 'Business VIP' ? (
                                                        <button disabled className="w-full py-4 bg-gray-50 text-gray-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed uppercase tracking-widest"><FiChevronDown /> Downgrade</button>
                                                    ) : (
                                                        <button onClick={() => handlePlanChange('Premium Basic')} className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-sm hover:border-[#D48D2A] hover:text-[#D48D2A] transition-all flex items-center justify-center gap-2 group-hover:bg-[#D48D2A] group-hover:border-[#D48D2A] group-hover:text-white shadow-sm">Upgrade Plan <FiChevronRight /></button>
                                                    )}
                                                </div>

                                                {/* Business VIP Plan */}
                                                <div className={`rounded-[2rem] border-2 p-8 transition-all flex flex-col ${user?.plan === 'Business VIP' ? 'border-[#D48D2A] bg-[#FDF8F0]/30 shadow-sm relative' : 'border-gray-100 bg-white hover:border-[#D48D2A] hover:shadow-xl hover:-translate-y-1 duration-300 group'}`}>
                                                    {user?.plan === 'Business VIP' && (
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                                            <span className="px-4 py-1 bg-[#D48D2A] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">Current Plan</span>
                                                        </div>
                                                    )}

                                                    <div className="mb-6">
                                                        <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-[#D48D2A] to-[#B5751C] shadow-lg shadow-[#D48D2A]/20 flex items-center justify-center mb-5 text-white group-hover:scale-105 transition-all">
                                                            <FiBriefcase className="text-xl" />
                                                        </div>
                                                        <h4 className="text-xl font-bold text-gray-900 font-playfair mb-1">Business VIP</h4>
                                                        <p className="text-xs text-gray-500 font-medium mb-4 min-h-[40px]">The ultimate plan for established dealerships needing maximum reach.</p>
                                                        <div className="flex items-baseline gap-1 py-4 border-y border-gray-100">
                                                            <span className="text-4xl font-black text-gray-900 tracking-tight">$299</span>
                                                            <span className="text-xs font-bold text-gray-400">/mo</span>
                                                        </div>
                                                    </div>

                                                    <ul className="space-y-4 mb-8 flex-1">
                                                        {['50 Active Listings', 'Full Analytics Suite', 'Priority Phone & Email Support', 'Premium Visibility', 'Lead Scoring', 'Dedicated Account Manager'].map((feature, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-sm">
                                                                <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50"><FiCheckCircle className="text-emerald-500 text-[10px]" /></div>
                                                                <span className="text-gray-600 font-medium">{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    {user?.plan === 'Business VIP' ? (
                                                        <button disabled className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed uppercase tracking-widest">Current Plan</button>
                                                    ) : (
                                                        <button onClick={() => handlePlanChange('Business VIP')} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/20">Upgrade Plan <FiChevronRight className="text-gray-400" /></button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Custom Solution Section */}
                                        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
                                            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                            <div className="relative z-10 flex-1">
                                                <h3 className="text-2xl font-bold font-playfair mb-2">Need a Custom Solution?</h3>
                                                <p className="text-gray-400 text-sm max-w-lg leading-relaxed font-medium">For large dealerships or enterprises with specific requirements, we offer tailored solutions with dedicated support and custom API integrations.</p>
                                            </div>
                                            <div className="relative z-10 shrink-0">
                                                <button onClick={() => { setContactType('Sales'); setIsContactModalOpen(true); }} className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-xl shadow-white/10">Contact Sales</button>
                                            </div>
                                        </div>

                                        {/* Support Section */}
                                        <div className="mt-8 bg-white border border-gray-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                                            <div className="relative z-10 flex-1">
                                                <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-2">Need Help?</h3>
                                                <p className="text-gray-500 text-sm max-w-lg leading-relaxed font-medium">Get in touch with our dedicated concierge support team for any questions or assistance with your account.</p>
                                            </div>
                                            <div className="relative z-10 shrink-0">
                                                <button onClick={() => { setContactType('Support'); setIsContactModalOpen(true); }} className="px-8 py-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">Contact Support</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </main >
            </div >

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                type={contactType}
                token={token}
            />
            
            <AddAssetModal
                isOpen={isAddModalOpen}
                editData={editingItem}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                }}
                onCreated={() => {
                    fetchDashboard();
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                }}
            />

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this listing? This cannot be undone."
                isLoading={isDeleting}
            />

            <DealerVerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                onSubmit={handleVerificationSubmit}
                user={user}
            />

            {showCropModal && (
                <ImageCropModal
                    src={cropSrc}
                    onCropComplete={handleCropComplete}
                    onClose={() => setShowCropModal(false)}
                    isUploading={logoLoading}
                />
            )}

            {/* PAYPAL UPGRADE MODAL */}
            {upgradePlan && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setUpgradePlan(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <FiPlus className="rotate-45 text-gray-500" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-[#FDF8F0] border border-[#F2E8DB] flex items-center justify-center mx-auto mb-4 text-[#D48D2A]">
                                <FiCreditCard className="text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 font-playfair mb-1">Upgrade to {upgradePlan}</h3>
                            <p className="text-gray-400 text-sm">
                                {upgradePlan === 'Business VIP' ? '$299.00 / month' : '$99.00 / month'}
                            </p>
                        </div>

                        <PayPalScriptProvider options={paypalOptions}>
                            <PayPalButtons
                                style={{ layout: "vertical", shape: "rect", color: "gold", label: "pay" }}
                                createOrder={(data, actions) => {
                                    return fetch("/api/payment/create-order", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ plan: upgradePlan })
                                    })
                                        .then((response) => response.json())
                                        .then((order) => order.id)
                                        .catch(err => {
                                            console.error("Order Create Error:", err);
                                            alert("Failed to initiate payment.");
                                            return null;
                                        });
                                }}
                                onApprove={(data, actions) => {
                                    return fetch("/api/payment/capture-order", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ orderID: data.orderID, plan: upgradePlan })
                                    })
                                        .then((response) => response.json())
                                        .then(async (details) => {
                                            if (details.success) {
                                                alert(`Successfully upgraded to ${upgradePlan}!`);
                                                setUpgradePlan(null);
                                                await fetchDashboard();
                                                if (refreshUser) refreshUser();
                                                // Ensure tab stays on subscription or reloads
                                            } else {
                                                alert("Payment failed: " + (details.error || "Unknown error"));
                                            }
                                        });
                                }}
                                onError={(err) => {
                                    console.error("PayPal Error:", err);
                                    alert("An error occurred with PayPal.");
                                }}
                            />
                        </PayPalScriptProvider>

                        <p className="text-[10px] text-gray-400 text-center mt-6">
                            Secure payment processed by PayPal. You can cancel anytime.
                        </p>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
            `}} />
        </div >
    );
};

const AnalyticsCard = ({ title, value, growth, icon, iconBgClass, chartColor, data }) => (
    <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-gray-200 transition-all">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm ${iconBgClass || 'bg-gray-50 text-gray-600'}`}>
                {icon}
            </div>
        </div>
        <div className="flex flex-col gap-1 mt-4">
            <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold flex items-center ${growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                    {growth.startsWith('+') ? <FiTrendingUp className="mr-0.5" /> : <FiTrendingDown className="mr-0.5" />} {growth}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">vs last 30 days</span>
            </div>
            {data && data.length > 0 && (
                <div className="h-8 mt-2 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <Line type="monotone" dataKey="value" stroke={chartColor || '#D48D2A'} strokeWidth={2} dot={false} isAnimationActive={false} />
                        </LineChart>
                   </ResponsiveContainer>
                </div>
            )}
        </div>
    </div>
);

const SettingsInputField = ({ label, value, icon, readOnly, onChange }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            {label}
            {readOnly && <span className="ml-auto text-[9px] text-emerald-600 font-black uppercase tracking-widest">Verified</span>}
        </label>
        <input
            type="text"
            value={value}
            readOnly={readOnly}
            onChange={onChange}
            className={`w-full border-transparent rounded-[1.25rem] px-6 py-4 text-sm font-bold focus:outline-none transition-all shadow-inner ${readOnly
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                : 'bg-[#E5E7EB]/30 text-gray-900 focus:border-[#D48D2A] focus:bg-white'
                }`}
        />
    </div>
);

const SettingsActionRow = ({ label, desc, btnText, isToggle, isOn, onToggle }) => (
    <div className="flex items-center justify-between p-8 rounded-[1.5rem] bg-[#E5E7EB]/10 border border-gray-50 group hover:border-gray-200 transition-all">
        <div>
            <h5 className="text-sm font-bold text-gray-900 mb-1">{label}</h5>
            <p className="text-xs text-gray-400 font-medium">{desc}</p>
        </div>
        {isToggle ? (
            <div
                onClick={onToggle}
                className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${isOn ? 'bg-[#D48D2A]' : 'bg-gray-300'
                    }`}
            >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${isOn ? 'left-8' : 'left-1'
                    }`}></div>
            </div>
        ) : (
            <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 shadow-sm hover:border-[#D48D2A] hover:text-[#D48D2A] transition-all">
                {btnText}
            </button>
        )}
    </div>
);

export default Inventory;
