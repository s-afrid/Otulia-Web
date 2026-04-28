import re

with open('/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx', 'r') as f:
    content = f.read()

start_str = "                    {/* LEADS TAB */}"
end_str = "                    {/* ANALYTICS TAB */}"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_leads = """                    {/* LEADS TAB */}
                    {activeTab === 'leads' && (
                        <div className="h-[calc(100vh-6rem-5rem)] flex flex-col gap-4 animate-in fade-in duration-700 pb-2">
                            {/* Header Row with Title and Buttons */}
                            <div className="flex justify-between items-end shrink-0 mb-1">
                                <div>
                                    <h2 className="text-[28px] font-bold text-gray-900 font-playfair mb-0 leading-tight">Leads</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="px-5 py-2 rounded-xl text-[11px] font-bold bg-gray-900 text-white shadow-sm flex items-center gap-2 hover:opacity-90 transition-opacity"><FiPlus className="text-white"/> Add Lead</button>
                                    <button onClick={handleExportCSV} className="px-5 py-2 rounded-xl text-[11px] font-bold border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 flex items-center gap-2 transition-colors">Export</button>
                                </div>
                            </div>

                            {/* 4 KPI Cards */}
                            <div className="grid grid-cols-4 gap-4 shrink-0 h-[85px]">
                                {/* Total Leads */}
                                <div className="bg-white rounded-[1rem] p-3.5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Leads</span>
                                            <span className="text-2xl font-bold text-gray-900 font-playfair leading-none mt-1">{numberWithCommas(data?.stats?.totalLeads || 0)}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-[#FFF8F0] justify-center text-[#D48D2A] flex items-center shrink-0 border border-[#F2E8DB]"><FiUsers className="text-sm" /></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-auto tracking-wide"><FiTrendingUp className="text-[10px]" /> 8.2% <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span></span>
                                </div>
                                {/* New Leads */}
                                <div className="bg-white rounded-[1rem] p-3.5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">New Leads</span>
                                            <span className="text-2xl font-bold text-gray-900 font-playfair leading-none mt-1">{(data?.leads || []).filter(l=>l.status==='New').length}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-[#FFF8F0] justify-center text-[#D48D2A] flex items-center shrink-0 border border-[#F2E8DB]"><FiUser className="text-sm" /></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-auto tracking-wide"><FiTrendingUp className="text-[10px]" /> 12.5% <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span></span>
                                </div>
                                {/* Qualified Leads */}
                                <div className="bg-white rounded-[1rem] p-3.5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Qualified Leads</span>
                                            <span className="text-2xl font-bold text-gray-900 font-playfair leading-none mt-1">{(data?.leads || []).filter(l=>l.status==='Qualified').length}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 justify-center text-emerald-600 flex items-center shrink-0 border border-emerald-100"><FiCheckCircle className="text-sm" /></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-auto tracking-wide"><FiTrendingUp className="text-[10px]" /> 6.1% <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span></span>
                                </div>
                                {/* Conversion Rate */}
                                <div className="bg-white rounded-[1rem] p-3.5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Conversion Rate</span>
                                            <span className="text-2xl font-bold text-gray-900 font-playfair leading-none mt-1">{data?.stats?.totalViews ? ((data?.stats?.totalLeads / data?.stats?.totalViews) * 100).toFixed(1) : '0.0'}%</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 justify-center text-purple-600 flex items-center shrink-0 border border-purple-100"><FiActivity className="text-sm" /></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-auto tracking-wide"><FiTrendingUp className="text-[10px]" /> 3.4% <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span></span>
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
                                        placeholder="Search leads by name, email, phone..."
                                        className="w-full bg-white border border-gray-200 rounded-[1rem] py-2.5 pl-9 pr-4 text-[11px] font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D48D2A] focus:ring-1 focus:ring-[#D48D2A] transition-all shadow-sm"
                                    />
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    {['All Status', 'All Source', 'All Assets'].map((f, i) => (
                                        <div key={i} className="relative w-[130px]">
                                            <select className="w-full appearance-none bg-white border border-gray-200 rounded-[1rem] py-2.5 pl-4 pr-8 text-[11px] font-bold text-gray-600 focus:outline-none cursor-pointer hover:border-gray-300 shadow-sm">
                                                <option>{f}</option>
                                            </select>
                                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                                        </div>
                                    ))}
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
                                                <th className="w-2/12 px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">LEAD</th>
                                                <th className="w-[18%] px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">ASSET INTERESTED</th>
                                                <th className="w-2/12 px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">SOURCE</th>
                                                <th className="w-1/12 px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">STATUS</th>
                                                <th className="w-1/12 px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">VALUE</th>
                                                <th className="w-[12%] px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">DATE ADDED <FiChevronDown className="inline ml-0.5"/></th>
                                                <th className="w-[18%] px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">MESSAGE</th>
                                                <th className="w-12 px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-[10px] font-bold">
                                            {(() => {
                                                const leads = (data?.leads || []);
                                                if (leads.length === 0) {
                                                    return <tr><td colSpan="9" className="py-8 text-center text-xs text-gray-400">No leads found</td></tr>;
                                                }
                                                return leads.slice(0, 5).map((lead, i) => (
                                                    <tr key={i} className="hover:bg-gray-50/50 group bg-white">
                                                        <td className="px-4 py-2.5"><input type="checkbox" className="rounded border-gray-300 text-[#D48D2A] focus:ring-[#D48D2A]"/></td>
                                                        <td className="px-2 py-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0"><img src="/assets/placeholder.jpg" className="w-full h-full object-cover"/></div>
                                                                <div className="flex flex-col truncate">
                                                                    <span className="text-gray-900 font-bold truncate">{lead.name}</span>
                                                                    <span className="text-gray-400 font-medium text-[9px] truncate">{lead.email}</span>
                                                                    <span className="text-gray-400 font-medium text-[9px] truncate">{lead.phone}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded shrink-0 bg-gray-100 border border-gray-200/50 overflow-hidden shadow-sm flex items-center justify-center">
                                                                    {(() => {
                                                                        const assetId = lead.category?.replace('Asset', '') + lead.assetId;
                                                                        return <img src="/assets/placeholder.jpg" className="w-full h-full object-cover"/>;
                                                                    })()}
                                                                </div>
                                                                <div className="flex flex-col truncate">
                                                                    <span className="text-gray-900 truncate">Asset Name here</span>
                                                                    <span className="text-gray-400 font-medium text-[9px] truncate">$0.00</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="flex items-center gap-1.5 text-gray-700"><FiGlobe className="text-[10px]"/> Website</span>
                                                                <span className="flex items-center gap-1.5 text-emerald-500"><FiMessageSquare className="text-[10px]"/> WhatsApp</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'New' ? 'bg-emerald-500' : lead.status === 'Contacted' ? 'bg-blue-500' : lead.status === 'Qualified' ? 'bg-[#D48D2A]' : 'bg-purple-500'}`}></div>
                                                                <span className="text-xs font-bold text-gray-700">{lead.status}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5 text-gray-900 font-black">$6.6M</td>
                                                        <td className="px-2 py-2.5">
                                                            <div className="flex flex-col text-gray-600">
                                                                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                                                                <span className="text-[9px] text-gray-400 font-medium">{new Date(lead.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5">
                                                            <p className="text-[9px] text-gray-500 font-medium line-clamp-2 leading-snug w-full whitespace-normal">
                                                                {lead.message || "I'm interested in this asset. Is it available?"}
                                                            </p>
                                                        </td>
                                                        <td className="px-2 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#D48D2A] hover:bg-[#FFF8F0] transition-colors shadow-sm bg-white"><FiEye className="text-[10px]"/></button>
                                                                <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900"><FiMoreVertical/></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ));
                                            })()}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Base */}
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
                    )}
\n"""

    content = content[:start_idx] + new_leads + content[end_idx:]

    with open('/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx', 'w') as f:
        f.write(content)
        print("Success Leads Dynamic")
else:
    print("Fail Leads Dynamic")
