import React, { useState, useEffect, useRef } from 'react';
import { FiImage, FiPlus, FiGrid, FiTrash2, FiInfo, FiChevronRight, FiSearch, FiCheck, FiChevronLeft, FiAward } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import ImageCropModal from '../ImageCropModal';

import carIcon from '../../assets/icons/car_icon.png';
import estateIcon from '../../assets/icons/estate_icon.png';
import yachtIcon from '../../assets/icons/yacht_icon.png';
import bikeIcon from '../../assets/icons/bike_icon.png';
import contentCreatorIcon from '../../assets/icons/content_creater_icon.png';
import otherIcon from '../../assets/icons/other_asset_icon.png';

const types = [
    { id: 'Cars', label: 'Cars', icon: carIcon },
    { id: 'Real Estate', label: 'Real Estate', icon: estateIcon },
    { id: 'Yachts', label: 'Yachts', icon: yachtIcon },
    { id: 'Bikes', label: 'Bikes', icon: bikeIcon },
    { id: 'Content Creator', label: 'Content Creator', icon: contentCreatorIcon },
    { id: 'Other', label: 'Other', icon: otherIcon }
];

// Mock database of searchable nominees
const mockAssetNominees = [
    { id: 'a1', name: 'Bugatti Tourbillon', detail: 'Hypercar · $4.6M', image: 'https://images.unsplash.com/photo-1600706432502-75a0e2b8b915?w=150&auto=format&fit=crop&q=60' },
    { id: 'a2', name: 'Koenigsegg Jesko Absolut', detail: 'Hypercar · $3.4M', image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=150&auto=format&fit=crop&q=60' },
    { id: 'a3', name: 'Pagani Utopia Roadster', detail: 'Hypercar · $2.8M', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=150&auto=format&fit=crop&q=60' },
    { id: 'a4', name: 'Ferrari SF90 XX Stradale', detail: 'Supercar · $890K', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=150&auto=format&fit=crop&q=60' },
    { id: 'a5', name: 'Rolls-Royce Spectre', detail: 'Luxury Coupe · $420K', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=150&auto=format&fit=crop&q=60' },
    { id: 'a6', name: 'Beverly Hills Modern Mansion', detail: 'Estate · $28M', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&auto=format&fit=crop&q=60' },
    { id: 'a7', name: 'Tuscan Hillside Villa', detail: 'Villa · $8.5M', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=150&auto=format&fit=crop&q=60' },
    { id: 'a8', name: 'Monaco Waterfront Penthouse', detail: 'Apartment · $19M', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=150&auto=format&fit=crop&q=60' },
    { id: 'a9', name: 'Benetti Oasis 40M Yacht', detail: 'Superyacht · $22M', image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=150&auto=format&fit=crop&q=60' },
    { id: 'a10', name: 'Lürssen Flying Fox 136M', detail: 'Gigayacht · Charter Only', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=150&auto=format&fit=crop&q=60' }
];

const mockDealerNominees = [
    { id: 'd1', name: 'Prestige Motors Dealership', detail: 'Miami, FL · Platinum Dealer', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=150&auto=format&fit=crop&q=60' },
    { id: 'd2', name: 'Elite Yachts Group', detail: 'Monaco Brokerage · 48 Active Listings', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&auto=format&fit=crop&q=60' },
    { id: 'd3', name: 'Sotheby’s International Realty', detail: 'London, UK · Global Agency', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=60' },
    { id: 'd4', name: 'Beverly Hills Luxury Estates', detail: 'Los Angeles, CA · High-Volume Realty', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=60' },
    { id: 'd5', name: 'Ultimate Motors Dubai', detail: 'Dubai, UAE · Exotic Car Retailer', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&auto=format&fit=crop&q=60' }
];

const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const getFutureDateString = (days) => {
    const today = new Date();
    today.setDate(today.getDate() + days);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const RankingCategoryForm = ({ initialData, onSubmit, onCancel }) => {
    const { token } = useAuth();
    const [step, setStep] = useState(1);
    const coverInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const [croppedCoverBlob, setCroppedCoverBlob] = useState(null);
    const [croppedBannerBlob, setCroppedBannerBlob] = useState(null);
    
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState('');
    const [cropTarget, setCropTarget] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        type: 'Cars',
        targetType: 'Assets', // 'Assets' or 'Dealers'
        shortDescription: '',
        detailedDescription: '',
        categoryImage: '',
        bannerImage: '',
        icon: carIcon,
        votingPeriodStart: getTodayDateString(),
        votingPeriodEnd: getFutureDateString(30),
        nomineeLimit: 10,
        allowMultipleVotes: true,
        showInPopularLinks: true,
        displayOrder: 1,
        featuredCategory: true,
        categoryColor: '#6366F1',
        status: 'Active',
        nominees: [],
        seoTitle: '',
        seoKeywords: ''
    });

    // Nominees management state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResultsDropdown, setShowResultsDropdown] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                votingPeriodStart: initialData.votingPeriodStart || getTodayDateString(),
                votingPeriodEnd: initialData.votingPeriodEnd || getFutureDateString(30),
                targetType: initialData.targetType || 'Assets',
                nominees: initialData.nominees || [],
                seoTitle: initialData.seoTitle || '',
                seoKeywords: initialData.seoKeywords || '',
                status: initialData.status || 'Active'
            });
        }
    }, [initialData]);

    // Update slug and target type smart details on title change
    const handleTitleChange = (e) => {
        const val = e.target.value;
        const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Auto-detect targetType based on keywords
        let detectedTarget = formData.targetType;
        if (val.toLowerCase().includes('dealer') || val.toLowerCase().includes('agency') || val.toLowerCase().includes('broker')) {
            detectedTarget = 'Dealers';
        } else if (val.toLowerCase().includes('car') || val.toLowerCase().includes('villa') || val.toLowerCase().includes('yacht')) {
            detectedTarget = 'Assets';
        }

        setFormData(prev => ({
            ...prev,
            title: val,
            slug: generatedSlug,
            targetType: detectedTarget
        }));
    };

    // Filter nominees based on targetType and search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                if (formData.targetType === 'Assets') {
                    // Map selected type to category query parameter
                    const categoryMap = {
                        'Cars': 'cars|vehicles',
                        'Real Estate': 'estates',
                        'Yachts': 'yachts',
                        'Bikes': 'bikes'
                    };
                    const queryCategory = categoryMap[formData.type] || '';
                    
                    const url = `/api/assets/combined?q=${encodeURIComponent(searchQuery)}&category=${queryCategory}&limit=10`;
                    const response = await fetch(url);
                    if (response.ok) {
                        const resData = await response.json();
                        if (resData && Array.isArray(resData.data)) {
                            const formatted = resData.data.map(asset => {
                                const detailParts = [];
                                if (asset.brand) detailParts.push(asset.brand);
                                if (asset.specification?.model) detailParts.push(asset.specification.model);
                                if (asset.location) detailParts.push(asset.location);
                                
                                const priceStr = asset.isPriceOnRequest 
                                    ? 'Price on Request' 
                                    : (asset.price ? `$${Number(asset.price).toLocaleString()}` : '');
                                if (priceStr) detailParts.push(priceStr);

                                return {
                                    id: asset._id || asset.id,
                                    name: asset.title || 'Unnamed Asset',
                                    detail: detailParts.join(' · '),
                                    image: asset.images && asset.images[0] ? asset.images[0] : '',
                                    votes: 0
                                };
                            });
                            setSearchResults(formatted);
                        }
                    }
                } else {
                    // targetType === 'Dealers'
                    const response = await fetch('/api/admin/partners', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const partners = await response.json();
                        
                        const categoryMap = {
                            'Cars': 'Car',
                            'Real Estate': 'Estate',
                            'Yachts': 'Yacht',
                            'Bikes': 'Bike'
                        };
                        const selectedCat = categoryMap[formData.type];
                        
                        const filtered = partners.filter(p => {
                            const matchesSearch = 
                                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                (p.company?.companyName && p.company.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                p.email.toLowerCase().includes(searchQuery.toLowerCase());
                                
                            const matchesCategory = !selectedCat || p.category === selectedCat || p.category === 'General';
                            
                            return matchesSearch && matchesCategory;
                        });

                        const formatted = filtered.map(p => ({
                            id: p.id,
                            name: p.company?.companyName || p.name,
                            detail: `${p.plan || 'Dealer'} · ${p.email} · ${p.level || 'Silver'} Level`,
                            image: p.company?.companyLogo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                            votes: 0
                        }));
                        
                        setSearchResults(formatted);
                    }
                }
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, formData.targetType, formData.type, token]);

    const addNominee = (nominee) => {
        if (formData.nominees.some(n => n.id === nominee.id || n._id === nominee.id)) {
            alert("This nominee is already added to this category.");
            return;
        }
        if (formData.nominees.length >= formData.nomineeLimit) {
            alert(`You have reached the limit of ${formData.nomineeLimit} nominees.`);
            return;
        }
        setFormData(prev => ({
            ...prev,
            nominees: [...prev.nominees, { ...nominee, votes: 0 }]
        }));
        setSearchQuery('');
        setShowResultsDropdown(false);
    };

    const removeNominee = (id) => {
        setFormData(prev => ({
            ...prev,
            nominees: prev.nominees.filter(n => n.id !== id && n._id !== id)
        }));
    };

    const uploadToCloudinary = async (blob, target, title) => {
        const uploadData = new FormData();
        uploadData.append('image', blob);
        
        const endpoint = target === 'cover' 
            ? `/api/upload/category-cover?title=${encodeURIComponent(title)}` 
            : `/api/upload/category-banner?title=${encodeURIComponent(title)}`;
            
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: uploadData
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.url) {
                return data.url;
            }
        }
        throw new Error(`Cloudinary upload failed for ${target}`);
    };

    const handleFormSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        
        let finalCoverUrl = formData.categoryImage;
        let finalBannerUrl = formData.bannerImage;
        
        try {
            // Upload cover if we have a cropped blob temporarily saved
            if (croppedCoverBlob) {
                finalCoverUrl = await uploadToCloudinary(croppedCoverBlob, 'cover', formData.title);
            }
            
            // Upload banner if we have a cropped blob temporarily saved
            if (croppedBannerBlob) {
                finalBannerUrl = await uploadToCloudinary(croppedBannerBlob, 'banner', formData.title);
            }
            
            await onSubmit({
                ...formData,
                categoryImage: finalCoverUrl,
                bannerImage: finalBannerUrl
            });
            
            // Reset form if creating new
            if (!initialData) {
                setFormData({
                    title: '',
                    slug: '',
                    type: 'Cars',
                    targetType: 'Assets',
                    shortDescription: '',
                    detailedDescription: '',
                    categoryImage: '',
                    bannerImage: '',
                    icon: carIcon,
                    votingPeriodStart: getTodayDateString(),
                    votingPeriodEnd: getFutureDateString(30),
                    nomineeLimit: 10,
                    allowMultipleVotes: true,
                    showInPopularLinks: true,
                    displayOrder: 1,
                    featuredCategory: true,
                    categoryColor: '#6366F1',
                    status: 'Active',
                    nominees: [],
                    seoTitle: '',
                    seoKeywords: ''
                });
                setCroppedCoverBlob(null);
                setCroppedBannerBlob(null);
                setStep(1);
            }
        } catch (err) {
            console.error("Error submitting category:", err);
            alert("Error saving category images. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileSelect = (e, target) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setCropImageSrc(reader.result);
            setCropTarget(target);
            setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
        
        // Reset file input value so same file can be selected again
        e.target.value = '';
    };

    const handleStepClick = (targetStep) => {
        if (targetStep < step) {
            setStep(targetStep);
            return;
        }

        // Validate Step 1
        if (step === 1) {
            if (!formData.title.trim()) {
                alert("Category title is required.");
                return;
            }
            if (!formData.slug.trim()) {
                alert("Slug is required.");
                return;
            }
            if (!formData.shortDescription.trim()) {
                alert("Short description is required.");
                return;
            }
            if (!formData.detailedDescription.trim()) {
                alert("Detailed description is required.");
                return;
            }
            if (!formData.categoryImage) {
                alert("Category cover image is required.");
                return;
            }
            if (!formData.bannerImage) {
                alert("Banner image is required.");
                return;
            }
        }

        if (targetStep <= 2) {
            setStep(targetStep);
        }
    };

    const handleNextStep = () => {
        // Validate Step 1 fields
        if (step === 1) {
            if (!formData.title.trim()) {
                alert("Category title is required.");
                return;
            }
            if (!formData.slug.trim()) {
                alert("Slug is required.");
                return;
            }
            if (!formData.shortDescription.trim()) {
                alert("Short description is required.");
                return;
            }
            if (!formData.detailedDescription.trim()) {
                alert("Detailed description is required.");
                return;
            }
            if (!formData.categoryImage) {
                alert("Category cover image is required.");
                return;
            }
            if (!formData.bannerImage) {
                alert("Banner image is required.");
                return;
            }
        }

        // Validate Step 2 fields
        if (step === 2) {
            if (formData.nominees.length === 0) {
                alert("Please add at least one nominee before proceeding.");
                return;
            }
        }

        if (step < 2) setStep(step + 1);
        else handleFormSubmit();
    };

    const handlePrevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left">
            {/* Multi-step Navigation Header */}
            <div className="bg-[#101622] rounded-2xl p-4 border border-[#1B243B] flex flex-wrap gap-4 items-center justify-between text-xs text-gray-400">
                <div className="flex items-center flex-wrap gap-4 sm:gap-6">
                    <span 
                        onClick={() => handleStepClick(1)}
                        className={`flex items-center gap-2 cursor-pointer transition-colors ${step === 1 ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#6366F1] text-white' : 'bg-[#1C253B]'}`}>1</span> 
                        Basic Info
                    </span>
                    <FiChevronRight className="text-gray-700 hidden sm:block" />
                    
                    <span 
                        onClick={() => handleStepClick(2)}
                        className={`flex items-center gap-2 cursor-pointer transition-colors ${step === 2 ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#6366F1] text-white' : 'bg-[#1C253B]'}`}>2</span> 
                        Nominees ({formData.nominees.length})
                    </span>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={onCancel} className="px-4 py-1.5 bg-[#1C253B] text-gray-300 rounded-lg hover:bg-[#253252] transition-colors font-bold">Cancel</button>
                    {step > 1 && (
                        <button type="button" onClick={handlePrevStep} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1A2338] text-gray-300 border border-[#2B395B] rounded-lg hover:bg-[#253252] transition-colors font-bold">
                            <FiChevronLeft /> Back
                        </button>
                    )}
                    <button 
                        type="button" 
                        onClick={handleNextStep} 
                        disabled={isSubmitting}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors font-bold shadow-lg shadow-[#6366F1]/20 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>Saving...</>
                        ) : step === 2 ? (
                            <>Save & Publish <FiChevronRight /></>
                        ) : (
                            <>Next Step <FiChevronRight /></>
                        )}
                    </button>
                </div>
            </div>

            {/* STEP 1: Basic Information */}
            {step === 1 && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* LEFT BLOCK: Text Fields */}
                    <div className="xl:col-span-8 space-y-6">
                        <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-6">
                            <h3 className="text-sm font-normal text-white border-b border-[#1C253B] pb-3 canela tracking-wide">Category Description</h3>
                            
                            {/* Title input */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category Title *</label>
                                    <span className="text-[9px] font-bold text-gray-500">{formData.title.length}/100</span>
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    maxLength="100"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all placeholder:text-gray-600 animate-in fade-in"
                                    placeholder="e.g., Best Luxury Dealers / Best Hypercars of 2026"
                                />
                            </div>

                            {/* Slug input */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Slug *</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all placeholder:text-gray-600"
                                    placeholder="best-hypercars-of-2026"
                                />
                            </div>

                            {/* Nominees Scope Target Type Selector */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Nominee Target Scope *</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, targetType: 'Assets', nominees: [] })}
                                        className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                                            formData.targetType === 'Assets'
                                            ? 'bg-[#6366F1]/10 border-[#6366F1] text-white shadow-xl'
                                            : 'bg-[#151D30]/60 border-[#222E4A] text-gray-400 hover:border-gray-500 hover:text-white'
                                        }`}
                                    >
                                        <FiAward className="text-xl text-[#D48D2A]" />
                                        <span className="text-xs font-bold">Assets Nominees</span>
                                        <span className="text-[9px] text-gray-500 font-semibold leading-normal">Nominate luxury cars, villas, yachts, or bikes</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, targetType: 'Dealers', nominees: [] })}
                                        className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                                            formData.targetType === 'Dealers'
                                            ? 'bg-[#6366F1]/10 border-[#6366F1] text-white shadow-xl'
                                            : 'bg-[#151D30]/60 border-[#222E4A] text-gray-400 hover:border-gray-500 hover:text-white'
                                        }`}
                                    >
                                        <FiPlus className="text-xl text-[#6366F1]" />
                                        <span className="text-xs font-bold">Dealers Nominees</span>
                                        <span className="text-[9px] text-gray-500 font-semibold leading-normal">Nominate dealerships, agents, realty teams, or companies</span>
                                    </button>
                                </div>
                            </div>

                            {/* Type Selector Grid */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Category Industry Type *</label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                                    {types.map((t) => {
                                        const isSelected = formData.type === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: t.id, icon: t.icon })}
                                                className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                                    isSelected 
                                                    ? 'bg-[#6366F1]/10 border-[#6366F1] text-white shadow-md' 
                                                    : 'bg-[#151D30]/60 border-[#222E4A] text-gray-400 hover:border-gray-500 hover:text-white'
                                                }`}
                                            >
                                                <img src={t.icon} alt={t.label} className="w-12 h-12 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-center truncate w-full">{t.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Short Description *</label>
                                        <span className="text-[9px] font-bold text-gray-500">{formData.shortDescription.length}/200</span>
                                    </div>
                                    <textarea 
                                        rows="2"
                                        maxLength="200"
                                        value={formData.shortDescription}
                                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                        className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all resize-none placeholder:text-gray-600"
                                        placeholder="Recognizing the most powerful, fastest and most innovative..."
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detailed Description *</label>
                                        <span className="text-[9px] font-bold text-gray-500">{formData.detailedDescription.length}/1000</span>
                                    </div>
                                    <textarea 
                                        rows="4"
                                        maxLength="1000"
                                        value={formData.detailedDescription}
                                        onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                                        className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all resize-none placeholder:text-gray-600"
                                        placeholder="Detailed category parameters for public display..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT BLOCK: Image uploaders */}
                    <div className="xl:col-span-4 space-y-6">
                        {/* Cover Image */}
                        <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Category Cover Image *</h3>
                            <div className="h-44 rounded-xl overflow-hidden bg-gray-900 border border-[#222E4A] relative group flex items-center justify-center">
                                {formData.categoryImage ? (
                                    <img src={formData.categoryImage} alt="Cover Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-500 p-4 text-center">
                                        <FiImage className="text-3xl" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">No Image Uploaded</span>
                                    </div>
                                )}
                                
                                {formData.categoryImage && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={() => coverInputRef.current.click()} className="px-3 py-1.5 bg-[#1C253B] text-white rounded-lg text-[9px] font-bold uppercase hover:bg-black transition-colors">Change Cover</button>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={coverInputRef} 
                                onChange={(e) => handleFileSelect(e, 'cover')} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                            />
                            <button type="button" onClick={() => coverInputRef.current.click()} className="w-full py-2.5 bg-[#151D30] border border-[#222E4A] rounded-xl text-[10px] font-bold text-white hover:bg-[#222E4A] transition-all uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <FiImage /> Choose Image
                            </button>
                        </div>

                        {/* Banner Image */}
                        <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Banner Image *</h3>
                            <div className="h-24 rounded-xl overflow-hidden bg-gray-900 border border-[#222E4A] relative group flex items-center justify-center">
                                {formData.bannerImage ? (
                                    <img src={formData.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5 text-gray-500 p-4 text-center">
                                        <FiImage className="text-2xl" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">No Image Uploaded</span>
                                    </div>
                                )}

                                {formData.bannerImage && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={() => bannerInputRef.current.click()} className="px-3 py-1.5 bg-[#1C253B] text-white rounded-lg text-[9px] font-bold uppercase hover:bg-black transition-colors">Change Banner</button>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={bannerInputRef} 
                                onChange={(e) => handleFileSelect(e, 'banner')} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                            />
                            <button type="button" onClick={() => bannerInputRef.current.click()} className="w-full py-2.5 bg-[#151D30] border border-[#222E4A] rounded-xl text-[10px] font-bold text-white hover:bg-[#222E4A] transition-all uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <FiImage /> Choose Banner
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: Manage Nominees */}
            {step === 2 && (
                <div className="bg-[#101622] rounded-[2.5rem] p-6 sm:p-8 border border-[#1B243B] space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1C253B] pb-4">
                        <div>
                            <h3 className="text-lg font-normal text-white canela tracking-wide">
                                Nominate {formData.targetType} in "{formData.title || 'Category'}"
                            </h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                                Search and add verified {formData.targetType.toLowerCase()} as official voters selections
                            </p>
                        </div>
                        <div className="px-4 py-1.5 bg-[#1C253B] border border-[#2B395B] rounded-xl text-[10px] font-bold text-gray-400">
                            Nominees Limit: <span className="text-white font-black">{formData.nominees.length} / {formData.nomineeLimit}</span>
                        </div>
                    </div>

                    {/* Search Field & Auto-complete dropdown */}
                    <div className="relative max-w-xl">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Search {formData.targetType}</label>
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowResultsDropdown(true);
                                }}
                                onFocus={() => setShowResultsDropdown(true)}
                                className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all placeholder:text-gray-600"
                                placeholder={`Type name of ${formData.targetType.toLowerCase() === 'assets' ? 'asset (e.g. Bugatti, Villa)' : 'dealer (e.g. Sotheby, Elite)'}...`}
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {showResultsDropdown && searchQuery.trim() && (
                            <div className="absolute top-full inset-x-0 bg-[#0F172A] border border-[#222E4A] rounded-2xl mt-2 overflow-hidden shadow-2xl z-50 divide-y divide-[#1E293B]">
                                {isSearching ? (
                                    <div className="p-4 text-center text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
                                        Searching database...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((item) => {
                                        const alreadyAdded = formData.nominees.some(n => n.id === item.id || n._id === item.id);
                                        return (
                                            <div 
                                                key={item.id} 
                                                onClick={() => !alreadyAdded && addNominee(item)}
                                                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${alreadyAdded ? 'opacity-40 cursor-default bg-[#151D30]/20' : 'hover:bg-[#1E293B]/70'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img src={item.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt={item.name} className="w-9 h-9 rounded-lg object-cover bg-gray-800" />
                                                    <div className="text-left">
                                                        <p className="text-xs font-bold text-white leading-normal">{item.name}</p>
                                                        <p className="text-[10px] text-gray-500 font-semibold">{item.detail}</p>
                                                    </div>
                                                </div>
                                                {alreadyAdded ? (
                                                    <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20"><FiCheck /> Added</span>
                                                ) : (
                                                    <button type="button" className="text-[10px] font-bold text-[#6366F1] hover:underline uppercase tracking-wider">Add nominee</button>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-4 text-center text-xs text-gray-500 font-bold uppercase tracking-wider">No matching {formData.targetType.toLowerCase()} found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Nominees Added Listing */}
                    <div className="space-y-3 mt-6">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nominated Candidates</label>
                        {formData.nominees.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.nominees.map((nom, index) => (
                                    <div key={nom.id} className="flex items-center justify-between p-3.5 bg-[#151D30]/40 border border-[#222E4A] rounded-2xl hover:border-[#2C3B5E] transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <span className="w-6 h-6 rounded-full bg-[#1C253B] flex items-center justify-center text-[10px] text-[#D48D2A] font-bold">{index + 1}</span>
                                            <img src={nom.image} alt={nom.name} className="w-11 h-11 rounded-xl object-cover bg-gray-800" />
                                            <div className="text-left">
                                                <h4 className="text-xs font-bold text-white tracking-wide">{nom.name}</h4>
                                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{nom.detail}</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeNominee(nom.id)}
                                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <FiTrash2 className="text-sm" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#151D30]/20 rounded-2xl p-12 border border-dashed border-[#222E4A] text-center flex flex-col items-center justify-center text-gray-500">
                                <FiAward className="text-3xl text-gray-600 mb-3" />
                                <p className="text-xs font-bold uppercase tracking-wider">No nominees nominated yet</p>
                                <p className="text-[10px] text-gray-600 mt-1 max-w-xs">Use the search bar above to populate list candidates.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bottom Actions footer */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#1C253B]">
                <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-[#1C253B] text-gray-300 rounded-xl hover:bg-[#253252] transition-colors font-bold text-xs uppercase tracking-wider">Cancel</button>
                {step > 1 && (
                    <button type="button" onClick={handlePrevStep} className="px-6 py-2.5 bg-[#151D30] border border-[#2B395B] text-gray-300 rounded-xl hover:bg-[#253252] transition-colors font-bold text-xs uppercase tracking-wider">Back</button>
                )}
                <button 
                    type="button" 
                    onClick={handleNextStep} 
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#6366F1] text-white rounded-xl hover:bg-[#4F46E5] transition-colors font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#6366F1]/20 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : step === 2 ? 'Save & Publish' : 'Save & Next'}
                </button>
            </div>

            {cropModalOpen && (
                <ImageCropModal 
                    src={cropImageSrc}
                    onCropComplete={(blob) => {
                        if (cropTarget === 'cover') {
                            setCroppedCoverBlob(blob);
                            setFormData(prev => ({ ...prev, categoryImage: URL.createObjectURL(blob) }));
                        } else {
                            setCroppedBannerBlob(blob);
                            setFormData(prev => ({ ...prev, bannerImage: URL.createObjectURL(blob) }));
                        }
                        setCropModalOpen(false);
                    }}
                    onClose={() => setCropModalOpen(false)}
                    isUploading={false}
                />
            )}
        </div>
    );
};

export default RankingCategoryForm;
