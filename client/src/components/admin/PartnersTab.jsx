import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import numberWithCommas from '../../modules/numberwithcomma';

const PartnersTab = ({
    partners,
    statusFilter,
    setStatusFilter,
    viewDocs,
    handleVerification,
    actionLoading
}) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-4 sm:p-8 border-b border-gray-100 flex-col sm:flex-row flex justify-between items-start sm:items-end">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 canela">Partners Management</h3>
                    <p className="text-sm text-gray-400 font-medium">Manage and verify dealer accounts</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                    <div className="relative">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-100 rounded-lg py-2 pl-4 pr-10 text-xs font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:border-[#D48D2A] cursor-pointer w-full sm:min-w-[140px]"
                        >
                            <option value="All">All Status</option>
                            <option value="None">None</option>
                            <option value="Pending">Pending</option>
                            <option value="Verified">Verified</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-100">Export</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className='hidden md:table-header-group'>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Partner Name</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metrics</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {partners
                            .filter(p => statusFilter === 'All' || p.verificationStatus === statusFilter)
                            .map(partner => (
                            <tr key={partner.id} className="block md:table-row hover:bg-gray-50/50 transition-colors group">
                                <td className="block md:table-cell px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#F2E8DB] flex-shrink-0 items-center justify-center text-xs font-black text-[#D48D2A] border border-[#E5DAC8] hidden sm:flex">
                                            {partner.name ? partner.name.substring(0, 2).toUpperCase() : 'PT'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{partner.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">{partner.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="block md:table-cell px-6 py-5" data-label="Plan">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${partner.plan === 'Business VIP' ? 'bg-[#F2E8DB] text-[#D48D2A]' : 'bg-gray-50 text-gray-600'}`}>
                                        {partner.plan || 'Freemium'}
                                    </span>
                                </td>
                                <td className="block md:table-cell px-6 py-5" data-label="Status">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${partner.verificationStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                        partner.verificationStatus === 'Pending' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                        partner.verificationStatus === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                                            'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${partner.verificationStatus === 'Verified' ? 'bg-emerald-500' : partner.verificationStatus === 'Pending' ? 'bg-blue-500' : partner.verificationStatus === 'Rejected' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                                        {partner.verificationStatus || 'None'}
                                    </div>
                                </td>
                                <td className="block md:table-cell px-6 py-5" data-label="Metrics">
                                    <p className="text-sm font-bold text-gray-900">${numberWithCommas(partner.totalSales)}</p>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Lifetime Sales</p>
                                </td>
                                <td className="block md:table-cell px-6 py-5" data-label="Location">
                                    <span className="text-sm text-gray-500 font-medium">{partner.location}</span>
                                </td>
                                <td className="block md:table-cell px-8 py-5 text-right">
                                    <div className="flex flex-wrap justify-end gap-2">
                                        <button
                                            onClick={() => viewDocs(partner)}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-bold uppercase border border-blue-100"
                                        >
                                            View Docs
                                        </button>
                                        <button
                                            onClick={() => handleVerification(partner.id, 'approve')}
                                            disabled={actionLoading === partner.id}
                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold uppercase disabled:opacity-50 border border-emerald-100"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleVerification(partner.id, 'reject')}
                                            disabled={actionLoading === partner.id}
                                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all text-xs font-bold uppercase disabled:opacity-50 border border-red-100"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PartnersTab;
