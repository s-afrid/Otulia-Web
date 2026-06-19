import React, { useState, useEffect } from 'react';
import { FiImage, FiPlus, FiGrid, FiTrash2, FiInfo, FiChevronRight, FiSearch, FiCheck, FiChevronLeft, FiAward } from 'react-icons/fi';

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

const RankingCategoryForm = ({ initialData, onSubmit, onCancel }) => {
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        type: 'Cars',
        targetType: 'Assets', // 'Assets' or 'Dealers'
        shortDescription: '',
        detailedDescription: '',
        categoryImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
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
        status: 'Draft',
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
                votingPeriodStart: initialData.votingPeriodStart || '2026-01-01',
                votingPeriodEnd: initialData.votingPeriodEnd || '2026-06-30',
                targetType: initialData.targetType || 'Assets',
                nominees: initialData.nominees || [],
                seoTitle: initialData.seoTitle || '',
                seoKeywords: initialData.seoKeywords || ''
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
        const db = formData.targetType === 'Assets' ? mockAssetNominees : mockDealerNominees;
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const filtered = db.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.detail.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
    }, [searchQuery, formData.targetType]);

    const addNominee = (nominee) => {
        if (formData.nominees.some(n => n.id === nominee.id)) {
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
            nominees: prev.nominees.filter(n => n.id !== id)
        }));
    };

    const handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        onSubmit(formData);
        // Reset form if creating new
        if (!initialData) {
            setFormData({
                title: '',
                slug: '',
                type: 'Cars',
                targetType: 'Assets',
                shortDescription: '',
                detailedDescription: '',
                categoryImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
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
                status: 'Draft',
                nominees: [],
                seoTitle: '',
                seoKeywords: ''
            });
            setStep(1);
        }
    };

    const mockChangeImage = (type) => {
        const luxuryImages = [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=60',
        ];
        const randomImage = luxuryImages[Math.floor(Math.random() * luxuryImages.length)];
        if (type === 'cover') {
            setFormData(prev => ({ ...prev, categoryImage: randomImage }));
        } else {
            setFormData(prev => ({ ...prev, bannerImage: randomImage }));
        }
    };

    const handleNextStep = () => {
        if (step === 1 && !formData.title.trim()) {
            alert("Category title is required.");
            return;
        }
        if (step < 4) setStep(step + 1);
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
                        onClick={() => formData.title.trim() && setStep(1)}
                        className={`flex items-center gap-2 cursor-pointer transition-colors ${step === 1 ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#6366F1] text-white' : 'bg-[#1C253B]'}`}>1</span> 
                        Basic Info
                    </span>
                    <FiChevronRight className="text-gray-700 hidden sm:block" />
                    
                    <span 
                        onClick={() => formData.title.trim() && setStep(2)}
                        className={`flex items-center gap-2 cursor-pointer transition-colors ${step === 2 ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#6366F1] text-white' : 'bg-[#1C253B]'}`}>2</span> 
                        Nominees ({formData.nominees.length})
                    </span>
                    <FiChevronRight className="text-gray-700 hidden sm:block" />
                    
                    <span 
                        onClick={() => formData.title.trim() && setStep(3)}
                        className={`flex items-center gap-2 cursor-pointer transition-colors ${step === 3 ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#6366F1] text-white' : 'bg-[#1C253B]'}`}>3</span> 
                        Display & SEO
                    </span>
                    <FiChevronRight className="text-gray-700 hidden sm:block" />
                    
                    <span 
                        onClick={() => formData.title.trim() && setStep(4)}
                        className={`flex items-center gap-2 cursor-pointer transition-colors ${step === 4 ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-[#6366F1] text-white' : 'bg-[#1C253B]'}`}>4</span> 
                        Settings & Publish
                    </span>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={onCancel} className="px-4 py-1.5 bg-[#1C253B] text-gray-300 rounded-lg hover:bg-[#253252] transition-colors font-bold">Cancel</button>
                    {step > 1 && (
                        <button type="button" onClick={handlePrevStep} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1A2338] text-gray-300 border border-[#2B395B] rounded-lg hover:bg-[#253252] transition-colors font-bold">
                            <FiChevronLeft /> Back
                        </button>
                    )}
                    <button type="button" onClick={handleNextStep} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors font-bold shadow-lg shadow-[#6366F1]/20">
                        {step === 4 ? 'Publish Category' : 'Next Step'} <FiChevronRight />
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
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Short Description</label>
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
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detailed Description</label>
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
                            <div className="h-44 rounded-xl overflow-hidden bg-gray-900 border border-[#222E4A] relative group">
                                <img src={formData.categoryImage} alt="Cover Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button type="button" onClick={() => mockChangeImage('cover')} className="px-3 py-1.5 bg-[#1C253B] text-white rounded-lg text-[9px] font-bold uppercase hover:bg-black transition-colors">Change Cover</button>
                                </div>
                            </div>
                            <button type="button" onClick={() => mockChangeImage('cover')} className="w-full py-2.5 bg-[#151D30] border border-[#222E4A] rounded-xl text-[10px] font-bold text-white hover:bg-[#222E4A] transition-all uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <FiImage /> Choose Image
                            </button>
                        </div>

                        {/* Banner Image */}
                        <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Banner Image <span className="text-gray-500 font-bold">(Optional)</span></h3>
                            <div className="h-24 rounded-xl overflow-hidden bg-gray-900 border border-[#222E4A] relative group">
                                <img src={formData.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button type="button" onClick={() => mockChangeImage('banner')} className="px-3 py-1.5 bg-[#1C253B] text-white rounded-lg text-[9px] font-bold uppercase hover:bg-black transition-colors">Change Banner</button>
                                </div>
                            </div>
                            <button type="button" onClick={() => mockChangeImage('banner')} className="w-full py-2.5 bg-[#151D30] border border-[#222E4A] rounded-xl text-[10px] font-bold text-white hover:bg-[#222E4A] transition-all uppercase tracking-wider flex items-center justify-center gap-1.5">
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
                                {searchResults.length > 0 ? (
                                    searchResults.map((item) => {
                                        const alreadyAdded = formData.nominees.some(n => n.id === item.id);
                                        return (
                                            <div 
                                                key={item.id} 
                                                onClick={() => !alreadyAdded && addNominee(item)}
                                                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${alreadyAdded ? 'opacity-40 cursor-default bg-[#151D30]/20' : 'hover:bg-[#1E293B]/70'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover bg-gray-800" />
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

            {/* STEP 3: Display & SEO */}
            {step === 3 && (
                <div className="bg-[#101622] rounded-[2.5rem] p-6 sm:p-8 border border-[#1B243B] space-y-6">
                    <h3 className="text-sm font-normal text-white border-b border-[#1C253B] pb-3 canela tracking-wide">Display Settings & Search Engine Optimization</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        {/* Display settings */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display Order</label>
                                <input 
                                    type="number" 
                                    required
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                                />
                                <p className="text-[8px] text-gray-500 font-semibold mt-1">Lower display numbers appear first inside voting indexes.</p>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs pt-2">
                                <span className="font-semibold text-gray-300">Featured Category (Homepage Banner)</span>
                                <input 
                                    type="checkbox" 
                                    checked={formData.featuredCategory}
                                    onChange={(e) => setFormData({ ...formData, featuredCategory: e.target.checked })}
                                    className="w-4 h-4 accent-[#6366F1] cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-gray-300">Category Branding Accent Color</span>
                                <div className="flex items-center gap-3 bg-[#151D30] px-3 py-1.5 rounded-xl border border-[#222E4A]">
                                    <input 
                                        type="color" 
                                        value={formData.categoryColor}
                                        onChange={(e) => setFormData({ ...formData, categoryColor: e.target.value })}
                                        className="w-6 h-6 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                                    />
                                    <span className="text-[10px] font-mono text-gray-400 uppercase">{formData.categoryColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* SEO details */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">SEO Meta Title (Optional)</label>
                                <input 
                                    type="text" 
                                    value={formData.seoTitle}
                                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                                    placeholder="e.g., Vote Best Luxury Car Dealers | Otulia Rankings"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">SEO Meta Keywords (Optional)</label>
                                <input 
                                    type="text" 
                                    value={formData.seoKeywords}
                                    onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                                    placeholder="e.g., hypercars, rankings, luxury cars nominees"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: Settings & Publish */}
            {step === 4 && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 text-left">
                    {/* LEFT BLOCK: Date/Status Settings */}
                    <div className="xl:col-span-8 space-y-6">
                        <div className="bg-[#101622] rounded-[2.5rem] p-6 border border-[#1B243B] space-y-6">
                            <h3 className="text-sm font-normal text-white border-b border-[#1C253B] pb-3 canela tracking-wide">Publish & Intervals Configurations</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Voting dates */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Voting Period Interval *</label>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</span>
                                            <input 
                                                type="date"
                                                required
                                                value={formData.votingPeriodStart}
                                                onChange={(e) => setFormData({ ...formData, votingPeriodStart: e.target.value })}
                                                className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-3 py-2 text-white focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-1">End Date</span>
                                            <input 
                                                type="date"
                                                required
                                                value={formData.votingPeriodEnd}
                                                onChange={(e) => setFormData({ ...formData, votingPeriodEnd: e.target.value })}
                                                className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-3 py-2 text-white focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Nominees limit count */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Max Nominees Limit</label>
                                    <input 
                                        type="number" 
                                        required
                                        min="1"
                                        max="50"
                                        value={formData.nomineeLimit}
                                        onChange={(e) => setFormData({ ...formData, nomineeLimit: Number(e.target.value) })}
                                        className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                                    />
                                    <p className="text-[8px] text-gray-500 font-semibold mt-1">Defines maximum candidates slot. Safe default is 10.</p>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="flex items-center justify-between text-xs bg-[#151D30]/40 p-4 border border-[#222E4A]/65 rounded-xl">
                                    <div>
                                        <span className="font-bold text-gray-300 block">Allow Multiple Votes</span>
                                        <span className="text-[8px] text-gray-500 font-semibold mt-0.5 block">Let voters cast multiple votes over time</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={formData.allowMultipleVotes}
                                        onChange={(e) => setFormData({ ...formData, allowMultipleVotes: e.target.checked })}
                                        className="w-4 h-4 accent-[#6366F1] cursor-pointer"
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs bg-[#151D30]/40 p-4 border border-[#222E4A]/65 rounded-xl">
                                    <div>
                                        <span className="font-bold text-gray-300 block">Show in Popular Links</span>
                                        <span className="text-[8px] text-gray-500 font-semibold mt-0.5 block">Render in public home/listing categories</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={formData.showInPopularLinks}
                                        onChange={(e) => setFormData({ ...formData, showInPopularLinks: e.target.checked })}
                                        className="w-4 h-4 accent-[#6366F1] cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Status selection */}
                            <div className="pt-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                                >
                                    <option value="Draft">Draft (Only Admin visible)</option>
                                    <option value="Active">Active (Publish live to all visitors)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT BLOCK: Summary Preview */}
                    <div className="xl:col-span-4 space-y-6">
                        <div className="bg-[#101622] rounded-[2.5rem] p-6 border border-[#1B243B] space-y-5">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Publish Preview Summary</h3>
                            
                            <div className="rounded-2xl overflow-hidden border border-[#222E4A] bg-[#151D30]/50 relative">
                                <div className="h-28 relative">
                                    <img src={formData.categoryImage} alt="Summary Cover" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#151D30] to-transparent"></div>
                                </div>
                                <div className="p-4 space-y-3 relative -mt-4 text-left">
                                    <span className="px-2 py-0.5 bg-[#6366F1] text-white rounded text-[8px] font-black tracking-widest uppercase">
                                        {formData.type} · {formData.targetType}
                                    </span>
                                    <h4 className="text-sm font-bold text-white leading-normal mt-1.5">{formData.title || 'Untitled Category'}</h4>
                                    <p className="text-[10px] text-gray-500 font-semibold leading-normal truncate">{formData.shortDescription || 'No description provided'}</p>
                                    
                                    <div className="flex justify-between items-center text-[9px] text-gray-400 pt-2 border-t border-[#222E4A] mt-2">
                                        <span>Nominees: <span className="text-white font-black">{formData.nominees.length}</span></span>
                                        <span>Status: <span className={`font-black ${formData.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>{formData.status}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1A2338] border border-[#2B395B] rounded-xl p-3 flex items-start gap-2 text-xs">
                                <FiInfo className="text-[#D48D2A] text-sm shrink-0 mt-0.5" />
                                <p className="text-[9px] text-gray-400 leading-normal">
                                    Ensure all candidate nominees are selected correctly. Once published as <span className="text-white font-bold">Active</span>, public votes are castable immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Actions footer */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#1C253B]">
                <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-[#1C253B] text-gray-300 rounded-xl hover:bg-[#253252] transition-colors font-bold text-xs uppercase tracking-wider">Cancel</button>
                {step > 1 && (
                    <button type="button" onClick={handlePrevStep} className="px-6 py-2.5 bg-[#151D30] border border-[#2B395B] text-gray-300 rounded-xl hover:bg-[#253252] transition-colors font-bold text-xs uppercase tracking-wider">Back</button>
                )}
                <button type="button" onClick={handleNextStep} className="px-6 py-2.5 bg-[#6366F1] text-white rounded-xl hover:bg-[#4F46E5] transition-colors font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#6366F1]/20">
                    {step === 4 ? 'Save & Publish' : 'Save & Next'}
                </button>
            </div>
        </div>
    );
};

export default RankingCategoryForm;
