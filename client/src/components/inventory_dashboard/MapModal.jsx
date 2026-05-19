import React from 'react';
import { FiX, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import WorldMap from './WorldMap';

const MapModal = ({ isOpen, onClose, data = [] }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 lg:p-10">
            <div className="bg-white rounded-[clamp(12px,2vh,32px)] shadow-2xl w-full h-full max-w-7xl flex flex-col relative overflow-hidden animate-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-[clamp(16px,2.5vh,40px)] border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-[clamp(32px,4vh,64px)] h-[clamp(32px,4vh,64px)] rounded-[clamp(8px,1.2vh,20px)] bg-[#FFF8F0] flex items-center justify-center border border-[#F2E8DB]/50">
                            <FiMapPin className="text-[#D48D2A] text-[clamp(16px,2vh,32px)]" />
                        </div>
                        <div>
                            <h2 className="text-[clamp(18px,2.4vh,36px)] font-bold text-gray-900 kaisei">Global Leads Distribution</h2>
                            <p className="inter text-[clamp(10px,1.3vh,18px)] text-gray-500 font-medium uppercase tracking-[0.05em]">Lead origins across all countries</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-[clamp(32px,4vh,56px)] h-[clamp(32px,4vh,56px)] rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-200"
                    >
                        <FiX className="text-[clamp(18px,2.4vh,32px)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                    {/* Map Side */}
                    <div className="flex-[2] relative bg-gray-50/30 flex items-center justify-center p-8 overflow-hidden">
                        <div className="w-full h-full max-h-[80vh]">
                            <WorldMap data={data} />
                        </div>
                        
                        {/* Map Overlay Stats */}
                        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-2xl border border-gray-100 shadow-lg flex gap-8">
                            <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Countries</span>
                                <span className="text-xl font-bold text-gray-900">{data.length}</span>
                            </div>
                            <div className="w-px bg-gray-100"></div>
                            <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Top Region</span>
                                <span className="text-xl font-bold text-gray-900">{data[0]?.country || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Side */}
                    <div className="flex-1 border-l border-gray-100 flex flex-col min-h-0 bg-white">
                        <div className="p-8 shrink-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 inter">Country Ranking</h3>
                            <p className="text-sm text-gray-500 font-medium">Sorted by highest lead volume</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                            <div className="space-y-6">
                                {data.map((loc, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:bg-[#D4A63A] group-hover:text-white transition-colors">{idx + 1}</span>
                                                <img 
                                                    src={
                                                        loc.country === 'United States' ? 'https://flagcdn.com/us.svg' :
                                                        loc.country === 'UAE' ? 'https://flagcdn.com/ae.svg' :
                                                        loc.country === 'United Kingdom' ? 'https://flagcdn.com/gb.svg' :
                                                        loc.country === 'India' ? 'https://flagcdn.com/in.svg' :
                                                        'https://flagcdn.com/un.svg'
                                                    } 
                                                    className="w-5 rounded-sm shadow-sm" 
                                                    alt={loc.country} 
                                                />
                                                <span className="font-bold text-gray-800 inter">{loc.country}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-black text-gray-900 tabular-nums">{loc.leads}</span>
                                                <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5"><FiTrendingUp className="text-[10px]"/>{loc.pct}%</span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                                            <div 
                                                className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
                                                style={{ width: `${loc.pct}%`, backgroundColor: '#D4A63A', opacity: 1 - (idx * 0.1) }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Footer */}
                        <div className="p-8 bg-gray-50 border-t border-gray-100 shrink-0">
                            <div className="flex items-center justify-between p-4 bg-[#1E3B70] rounded-2xl shadow-lg shadow-[#1E3B70]/20">
                                <div className="text-white">
                                    <span className="block text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Cumulative Percentage</span>
                                    <span className="text-2xl font-bold kaisei">Top 5 Countries</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-[#D4A63A]">
                                        {data.slice(0, 5).reduce((acc, curr) => acc + parseFloat(curr.pct), 0).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapModal;
