import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import numberWithCommas from '../../modules/numberwithcomma';

const AnalyticsTab = ({ analyticsData }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Sessions Over Time */}
            <div className="bg-white p-4 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2 canela">Traffic Overview</h3>
                <p className="text-gray-400 text-sm mb-10">Daily sessions over the last 30 days (GA4)</p>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData?.userGrowth || []}>
                            <defs>
                                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}}
                            />
                            <Tooltip 
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#000" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorSessions)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Device Distribution */}
                <div className="bg-white p-4 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 canela">Devices</h3>
                    <p className="text-gray-400 text-sm mb-8">Sessions by device category</p>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData?.deviceDistribution || []}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(analyticsData?.deviceDistribution || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#000', '#D48D2A', '#9ca3af'][index % 3]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Countries */}
                <div className="bg-white p-4 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 canela">Top Countries</h3>
                    <p className="text-gray-400 text-sm mb-8">Most active regions</p>
                    <div className="space-y-4">
                        {analyticsData?.topCountries?.length > 0 ? (
                            analyticsData.topCountries.map((country, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold border border-gray-100">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">{country.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-[#D48D2A]">{numberWithCommas(country.value)} sessions</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest">
                                No country data available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
