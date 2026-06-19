import React from 'react';
import numberWithCommas from '../../modules/numberwithcomma';

const UsersTab = ({ usersList }) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-4 sm:p-8 border-b border-gray-100 flex-col sm:flex-row flex justify-between items-start sm:items-end">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 canela">User Management</h3>
                    <p className="text-sm text-gray-400 font-medium">View and manage all registered platform users</p>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                    <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-100">Export CSV</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className='hidden md:table-header-group'>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Profile</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Revenue</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {usersList.map(u => (
                            <tr key={u.id} className="block md:table-row hover:bg-gray-50/50 transition-colors">
                                <td className="block md:table-cell px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 items-center justify-center text-gray-500 font-bold text-xs hidden sm:flex">
                                            {u.name ? u.name[0] : 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{u.name}</p>
                                            <p className="text-xs text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="block md:table-cell px-6 py-5" data-label="Plan">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight ${u.plan === 'Business VIP' ? 'bg-[#F2E8DB] text-[#D48D2A]' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {u.plan}
                                    </span>
                                </td>
                                <td className="block md:table-cell px-6 py-5" data-label="Status">
                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{u.status}</span>
                                </td>

                                <td className="block md:table-cell px-6 py-5" data-label="Est. Revenue">
                                    <p className="text-sm font-bold text-gray-900">${numberWithCommas(u.revenue)}</p>
                                </td>
                                <td className="block md:table-cell px-6 py-5" data-label="Joined">
                                    <span className="text-xs text-gray-500">{new Date(u.joinDate).toLocaleDateString()}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTab;
