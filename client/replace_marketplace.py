import re

with open('/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx', 'r') as f:
    content = f.read()

start_str = "                    {/* PUBLIC MARKETPLACE TAB */}"
end_str = "                    {/* SUBSCRIPTION TAB */}"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_marketplace = """                    {/* PUBLIC MARKETPLACE TAB */}
                    {activeTab === 'marketplace' && (
                        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-12">
                            <div>
                                <h2 className="text-[28px] font-bold text-gray-900 font-playfair mb-1 leading-tight">Public Marketplace</h2>
                                <p className="text-gray-400 font-medium text-xs">Showcase your assets to a global audience and get more visibility.</p>
                            </div>
                            
                            {/* Visibility Controls */}
                            <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-[17px] font-bold text-gray-900 mb-1 font-playfair">Visibility Controls</h3>
                                        <p className="text-[11px] text-gray-400 font-medium border-l-[3px] border-[#D48D2A] pl-2 -ml-[3px]">Manage which assets appear on your public marketplace profile.</p>
                                    </div>
                                    <button className="px-4 py-2 border border-gray-200 rounded-[10px] text-[10px] font-bold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors uppercase tracking-widest"><FiLayout className="text-gray-400"/> Manage Visibility</button>
                                </div>
                                
                                <div className="space-y-4">
                                    {(data?.inventory || []).map(item => {
                                        const assetName = item.propertyName || item.yachtName || item.name || item.title || `${item.make || ''} ${item.model || ''}`.trim() || 'Unnamed Asset';
                                        const cat = item.category?.replace('Asset', 's')?.toUpperCase() || 'ASSET';
                                        return (
                                            <div key={item.id} className="flex gap-6 items-center p-4 rounded-[1.25rem] border border-gray-100/50 bg-gray-50/50 hover:bg-white hover:border-[#D48D2A]/30 transition-colors">
                                                <div className="w-[120px] h-[90px] rounded-[1rem] overflow-hidden shrink-0 bg-white border border-gray-200/50 shadow-sm">
                                                    {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FiImage className="text-gray-300 text-2xl"/></div>}
                                                </div>
                                                
                                                <div className="flex-1 flex justify-between items-center pr-2">
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex flex-col gap-1">
                                                            <h4 className="text-[16px] font-bold text-gray-900 font-playfair leading-none">{assetName}</h4>
                                                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">
                                                                <FiPackage/> {cat} <span className="text-gray-300 mx-0.5">•</span> ${numberWithCommas(item.price || 0)}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-10">
                                                            <div className="flex items-center gap-2.5">
                                                                <FiEye className="text-gray-400 text-[18px]"/>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[7px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Views</span>
                                                                    <span className="text-[13px] font-bold text-gray-900 leading-none">{numberWithCommas(item.views || 0)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2.5">
                                                                <FiMessageSquare className="text-gray-400 text-[18px]"/>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[7px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Inquiries</span>
                                                                    <span className="text-[13px] font-bold text-gray-900 leading-none">{numberWithCommas(item.leads || 0)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2.5">
                                                                <FiHeart className="text-gray-400 text-[18px]"/>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[7px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Saves</span>
                                                                    <span className="text-[13px] font-bold text-gray-900 leading-none">{numberWithCommas(item.saves || 0)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2.5">
                                                                <FiCalendar className="text-gray-400 text-[18px]"/>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[7px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Last Active</span>
                                                                    <span className="text-[13px] font-bold text-gray-900 leading-none">{new Date(item.updatedAt || Date.now()).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-6 items-center pl-6 border-l border-gray-200 ml-4 py-2 h-[80px]">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'Active' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-gray-100 text-gray-500'}`}>
                                                                {item.status === 'Active' ? 'Public' : 'Hidden'}
                                                            </div>
                                                            <div 
                                                                onClick={() => handleTogglePublic(item)}
                                                                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${item.status === 'Active' ? 'bg-[#D48D2A]' : 'bg-gray-200'}`}
                                                            >
                                                                <div className={`absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${item.status === 'Active' ? 'left-[22px]' : 'left-[2px]'}`}></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button className="px-4 py-2.5 rounded-[10px] text-[10px] font-bold border border-gray-200 bg-white text-gray-700 hover:border-[#D48D2A] flex items-center gap-2 transition-colors uppercase tracking-widest shadow-sm"><FiEye className="text-[#D48D2A] text-sm"/> Preview Listing</button>
                                                            <button className="w-[36px] h-[36px] rounded-[10px] border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm text-gray-400">
                                                                <FiMoreHorizontal />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {(!data?.inventory || data.inventory.length === 0) && (
                                        <div className="text-center py-6 text-[11px] font-medium text-gray-400 italic">No assets available to manage.</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Public Preview */}
                            <div className="mb-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-[17px] font-bold text-gray-900 mb-1 font-playfair">Public Preview</h3>
                                        <p className="text-[11px] text-gray-400 font-medium border-l-[3px] border-[#10B981] pl-2 -ml-[3px]">This is how your listings appear to potential buyers on the marketplace.</p>
                                    </div>
                                    <button className="px-4 py-2 border border-gray-200 rounded-[10px] text-[10px] font-bold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors uppercase tracking-widest">View Public Profile <FiExternalLink className="text-gray-400"/></button>
                                </div>
                                
                                <div className="space-y-8">
                                    {(data?.inventory || []).filter(i => i.status === 'Active').map((item, idx) => {
                                        const assetName = item.propertyName || item.yachtName || item.name || item.title || `${item.make || ''} ${item.model || ''}`.trim() || 'Unnamed Asset';
                                        const cat = item.category?.replace('Asset', 's')?.toUpperCase() || 'ASSET';
                                        return (
                                            <div key={idx} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex overflow-hidden p-3.5 gap-6 relative group hover:border-[#D48D2A]/30 transition-colors">
                                                <div className="w-[48%] h-[320px] rounded-[1.25rem] bg-gray-100 overflow-hidden relative shrink-0 shadow-inner">
                                                    {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/> : <div className="w-full h-full flex items-center justify-center"><FiImage className="text-gray-300 text-3xl"/></div>}
                                                    <div className="absolute top-5 left-5">
                                                        <span className="bg-white/95 backdrop-blur text-gray-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">{cat}</span>
                                                    </div>
                                                    <div className="absolute bottom-5 left-0 w-full flex justify-center gap-3">
                                                        <button className="bg-white/95 backdrop-blur text-gray-900 px-5 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2 shadow-sm hover:bg-white transition-colors uppercase tracking-widest"><FiImage className="text-[#D48D2A] text-sm"/> {item.images?.length || 0} Photos</button>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex-1 py-4 pr-4 flex">
                                                    <div className="flex-1 flex flex-col justify-center pr-8 border-r border-gray-100">
                                                        <h2 className="text-[28px] font-bold text-gray-900 font-playfair leading-tight mb-2 truncate" title={assetName}>{assetName}</h2>
                                                        <p className="text-[22px] font-black text-[#D48D2A] tracking-wider mb-6 leading-none">${numberWithCommas(item.price || 0)}</p>
                                                        
                                                        <div className="flex gap-8 mb-6">
                                                            <div className="flex gap-3 items-center">
                                                                <div className="w-8 h-8 rounded-lg bg-[#FFF8F0] flex items-center justify-center shrink-0 border border-[#F2E8DB]"><FiCalendar className="text-[#D48D2A] text-sm"/></div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[13px] font-bold text-gray-900 leading-none">{item.year || '2023'}</span>
                                                                    <span className="text-[8px] font-black uppercase tracking-widest text-[#D48D2A] mt-1">Year</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3 items-center">
                                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100"><FiClock className="text-blue-500 text-sm"/></div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[13px] font-bold text-gray-900 leading-none">{numberWithCommas(item.mileage || 0)} {cat==='VEHICLES'?'km':'hrs'}</span>
                                                                    <span className="text-[8px] font-black uppercase tracking-widest text-blue-500 mt-1">{cat==='VEHICLES'?'Mileage':'Usage'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3 items-center">
                                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100"><FiDroplet className="text-emerald-500 text-sm"/></div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[13px] font-bold text-gray-900 leading-none">{item.fuelType || 'Petrol'}</span>
                                                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-1">Fuel Type</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3 items-center">
                                                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><FiSettings className="text-purple-500 text-sm"/></div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[13px] font-bold text-gray-900 leading-none">{item.transmission || 'Automatic'}</span>
                                                                    <span className="text-[8px] font-black uppercase tracking-widest text-purple-500 mt-1">Transmission</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <p className="text-[12px] text-gray-500 mb-6 leading-relaxed line-clamp-3">
                                                            {item.description || `Experience the perfect blend of power, innovation, and design. The ${assetName} delivers unmatched performance and luxury across all aspects of ownership.`}
                                                        </p>
                                                        
                                                        <div className="flex flex-wrap gap-2 mt-auto">
                                                            {(item.tags || ['Hybrid', 'V8 Engine', 'AWD']).map((tag, tIdx) => (
                                                                <span key={tIdx} className="bg-gray-50 border border-gray-100 text-gray-600 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">{tag}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="w-[280px] pl-8 flex flex-col justify-center gap-1">
                                                        <h4 className="text-[14px] font-bold text-gray-900 font-playfair mb-0.5">Interested in this asset?</h4>
                                                        <p className="text-[10px] text-gray-400 font-medium mb-6">Contact the seller directly.</p>
                                                        
                                                        <div className="space-y-3">
                                                            <button className="w-full py-4 bg-[#D48D2A] hover:bg-[#b5751c] text-white rounded-[1rem] font-bold text-[11px] uppercase tracking-widest shadow-[0_4px_15px_rgba(212,141,42,0.3)] transition-colors flex items-center justify-center gap-2"><FiMessageSquare className="text-sm"/> Send Inquiry</button>
                                                            <button className="w-full py-4 bg-white border border-gray-200 text-gray-700 hover:border-[#D48D2A] hover:text-[#D48D2A] rounded-[1rem] font-bold text-[11px] uppercase tracking-widest shadow-sm transition-colors flex items-center justify-center gap-2"><FiHeart className="text-sm text-gray-400"/> Save Asset</button>
                                                            <button className="w-full py-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-[1rem] font-bold text-[11px] uppercase tracking-widest shadow-sm transition-colors flex items-center justify-center gap-2"><FiShare2 className="text-sm text-gray-400"/> Share</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {(!data?.inventory || data.inventory.filter(i => i.status === 'Active').length === 0) && (
                                        <div className="text-center py-6 text-[11px] font-medium text-gray-400 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm italic">No active public assets available. Set assets to Public to preview them here.</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Marketplace Performance */}
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-[17px] font-bold text-gray-900 mb-1 font-playfair">Marketplace Performance</h3>
                                        <p className="text-[11px] text-gray-400 font-medium border-l-[3px] border-[#8B5CF6] pl-2 -ml-[3px]">Overview of your public listing performance.</p>
                                    </div>
                                    <div className="relative">
                                        <select className="appearance-none bg-white border border-gray-200 rounded-[10px] py-2 pl-4 pr-10 text-[10px] font-bold text-gray-600 focus:outline-none shadow-sm cursor-pointer hover:border-gray-300 uppercase tracking-widest">
                                            <option>Last 30 days</option>
                                            <option>Last 7 days</option>
                                            <option>All time</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                                    </div>
                                </div>
                                
                                <div className="flex gap-4">
                                    {[
                                        {label: 'Total Views', value: numberWithCommas(data?.stats?.totalViews || 0), change: '+18.2%', icon: FiEye, color: 'text-gray-400'},
                                        {label: 'Total Inquiries', value: numberWithCommas(data?.stats?.totalLeads || 0), change: '+12.5%', icon: FiMessageSquare, color: 'text-gray-400'},
                                        {label: 'Saves', value: data?.stats?.savedCount || 0, change: '+9.8%', icon: FiHeart, color: 'text-gray-400'},
                                        {label: 'Avg. Time on Listing', value: '14d 2h', change: '-4.1%', icon: FiClock, color: 'text-gray-400', isDown: true},
                                        {label: 'Conversion Rate', value: data?.stats?.totalViews ? ((data?.stats?.totalLeads / data?.stats?.totalViews) * 100).toFixed(1)+'%' : '0.0%', change: '+7.4%', icon: FiTrendingUp, color: 'text-gray-400'}
                                    ].map((stat, i) => (
                                        <div key={i} className="flex-1 bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-start gap-4 hover:-translate-y-1 transition-transform cursor-default group">
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200 shadow-sm group-hover:bg-white group-hover:border-[#D48D2A] transition-colors">
                                                <stat.icon className={`text-[12px] ${stat.color} group-hover:text-[#D48D2A] transition-colors`} />
                                            </div>
                                            <div className="flex flex-col -mt-0.5 z-10 relative">
                                                <span className="text-[7px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">{stat.label}</span>
                                                <span className="text-[20px] font-playfair font-bold text-gray-900 leading-none my-1">{stat.value}</span>
                                                <span className={`text-[8px] font-black flex items-center gap-1 tracking-widest mt-2 uppercase ${stat.isDown ? 'text-blue-500' : 'text-emerald-500'}`}>
                                                    {stat.isDown ? <FiTrendingDown className="text-[9px]"/> : <FiTrendingUp className="text-[9px]"/>} 
                                                    {stat.change} <span className="text-gray-300 font-bold normal-case">from last 30d</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
\n"""

    content = content[:start_idx] + new_marketplace + content[end_idx:]

    with open('/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx', 'w') as f:
        f.write(content)
        print("Success Marketplace Dynamic")
else:
    print("Fail Marketplace Dynamic")
