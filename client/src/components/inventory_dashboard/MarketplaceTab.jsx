import React from 'react';
import { FiLayout, FiImage, FiPackage, FiEye, FiMoreHorizontal, FiGlobe, FiTrendingUp, FiCheckCircle, FiUsers, FiTrendingDown, FiDroplet, FiSettings, FiMessageSquare, FiHeart, FiShare2 } from 'react-icons/fi';
import numberWithCommas from '../../modules/numberwithcomma';

const MarketplaceTab = ({ data, handleTogglePublic }) => {
    return (
        <div className="h-[calc(100vh-6rem)] overflow-hidden flex flex-col p-2 gap-4 animate-in fade-in duration-700">
            {/* Top Row: Visibility & Performance */}
            <div className="flex gap-4 shrink-0 h-[38%] min-h-[220px]">
                {/* Visibility Controls */}
                <div className="flex-[3] bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col min-h-0 relative">
                    <div className="flex justify-between items-start mb-4 shrink-0">
                        <div>
                            <h3 className="inter text-[15px] font-semibold text-gray-900 mb-1 leading-none tracking-normal">Visibility Controls</h3>
                            <p className="inter text-[10px] text-gray-400 font-medium border-l-[3px] border-[#D48D2A] pl-2 -ml-[3px]">Manage profile visibility.</p>
                        </div>
                        <button className="px-4 py-1.5 border border-gray-200 rounded-[8px] text-[9px] font-bold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors uppercase tracking-widest"><FiLayout className="text-gray-400"/> Manage Listings</button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 pb-2 relative">
                        {(data?.inventory || []).map(item => {
                            const assetName = item.propertyName || item.yachtName || item.name || item.title || `${item.make || ''} ${item.model || ''}`.trim() || 'Unnamed Asset';
                            const cat = item.category?.replace('Asset', 's')?.toUpperCase() || 'ASSET';
                            return (
                                <div key={item.id} className="flex gap-4 items-center p-3 rounded-[1rem] border border-gray-100/50 bg-gray-50/50 hover:bg-white hover:border-[#D48D2A]/30 transition-colors">
                                    <div className="w-[80px] h-[60px] rounded-lg overflow-hidden shrink-0 bg-white border border-gray-200/50 shadow-sm">
                                        {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FiImage className="text-gray-300 text-lg"/></div>}
                                    </div>

                                    <div className="flex-1 flex justify-between items-center pr-2">
                                        <div className="flex flex-col">
                                            <h4 className="text-[13px] font-bold text-gray-900 canela leading-none mb-1.5">{assetName}</h4>
                                            <div className="flex items-center gap-2 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                                <FiPackage/> {cat} <span className="text-gray-300 mx-0.5">•</span> ${numberWithCommas(item.price || 0)}
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-center pl-4 ml-2">
                                            <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                                                <span className={`text-[8px] font-black uppercase tracking-widest ${item.status === 'Active' ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                    {item.status === 'Active' ? 'Public' : 'Hidden'}
                                                </span>
                                                <div
                                                    onClick={() => handleTogglePublic(item)}
                                                    className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${item.status === 'Active' ? 'bg-[#D48D2A]' : 'bg-gray-200'}`}
                                                >
                                                    <div className={`absolute top-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${item.status === 'Active' ? 'left-[18px]' : 'left-[2px]'}`}></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="px-3 py-1.5 rounded-[8px] text-[9px] font-bold border border-gray-200 bg-white text-gray-700 hover:border-[#D48D2A] flex items-center gap-1.5 transition-colors uppercase tracking-widest shadow-sm"><FiEye className="text-[#D48D2A] text-[11px]"/> Preview Listing</button>
                                                <button className="w-[28px] h-[28px] rounded-[8px] border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm text-gray-400">
                                                    <FiMoreHorizontal />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Live Marketplace Performance */}
                <div className="flex-[2] bg-gray-900 rounded-[1.5rem] p-5 border border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D48D2A] opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="flex justify-between items-start mb-6 shrink-0 relative z-10">
                        <div>
                            <h3 className="inter text-[15px] font-semibold text-white mb-1 leading-none tracking-normal">Live Marketplace Analytics</h3>
                            <p className="inter text-[10px] text-gray-400 font-medium">Real-time performance on Otulia.com</p>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live Now</span>
                        </div>
                    </div>

                    <div className="flex-1 flex gap-6 min-h-0 relative z-10">
                        <div className="flex-1 flex flex-col justify-between">
                            {[
                                {label: 'Public Views', val: data?.stats?.trends?.views?.current || 0, icon: FiEye, col: '#D48D2A'},
                                {label: 'Search Appearance', val: 842, icon: FiGlobe, col: '#3B82F6'},
                                {label: 'CTR', val: '4.2%', icon: FiTrendingUp, col: '#10B981'},
                                {label: 'Saves', val: data?.stats?.trends?.saved?.current || 0, icon: FiHeart, col: '#D946EF'}
                            ].map((s, idx) => (
                                <div key={idx} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-gray-700 group-hover:text-white transition-colors"><s.icon className="text-sm"/></div>
                                        <span className="text-[11px] font-bold text-gray-400 inter">{s.label}</span>
                                    </div>
                                    <span className="text-[16px] font-bold text-white kaisei">{s.val}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 bg-gray-800/30 rounded-2xl border border-gray-700/30 p-4 flex flex-col justify-center items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D48D2A]/5 to-transparent"></div>
                            <div className="text-[32px] font-bold text-white mb-1 kaisei relative z-10">{((data?.stats?.totalLeads || 0)/7).toFixed(1)}</div>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest relative z-10">Inquiries / Week</span>
                            <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 relative z-10">
                                <FiTrendingUp className="text-emerald-500 text-[10px]"/>
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">+12% vs last week</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Public Preview */}
            <div className="flex-1 flex flex-col bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] min-h-0">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                        <h3 className="inter text-[15px] font-semibold text-gray-900 mb-1 leading-none tracking-normal">Marketplace Listing Preview</h3>
                        <p className="inter text-[10px] text-gray-400 font-medium">How your assets appear to potential buyers</p>
                    </div>
                    <button className="inter text-[10px] font-bold text-[#D48D2A] hover:text-[#b5751c] flex items-center gap-2 transition-colors uppercase tracking-widest">Full Marketplace View <FiEye/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
                    {(data?.inventory || []).filter(i => i.status === 'Active').slice(0, 3).map((item, i) => {
                        const assetName = item.propertyName || item.yachtName || item.name || item.title || `${item.make || ''} ${item.model || ''}`.trim() || 'Unnamed Asset';
                        return (
                            <div key={item.id} className="group border border-gray-100 rounded-3xl p-4 hover:border-[#D48D2A]/30 transition-all flex gap-6 hover:shadow-md relative bg-white">
                                <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100">Live on Otulia</div>
                                <div className="w-[180px] h-[120px] rounded-2xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                                    <img src={item.images?.[0] || "https://placehold.co/400x400?text=No+Image"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="flex flex-col flex-1 py-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black text-[#D48D2A] uppercase tracking-widest">{item.category?.replace('Asset', '')}</div>
                                        <span className="text-gray-300 font-light">•</span>
                                        <span className="text-[16px] font-bold text-gray-900 kaisei">${numberWithCommas(item.price || 0)}</span>
                                    </div>
                                    <h4 className="text-[18px] font-bold text-gray-900 canela leading-tight mb-3 group-hover:text-[#D48D2A] transition-colors">{assetName}</h4>
                                    
                                    <div className="flex gap-6 mb-4">
                                        <div className="flex gap-2 items-center pr-4 border-r border-gray-50">
                                            <FiDroplet className="text-gray-400 text-[14px]"/>
                                            <div className="flex flex-col mt-0.5">
                                                <span className="text-[11px] font-bold text-gray-900 leading-none">{item.fuelType || 'Petrol'}</span>
                                                <span className="text-[9px] text-gray-400 mt-0.5">Fuel Type</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <FiSettings className="text-gray-400 text-[14px]"/>
                                            <div className="flex flex-col mt-0.5">
                                                <span className="text-[11px] font-bold text-gray-900 leading-none">{item.transmission || 'Auto'}</span>
                                                <span className="text-[9px] text-gray-400 mt-0.5">Transmission</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[11px] text-gray-500 mb-4 leading-relaxed line-clamp-2">
                                        {item.description || `Experience the perfect blend of power, innovation, and design. The ${assetName} delivers unmatched performance and luxury across all aspects of ownership.`}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {(item.tags || ['Hybrid', '4.0L V8', '2 Seater', 'AWD']).map((tag, tIdx) => (
                                            <span key={tIdx} className="bg-[#FFF8F0] text-[#D48D2A] px-3 py-1 rounded-[6px] text-[9px] font-bold border border-[#F2E8DB]">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 pl-6 flex flex-col justify-center">
                                    <h4 className="text-[13px] font-bold text-gray-900 canela mb-0.5">Interested in this asset?</h4>
                                    <p className="text-[9px] text-gray-400 font-medium mb-3 border-b border-gray-50 pb-3">Contact the seller directly.</p>

                                    <div className="space-y-2.5">
                                        <button className="w-full py-2.5 bg-[#D48D2A] hover:bg-[#b5751c] text-white rounded-[0.75rem] font-bold text-[9px] uppercase tracking-widest shadow-[0_4px_15px_rgba(212,141,42,0.3)] transition-colors flex items-center justify-center gap-2"><FiMessageSquare className="text-sm"/> Send Inquiry</button>
                                        <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 hover:border-[#D48D2A] hover:text-[#D48D2A] rounded-[0.75rem] font-bold text-[9px] uppercase tracking-widest shadow-sm transition-colors flex items-center justify-center gap-2"><FiHeart className="text-[12px] text-gray-400"/> Save Asset</button>
                                        <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-[0.75rem] font-bold text-[9px] uppercase tracking-widest shadow-sm transition-colors flex items-center justify-center gap-2"><FiShare2 className="text-[12px] text-gray-400"/> Share</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {(!data?.inventory || data.inventory.filter(i => i.status === 'Active').length === 0) && (
                        <div className="text-center py-6 text-[11px] font-medium text-gray-400 bg-gray-50/50 border border-gray-100 rounded-3xl p-4 shadow-sm italic">No active public assets available. Set assets to Public to preview them here.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketplaceTab;
