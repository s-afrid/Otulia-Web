import React from 'react';
import { 
    FiCalendar, FiChevronDown, FiPlus, FiUsers, FiTrendingUp, FiTrendingDown, 
    FiUser, FiCheckCircle, FiActivity, FiSearch, FiFilter, FiGlobe, 
    FiMessageSquare, FiEye, FiMoreVertical, FiStar, FiPhone, FiMail, 
    FiMessageCircle, FiClock, FiSmartphone 
} from 'react-icons/fi';
import facebookIcon from '../../assets/icons/social/facebook.svg';
import instagramIcon from '../../assets/icons/social/instagram.svg';
import linkedinIcon from '../../assets/icons/social/linkedin.svg';
import xIcon from '../../assets/icons/social/x.svg';
import youtubeIcon from '../../assets/icons/social/youtube.svg';
import whatsappIcon from '../../assets/icons/social/whatsapp.svg';
import numberWithCommas from '../../modules/numberwithcomma';

const LeadsTab = ({ 
    data, 
    setIsAddLeadModalOpen, 
    handleExportCSV, 
    leadSearchQuery, 
    setLeadSearchQuery, 
    leadStatusFilter, 
    setLeadStatusFilter, 
    leadSourceFilter, 
    setLeadSourceFilter, 
    leadAssetFilter, 
    setLeadAssetFilter, 
    activeLeadDropdown, 
    setActiveLeadDropdown, 
    handleStatusChange, 
    setViewLead,
    setIsScheduleModalOpen,
    setSelectedLeadForSchedule,
    leadCurrentPage,
    setLeadCurrentPage,
    leadItemsPerPage,
    setLeadItemsPerPage
}) => {
    const [revealedPhones, setRevealedPhones] = React.useState({});

    const getSourceIcon = (source) => {
        const s = source?.toLowerCase() || '';
        if (s.includes('facebook')) return <img src={facebookIcon} alt="Facebook" className="w-2.5 h-2.5" />;
        if (s.includes('instagram')) return <img src={instagramIcon} alt="Instagram" className="w-2.5 h-2.5" />;
        if (s.includes('linkedin')) return <img src={linkedinIcon} alt="LinkedIn" className="w-2.5 h-2.5" />;
        if (s.includes('whatsapp')) return <img src={whatsappIcon} alt="WhatsApp" className="w-2.5 h-2.5" />;
        if (s.includes('x.com') || s === 'x' || s.includes('twitter')) return <img src={xIcon} alt="X" className="w-2.5 h-2.5" />;
        if (s.includes('youtube')) return <img src={youtubeIcon} alt="YouTube" className="w-2.5 h-2.5" />;
        return <FiGlobe className="text-[10px]"/>;
    };

    let filteredLeads = (data?.leads || []);
    if (leadStatusFilter !== 'All Status') filteredLeads = filteredLeads.filter(l => l.status === leadStatusFilter);
    if (leadSourceFilter !== 'All Source') {
        filteredLeads = filteredLeads.filter(l => {
            const source = l.source || 'Website';
            return source.toLowerCase().includes(leadSourceFilter.toLowerCase());
        });
    }
    if (leadAssetFilter !== 'All Assets') {
        filteredLeads = filteredLeads.filter(l => l.category === leadAssetFilter);
    }
    if (leadSearchQuery) {
        const q = leadSearchQuery.toLowerCase();
        filteredLeads = filteredLeads.filter(l => (l.name && l.name.toLowerCase().includes(q)) || (l.phone && l.phone.toLowerCase().includes(q)) || (l.email && l.email.toLowerCase().includes(q)));
    }

    // Pagination Logic
    const totalLeads = filteredLeads.length;
    const totalPages = Math.ceil(totalLeads / leadItemsPerPage);
    const startIndex = (leadCurrentPage - 1) * leadItemsPerPage;
    const paginatedLeads = filteredLeads.slice(startIndex, startIndex + leadItemsPerPage);

    const getStatusStyles = (status) => {
        switch(status) {
            case 'New': return 'bg-[#EEF2FF] text-[#4F46E5]';
            case 'Contacted': return 'bg-[#E0F2FE] text-[#0284C7]';
            case 'Qualified': return 'bg-[#FFF7ED] text-[#EA580C]';
            case 'Proposal Sent': return 'bg-[#F5F3FF] text-[#7C3AED]';
            case 'Negotiating': return 'bg-[#FEF3C7] text-[#D97706]';
            case 'Closed': return 'bg-[#ECFDF5] text-[#059669]';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const handleWhatsApp = (lead, assetName) => {
        const phoneNumber = lead.phone;
        if (!phoneNumber || phoneNumber === 'No Phone Provided') {
            alert("Lead phone number not available.");
            return;
        }

        const njmId = lead.listingReference ? ` (Ref: ${lead.listingReference})` : "";
        const imageLink = lead.assetImage ? `\n\nView Image: ${lead.assetImage}` : "";
        const text = `Hello ${lead.name}, thank you for your interest in ${assetName}${njmId} on Otulia. I'm reaching out to discuss this further with you. When would be a good time to connect?${imageLink}`;

        let cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
        if (!cleanPhone.startsWith("+") && cleanPhone.length > 0) {
            cleanPhone = "+" + cleanPhone;
        }
        const waUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(text)}`;
        window.open(waUrl, "_blank");
    };

    return (
        <div className="h-full flex flex-col gap-4 animate-in fade-in duration-700">
            {/* Header Row */}
            <div className="flex justify-between items-end shrink-0 mb-1">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 cursor-pointer shadow-sm">
                    <FiCalendar className="text-gray-400" /> Last 30 days <FiChevronDown className="ml-1 text-gray-400" />
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsAddLeadModalOpen(true)} className="px-5 py-2 rounded-xl text-[11px] font-bold bg-gray-900 text-white shadow-sm flex items-center gap-2 hover:opacity-90 transition-opacity"><FiPlus className="text-white"/> Add Lead</button>
                    <button onClick={handleExportCSV} className="px-5 py-2 rounded-xl text-[11px] font-bold border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 flex items-center gap-2 transition-colors">Export</button>
                </div>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[clamp(8px,1vh,16px)] shrink-0 min-h-0">
                <div className="bg-white rounded-[clamp(8px,1.2vh,16px)] p-[clamp(10px,1.5vh,20px)] flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-[clamp(8px,0.9vh,12px)] font-black uppercase tracking-widest text-gray-400">Total Leads</span>
                            <span className="text-[clamp(18px,2.4vh,32px)] font-bold text-gray-900 kaisei leading-none mt-1">{numberWithCommas(data?.stats?.totalLeads || 0)}</span>
                        </div>
                        <div className="w-[clamp(24px,3.5vh,48px)] h-[clamp(24px,3.5vh,48px)] rounded-[clamp(6px,1vh,12px)] bg-[#FFF8F0] justify-center text-[#D48D2A] flex items-center shrink-0 border border-[#F2E8DB]"><FiUsers className="text-[clamp(12px,1.8vh,24px)]" /></div>
                    </div>
                    <span className={`inter text-[clamp(8px,1.1vh,14px)] font-bold ${Number(data?.stats?.trends?.leads?.change) >= 0 ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1 mt-[clamp(8px,1vh,16px)] tracking-wide`}>
                        {Number(data?.stats?.trends?.leads?.change) >= 0 ? <FiTrendingUp className="text-[clamp(10px,1.3vh,18px)]" /> : <FiTrendingDown className="text-[clamp(10px,1.4vh,20px)]" />} 
                        {Math.abs(data?.stats?.trends?.leads?.change || 0)}% 
                        <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span>
                    </span>
                </div>
                {/* New Leads */}
                <div className="bg-white rounded-[clamp(8px,1.2vh,16px)] p-[clamp(10px,1.5vh,20px)] flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-[clamp(8px,0.9vh,12px)] font-black uppercase tracking-widest text-gray-400">New Leads</span>
                            <span className="text-[clamp(18px,2.4vh,32px)] font-bold text-gray-900 kaisei leading-none mt-1">{(data?.leads || []).filter(l=>l.status==='New').length}</span>
                        </div>
                        <div className="w-[clamp(24px,3.5vh,48px)] h-[clamp(24px,3.5vh,48px)] rounded-[clamp(6px,1vh,12px)] bg-[#FFF8F0] justify-center text-[#D48D2A] flex items-center shrink-0 border border-[#F2E8DB]"><FiUser className="text-[clamp(12px,1.8vh,24px)]" /></div>
                    </div>
                    <span className={`inter text-[clamp(8px,1.1vh,14px)] font-bold ${Number(data?.stats?.trends?.leads?.change) >= 0 ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1 mt-[clamp(8px,1vh,16px)] tracking-wide`}>
                        {Number(data?.stats?.trends?.leads?.change) >= 0 ? <FiTrendingUp className="text-[clamp(10px,1.3vh,18px)]" /> : <FiTrendingDown className="text-[clamp(10px,1.4vh,20px)]" />} 
                        {Math.abs(data?.stats?.trends?.leads?.change || 0)}% 
                        <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span>
                    </span>
                </div>
                {/* Qualified Leads */}
                <div className="bg-white rounded-[clamp(8px,1.2vh,16px)] p-[clamp(10px,1.5vh,20px)] flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-[clamp(8px,0.9vh,12px)] font-black uppercase tracking-widest text-gray-400">Qualified Leads</span>
                            <span className="text-[clamp(18px,2.4vh,32px)] font-bold text-gray-900 kaisei leading-none mt-1">{(data?.leads || []).filter(l=>l.status==='Qualified').length}</span>
                        </div>
                        <div className="w-[clamp(24px,3.5vh,48px)] h-[clamp(24px,3.5vh,48px)] rounded-[clamp(6px,1vh,12px)] bg-emerald-50 justify-center text-emerald-600 flex items-center shrink-0 border border-emerald-100"><FiCheckCircle className="text-[clamp(12px,1.8vh,24px)]" /></div>
                    </div>
                    <span className={`inter text-[clamp(8px,1.1vh,14px)] font-bold ${Number(data?.stats?.trends?.leads?.change) >= 0 ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1 mt-[clamp(8px,1vh,16px)] tracking-wide`}>
                        {Number(data?.stats?.trends?.leads?.change) >= 0 ? <FiTrendingUp className="text-[10px]" /> : <FiTrendingDown className="text-[10px]" />} 
                        {Math.abs(data?.stats?.trends?.leads?.change || 0)}% 
                        <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span>
                    </span>
                </div>
                {/* Conversion Rate */}
                <div className="bg-white rounded-[clamp(8px,1.2vh,16px)] p-[clamp(10px,1.5vh,20px)] flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-[clamp(8px,0.9vh,12px)] font-black uppercase tracking-widest text-gray-400">Conversion Rate</span>
                            <span className="text-[clamp(18px,2.4vh,32px)] font-bold text-gray-900 canela leading-none mt-1">{data?.stats?.avgConversion || '0.0'}%</span>
                        </div>
                        <div className="w-[clamp(24px,3.5vh,48px)] h-[clamp(24px,3.5vh,48px)] rounded-[clamp(6px,1vh,12px)] bg-purple-50 justify-center text-purple-600 flex items-center shrink-0 border border-purple-100"><FiActivity className="text-[clamp(12px,1.8vh,24px)]" /></div>
                    </div>
                    <span className={`inter text-[clamp(8px,1.1vh,14px)] font-bold ${Number(data?.stats?.trends?.leads?.change) >= 0 ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1 mt-[clamp(8px,1vh,16px)] tracking-wide`}>
                        {Number(data?.stats?.trends?.leads?.change) >= 0 ? <FiTrendingUp className="text-[10px]" /> : <FiTrendingDown className="text-[10px]" />} 
                        {Math.abs(data?.stats?.trends?.leads?.change || 0)}% 
                        <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span>
                    </span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex justify-between gap-3 shrink-0 py-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400 text-sm" />
                    </div>
                    <input
                        type="text"
                        value={leadSearchQuery}
                        onChange={e => setLeadSearchQuery(e.target.value)}
                        placeholder="Search leads by name, email, phone..."
                        className="w-full bg-white border border-gray-200 rounded-[1rem] py-2.5 pl-9 pr-4 text-[11px] font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D48D2A] focus:ring-1 focus:ring-[#D48D2A] transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-3 shrink-0">
                    <div className="relative w-[130px]">
                        <select value={leadStatusFilter} onChange={e => setLeadStatusFilter(e.target.value)} className="w-full appearance-none bg-white border border-gray-200 rounded-[1rem] py-2.5 pl-4 pr-8 text-[11px] font-bold text-gray-600 focus:outline-none cursor-pointer hover:border-gray-300 shadow-sm">
                            <option value="All Status">All Status</option>
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Negotiating">Negotiating</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                    </div>
                    <div className="relative w-[130px]">
                        <select value={leadSourceFilter} onChange={e => setLeadSourceFilter(e.target.value)} className="w-full appearance-none bg-white border border-gray-200 rounded-[1rem] py-2.5 pl-4 pr-8 text-[11px] font-bold text-gray-600 focus:outline-none cursor-pointer hover:border-gray-300 shadow-sm">
                            <option value="All Source">All Source</option>
                            <option value="Website">Website</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Email">Email</option>
                            <option value="Other">Other</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                    </div>
                    <div className="relative w-[130px]">
                        <select value={leadAssetFilter} onChange={e => setLeadAssetFilter(e.target.value)} className="w-full appearance-none bg-white border border-gray-200 rounded-[1rem] py-2.5 pl-4 pr-8 text-[11px] font-bold text-gray-600 focus:outline-none cursor-pointer hover:border-gray-300 shadow-sm">
                            <option value="All Assets">All Assets</option>
                            <option value="CarAsset">Cars</option>
                            <option value="EstateAsset">Real Estate</option>
                            <option value="YachtAsset">Yachts</option>
                            <option value="BikeAsset">Bikes</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                    </div>
                    <button className="px-4 py-2.5 rounded-[1rem] border border-gray-200 bg-white text-gray-700 font-bold text-[11px] shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <FiFilter className="text-gray-400"/> More Filters
                    </button>
                </div>
            </div>

            {/* List Area */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto custom-scrollbar pr-1">
                    <div className="flex flex-col gap-3 pb-4">
                        {paginatedLeads.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 font-medium">No leads found matching your criteria.</div>
                        ) : (
                            paginatedLeads.map((lead, i) => {
                                const asset = (data?.inventory || []).find(a => a._id === lead.assetId || a.id === lead.assetId);
                                const assetName = lead.assetName || (asset ? (asset.propertyName || asset.yachtName || asset.name || asset.title || `${asset.make || ''} ${asset.model || ''}`.trim()) : null) || 'Unknown Asset';
                                const assetCategory = asset?.category?.replace('Asset', '') || 'Asset';
                                const assetPrice = (lead.assetPrice || asset?.price) ? `$${numberWithCommas(lead.assetPrice || asset?.price)}` : 'Price on request';
                                const assetImage = lead.assetImage || asset?.images?.[0];
                                
                                return (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-6 group relative">
                                        {/* Lead Profile Section */}
                                        <div className="flex items-start gap-4 flex-[1.2] min-w-0">
                                            <div className="relative shrink-0">
                                                <div className="w-20 h-20 rounded-full bg-gray-100 shadow-sm overflow-hidden">
                                                    <img 
                                                        src={lead.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=random`} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=random`; }}
                                                    />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://flagcdn.com/w20/${lead.countryCode || 'us'}.png`} className="w-4 h-3 object-contain" alt="Country" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-bold text-gray-900 truncate">{lead.name}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusStyles(lead.status)}`}>
                                                        {lead.status}
                                                    </span>
                                                    <FiStar className="text-gray-300 text-xs cursor-pointer hover:text-amber-400 transition-colors" />
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1.5 truncate"><FiMail className="text-gray-400 shrink-0" /> {lead.email}</span>
                                                    <span className="flex items-center gap-1.5 shrink-0"><FiPhone className="text-gray-400 shrink-0" /> {lead.phone} <img src={whatsappIcon} className="w-2.5 h-2.5 ml-0.5" alt="WA" /></span>
                                                </div>
                                                <div className="bg-[#FFF8F1] rounded-xl px-3 py-2 mt-1">
                                                    <p className="text-[10px] text-gray-700 font-medium line-clamp-1 leading-relaxed">
                                                        {lead.message || "I'm interested in this vehicle. Is it still available? Can we schedule a test drive?"}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><FiClock className="text-gray-300" /> {lead.date ? new Date(lead.date).toLocaleDateString() : '01/15/2024'} @ {lead.date ? new Date(lead.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '04:00 PM'}</span>
                                                    <span>Source: {lead.source || 'Website'}</span>
                                                    <div className="flex items-center gap-1.5 ml-auto">
                                                        <span>Lead Score</span>
                                                        <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] border border-emerald-100">85</span>
                                                        <svg className="w-10 h-4 text-emerald-400" viewBox="0 0 40 16">
                                                            <path d="M0 12 L8 8 L16 10 L24 4 L32 8 L40 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Asset Section */}
                                        <div className="flex items-center gap-6 flex-1 border-x border-gray-50 px-6">
                                            <div className="w-44 h-28 rounded-xl overflow-hidden shrink-0">
                                                {assetImage ? 
                                                    <img src={assetImage} className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://placehold.co/400x400?text=No+Image"; }}/> : 
                                                    <img src="https://placehold.co/400x400?text=No+Image" className="w-full h-full object-cover opacity-30"/>
                                                }
                                            </div>
                                            <div className="flex flex-col gap-1 truncate">
                                                <span className="text-[14px] font-bold text-gray-900 truncate">{assetName}</span>
                                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{assetCategory}</span>
                                                <span className="text-[15px] font-black text-gray-900 mt-1">{assetPrice}</span>
                                            </div>
                                        </div>

                                        {/* Actions Section */}
                                        <div className="flex flex-col gap-2 w-44 shrink-0">
                                            <button 
                                                onClick={() => handleWhatsApp(lead, assetName)}
                                                className="w-full py-1.5 rounded-lg bg-[#0F172A] text-white text-[10px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                            >
                                                <img src={whatsappIcon} className="w-3 h-3 brightness-0 invert" alt="WA" /> Send Message
                                            </button>
                                            {revealedPhones[lead.id] ? (
                                                <a 
                                                    href={`tel:${lead.phone}`}
                                                    className="w-full py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                                >
                                                    <FiPhone className="text-[12px]" /> {lead.phone}
                                                </a>
                                            ) : (
                                                <button 
                                                    onClick={() => setRevealedPhones(prev => ({...prev, [lead.id]: true}))}
                                                    className="w-full py-1.5 rounded-lg bg-[#15803D] text-white text-[10px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                                >
                                                    <FiPhone className="text-[12px]" /> Call Now
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => { 
                                                    const enrichedLead = { ...lead, assetImage: assetImage, assetName: assetName };
                                                    setSelectedLeadForSchedule(enrichedLead); 
                                                    setIsScheduleModalOpen(true); 
                                                }}
                                                className="w-full py-1.5 rounded-lg bg-[#C2410C] text-white text-[10px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                            >
                                                <FiCalendar className="text-[12px]" /> Schedule
                                            </button>
                                            
                                            <div className="relative mt-1">
                                                <button 
                                                    onClick={() => setActiveLeadDropdown(activeLeadDropdown === lead.id ? null : lead.id)}
                                                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                                >
                                                    {lead.status} <FiChevronDown className="text-gray-400" />
                                                </button>
                                                {activeLeadDropdown === lead.id && (
                                                    <div className="absolute bottom-full left-0 mb-1 w-full bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-[100]">
                                                        {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Closed'].map(s => (
                                                            <button 
                                                                key={s} 
                                                                onClick={() => { handleStatusChange(lead.id, s, lead.isActivity); setActiveLeadDropdown(null); }} 
                                                                className={`w-full text-left px-4 py-1.5 text-[10px] font-bold ${lead.status === s ? 'text-[#D48D2A] bg-[#FFF8F0]' : 'text-gray-600 hover:bg-gray-50'}`}
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* More Options */}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Pagination */}
                <div className="py-2 border-t border-gray-100 flex justify-between items-center bg-transparent">
                    <span className="text-[10px] font-bold text-gray-400">
                        Showing {totalLeads > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + leadItemsPerPage, totalLeads)} of {totalLeads} leads
                    </span>
                    <div className="flex items-center gap-1 justify-center">
                        <button 
                            disabled={leadCurrentPage === 1}
                            onClick={() => setLeadCurrentPage(p => Math.max(1, p - 1))}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            &lt;
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => {
                            const p = i + 1;
                            // Basic dynamic page numbers logic (can be improved with dots for many pages)
                            if (totalPages > 7) {
                                if (p === 1 || p === totalPages || (p >= leadCurrentPage - 1 && p <= leadCurrentPage + 1)) {
                                    return (
                                        <button 
                                            key={p} 
                                            onClick={() => setLeadCurrentPage(p)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] transition-all ${leadCurrentPage === p ? 'text-white bg-[#D48D2A] shadow-sm' : 'text-gray-500 hover:text-gray-900 bg-white border border-gray-200 shadow-sm'}`}
                                        >
                                            {p}
                                        </button>
                                    );
                                }
                                if (p === leadCurrentPage - 2 || p === leadCurrentPage + 2) return <span key={p} className="text-gray-300 font-bold px-1 text-[10px]">...</span>;
                                return null;
                            }

                            return (
                                <button 
                                    key={p} 
                                    onClick={() => setLeadCurrentPage(p)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] transition-all ${leadCurrentPage === p ? 'text-white bg-[#D48D2A] shadow-sm' : 'text-gray-500 hover:text-gray-900 bg-white border border-gray-200 shadow-sm'}`}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        <button 
                            disabled={leadCurrentPage === totalPages || totalPages === 0}
                            onClick={() => setLeadCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            &gt;
                        </button>
                    </div>
                    <div className="relative">
                        <select 
                            value={leadItemsPerPage} 
                            onChange={e => { setLeadItemsPerPage(Number(e.target.value)); setLeadCurrentPage(1); }}
                            className="appearance-none bg-white border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-[10px] font-bold text-gray-600 focus:outline-none hover:border-gray-300 shadow-sm cursor-pointer"
                        >
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadsTab;
