import React, { useState, useEffect } from 'react';
import { FiImage, FiPlus, FiGrid, FiTrash2, FiInfo, FiChevronRight } from 'react-icons/fi';

const types = [
    { id: 'Cars', label: 'Cars', icon: '🚗' },
    { id: 'Real Estate', label: 'Real Estate', icon: '🏠' },
    { id: 'Yachts', label: 'Yachts', icon: '⛵' },
    { id: 'Bikes', label: 'Bikes', icon: '🏍️' },
    { id: 'Content Creator', label: 'Content Creator', icon: '👤' },
    { id: 'Other', label: 'Other', icon: '⚙️' }
];

const RankingCategoryForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        type: 'Cars',
        shortDescription: '',
        detailedDescription: '',
        categoryImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
        bannerImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&auto=format&fit=crop&q=60',
        icon: '🚗',
        votingPeriodStart: '2026-01-01',
        votingPeriodEnd: '2026-06-30',
        nomineeLimit: 10,
        allowMultipleVotes: true,
        showInPopularLinks: true,
        displayOrder: 1,
        featuredCategory: true,
        categoryColor: '#6366F1',
        status: 'Draft'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                votingPeriodStart: initialData.votingPeriodStart || '2026-01-01',
                votingPeriodEnd: initialData.votingPeriodEnd || '2026-06-30',
            });
        }
    }, [initialData]);

    const handleTitleChange = (e) => {
        const val = e.target.value;
        const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setFormData(prev => ({
            ...prev,
            title: val,
            slug: generatedSlug
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form if creating new
        if (!initialData) {
            setFormData({
                title: '',
                slug: '',
                type: 'Cars',
                shortDescription: '',
                detailedDescription: '',
                categoryImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
                bannerImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&auto=format&fit=crop&q=60',
                icon: '🚗',
                votingPeriodStart: '2026-01-01',
                votingPeriodEnd: '2026-06-30',
                nomineeLimit: 10,
                allowMultipleVotes: true,
                showInPopularLinks: true,
                displayOrder: 1,
                featuredCategory: true,
                categoryColor: '#6366F1',
                status: 'Draft'
            });
        }
    };

    const mockChangeImage = (type) => {
        const luxuryCarImages = [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60', // Porsche
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60', // Corvette
            'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&auto=format&fit=crop&q=60', // Audi
            'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?w=800&auto=format&fit=crop&q=60', // Lambo
        ];
        const randomImage = luxuryCarImages[Math.floor(Math.random() * luxuryCarImages.length)];
        
        if (type === 'cover') {
            setFormData(prev => ({ ...prev, categoryImage: randomImage }));
        } else {
            setFormData(prev => ({ ...prev, bannerImage: randomImage }));
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-8 animate-in fade-in duration-500 text-left">
            {/* Top Banner Stepper Indicator */}
            <div className="bg-[#101622] rounded-2xl p-4 border border-[#1B243B] flex flex-wrap gap-4 items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2 text-white font-bold"><span className="w-5 h-5 rounded-full bg-[#6366F1] flex items-center justify-center text-[10px]">1</span> Basic Information</span>
                    <FiChevronRight className="text-gray-600 hidden md:block" />
                    <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-[#1C253B] flex items-center justify-center text-[10px]">2</span> Nominees (Top 10)</span>
                    <FiChevronRight className="text-gray-600 hidden md:block" />
                    <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-[#1C253B] flex items-center justify-center text-[10px]">3</span> Display & SEO</span>
                    <FiChevronRight className="text-gray-600 hidden md:block" />
                    <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-[#1C253B] flex items-center justify-center text-[10px]">4</span> Settings & Publish</span>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={onCancel} className="px-4 py-1.5 bg-[#1C253B] text-gray-300 rounded-lg hover:bg-[#253252] transition-colors font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors font-semibold shadow-lg shadow-[#6366F1]/20">Save & Next</button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* LEFT BLOCK: Basic details (xl:col-span-6) */}
                <div className="xl:col-span-6 space-y-6">
                    <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-3 Canela">Basic Information</h3>
                        
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
                                className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all placeholder:text-gray-600"
                                placeholder="e.g. Best Hypercars of 2026"
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
                            <p className="text-[9px] text-gray-500 font-semibold mt-1.5">
                                This will be used in the URL: <span className="text-gray-400 font-bold">otulia.com/rankings/{formData.slug || 'slug'}</span>
                            </p>
                        </div>

                        {/* Type Selector Grid */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Category Type *</label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {types.map((t) => {
                                    const isSelected = formData.type === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t.id, icon: t.icon })}
                                            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                                                isSelected 
                                                ? 'bg-[#6366F1]/10 border-[#6366F1] text-white shadow-lg' 
                                                : 'bg-[#151D30]/60 border-[#222E4A] text-gray-400 hover:border-gray-600 hover:text-white'
                                            }`}
                                        >
                                            <span className="text-lg">{t.icon}</span>
                                            <span className="text-[9px] font-extrabold uppercase tracking-tight text-center truncate w-full">{t.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Short Description */}
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

                        {/* Detailed Description */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detailed Description</label>
                                <span className="text-[9px] font-bold text-gray-500">{formData.detailedDescription.length}/1000</span>
                            </div>
                            
                            {/* Rich Editor Toolbar Mock */}
                            <div className="bg-[#151D30] border border-[#222E4A] rounded-xl overflow-hidden focus-within:border-[#6366F1] transition-all">
                                <div className="bg-[#1C253B]/50 px-3 py-2 border-b border-[#222E4A] flex flex-wrap gap-2 text-gray-400 text-xs font-bold select-none">
                                    <span className="cursor-pointer hover:text-white px-1">B</span>
                                    <span className="cursor-pointer hover:text-white px-1 italic">I</span>
                                    <span className="cursor-pointer hover:text-white px-1 underline">U</span>
                                    <span className="h-4 w-px bg-[#222E4A] mx-1"></span>
                                    <span className="cursor-pointer hover:text-white px-1">≡</span>
                                    <span className="cursor-pointer hover:text-white px-1">🔗</span>
                                    <span className="cursor-pointer hover:text-white px-1">”</span>
                                    <span className="cursor-pointer hover:text-white px-1">🖼️</span>
                                    <span className="cursor-pointer hover:text-white px-1">📊</span>
                                </div>
                                <textarea 
                                    rows="4"
                                    maxLength="1000"
                                    value={formData.detailedDescription}
                                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                                    className="w-full bg-transparent border-0 px-4 py-3 text-xs font-bold text-white focus:outline-none resize-none placeholder:text-gray-600"
                                    placeholder="Enter full description detail..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* MIDDLE BLOCK: Images (xl:col-span-3) */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Category Image */}
                    <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Category Image *</h3>
                        <div className="h-40 rounded-xl overflow-hidden bg-gray-900 border border-[#222E4A] relative group">
                            <img src={formData.categoryImage} alt="Cover Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={() => mockChangeImage('cover')} className="px-3 py-1.5 bg-[#1C253B] text-white rounded-lg text-[9px] font-bold uppercase hover:bg-black transition-colors">Change Cover</button>
                            </div>
                        </div>
                        <button type="button" onClick={() => mockChangeImage('cover')} className="w-full py-2.5 bg-[#151D30] border border-[#222E4A] rounded-xl text-[10px] font-bold text-white hover:bg-[#222E4A] transition-all uppercase tracking-wider flex items-center justify-center gap-1">
                            <FiImage /> Change Image
                        </button>
                        <p className="text-[8px] text-gray-500 font-semibold text-center">Recommended size: 1200x630px (JPG, PNG, WebP)</p>
                    </div>

                    {/* Banner Image */}
                    <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Banner Image <span className="text-gray-500 font-bold">(Optional)</span></h3>
                        <div className="h-28 rounded-xl overflow-hidden bg-gray-900 border border-[#222E4A] relative group">
                            <img src={formData.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={() => mockChangeImage('banner')} className="px-3 py-1.5 bg-[#1C253B] text-white rounded-lg text-[9px] font-bold uppercase hover:bg-black transition-colors">Change Banner</button>
                            </div>
                        </div>
                        <button type="button" onClick={() => mockChangeImage('banner')} className="w-full py-2.5 bg-[#151D30] border border-[#222E4A] rounded-xl text-[10px] font-bold text-white hover:bg-[#222E4A] transition-all uppercase tracking-wider flex items-center justify-center gap-1">
                            <FiImage /> Change Banner
                        </button>
                        <p className="text-[8px] text-gray-500 font-semibold text-center">Recommended size: 1920x600px (JPG, PNG, WebP)</p>
                    </div>

                    {/* Icon Selection */}
                    <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Icon <span className="text-gray-500 font-bold">(Optional)</span></h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#6366F1]/10 rounded-xl border border-[#6366F1]/30 flex items-center justify-center text-xl shrink-0">
                                {formData.icon}
                            </div>
                            <div className="flex-1 space-y-1">
                                <input 
                                    type="text" 
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                                />
                                <p className="text-[8px] text-gray-500 font-semibold">Recommended size: 512x512px (PNG, SVG)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT BLOCK: Settings & Publishing (xl:col-span-3) */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Category Settings */}
                    <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Category Settings</h3>
                        
                        {/* Voting Period */}
                        <div>
                            <label className="block text-[8px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Voting Period *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <input 
                                    type="date"
                                    required
                                    value={formData.votingPeriodStart}
                                    onChange={(e) => setFormData({ ...formData, votingPeriodStart: e.target.value })}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-lg px-2 py-1 text-white focus:outline-none"
                                />
                                <input 
                                    type="date"
                                    required
                                    value={formData.votingPeriodEnd}
                                    onChange={(e) => setFormData({ ...formData, votingPeriodEnd: e.target.value })}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-lg px-2 py-1 text-white focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Nominee Limit */}
                        <div>
                            <label className="block text-[8px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Nominee Limit</label>
                            <input 
                                type="number" 
                                required
                                min="1"
                                max="100"
                                value={formData.nomineeLimit}
                                onChange={(e) => setFormData({ ...formData, nomineeLimit: Number(e.target.value) })}
                                className="w-full bg-[#151D30] border border-[#222E4A] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                            <p className="text-[8px] text-gray-500 font-semibold mt-1">Maximum 10 nominees allowed</p>
                        </div>

                        {/* Toggles */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-gray-300">Allow Multiple Votes</span>
                                <input 
                                    type="checkbox" 
                                    checked={formData.allowMultipleVotes}
                                    onChange={(e) => setFormData({ ...formData, allowMultipleVotes: e.target.checked })}
                                    className="w-4 h-4 accent-[#6366F1] cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-gray-300">Show in Popular Links</span>
                                <input 
                                    type="checkbox" 
                                    checked={formData.showInPopularLinks}
                                    onChange={(e) => setFormData({ ...formData, showInPopularLinks: e.target.checked })}
                                    className="w-4 h-4 accent-[#6366F1] cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Display Settings */}
                    <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Display Settings</h3>
                        
                        {/* Display Order */}
                        <div>
                            <label className="block text-[8px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Display Order</label>
                            <input 
                                type="number" 
                                required
                                value={formData.displayOrder}
                                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                                className="w-full bg-[#151D30] border border-[#222E4A] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                            <p className="text-[8px] text-gray-500 font-semibold mt-1">Lower numbers appear first</p>
                        </div>

                        {/* Featured Toggles */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-gray-300">Featured Category</span>
                            <input 
                                type="checkbox" 
                                checked={formData.featuredCategory}
                                onChange={(e) => setFormData({ ...formData, featuredCategory: e.target.checked })}
                                className="w-4 h-4 accent-[#6366F1] cursor-pointer"
                            />
                        </div>

                        {/* Category Color */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-gray-300">Category Color</span>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="color" 
                                    value={formData.categoryColor}
                                    onChange={(e) => setFormData({ ...formData, categoryColor: e.target.value })}
                                    className="w-6 h-6 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                                />
                                <span className="text-[10px] font-mono text-gray-400">{formData.categoryColor}</span>
                            </div>
                        </div>
                    </div>

                    {/* Publish Settings */}
                    <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Publish Settings</h3>
                        
                        {/* Status Selection */}
                        <div>
                            <label className="block text-[8px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-[#151D30] border border-[#222E4A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            >
                                <option value="Draft">Draft</option>
                                <option value="Active">Active</option>
                            </select>
                            <p className="text-[8px] text-gray-500 font-semibold mt-1.5">Draft: Only visible to admins. Publish: Visible to all users</p>
                        </div>

                        {/* Info banner alert box */}
                        <div className="bg-[#6366F1]/10 border border-[#6366F1]/30 rounded-xl p-3.5 flex items-start gap-2">
                            <FiInfo className="text-sm text-[#6366F1] shrink-0 mt-0.5" />
                            <p className="text-[9px] text-[#818CF8] font-semibold leading-normal">
                                You can save this category as draft and publish it later when you're ready.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#1C253B]">
                <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-[#1C253B] text-gray-300 rounded-xl hover:bg-[#253252] transition-colors font-semibold text-xs uppercase">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-[#6366F1] text-white rounded-xl hover:bg-[#4F46E5] transition-colors font-semibold text-xs uppercase shadow-lg shadow-[#6366F1]/20">Save & Next</button>
            </div>
        </form>
    );
};

export default RankingCategoryForm;
