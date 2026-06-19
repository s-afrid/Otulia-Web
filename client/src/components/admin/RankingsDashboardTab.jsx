import React from 'react';
import { FiAward, FiUsers, FiTrendingUp, FiPlus, FiUserPlus, FiDownload, FiActivity, FiClock, FiChevronRight } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RankingsKPICard = ({ title, value, growth, icon: Icon, gradientId }) => (
    <div className="bg-[#111726]/60 border border-[#1C253B] p-6 rounded-[2rem] relative overflow-hidden group hover:border-[#2C3B5E] transition-all duration-300 backdrop-blur-md">
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-5 bg-gradient-to-br from-[#6366F1] to-[#D48D2A] blur-xl group-hover:scale-150 transition-transform duration-500"></div>
        
        <div className="flex justify-between items-start mb-6 z-10 relative">
            <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">{title}</p>
                <h3 className="text-2xl sm:text-3xl font-normal text-white canela tracking-wide">{value}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#151D30]/80 border border-[#2B395B] text-[#D48D2A] group-hover:text-white group-hover:border-[#6366F1] transition-all duration-300">
                <Icon className="text-lg" />
            </div>
        </div>
        
        <div className="flex items-center gap-2.5 z-10 relative">
            {growth && (
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {growth}
                </span>
            )}
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active state</span>
        </div>
    </div>
);

const RankingsDashboardTab = ({ onTabChange, onCreateCategoryClick }) => {
    // 30 days voting engagement mock data
    const analyticsData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
            name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            votes: Math.floor(Math.random() * 25000) + 15000 + (i * 800), // upward trend
        };
    });

    const recentActivities = [
        { id: 1, action: "Admin added Bugatti Tourbillon to Hypercars", time: "10 mins ago", category: "Cars", type: "add" },
        { id: 2, action: "10K votes milestone reached in Real Estate", time: "2 hours ago", category: "Real Estate", type: "milestone" },
        { id: 3, action: "Category 'Best Superyachts' published", time: "5 hours ago", category: "Yachts", type: "publish" },
        { id: 4, action: "Voter 'user_f82' cast vote in Yacht Rankings", time: "1 day ago", category: "Yachts", type: "vote" },
        { id: 5, action: "Admin updated voting periods for Cars", time: "2 days ago", category: "Cars", type: "update" },
    ];

    const topCategories = [
        {
            id: 1,
            title: "Best Hypercars of 2026",
            votes: "12.4K",
            status: "Active",
            statusType: "active",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=150&auto=format&fit=crop&q=60"
        },
        {
            id: 2,
            title: "Best Luxury SUVs of 2026",
            votes: "8.7K",
            status: "Active",
            statusType: "active",
            image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150&auto=format&fit=crop&q=60"
        },
        {
            id: 3,
            title: "Most Beautiful Villas 2026",
            votes: "6.3K",
            status: "Active",
            statusType: "active",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=150&auto=format&fit=crop&q=60"
        },
        {
            id: 4,
            title: "Best Superyachts of 2026",
            votes: "4.8K",
            status: "Ending Soon",
            statusType: "warning",
            image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=150&auto=format&fit=crop&q=60"
        }
    ];

    const handleExport = () => {
        alert("Preparing rankings and votes data export...\nCSV format generated successfully.");
    };

    const handleAddNominee = () => {
        alert("To add a nominee, select a category from the 'Categories' tab and click 'Edit' to manage its Nominees list.");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <RankingsKPICard
                    title="Total Active Categories"
                    value="12"
                    growth={null}
                    icon={FiAward}
                />
                <RankingsKPICard
                    title="Total Nominees"
                    value="245"
                    growth={null}
                    icon={FiUsers}
                />
                <RankingsKPICard
                    title="Total Votes Cast"
                    value="1.2M"
                    growth="+15%"
                    icon={FiTrendingUp}
                />
                <RankingsKPICard
                    title="Live Active Voters"
                    value="3,400"
                    growth="Real-time"
                    icon={FiActivity}
                />
            </div>

            {/* Voting Engagement Graph Area */}
            <div className="bg-[#111726]/60 border border-[#1C253B] p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden backdrop-blur-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h3 className="text-lg font-normal text-white canela tracking-wide">Voting Engagement Over Time</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Spanning the last 30 days platform-wide</p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]"></span>Purple (Start)</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D48D2A]"></span>Gold (End)</span>
                    </div>
                </div>

                <div className="h-72 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData}>
                            <defs>
                                <linearGradient id="chartStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#6366F1" />
                                    <stop offset="100%" stopColor="#D48D2A" />
                                </linearGradient>
                                <linearGradient id="chartFillGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#D48D2A" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1C253B" opacity={0.6} />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }}
                                tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#0F172A', 
                                    borderColor: '#1E293B', 
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontFamily: 'Montserrat, sans-serif'
                                }}
                                labelStyle={{ color: '#94A3B8', fontSize: '10px', fontWeight: 'bold' }}
                                itemStyle={{ color: '#fff', fontSize: '12px' }}
                                formatter={(value) => [`${value.toLocaleString()} votes`, 'Engagement']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="votes" 
                                stroke="url(#chartStrokeGradient)" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#chartFillGradient)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-[#111726]/60 border border-[#1C253B] p-6 rounded-[2.5rem] backdrop-blur-md">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Quick Operations</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                        onClick={onCreateCategoryClick}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:brightness-110 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-indigo-900/30 group"
                    >
                        <FiPlus className="text-sm group-hover:scale-125 transition-transform duration-300" /> Create New Category
                    </button>
                    <button 
                        onClick={handleAddNominee}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-[#151D30]/80 border border-[#2B395B] hover:border-[#6366F1] text-gray-200 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300"
                    >
                        <FiUserPlus className="text-sm text-[#D48D2A]" /> Add Nominee
                    </button>
                    <button 
                        onClick={handleExport}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-[#151D30]/80 border border-[#2B395B] hover:border-[#6366F1] text-gray-200 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300"
                    >
                        <FiDownload className="text-sm text-[#6366F1]" /> Export Voting Data
                    </button>
                </div>
            </div>

            {/* Split Sections: Top Performers & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performing Categories */}
                <div className="bg-[#111726]/60 border border-[#1C253B] p-6 sm:p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-normal text-white canela tracking-wide">Top Performing Categories</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">High volume active voting lists</p>
                        </div>
                        <button 
                            onClick={() => onTabChange('categories')}
                            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#D48D2A] hover:text-[#f5a623] transition-colors"
                        >
                            View All <FiChevronRight />
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        {topCategories.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between p-3.5 bg-[#151D30]/40 border border-[#1C253B]/50 rounded-2xl hover:border-[#2C3B5E] transition-all duration-300 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#2B395B]/40">
                                        <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-xs font-bold text-white tracking-wide">{cat.title}</h4>
                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">{cat.votes} votes accumulated</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                    cat.statusType === 'active' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                    {cat.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity / Audit Log */}
                <div className="bg-[#111726]/60 border border-[#1C253B] p-6 sm:p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-normal text-white canela tracking-wide">Recent Activity & Audit Log</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Real-time system ranking adjustments</p>
                        </div>
                        <FiClock className="text-gray-400 text-sm" />
                    </div>

                    <div className="flex-grow space-y-4">
                        {recentActivities.map((act) => (
                            <div key={act.id} className="flex items-start gap-4 p-3 bg-[#151D30]/20 rounded-2xl hover:bg-[#151D30]/40 transition-all duration-300">
                                <div className="w-8 h-8 rounded-xl bg-[#1C253B] border border-[#2B395B]/60 flex items-center justify-center text-[#D48D2A] shrink-0 mt-0.5">
                                    <FiActivity className="text-xs" />
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-[11px] text-gray-200 font-medium leading-normal tracking-wide break-words">{act.action}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[8px] font-black uppercase tracking-wider bg-[#1E293B] text-gray-400 px-2 py-0.5 rounded-md border border-[#2C3B5E]/50">
                                            {act.category}
                                        </span>
                                        <span className="text-[9px] text-gray-500 font-semibold">{act.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RankingsDashboardTab;
