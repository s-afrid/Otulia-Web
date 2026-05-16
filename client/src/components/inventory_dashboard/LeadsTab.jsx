import React from 'react';
import { FiCalendar, FiChevronDown, FiPlus, FiUsers, FiTrendingUp, FiTrendingDown, FiUser, FiCheckCircle, FiActivity, FiSearch, FiFilter, FiGlobe, FiMessageSquare, FiEye, FiMoreVertical } from 'react-icons/fi';
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
    setViewLead 
}) => {
    let leads = (data?.leads || []);
    if (leadStatusFilter !== 'All Status') leads = leads.filter(l => l.status === leadStatusFilter);
    if (leadSourceFilter !== 'All Source') {
        leads = leads.filter(l => {
            const source = l.source || 'Website';
            return source.toLowerCase().includes(leadSourceFilter.toLowerCase());
        });
    }
    if (leadAssetFilter !== 'All Assets') {
        leads = leads.filter(l => l.category === leadAssetFilter);
    }
    if (leadSearchQuery) {
        const q = leadSearchQuery.toLowerCase();
        leads = leads.filter(l => (l.name && l.name.toLowerCase().includes(q)) || (l.phone && l.phone.toLowerCase().includes(q)) || (l.email && l.email.toLowerCase().includes(q)));
    }

    return (
        <div className="h-[calc(100vh-6rem-5rem)] flex flex-col gap-4 animate-in fade-in duration-700 pb-2">
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

            {/* Table Area */}
            <div className="bg-white rounded-[1.25rem] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col relative">
                <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left table-fixed min-w-[1000px]">
                        <thead className="sticky top-0 bg-white z-20 border-b border-gray-50 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.02)]">
                            <tr>
                                <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded border-gray-300 text-[#D48D2A] focus:ring-[#D48D2A]"/></th>
                                <th className="w-2/12 px-2 py-3 inter text-[10px] font-black text-gray-400 uppercase tracking-widest">LEAD</th>
                                <th className="w-[18%] px-2 py-3 inter text-[10px] font-black text-gray-400 uppercase tracking-widest">ASSET INTERESTED</th>
                                <th className="w-2/12 px-2 py-3 inter text-[10px] font-black text-gray-400 uppercase tracking-widest">SOURCE</th>
                                <th className="w-1/12 px-2 py-3 inter text-[10px] font-black text-gray-400 uppercase tracking-widest">STATUS</th>
                                <th className="w-1/12 px-2 py-3 inter text-[10px] font-black text-gray-400 uppercase tracking-widest">VALUE</th>
                                <th className="w-[12%] px-2 py-3 inter text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">DATE ADDED <FiChevronDown className="inline ml-0.5"/></th>
                                <th className="w-[18%] px-2 py-3 inter text-[10px] font-black text-gray-400 uppercase tracking-widest">MESSAGE</th>
                                <th className="w-20 px-4 py-3 inter text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-[10px] font-bold">
                            {leads.length === 0 ? (
                                <tr><td colSpan="9" className="py-8 text-center text-xs text-gray-400">No leads found</td></tr>
                            ) : (
                                leads.slice(0, 10).map((lead, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 group bg-white">
                                        <td className="px-4 py-2.5"><input type="checkbox" className="rounded border-gray-300 text-[#D48D2A] focus:ring-[#D48D2A]"/></td>
                                        <td className="px-2 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                                    <img 
                                                        src={lead.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=random`} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=random`; }}
                                                    />
                                                </div>
                                                <div className="flex flex-col truncate">
                                                    <span className="text-gray-900 font-bold truncate">{lead.name}</span>
                                                    <span className="text-gray-400 font-medium text-[9px] truncate">{lead.email}</span>
                                                    <span className="text-gray-400 font-medium text-[9px] truncate">{lead.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2.5">
                                            <div className="flex items-center gap-2">
                                                {(() => {
                                                    const asset = (data?.inventory || []).find(a => a._id === lead.assetId || a.id === lead.assetId);
                                                    const assetName = lead.assetName || (asset ? (asset.propertyName || asset.yachtName || asset.name || asset.title || `${asset.make || ''} ${asset.model || ''}`.trim()) : null) || 'Unknown Asset';
                                                    const assetPrice = (lead.assetPrice || asset?.price) ? `$${numberWithCommas(lead.assetPrice || asset?.price)}` : 'Price on request';
                                                    const assetImage = lead.assetImage || asset?.images?.[0];
                                                    return (
                                                        <>
                                                            <div className="w-8 h-8 rounded shrink-0 bg-gray-100 border border-gray-200/50 overflow-hidden shadow-sm flex items-center justify-center">
                                                                {assetImage ? 
                                                                    <img src={assetImage} className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://placehold.co/400x400?text=No+Image"; }}/> : 
                                                                    <img src="https://placehold.co/400x400?text=No+Image" className="w-full h-full object-cover opacity-50"/>
                                                                }
                                                            </div>
                                                            <div className="flex flex-col truncate">
                                                                <span className="text-gray-900 truncate font-bold">{assetName}</span>
                                                                <span className="text-gray-400 font-medium text-[9px] truncate">{assetPrice}</span>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                        <td className="px-2 py-2.5">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1.5 text-gray-700 capitalize font-medium"><FiGlobe className="text-[10px]"/> {lead.source || 'Website'}</span>
                                                <span className="flex items-center gap-1.5 text-emerald-500 font-medium"><FiMessageSquare className="text-[10px]"/> WhatsApp</span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2.5">
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${lead.status === 'New' ? 'bg-emerald-50' : lead.status === 'Contacted' ? 'bg-blue-50' : lead.status === 'Qualified' ? 'bg-[#FFF8F0]' : 'bg-purple-50'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'New' ? 'bg-emerald-500' : lead.status === 'Contacted' ? 'bg-blue-500' : lead.status === 'Qualified' ? 'bg-[#D48D2A]' : 'bg-purple-500'}`}></div>
                                                <span className={`text-[10px] font-bold ${lead.status === 'New' ? 'text-emerald-600' : lead.status === 'Contacted' ? 'text-blue-600' : lead.status === 'Qualified' ? 'text-[#D48D2A]' : 'text-purple-600'}`}>{lead.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2.5 text-gray-900 font-black">
                                            {(() => {
                                                const price = lead.assetPrice || (data?.inventory || []).find(a => a._id === lead.assetId || a.id === lead.assetId)?.price;
                                                if (!price || isNaN(price)) return 'Price on request';
                                                return Number(price) >= 1000000 ? `$${(Number(price) / 1000000).toFixed(1)}M` : `$${numberWithCommas(price)}`;
                                            })()}
                                        </td>
                                        <td className="px-2 py-2.5">
                                            <div className="flex flex-col text-gray-600">
                                                <span>{lead.date ? new Date(lead.date).toLocaleDateString() : 'Unknown Date'}</span>
                                                <span className="text-[9px] text-gray-400 font-medium">{lead.date ? new Date(lead.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2.5">
                                            <p className="text-[9px] text-gray-500 font-medium line-clamp-2 leading-snug w-full whitespace-normal">
                                                {lead.message || "I'm interested in this asset. Is it available?"}
                                            </p>
                                        </td>
                                        <td className="px-4 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex items-center justify-end gap-2 relative">
                                                <button onClick={() => setViewLead(lead)} className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#D48D2A] hover:bg-[#FFF8F0] transition-colors shadow-sm bg-white"><FiEye className="text-[10px]"/></button>
                                                <div className="relative">
                                                    <button onClick={() => setActiveLeadDropdown(activeLeadDropdown === lead.id ? null : lead.id)} className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${activeLeadDropdown === lead.id ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}><FiMoreVertical/></button>
                                                    {activeLeadDropdown === lead.id && (
                                                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 py-1 z-[100]">
                                                            {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Closed'].map(s => (
                                                                <button key={s} onClick={() => { handleStatusChange(lead.id, s, lead.isActivity); setActiveLeadDropdown(null); }} className={`w-full text-left px-4 py-1.5 text-[10px] font-bold ${lead.status === s ? 'text-[#D48D2A] bg-[#FFF8F0]' : 'text-gray-600 hover:bg-gray-50'}`}>{s}</button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="h-10 border-t border-gray-100 flex justify-between items-center px-4 shrink-0 bg-white">
                    <span className="text-[10px] font-bold text-gray-400">Showing 1 to 5 of {(data?.leads || []).length} leads</span>
                    <div className="flex items-center gap-1.5 justify-center">
                        <button className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">&lt;</button>
                        <button className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-[#D48D2A] bg-[#FFF8F0] border border-[#F2E8DB] shadow-sm">1</button>
                        <button className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-gray-500 hover:text-gray-900 border border-transparent">2</button>
                        <button className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-gray-500 hover:text-gray-900 border border-transparent">3</button>
                        <span className="text-gray-300 font-bold px-1 text-[10px]">...</span>
                        <button className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-gray-500 hover:text-gray-900 border border-transparent">29</button>
                        <button className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">&gt;</button>
                    </div>
                    <div className="relative">
                        <select className="appearance-none bg-white border border-gray-200 rounded-lg py-1 pl-3 pr-8 text-[10px] font-bold text-gray-600 focus:outline-none hover:border-gray-300 shadow-sm cursor-pointer">
                            <option>10 per page</option>
                            <option>20 per page</option>
                            <option>50 per page</option>
                        </select>
                        <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[9px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadsTab;
