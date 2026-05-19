import React, { useRef, useState } from 'react';
import { FiX, FiPieChart, FiTrendingUp, FiGlobe, FiMoreHorizontal, FiArrowRight, FiDownload, FiLoader } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import facebookIcon from '../../assets/icons/social/facebook.svg';
import instagramIcon from '../../assets/icons/social/instagram.svg';
import whatsappIcon from '../../assets/icons/social/whatsapp.svg';
import numberWithCommas from '../../modules/numberwithcomma';

const SourceReportModal = ({ isOpen, onClose, data = [], totalLeads = 0 }) => {
    const reportRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const handleExport = async () => {
        if (!reportRef.current) return;
        setIsExporting(true);
        try {
            const element = reportRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                ignoreElements: (el) => el.classList.contains('no-export')
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Leads_Source_Report_${new Date().toLocaleDateString()}.pdf`);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to generate PDF. Please check the console for details.');
        } finally {
            setIsExporting(false);
        }
    };

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
                {/* Export Wrapper */}
                <div ref={reportRef} className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                    {/* Header */}
                    <div className="flex justify-between items-center p-[clamp(16px,2.5vh,40px)] border-b" style={{ borderColor: '#f3f4f6', backgroundColor: '#ffffff' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-[clamp(32px,4vh,64px)] h-[clamp(32px,4vh,64px)] rounded-[clamp(8px,1.2vh,20px)] flex items-center justify-center border" style={{ backgroundColor: '#eff6ff', borderColor: '#f8fafc' }}>
                                <FiPieChart className="text-[clamp(16px,2vh,32px)]" style={{ color: '#2563eb' }} />
                            </div>
                            <div>
                                <h2 className="text-[clamp(18px,2.4vh,36px)] font-bold kaisei" style={{ color: '#111827' }}>Leads Source Analysis</h2>
                                <p className="inter text-[clamp(10px,1.3vh,18px)] font-medium uppercase tracking-[0.05em]" style={{ color: '#6b7280' }}>Detailed breakdown of lead acquisition channels</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-[clamp(32px,4vh,56px)] h-[clamp(32px,4vh,56px)] rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-200 no-export"
                            data-html2canvas-ignore="true"
                        >
                            <FiX className="text-[clamp(18px,2.4vh,32px)]" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                        {/* Chart Side */}
                        <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden" style={{ backgroundColor: '#f9fafb' }}>
                            <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
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
                                    <span className="text-5xl font-bold leading-none kaisei" style={{ color: '#111827' }}>{numberWithCommas(totalLeads)}</span>
                                    <span className="inter text-sm font-bold uppercase tracking-widest mt-2" style={{ color: '#9ca3af' }}>Total Leads</span>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-12">
                                <div className="p-4 rounded-2xl border shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: '#f3f4f6' }}>
                                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Top Performer</span>
                                    <span className="text-lg font-bold" style={{ color: '#111827' }}>{data[0]?.label || 'N/A'}</span>
                                </div>
                                <div className="p-4 rounded-2xl border shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: '#f3f4f6' }}>
                                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Conversion Efficiency</span>
                                    <span className="text-lg font-bold" style={{ color: '#059669' }}>High</span>
                                </div>
                            </div>
                        </div>

                        {/* Table Side */}
                        <div className="flex-1 border-l flex flex-col min-h-0" style={{ borderLeftColor: '#f3f4f6', backgroundColor: '#ffffff' }}>
                            <div className="p-8 shrink-0">
                                <h3 className="text-lg font-bold mb-2 inter" style={{ color: '#111827' }}>Channel Distribution</h3>
                                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Performance by acquisition channel</p>
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
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border" style={{ backgroundColor: `${color}15`, color: color, borderColor: '#f9fafb' }}>
                                                            {iconInfo.isCustom ? (
                                                                <img src={iconInfo.icon} alt={src.label} className="w-5 h-5 object-contain" />
                                                            ) : (
                                                                <iconInfo.icon className="text-xl" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="block font-bold inter" style={{ color: '#1f2937' }}>{src.label}</span>
                                                            <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>Channel {idx + 1}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-lg font-black tabular-nums" style={{ color: '#111827' }}>{src.count}</span>
                                                        <span className="text-xs font-bold" style={{ color: '#3b82f6' }}>{src.p || src.pct}</span>
                                                    </div>
                                                </div>
                                                <div className="h-2 w-full rounded-full overflow-hidden border" style={{ backgroundColor: '#f9fafb', borderColor: 'rgba(243, 244, 246, 0.5)' }}>
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
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="p-8 border-t shrink-0 no-export" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }} data-html2canvas-ignore="true">
                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full py-4 text-white rounded-2xl font-bold inter flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#1E3B70', boxShadow: '0 10px 15px -3px rgba(30, 59, 112, 0.2)' }}
                    >
                        {isExporting ? (
                            <>
                                <FiLoader className="animate-spin" /> Generating PDF...
                            </>
                        ) : (
                            <>
                                Export Channel Report <FiDownload />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SourceReportModal;
