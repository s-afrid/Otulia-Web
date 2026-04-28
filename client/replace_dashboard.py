import re
with open('/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx', 'r') as f:
    content = f.read()

# I want to replace from line 728 "                    {/* DASHBOARD TAB */}" to "                    {/* INVENTORY TAB */}"
start_str = "                    {/* DASHBOARD TAB */}"
end_str = "                    {/* INVENTORY TAB */}"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_dash = """                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="h-[calc(100vh-6rem-5rem)] flex flex-col gap-4 animate-in fade-in duration-700 pb-2">
                            {/* Header Row */}
                            <div className="flex justify-between items-end shrink-0">
                                <div>
                                    <h2 className="text-[28px] font-bold text-gray-900 font-playfair mb-0 leading-tight">Dashboard</h2>
                                    <p className="text-gray-400 font-medium text-xs flex items-center gap-1.5">Welcome back, {user?.name?.split(' ')[0] || 'Md Riyaz'} <span className="text-[12px]">👋</span></p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm text-xs font-bold text-gray-600 cursor-pointer">
                                        <FiCalendar className="text-gray-400 mr-2" /> Last 30 days <FiChevronDown className="ml-3 text-gray-400" />
                                    </div>
                                    <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1 shrink-0">
                                        <button className="px-4 py-1 rounded-lg text-[10px] font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">Day</button>
                                        <button className="px-4 py-1 rounded-lg text-[10px] font-bold bg-gray-900 text-white shadow-sm hover:opacity-90 uppercase tracking-widest transition-colors">Week</button>
                                        <button className="px-4 py-1 rounded-lg text-[10px] font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">Month</button>
                                    </div>
                                </div>
                            </div>

                            {/* Top 4 KPI Cards */}
                            <div className="grid grid-cols-4 gap-4 shrink-0 h-[100px]">
                                {/* Card 1 */}
                                <div className="bg-white rounded-[1.25rem] p-4 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex-1 group">
                                    <div className="flex justify-between items-start z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Views</span>
                                            <span className="text-2xl font-bold text-gray-900 font-playfair leading-none mt-1">{numberWithCommas(data.stats?.totalViews || 2456)}</span>
                                            <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-1.5 tracking-wide"><FiTrendingUp className="text-[10px]" /> 12.5% <span className="text-gray-400/80 font-medium">vs last 30 days</span></span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-[#FFF8F0] justify-center text-[#D48D2A] flex items-center shrink-0 border border-[#F2E8DB] shadow-sm"><FiEye className="text-sm" /></div>
                                    </div>
                                    <svg className="absolute bottom-0 left-0 w-full h-[40px] select-none pointer-events-none group-hover:-translate-y-1 transition-transform" preserveAspectRatio="none" viewBox="0 0 100 20">
                                        <path d="M0,15 L10,12 L20,18 L30,5 L40,8 L50,2 L60,10 L70,4 L80,12 L90,1 L100,5" fill="none" stroke="#D48D2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {/* Card 2 */}
                                <div className="bg-white rounded-[1.25rem] p-4 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex-1 group">
                                    <div className="flex justify-between items-start z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Leads</span>
                                            <span className="text-2xl font-bold text-gray-900 font-playfair leading-none mt-1">{numberWithCommas(data.stats?.totalLeads || 142)}</span>
                                            <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-1.5 tracking-wide"><FiTrendingUp className="text-[10px]" /> 8.2% <span className="text-gray-400/80 font-medium">vs last 30 days</span></span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 justify-center flex items-center shrink-0 border border-blue-100 shadow-sm"><FiUser className="text-sm" /></div>
                                    </div>
                                    <svg className="absolute bottom-0 left-0 w-full h-[40px] select-none pointer-events-none group-hover:-translate-y-1 transition-transform" preserveAspectRatio="none" viewBox="0 0 100 20">
                                        <path d="M0,12 L10,15 L20,8 L30,12 L40,5 L50,14 L60,4 L70,8 L80,2 L90,10 L100,6" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {/* Card 3 */}
                                <div className="bg-white rounded-[1.25rem] p-4 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex-1 group">
                                    <div className="flex justify-between items-start z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Saved / Shortlisted</span>
                                            <span className="text-2xl font-bold text-gray-900 font-playfair leading-none mt-1">{data.stats?.savedCount || 48}</span>
                                            <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-1.5 tracking-wide"><FiTrendingUp className="text-[10px]" /> 5.1% <span className="text-gray-400/80 font-medium">vs last 30 days</span></span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 justify-center flex items-center shrink-0 border border-emerald-100 shadow-sm"><FiHeart className="text-sm" /></div>
                                    </div>
                                    <svg className="absolute bottom-0 left-0 w-full h-[40px] select-none pointer-events-none group-hover:-translate-y-1 transition-transform" preserveAspectRatio="none" viewBox="0 0 100 20">
                                        <path d="M0,18 L15,10 L30,12 L45,5 L60,15 L75,8 L90,2 L100,5" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {/* Card 4 */}
                                <div className="bg-white rounded-[1.25rem] p-4 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex-1 group">
                                    <div className="flex justify-between items-start z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Est. Lead Value</span>
                                            <span className="text-2xl font-bold text-gray-900 font-playfair leading-none mt-1">${(data.stats?.estLeadValue || 2450000) >= 1000000 ? (data.stats?.estLeadValue/1000000).toFixed(2) + 'M' : numberWithCommas(data.stats?.estLeadValue || 0)}</span>
                                            <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-1.5 tracking-wide"><FiTrendingUp className="text-[10px]" /> 15.3% <span className="text-gray-400/80 font-medium">vs last 30 days</span></span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 justify-center flex items-center shrink-0 border border-purple-100 shadow-sm"><FiTrendingUp className="text-sm" /></div>
                                    </div>
                                    <svg className="absolute bottom-0 left-0 w-full h-[40px] select-none pointer-events-none group-hover:-translate-y-1 transition-transform" preserveAspectRatio="none" viewBox="0 0 100 20">
                                        <path d="M0,15 L20,12 L40,8 L60,4 L80,6 L100,2" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            {/* Middle Charts */}
                            <div className="flex flex-1 gap-4 overflow-hidden min-h-[220px]">
                                {/* Left Line Chart */}
                                <div className="w-[66%] bg-white rounded-[1.25rem] p-5 pb-3 flex flex-col border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative">
                                    <div className="flex justify-between items-center mb-0 shrink-0">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-[15px] font-bold text-gray-900 font-playfair tracking-wide">Views vs Leads Over Time</h4>
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-1.5"><div className="w-2 h-0.5 rounded-full bg-[#D48D2A]"></div><span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Views</span></div>
                                                <div className="flex items-center gap-1.5"><div className="w-2 h-0.5 rounded-full bg-[#1E3B70]"></div><span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Leads</span></div>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <select className="appearance-none border border-gray-200 text-[10px] font-bold text-gray-500 rounded-md py-1 pb-1.5 px-2 pr-6 outline-none bg-transparent cursor-pointer hover:bg-gray-50 transition-colors uppercase tracking-widest">
                                                <option>Week</option>
                                            </select>
                                            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[9px] pointer-events-none" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 relative mt-[1px]">
                                        <div className="absolute inset-0 pb-5 pl-8 flex flex-col justify-between border-b border-gray-50 pointer-events-none pr-1">
                                            {[300, 225, 150, 75, 0].map((val, i) => (
                                                <div key={i} className="w-full border-t border-gray-50 flex items-center h-0 relative">
                                                    <span className="absolute -left-8 text-[9px] text-gray-400 font-bold w-6 text-right -mt-2 bg-white pr-1">{val}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 pl-8 pr-1 h-5 flex justify-between items-end text-[9px] font-bold text-gray-400 capitalize whitespace-nowrap overflow-hidden">
                                            <span>24 Apr</span><span>27 Apr</span><span>30 Apr</span><span>03 May</span><span>06 May</span><span>09 May</span><span>12 May</span><span>15 May</span><span>21 May</span>
                                        </div>
                                        <div className="absolute inset-0 pb-5 pl-8 pr-1 mt-1.5">
                                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                {/* Views Line */}
                                                <path d="M0,60 C10,40 15,45 25,25 C35,15 45,35 55,20 C65,40 75,30 85,45 L100,40" fill="none" stroke="#D48D2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                {[0,25,55,85,100].map((cx,i) => <circle key={`o-${i}`} cx={cx} cy={[60,25,20,45,40][i]} r="2.5" fill="#D48D2A" stroke="white" strokeWidth="1"/>)}
                                                
                                                {/* Leads Line */}
                                                <path d="M0,85 C10,75 20,80 30,75 C40,85 50,70 60,70 C70,68 80,82 90,75 L100,75" fill="none" stroke="#1E3B70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                {[0,30,60,90,100].map((cx,i) => <circle key={`b-${i}`} cx={cx} cy={[85,75,70,75,75][i]} r="2" fill="#1E3B70" stroke="white" strokeWidth="1"/>)}
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right Donut */}
                                <div className="w-[34%] bg-white rounded-[1.25rem] p-5 pb-4 flex flex-col border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <h4 className="text-[15px] font-bold text-gray-900 font-playfair tracking-wide mb-1 shrink-0">Leads by Asset Category</h4>
                                    <div className="flex-1 flex gap-2 items-center relative">
                                        <div className="w-1/2 h-full flex items-center justify-center relative scale-[1.3] translate-x-2">
                                            <svg viewBox="0 0 100 100" className="w-[85%] transform -rotate-90">
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#D48D2A" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.472)} />
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#1E3B70" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.317)} style={{strokeDashoffset: 251.2 * (1 - 0.317) + 251.2 * (1 - 0.472)}}/>
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.155)} style={{strokeDashoffset: 251.2 * (1 - 0.155) + 251.2 * (1 - (0.472+0.317))}}/>
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#9CA3AF" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.056)} style={{strokeDashoffset: 251.2 * (1 - 0.056) + 251.2 * (1 - (0.472+0.317+0.155))}}/>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                <span className="text-[20px] font-bold text-gray-900 leading-none">142</span>
                                                <span className="text-[6px] uppercase font-bold text-gray-400 tracking-widest mt-1">Total Leads</span>
                                            </div>
                                        </div>
                                        <div className="w-1/2 flex flex-col justify-center gap-2.5 z-10 pl-6">
                                            {[ 
                                                {n:'Cars', v:67, p:'47.2%', c:'#D48D2A'}, {n:'Yachts', v:45, p:'31.7%', c:'#1E3B70'},
                                                {n:'Real Estate', v:22, p:'15.5%', c:'#10B981'}, {n:'Others', v:8, p:'5.6%', c:'#9CA3AF'}
                                            ].map((r,i) => (
                                                <div key={i} className="flex items-center justify-between text-[9px] font-bold">
                                                    <span className="flex items-center gap-1.5 text-gray-600"><span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:r.c}}></span>{r.n}</span>
                                                    <span className="text-gray-900 truncate pl-1 flex gap-1"><span className="w-3 text-right">{r.v}</span> <span className="text-gray-400/80 font-medium w-6 text-right">({r.p})</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-1 shrink-0 mt-2">
                                        <button className="text-[9px] font-bold text-[#D48D2A] hover:bg-[#FFF8F0] px-2 py-1 rounded transition-colors uppercase tracking-widest flex items-center gap-1">View Full Report <FiChevronRight/></button>
                                    </div>
                                </div>
                            </div>

                            {/* Third Row */}
                            <div className="flex gap-4 shrink-0 h-[170px]">
                                {/* Top Assets Table */}
                                <div className="w-5/12 bg-white rounded-[1.25rem] p-4 flex flex-col border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-[14px] font-bold text-gray-900 font-playfair tracking-wide">Top Performing Assets</h4>
                                        <button className="text-[9px] font-bold text-[#D48D2A] bg-[#FFF8F0] px-2 py-1 rounded transition-colors uppercase tracking-widest">View all</button>
                                    </div>
                                    <table className="w-full text-left table-fixed">
                                        <thead>
                                            <tr>
                                                <th className="pb-1.5 pt-1 text-[8px] font-black text-gray-400/80 uppercase tracking-widest border-b border-gray-50/50 w-7/12">Asset</th>
                                                <th className="pb-1.5 pt-1 text-[8px] font-black text-gray-400/80 uppercase tracking-widest border-b border-gray-50/50 w-2/12 text-center">Views</th>
                                                <th className="pb-1.5 pt-1 text-[8px] font-black text-gray-400/80 uppercase tracking-widest border-b border-gray-50/50 w-3/12 text-right pr-2">Change</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-[10px] font-bold">
                                            {[ {n:'Ferrari SF90',v:892,c:'18.2%',img:'/assets/placeholder.jpg'}, {n:'Sunseeker 88 Yacht',v:673,c:'12.8%',img:'/assets/placeholder.jpg'}, {n:'Dubai Marina Penthouse',v:512,c:'9.4%',img:'/assets/placeholder.jpg'} ].map((r,i) => (
                                                <tr key={i} className="hover:bg-gray-50/50">
                                                    <td className="py-1.5 pt-2 flex items-center gap-2 truncate">
                                                        <img src={r.img} className="w-6 h-6 rounded object-cover shadow-sm border border-gray-200/50 shrink-0"/>
                                                        <span className="text-gray-900 truncate overflow-hidden whitespace-nowrap">{r.n}</span>
                                                    </td>
                                                    <td className="py-1.5 pt-2 text-center text-gray-600 font-black">{r.v}</td>
                                                    <td className="py-1.5 pt-2 text-right text-emerald-500 pr-2 tracking-wide flex justify-end items-center"><FiTrendingUp className="mr-0.5 text-[8px]"/> {r.c}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Leads Source Donut */}
                                <div className="w-4/12 bg-white rounded-[1.25rem] p-4 flex flex-col border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative">
                                    <div className="flex justify-between items-center mb-0">
                                        <h4 className="text-[14px] font-bold text-gray-900 font-playfair tracking-wide">Leads Source</h4>
                                        <button className="text-[9px] font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">View all</button>
                                    </div>
                                    <div className="flex-1 flex items-center justify-between z-10 px-0">
                                        <div className="w-1/2 h-full flex items-center justify-center relative pb-3 -ml-2">
                                            <svg viewBox="0 0 100 100" className="w-[110%] transform -rotate-135">
                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#F3F4F6" strokeWidth="16" />
                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#D48D2A" strokeWidth="16" strokeDasharray="219.9" strokeDashoffset={219.9 * (1 - 0.437)} />
                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#1E3B70" strokeWidth="16" strokeDasharray="219.9" strokeDashoffset={219.9 * (1 - 0.338)} style={{strokeDashoffset: 219.9 * (1 - 0.338) + 219.9 * (1 - 0.437)}}/>
                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#10B981" strokeWidth="16" strokeDasharray="219.9" strokeDashoffset={219.9 * (1 - 0.155)} style={{strokeDashoffset: 219.9 * (1 - 0.155) + 219.9 * (1 - (0.437+0.338))}}/>
                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#8B5CF6" strokeWidth="16" strokeDasharray="219.9" strokeDashoffset={219.9 * (1 - 0.07)} style={{strokeDashoffset: 219.9 * (1 - 0.07) + 219.9 * (1 - (0.437+0.338+0.155))}}/>
                                            </svg>
                                        </div>
                                        <div className="w-1/2 flex flex-col justify-center gap-1.5 pl-2 z-10 pb-2">
                                            {[{n:'Direct', v:62, p:'43.7%', c:'#D48D2A'}, {n:'Website', v:48, p:'33.8%', c:'#1E3B70'}, {n:'Public Marketplace', v:22, p:'15.5%', c:'#10B981'}, {n:'Social Media', v:10, p:'7.0%', c:'#8B5CF6'}, {n:'Others', v:0, p:'0%', c:'#9CA3AF'}].map((r,i) => (
                                                <div key={i} className="flex items-center justify-between text-[8px] font-bold">
                                                    <span className="flex items-center gap-1.5 text-gray-600 truncate mr-1" title={r.n}><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{backgroundColor:r.c}}></span><span className="truncate max-w-[60px]">{r.n}</span></span>
                                                    <span className="text-gray-900 text-right flex shrink-0 whitespace-nowrap"><span className="w-[14px]">{r.v}</span> <span className="text-gray-400 font-medium w-[24px] tracking-tight text-right">({r.p})</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Conversion Rate Bars */}
                                <div className="w-3/12 bg-white rounded-[1.25rem] p-4 flex flex-col border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-start mb-0">
                                        <div className="flex flex-col">
                                            <h4 className="text-[14px] font-bold text-gray-900 font-playfair tracking-wide leading-none">Conversion Rate</h4>
                                            <span className="text-[18px] font-bold text-gray-900 mt-1">5.8%</span>
                                            <span className="text-[8px] font-bold text-emerald-500 flex items-center mt-0.5"><FiTrendingUp className="mr-0.5"/> 2.3% <span className="text-gray-400/80 font-medium ml-1">vs last 30 days</span></span>
                                        </div>
                                        <div className="relative border border-gray-200 rounded px-1.5 py-0.5 select-none bg-gray-50 flex items-center justify-center">
                                            <select className="appearance-none text-[8px] font-bold text-gray-500 outline-none bg-transparent pr-3 cursor-pointer uppercase tracking-widest"><option>Week</option></select>
                                            <FiChevronDown className="absolute right-1 text-gray-400 text-[8px] pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between px-2 pt-2 pb-1 relative">
                                        {/* Bars */}
                                        <div className="absolute inset-y-0 left-0 flex flex-col justify-end gap-[13px] pointer-events-none text-[7px] text-gray-300 font-bold -mb-4 pb-2 z-10 w-3 pr-2 text-right h-[100px] mt-2">
                                            <span>9%</span><span>6%</span><span>3%</span><span>0%</span>
                                        </div>
                                        <div className="flex-1 flex justify-between items-end h-[60px] ml-4 pt-1">
                                            {[40, 20, 60, 35, 100, 30].map((h, i) => (
                                                <div key={i} className="flex flex-col items-center justify-end h-full mt-2 gap-1 group cursor-default relative w-full pt-4">
                                                    {i === 4 && <div className="absolute -top-1 px-1 py-0.5 bg-gray-900 text-white rounded-[2px] text-[7px] font-black tracking-widest translate-y-3 z-20 shadow-md">5.8%</div>}
                                                    <div className={`w-2.5 rounded-t-[2px] group-hover:bg-[#b5751c] transition-colors relative z-10 ${i === 4 ? 'bg-gray-900' : 'bg-[#D48D2A]'}`} style={{height: `${h}%`}}></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 flex justify-between ml-[18px] text-[7px] font-black text-gray-400 lowercase pointer-events-none pb-0">
                                            <span className="w-1/3 text-left">24 apr</span><span className="w-1/3 text-center">01 may</span><span className="w-1/3 text-center mr-1">08 may</span><span className="w-1/3 text-center -mr-1">15 may</span><span className="w-1/3 text-right">21 may</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Fourth Row */}
                            <div className="flex gap-4 shrink-0 h-[100px]">
                                <div className="w-[58%] bg-white rounded-[1.25rem] p-4 flex flex-col border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] justify-between">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-[14px] font-bold text-gray-900 font-playfair tracking-wide leading-none">Recent Activity</h4>
                                        <button className="text-[9px] font-bold text-[#D48D2A] bg-[#FFF8F0] px-2 py-1.5 rounded transition-colors uppercase tracking-widest flex items-center">View all activity</button>
                                    </div>
                                    <div className="space-y-[5px] flex-1">
                                        <div className="flex justify-between items-center text-[10px]">
                                            <div className="flex items-center gap-2 text-gray-600"><FiEye className="text-gray-400 shrink-0"/> <span className="font-medium">New view on <span className="font-bold text-gray-900">Ferrari SF90</span></span></div>
                                            <span className="text-gray-400 font-medium">2 minutes ago</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <div className="flex items-center gap-2 text-gray-600"><FiUser className="text-gray-400 shrink-0"/> <span className="font-medium">New lead from <span className="font-bold text-gray-900">Website</span></span></div>
                                            <span className="text-gray-400 font-medium">15 minutes ago</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <div className="flex items-center gap-2 text-gray-600"><FiHeart className="text-gray-400 shrink-0"/> <span className="font-medium">Asset <span className="font-bold text-gray-900">Sunseeker 88 Yacht</span> shortlisted</span></div>
                                            <span className="text-gray-400 font-medium">1 hour ago</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[42%] bg-white rounded-[1.25rem] p-4 flex flex-col border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] justify-between">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-[14px] font-bold text-gray-900 font-playfair tracking-wide leading-none">Assets Overview</h4>
                                        <button className="text-[9px] font-bold text-gray-700 border border-gray-200 shadow-sm bg-gray-50 px-2 py-1.5 rounded transition-colors uppercase tracking-widest flex items-center hover:bg-gray-100">Manage Assets</button>
                                    </div>
                                    <div className="flex justify-between items-start mt-2 px-1">
                                        <div className="flex flex-col text-center">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Assets</span>
                                            <span className="text-[22px] font-bold text-gray-900 leading-none">25</span>
                                            <span className="text-[8px] font-bold text-emerald-500 flex items-center gap-0.5 justify-center mt-1"><FiTrendingUp className="text-[8px]"/> 3 new</span>
                                        </div>
                                        <div className="w-[1px] h-8 bg-gray-100 mx-2"></div>
                                        <div className="flex flex-col text-center">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Live Assets</span>
                                            <span className="text-[20px] font-bold text-gray-900 leading-none">18</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mx-auto mt-1.5 shadow-sm shadow-emerald-500/20"></div>
                                        </div>
                                        <div className="w-[1px] h-8 bg-gray-100 mx-2"></div>
                                        <div className="flex flex-col text-center">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Drafts</span>
                                            <span className="text-[20px] font-bold text-gray-900 leading-none">4</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#D48D2A] mx-auto mt-1.5 shadow-sm shadow-[#D48D2A]/20"></div>
                                        </div>
                                        <div className="w-[1px] h-8 bg-gray-100 mx-2"></div>
                                        <div className="flex flex-col text-center pr-2">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Sold</span>
                                            <span className="text-[20px] font-bold text-gray-900 leading-none">3</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mx-auto mt-1.5 border border-gray-200"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
\n"""
    
    content = content[:start_idx] + new_dash + content[end_idx:]

    with open('/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx', 'w') as f:
        f.write(content)
        print("Success Dashboard")
else:
    print("Fail Dashboard")
