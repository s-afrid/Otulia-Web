import React from 'react';
import { 
    FiEye, FiUsers, FiTrendingUp, FiCreditCard, FiTrendingDown, 
    FiGlobe, FiInstagram, FiFacebook, FiChevronDown, FiActivity,
    FiMessageSquare, FiMapPin, FiArrowRight, FiMoreHorizontal
} from 'react-icons/fi';
import numberWithCommas from '../../modules/numberwithcomma';
import WorldMap from './WorldMap';

const AnalyticsTab = ({ 
    data, 
    generateSparkline, 
    chartInterval, 
    setChartInterval, 
    getSparklineData 
}) => {
    // Top KPI Cards Data
    const kpiCards = [
        { 
            label: 'Total Views', 
            val: data?.stats?.trends?.views?.current || 0, 
            chg: data?.stats?.trends?.views?.change || 0, 
            icon: FiEye, 
            col: '#D48D2A', 
            bg: '#FFF8F0',
            key: 'views'
        },
        { 
            label: 'Total Leads', 
            val: data?.stats?.trends?.leads?.current || 0, 
            chg: data?.stats?.trends?.leads?.change || 0, 
            icon: FiUsers, 
            col: '#3B82F6', 
            bg: '#EFF6FF',
            key: 'leads'
        },
        { 
            label: 'Conversion Rate', 
            val: `${data?.stats?.avgConversion || '0.00'}%`, 
            chg: data?.stats?.trends?.leads?.change || 0, 
            icon: FiTrendingUp, 
            col: '#10B981', 
            bg: '#ECFDF5',
            key: 'leads' // Approximating sparkline with leads
        },
        { 
            label: 'AVG Lead Value', 
            val: `$${numberWithCommas(Math.floor((data?.stats?.trends?.value?.current || 0) / (data?.stats?.trends?.leads?.current || 1)))}`, 
            chg: data?.stats?.trends?.value?.change || 0, 
            icon: FiCreditCard, 
            col: '#8B5CF6', 
            bg: '#F5F3FF',
            key: 'value'
        }
    ];

    return (
        <div className="flex flex-col gap-[2vh] h-full animate-in fade-in duration-700 pb-[2vh]">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[clamp(8px,1vh,20px)] flex-none h-[14vh] min-h-[100px]">
                {kpiCards.map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-[clamp(8px,1.2vh,20px)] p-[clamp(10px,1.2vh,20px)] flex flex-col justify-between border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                        <div className="flex justify-between items-start z-10 w-full relative">
                            <div className="flex flex-col">
                                <span className="inter text-[clamp(8px,1vh,14px)] font-bold uppercase tracking-[0.05em] text-gray-700 leading-none mb-2">{kpi.label}</span>
                                <span className="text-[clamp(18px,2.4vh,36px)] font-bold text-gray-900 leading-none kaisei">{typeof kpi.val === 'number' ? numberWithCommas(kpi.val) : kpi.val}</span>
                                <span className={`inter text-[clamp(8px,1vh,15px)] font-bold ${Number(kpi.chg) >= 0 ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1 mt-2`}>
                                    {Number(kpi.chg) >= 0 ? <FiTrendingUp className="text-[clamp(10px,1.2vh,18px)]" /> : <FiTrendingDown className="text-[clamp(10px,1.2vh,18px)]" />} 
                                    {Math.abs(kpi.chg || 0)}% 
                                    <span className="text-gray-600 font-bold whitespace-nowrap normal-case">from last 30 days</span>
                                </span>
                            </div>
                            <div className="w-[clamp(28px,4vh,48px)] h-[clamp(28px,4vh,48px)] rounded-[clamp(6px,0.8vh,12px)] flex items-center justify-center shrink-0 shadow-sm border border-gray-50/50" style={{ backgroundColor: kpi.bg, color: kpi.col }}>
                                <kpi.icon className="text-[clamp(14px,2vh,28px)]" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[2.5vh] select-none pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <path 
                                    d={generateSparkline(data?.stats?.dailyTrends, kpi.key)} 
                                    fill="none" 
                                    stroke={kpi.col} 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Row: Performance Trend & Top Performing Assets */}
            <div className="flex flex-col lg:flex-row gap-[clamp(8px,1vh,20px)] flex-none lg:flex-[1.5] min-h-0">
                {/* Left Line Chart: Performance Trend */}
                <div className="flex-[2] bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(12px,1.8vh,30px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden min-h-0">
                    <div className="flex justify-between items-center mb-[clamp(12px,1.8vh,30px)] shrink-0 relative z-10">
                        <div className="flex flex-col gap-2">
                            <h4 className="inter text-[clamp(14px,1.8vh,28px)] font-bold text-gray-900 tracking-tight leading-none">Performance Trend</h4>
                            <div className="flex gap-[clamp(12px,1.5vw,32px)] mt-1">
                                <div className="flex items-center gap-2"><div className="w-2.5 h-1.5 rounded-full bg-[#D48D2A]"></div><span className="inter text-[clamp(10px,1.3vh,18px)] font-medium text-gray-500 leading-none">Views</span></div>
                                <div className="flex items-center gap-2"><div className="w-2.5 h-1.5 rounded-full bg-[#1E3B70]"></div><span className="inter text-[clamp(10px,1.3vh,18px)] font-medium text-gray-500 leading-none">Leads</span></div>
                                <div className="flex items-center gap-2"><div className="w-2.5 h-1.5 rounded-full bg-[#10B981]"></div><span className="inter text-[clamp(10px,1.3vh,18px)] font-medium text-gray-500 leading-none">Conversions</span></div>
                            </div>
                        </div>
                        <div className="relative">
                            <select 
                                value={chartInterval} 
                                onChange={(e) => setChartInterval(e.target.value)}
                                className="inter text-[clamp(10px,1.3vh,18px)] font-medium text-gray-600 bg-white border border-gray-200 rounded-[clamp(6px,0.8vh,12px)] pl-[clamp(12px,1.5vh,24px)] pr-[clamp(28px,3.5vh,48px)] py-[clamp(6px,0.8vh,12px)] outline-none shadow-sm cursor-pointer hover:bg-gray-50 leading-none tracking-normal appearance-none min-w-[clamp(80px,10vh,160px)]"
                            >
                                <option value="Day">Daily</option>
                                <option value="Week">Weekly</option>
                                <option value="Month">Monthly</option>
                            </select>
                            <FiChevronDown className="absolute right-[clamp(10px,1.2vh,20px)] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[clamp(12px,1.6vh,24px)]" />
                        </div>
                    </div>

                    <div className="flex-1 relative mt-2 min-h-0 w-full">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 pb-[clamp(20px,2.5vh,48px)] pl-[clamp(32px,4.5vh,80px)] flex flex-col justify-between border-b border-gray-50 pointer-events-none pr-4">
                            {[100, 75, 50, 25, 0].map((val, i) => (
                                <div key={i} className="w-full border-t border-gray-50/80 flex items-center h-0 relative">
                                    <span className="absolute -left-[clamp(32px,4.5vh,80px)] inter text-[clamp(10px,1.3vh,18px)] text-gray-400 font-medium w-[clamp(28px,3.5vh,64px)] text-right pr-2 leading-none tracking-normal">{val === 100 ? '50K' : val === 75 ? '25K' : val === 50 ? '15K' : val === 25 ? '5K' : '0'}</span>
                                </div>
                            ))}
                        </div>
                        {/* X-Axis Labels */}
                        <div className="absolute inset-x-0 bottom-0 pl-[clamp(32px,4.5vh,80px)] pr-4 h-[clamp(20px,2.5vh,48px)] flex justify-between items-end inter text-[clamp(10px,1.3vh,18px)] font-medium text-gray-400 pb-2">
                            {(() => {
                                const rawData = (data?.stats?.dailyTrends || []).slice(chartInterval === 'Day' ? -3 : chartInterval === 'Week' ? -7 : -30);
                                const points = [];
                                if (rawData.length > 0) {
                                    for (let i = 0; i < 8; i++) {
                                        const idx = Math.min(Math.floor((i / 7) * (rawData.length - 1)), rawData.length - 1);
                                        points.push(rawData[idx]);
                                    }
                                }
                                return points.map((d, i) => (
                                    <span key={i}>{new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                ));
                            })()}
                        </div>
                        {/* Main SVG Chart Area */}
                        <div className="absolute inset-0 pb-[clamp(24px,3vh,56px)] pl-[clamp(32px,4.5vh,80px)] pr-4 mt-2 overflow-visible">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                                {(() => {
                                    const rawData = (data?.stats?.dailyTrends || []).slice(chartInterval === 'Day' ? -3 : chartInterval === 'Week' ? -7 : -30);
                                    const trendData = [];
                                    if (rawData.length > 0) {
                                        for (let i = 0; i < 8; i++) {
                                            const idx = Math.min(Math.floor((i / 7) * (rawData.length - 1)), rawData.length - 1);
                                            trendData.push(rawData[idx]);
                                        }
                                    }
                                    const viewsData = getSparklineData(trendData, 'views', 300, 100, 10);
                                    const leadsData = getSparklineData(trendData, 'leads', 300, 100, 10);
                                    // Simulated conversions data for the third line
                                    const convData = getSparklineData(trendData.map(d => ({ ...d, conv: (d.leads * 0.4) + (Math.random() * 5) })), 'conv', 300, 100, 10);
                                    
                                    return (
                                        <>
                                            {/* Views Line */}
                                            <path d={viewsData.path} fill="none" stroke="#D48D2A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            {viewsData.points.map((pt, i) => (
                                                <circle key={`v-${i}`} cx={pt.x} cy={pt.y} r="1.5" fill="#D48D2A" stroke="white" strokeWidth="0.5" />
                                            ))}
                                            {/* Leads Line */}
                                            <path d={leadsData.path} fill="none" stroke="#1E3B70" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            {leadsData.points.map((pt, i) => (
                                                <circle key={`l-${i}`} cx={pt.x} cy={pt.y} r="1.5" fill="#1E3B70" stroke="white" strokeWidth="0.5" />
                                            ))}
                                            {/* Conversions Line */}
                                            <path d={convData.path} fill="none" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            {convData.points.map((pt, i) => (
                                                <circle key={`c-${i}`} cx={pt.x} cy={pt.y} r="1.5" fill="#10B981" stroke="white" strokeWidth="0.5" />
                                            ))}
                                        </>
                                    );
                                })()}
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Top Performing Assets */}
                <div className="flex-1 bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(12px,1.8vh,30px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] min-h-0 min-w-[30%]">
                    <div className="flex justify-between items-center mb-[clamp(10px,1.5vh,24px)] shrink-0">
                        <h4 className="inter text-[clamp(14px,1.8vh,28px)] font-bold text-gray-900 tracking-tight leading-none">Top Performing Assets</h4>
                        <button className="px-4 py-1.5 rounded-lg border border-gray-100 text-[clamp(10px,1.2vh,18px)] font-semibold text-gray-500 hover:bg-gray-50 transition-colors">View All</button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <table className="w-full text-left table-fixed">
                            <thead className="sticky top-0 bg-white z-10 w-full">
                                <tr className="border-b border-gray-50">
                                    <th className="pb-3 inter text-[clamp(9px,1.2vh,16px)] font-semibold text-gray-400 uppercase tracking-[0.05em] w-6/12">Assets</th>
                                    <th className="pb-3 inter text-[clamp(9px,1.2vh,16px)] font-semibold text-gray-400 uppercase tracking-[0.05em] w-2/12 text-center">Views</th>
                                    <th className="pb-3 inter text-[clamp(9px,1.2vh,16px)] font-semibold text-gray-400 uppercase tracking-[0.05em] w-2/12 text-center">Leads</th>
                                    <th className="pb-3 inter text-[clamp(9px,1.2vh,16px)] font-semibold text-gray-400 uppercase tracking-[0.05em] w-2/12 text-right">Conv.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50/50">
                                {(data?.inventory || []).slice(0, 4).map((item, i) => {
                                    const views = Math.floor(Math.random() * 5000) + 1000;
                                    const leads = Math.floor(views * (0.02 + Math.random() * 0.05));
                                    const conv = ((leads / views) * 100).toFixed(2);
                                    return (
                                        <tr key={i} className="group hover:bg-gray-50/30 transition-colors">
                                            <td className="py-[clamp(6px,0.8vh,16px)] flex items-center gap-3">
                                                <div className="w-[clamp(24px,3.5vh,54px)] h-[clamp(18px,2.5vh,38px)] rounded-lg bg-[#F3EBE3] shrink-0 overflow-hidden shadow-sm border border-gray-100/50">
                                                    {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><FiActivity/></div>}
                                                </div>
                                                <span className="inter text-gray-900 font-semibold text-[clamp(10px,1.3vh,18px)] truncate">{item.title || item.name}</span>
                                            </td>
                                            <td className="py-[clamp(6px,0.8vh,16px)] text-center text-gray-600 font-bold text-[clamp(10px,1.3vh,18px)] tabular-nums">{numberWithCommas(views)}</td>
                                            <td className="py-[clamp(6px,0.8vh,16px)] text-center text-gray-600 font-bold text-[clamp(10px,1.3vh,18px)] tabular-nums">{leads}</td>
                                            <td className="py-[clamp(6px,0.8vh,16px)] text-right text-emerald-500 font-bold text-[clamp(10px,1.3vh,18px)] tabular-nums">{conv}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Leads By Source & Leads By Location */}
            <div className="flex flex-col lg:flex-row gap-[clamp(8px,1vh,20px)] flex-none lg:flex-[1.2] min-h-0">
                {/* Leads By Source Donut Section */}
                <div className="flex-[1.2] bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(12px,1.8vh,30px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] min-h-0">
                    <div className="flex justify-between items-center mb-[clamp(10px,1.5vh,24px)] shrink-0">
                        <h4 className="inter text-[clamp(14px,1.8vh,28px)] font-bold text-gray-900 tracking-tight leading-none">Leads By Source</h4>
                        <button className="px-4 py-1.5 rounded-lg text-[clamp(10px,1.2vh,18px)] font-bold text-[#D48D2A] bg-[#FFF8F0] hover:bg-[#F2E8DB] transition-colors border border-[#F2E8DB]/50 shadow-sm">View Report</button>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-[clamp(12px,2vw,48px)] min-h-0 px-2">
                        {/* Donut Chart SVG */}
                        <div className="w-[clamp(100px,15vh,260px)] aspect-square flex items-center justify-center relative shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                                {(() => {
                                    const sources = [
                                        { label: 'WhatsApp', count: 458, color: '#22C55E' },
                                        { label: 'Website', count: 458, color: '#3B82F6' },
                                        { label: 'Facebook', count: 458, color: '#1E3B70' },
                                        { label: 'Instagram', count: 458, color: '#E1306C' },
                                        { label: 'Others', count: 458, color: '#9CA3AF' }
                                    ];
                                    const total = sources.reduce((s, i) => s + i.count, 0) || 1;
                                    let cumulativeOffset = 0;
                                    return sources.map((src, idx) => {
                                        const pct = src.count / total;
                                        const dashArray = 251.2; // 2 * pi * r
                                        const offset = cumulativeOffset;
                                        cumulativeOffset += pct;
                                        return (
                                            <circle 
                                                key={idx} 
                                                cx="50" 
                                                cy="50" 
                                                r="40" 
                                                fill="none" 
                                                stroke={src.color} 
                                                strokeWidth="12" 
                                                strokeDasharray={dashArray} 
                                                strokeDashoffset={dashArray * (1 - pct)} 
                                                style={{ transform: `rotate(${offset * 360}deg)`, transformOrigin: 'center' }} 
                                            />
                                        );
                                    });
                                })()}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
                                <span className="text-[clamp(18px,2.8vh,40px)] font-bold text-gray-900 leading-none kaisei">{numberWithCommas(data?.stats?.totalLeads || 1248)}</span>
                                <span className="inter text-[clamp(8px,1vh,16px)] font-bold text-gray-400 uppercase tracking-[0.05em] mt-1">Total Leads</span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex flex-col justify-center gap-[clamp(8px,1vh,20px)] flex-1">
                            {[
                                { label: 'Whatsapp', count: 458, pct: '36.7%', color: '#22C55E', icon: FiMessageSquare },
                                { label: 'Website', count: 458, pct: '36.7%', color: '#3B82F6', icon: FiGlobe },
                                { label: 'Facebook', count: 458, pct: '36.7%', color: '#1E3B70', icon: FiFacebook },
                                { label: 'Instagram', count: 458, pct: '36.7%', color: '#E1306C', icon: FiInstagram },
                                { label: 'Others', count: 458, pct: '36.7%', color: '#9CA3AF', icon: FiMoreHorizontal }
                            ].map((src, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[clamp(24px,3.2vh,48px)] h-[clamp(24px,3.2vh,48px)] rounded-full flex items-center justify-center shrink-0 border border-gray-50/50 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${src.color}15`, color: src.color }}>
                                            <src.icon className="text-[clamp(12px,1.6vh,24px)]" />
                                        </div>
                                        <span className="inter text-[clamp(10px,1.3vh,18px)] font-bold text-gray-800 group-hover:text-black transition-colors">{src.label}</span>
                                    </div>
                                    <span className="inter text-[clamp(10px,1.3vh,18px)] font-bold text-gray-900 tabular-nums">{src.count} <span className="text-gray-700 font-bold ml-1">({src.pct})</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Leads By Location Section */}
                <div className="flex-[2] bg-white rounded-[clamp(8px,1.5vh,24px)] p-[clamp(12px,1.8vh,30px)] flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] min-h-0">
                    <div className="flex justify-between items-center mb-[clamp(10px,1.5vh,24px)] shrink-0">
                        <h4 className="inter text-[clamp(14px,1.8vh,28px)] font-bold text-gray-900 tracking-tight leading-none">Leads By Location</h4>
                        <div className="flex items-center gap-4">
                            {data?.analytics?.leadsByLocation?.length > 0 && (
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <span className="text-[clamp(9px,1.2vh,16px)] font-bold text-gray-700 uppercase tracking-[0.05em]">Top Country :</span>
                                    <div className="flex items-center gap-1.5">
                                        <img 
                                            src={
                                                data.analytics.leadsByLocation[0].country === 'United States' ? 'https://flagcdn.com/us.svg' :
                                                data.analytics.leadsByLocation[0].country === 'UAE' ? 'https://flagcdn.com/ae.svg' :
                                                data.analytics.leadsByLocation[0].country === 'United Kingdom' ? 'https://flagcdn.com/gb.svg' :
                                                data.analytics.leadsByLocation[0].country === 'India' ? 'https://flagcdn.com/in.svg' :
                                                'https://flagcdn.com/un.svg'
                                            } 
                                            className="w-4 rounded-sm" 
                                            alt={data.analytics.leadsByLocation[0].country} 
                                        />
                                        <span className="text-[clamp(10px,1.3vh,18px)] font-bold text-gray-900">{data.analytics.leadsByLocation[0].country} - {data.analytics.leadsByLocation[0].leads}</span>
                                        <span className="text-[clamp(8px,1vh,14px)] font-bold text-emerald-600">{data.analytics.leadsByLocation[0].pct}% Of Total Leads</span>
                                    </div>
                                </div>
                            )}
                            <button className="px-4 py-1.5 rounded-lg border border-gray-100 text-[clamp(10px,1.2vh,18px)] font-bold text-gray-800 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors uppercase tracking-[0.05em]"><FiMapPin className="text-gray-700"/> View Map</button>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex gap-8 min-h-0">
                        {/* Location List */}
                        <div className="flex-[0.8] flex flex-col justify-center gap-[clamp(10px,1.5vh,28px)] h-full pr-4 border-r border-gray-50/50">
                            <div className="flex justify-between items-center pb-1 text-[clamp(10px,1.3vh,16px)] font-bold text-gray-800 uppercase tracking-[0.05em] border-b border-gray-50/80">
                                <span>Assets</span>
                                <div className="flex gap-[clamp(40px,5vw,80px)]">
                                    <span>Leads</span>
                                    <span>Percentages</span>
                                </div>
                            </div>
                            {(data?.analytics?.leadsByLocation || []).slice(0, 5).map((loc, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <span className="inter text-[clamp(10px,1.3vh,18px)] font-bold text-gray-800 w-1/4 truncate">{loc.country}</span>
                                    <div className="flex items-center gap-[clamp(20px,2.5vw,40px)] flex-1 justify-end">
                                        <span className="inter text-[clamp(10px,1.3vh,18px)] font-black text-gray-900 tabular-nums w-12 text-center">{loc.leads}</span>
                                        <div className="flex items-center gap-3 flex-1 max-w-[180px]">
                                            <div className="h-[ clamp(5px,0.8vh,10px)] flex-1 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50 shadow-inner">
                                                <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${loc.pct}%`, backgroundColor: '#D4A63A', opacity: 1 - (idx * 0.15) }}></div>
                                            </div>
                                            <span className="inter text-[clamp(10px,1.3vh,18px)] font-bold text-emerald-600 w-12 text-right tabular-nums">{loc.pct}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Map Visualization */}
                        <div className="flex-1 relative flex items-center justify-center h-full min-h-[220px]">
                            <div className="w-full h-full max-w-[600px] max-h-[300px] relative">
                                <WorldMap data={data?.analytics?.leadsByLocation || []} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
