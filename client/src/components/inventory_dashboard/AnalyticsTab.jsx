import React from 'react';
import { FiCalendar, FiChevronDown, FiFilter, FiDownload, FiEye, FiUsers, FiTrendingUp, FiCreditCard, FiTrendingDown, FiActivity, FiGlobe, FiInstagram, FiFacebook, FiMail, FiMoreHorizontal } from 'react-icons/fi';
import numberWithCommas from '../../modules/numberwithcomma';

const AnalyticsTab = ({ data }) => {
    return (
        <div className="h-full max-h-[calc(100vh-9.5rem)] flex flex-col gap-4 animate-in fade-in duration-700">
            {/* Toolbar */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <p className="text-gray-500 font-medium text-xs">Track performance and get actionable insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 bg-white rounded-[10px] shadow-sm overflow-hidden h-[34px] mr-2">
                        <div className="flex items-center px-4 border-r border-gray-100 h-full text-[11px] font-bold text-gray-700 cursor-pointer hover:bg-gray-50"><FiCalendar className="mr-2 text-gray-400"/> 24 Apr - 24 May 2026 <FiChevronDown className="ml-2 text-gray-400"/></div>
                        <div className="flex h-full">
                            {['7D', '30D', '90D', '1Y'].map(d => (
                                <button key={d} className={`px-3 text-[10px] font-bold border-r border-gray-100 ${d==='30D'?'bg-[#FFF8F0] text-[#D48D2A]':'bg-white text-gray-500 hover:bg-gray-50'}`}>{d}</button>
                            ))}
                            <button className="px-3 text-[10px] font-bold bg-white text-gray-500 flex items-center hover:bg-gray-50">Custom <FiChevronDown className="ml-1"/></button>
                        </div>
                    </div>
                    <button className="h-[34px] px-4 border border-gray-200 rounded-[10px] text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"><FiFilter className="text-gray-400"/> Filters</button>
                    <button className="h-[34px] px-4 border border-[#F2E8DB] rounded-[10px] text-[11px] font-bold text-[#D48D2A] bg-[#FFF8F0] hover:bg-[#faeedd] flex items-center gap-2 shadow-sm transition-colors"><FiDownload /> Export Report</button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="flex gap-4 shrink-0 h-[100px]">
                {[
                    {label: 'TOTAL VIEWS', val: data?.stats?.trends?.views?.current ? numberWithCommas(data.stats.trends.views.current) : '0', chg: data?.stats?.trends?.views?.change, icon: FiEye, col: '#D48D2A', bg: '#FFF8F0'},
                    {label: 'TOTAL LEADS', val: data?.stats?.trends?.leads?.current ? numberWithCommas(data.stats.trends.leads.current) : '0', chg: data?.stats?.trends?.leads?.change, icon: FiUsers, col: '#3B82F6', bg: '#EFF6FF'},
                    {label: 'CONVERSION RATE', val: data?.stats?.avgConversion ? `${Number(data.stats.avgConversion).toFixed(2)}%` : '0.00%', chg: data?.stats?.trends?.leads?.change, icon: FiTrendingUp, col: '#10B981', bg: '#ECFDF5'},
                    {label: 'AVG LEAD VALUE', val: data?.stats?.trends?.value?.current ? `$${(data.stats.trends.value.current / 1000000).toFixed(2)}M` : '$0', chg: data?.stats?.trends?.value?.change, icon: FiCreditCard, col: '#8B5CF6', bg: '#F5F3FF'}
                ].map((kpi, idx) => (
                    <div key={idx} className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group">
                        <div className="flex justify-between items-start z-10 relative">
                            <div className="flex flex-col">
                                <span className="inter text-[10px] font-black uppercase text-gray-400 tracking-widest">{kpi.label}</span>
                                <span className="text-[28px] font-bold text-gray-900 leading-none mt-1.5 kaisei tracking-tight">{kpi.val}</span>
                            </div>
                            <div className="w-[34px] h-[34px] rounded-[10px] justify-center flex items-center shrink-0 border border-gray-100 shadow-sm" style={{backgroundColor: kpi.bg, color: kpi.col}}>
                                <kpi.icon className="text-[15px]" />
                            </div>
                        </div>
                        <span className={`inter text-[10px] font-bold ${Number(kpi.chg) >= 0 ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1 z-10 relative mt-auto tracking-wide`}>
                            {Number(kpi.chg) >= 0 ? <FiTrendingUp className="text-[11px]" /> : <FiTrendingDown className="text-[11px]" />}
                            {Math.abs(kpi.chg || 0)}%
                            <span className="inter text-gray-400 font-medium whitespace-nowrap normal-case text-[10px]">from last 30 days</span>
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 h-[35%] opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-30">
                            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full fill-current" style={{color: kpi.col}}><path d={idx%2===0?"M0,30 L0,20 Q15,10 30,25 T60,15 T85,25 T100,5 L100,30 Z":"M0,30 L0,15 Q10,25 20,10 T40,15 T60,5 T80,20 T100,10 L100,30 Z"}/></svg>
                            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full absolute bottom-0 left-0 outline-none"><path d={idx%2===0?"M0,20 Q15,10 30,25 T60,15 T85,25 T100,5":"M0,15 Q10,25 20,10 T40,15 T60,5 T80,20 T100,10"} fill="none" stroke={kpi.col} strokeWidth="1.5"/></svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Analytics Content */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Performance Charts */}
                <div className="flex-[1.5] flex flex-col gap-4 min-h-0">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col flex-1 min-h-0">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h4 className="inter text-sm font-bold text-gray-900 tracking-normal">Views & Leads Analytics</h4>
                                <p className="text-[10px] font-medium text-gray-400 mt-0.5 inter">Historical performance of your listings</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-4 mr-4">
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#D48D2A]"></div><span className="text-[10px] font-bold text-gray-500 inter uppercase">Views</span></div>
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#1E3B70]"></div><span className="text-[10px] font-bold text-gray-500 inter uppercase">Leads</span></div>
                                </div>
                                <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                                    {['Chart', 'Table'].map(m => (
                                        <button key={m} className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-[6px] transition-all ${m==='Chart'?'bg-white text-gray-900 shadow-sm border border-gray-100':'text-gray-400 hover:text-gray-600'}`}>{m}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative mt-2 bg-[radial-gradient(#f1f1f1_1px,transparent_1px)] [background-size:24px_24px]">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between py-2 border-b border-l border-gray-100">
                                {[1,2,3,4,5].map(i => <div key={i} className="w-full border-t border-gray-50 h-0 relative"><span className="absolute -left-7 -top-2 text-[9px] font-bold text-gray-300 w-5 text-right">{100 - (i-1)*20}</span></div>)}
                            </div>
                            {/* SVG Chart Placeholder */}
                            <div className="absolute inset-0 pt-2 pb-6 pl-2 pr-2">
                                <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
                                    <path d="M0,250 Q100,100 200,220 T400,80 T600,150 T800,120 T1000,180" fill="none" stroke="#D48D2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M0,280 Q100,200 200,260 T400,180 T600,240 T800,200 T1000,240" fill="none" stroke="#1E3B70" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {/* X-Axis */}
                            <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 pt-2 inter text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                {['Apr 24', 'May 01', 'May 08', 'May 15', 'May 22', 'May 24'].map(d => <span key={d}>{d}</span>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Distributions */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="inter text-sm font-bold text-gray-900 tracking-normal">Lead Sources</h4>
                            <FiMoreHorizontal className="text-gray-400 cursor-pointer" />
                        </div>
                        <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">
                            {[
                                {label: 'Website', val: 65, icon: FiGlobe, col: '#D48D2A'},
                                {label: 'WhatsApp', val: 24, icon: FiActivity, col: '#10B981'},
                                {label: 'Instagram', val: 8, icon: FiInstagram, col: '#8B5CF6'},
                                {label: 'Facebook', val: 3, icon: FiFacebook, col: '#3B82F6'},
                                {label: 'Email', val: 0, icon: FiMail, col: '#94A3B8'}
                            ].map((src, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center inter text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                        <div className="flex items-center gap-2"><src.icon className="text-xs" style={{color: src.col}}/> {src.label}</div>
                                        <span className="text-gray-900">{src.val}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${src.val}%`, backgroundColor: src.col}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
