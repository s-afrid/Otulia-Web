import React from 'react';
import { FiX, FiPieChart, FiTrendingUp, FiGlobe, FiMoreHorizontal, FiArrowRight } from 'react-icons/fi';
import facebookIcon from '../../assets/icons/social/facebook.svg';
import instagramIcon from '../../assets/icons/social/instagram.svg';
import whatsappIcon from '../../assets/icons/social/whatsapp.svg';
import numberWithCommas from '../../modules/numberwithcomma';

const SourceReportModal = ({ isOpen, onClose, data = [], totalLeads = 0 }) => {
    if (!isOpen) return null;

    const colorMap = {
        'WhatsApp': '#22C55E',
        'Whatsapp': '#22C55E',
        'Website': '#3B82F6',
        'Facebook': '#1E3B70',
        'Instagram': '#E1306C',
        'Others': '#9CA3AF',
        'Direct': '#3B82F6',
        'Marketplace': '#D48D2A',
        'Social': '#E1306C'
    };

    const iconMap = {
        'WhatsApp': { icon: whatsappIcon, isCustom: true },
        'Whatsapp': { icon: whatsappIcon, isCustom: true },
        'Website': { icon: FiGlobe, isCustom: false },
        'Facebook': { icon: facebookIcon, isCustom: true },
        'Instagram': { icon: instagramIcon, isCustom: true },
        'Others': { icon: FiMoreHorizontal, isCustom: false },
        'Direct': { icon: FiGlobe, isCustom: false },
        'Marketplace': { icon: FiArrowRight, isCustom: false },
        'Social': { icon: instagramIcon, isCustom: true }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 lg:p-10">
            <div className="bg-white rounded-[clamp(12px,2vh,32px)] shadow-2xl w-full h-full max-w-5xl flex flex-col relative overflow-hidden animate-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-[clamp(16px,2.5vh,40px)] border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-[clamp(32px,4vh,64px)] h-[clamp(32px,4vh,64px)] rounded-[clamp(8px,1.2vh,20px)] bg-[#EFF6FF] flex items-center justify-center border border-blue-50">
                            <FiPieChart className="text-blue-600 text-[clamp(16px,2vh,32px)]" />
                        </div>
                        <div>
                            <h2 className="text-[clamp(18px,2.4vh,36px)] font-bold text-gray-900 kaisei">Leads Source Analysis</h2>
                            <p className="inter text-[clamp(10px,1.3vh,18px)] text-gray-500 font-medium uppercase tracking-[0.05em]">Detailed breakdown of lead acquisition channels</p>
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
                    {/* Chart Side */}
                    <div className="flex-1 relative bg-gray-50/30 flex flex-col items-center justify-center p-8 overflow-hidden">
                        <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="10" />
                                {(() => {
                                    const total = data.reduce((s, i) => s + (i.count || 0), 0) || 1;
                                    let cumulativeOffset = 0;
                                    return data.map((src, idx) => {
                                        const count = src.count || 0;
                                        const pct = count / total;
                                        const dashArray = 251.2; // 2 * pi * r
                                        const offset = cumulativeOffset;
                                        cumulativeOffset += pct;
                                        const color = colorMap[src.label] || '#9CA3AF';
                                        
                                        return (
                                            <circle 
                                                key={idx} 
                                                cx="50" 
                                                cy="50" 
                                                r="40" 
                                                fill="none" 
                                                stroke={color} 
                                                strokeWidth="10" 
                                                strokeDasharray={dashArray} 
                                                strokeDashoffset={dashArray * (1 - pct)} 
                                                style={{ transform: `rotate(${offset * 360}deg)`, transformOrigin: 'center' }} 
                                                className="transition-all duration-1000 ease-in-out"
                                            />
                                        );
                                    });
                                })()}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-5xl font-bold text-gray-900 leading-none kaisei">{numberWithCommas(totalLeads)}</span>
                                <span className="inter text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Total Leads</span>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-12">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Top Performer</span>
                                <span className="text-lg font-bold text-gray-900">{data[0]?.label || 'N/A'}</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Conversion Efficiency</span>
                                <span className="text-lg font-bold text-emerald-600">High</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Side */}
                    <div className="flex-1 border-l border-gray-100 flex flex-col min-h-0 bg-white">
                        <div className="p-8 shrink-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 inter">Channel Distribution</h3>
                            <p className="text-sm text-gray-500 font-medium">Performance by acquisition channel</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                            <div className="space-y-6">
                                {data.map((src, idx) => {
                                    const color = colorMap[src.label] || '#9CA3AF';
                                    const iconInfo = iconMap[src.label] || { icon: FiMoreHorizontal, isCustom: false };
                                    const pctValue = parseFloat(src.p || src.pct || 0);

                                    return (
                                        <div key={idx} className="group">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-gray-50 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}15`, color: color }}>
                                                        {iconInfo.isCustom ? (
                                                            <img src={iconInfo.icon} alt={src.label} className="w-5 h-5 object-contain" />
                                                        ) : (
                                                            <iconInfo.icon className="text-xl" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-gray-800 inter">{src.label}</span>
                                                        <span className="text-xs text-gray-400 font-medium">Channel {idx + 1}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-lg font-black text-gray-900 tabular-nums">{src.count}</span>
                                                    <span className="text-xs font-bold text-blue-500">{src.p || src.pct}</span>
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
                                                    style={{ width: `${pctValue}%`, backgroundColor: color }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="p-8 bg-gray-50 border-t border-gray-100 shrink-0">
                            <button className="w-full py-4 bg-[#1E3B70] text-white rounded-2xl font-bold inter flex items-center justify-center gap-2 hover:bg-[#152a50] transition-colors shadow-lg shadow-[#1E3B70]/20">
                                Export Channel Report <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SourceReportModal;
