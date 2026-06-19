import React, { useState } from 'react';
import { FiSearch, FiChevronDown, FiPlus, FiEye, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import numberWithCommas from '../../modules/numberwithcomma';

const RankingCategoryTable = ({ categories, onEdit, onDelete, onAddNew }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // Filter Categories
    const filteredCategories = categories.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || c.type === typeFilter;
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'Cars': return 'bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/30';
            case 'Real Estate': return 'bg-[#D48D2A]/10 text-[#F59E0B] border border-[#D48D2A]/30';
            case 'Yachts': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30';
            case 'Bikes': return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
            default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/30';
        }
    };

    return (
        <div className="bg-[#101622] rounded-[2.5rem] border border-[#1B243B] p-6 space-y-6 text-left">
            {/* Header filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-base font-bold text-white canela">Existing Ranking Categories</h3>
                    <p className="text-xs text-gray-500 font-medium">Manage and organize all ranking categories</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Search categories */}
                    <div className="relative flex-1 sm:flex-initial">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#151D30] border border-[#222E4A] rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all placeholder:text-gray-600 w-full sm:w-48"
                        />
                    </div>

                    {/* Filter Type */}
                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="appearance-none bg-[#151D30] border border-[#222E4A] rounded-xl pl-4 pr-9 py-2 text-xs font-bold text-gray-400 cursor-pointer focus:outline-none focus:border-[#6366F1]"
                        >
                            <option value="All">All Types</option>
                            <option value="Cars">Cars</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Yachts">Yachts</option>
                            <option value="Bikes">Bikes</option>
                            <option value="Content Creator">Content Creator</option>
                            <option value="Other">Other</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs" />
                    </div>

                    {/* Filter Status */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-[#151D30] border border-[#222E4A] rounded-xl pl-4 pr-9 py-2 text-xs font-bold text-gray-400 cursor-pointer focus:outline-none focus:border-[#6366F1]"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs" />
                    </div>

                    {/* Add new Category */}
                    <button
                        onClick={onAddNew}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-bold hover:bg-[#4F46E5] transition-all shadow-lg shadow-[#6366F1]/20 uppercase"
                    >
                        <FiPlus /> Add New Category
                    </button>
                </div>
            </div>

            {/* Category Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#1C253B]">
                            <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-wider">Nominees</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-wider">Votes</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-wider">Period</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1B243B]/30">
                        {filteredCategories.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center py-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    No categories matched
                                </td>
                            </tr>
                        ) : (
                            filteredCategories.map((c, index) => (
                                <tr key={c.id} className="hover:bg-[#151D30]/20 transition-colors">
                                    <td className="px-6 py-4 text-xs text-gray-500 font-bold">{index + 1}</td>
                                    
                                    {/* Cover image & Title */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-7 rounded-lg bg-gray-900 border border-[#222E4A] overflow-hidden shrink-0">
                                                <img src={c.categoryImage} alt="Cover" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-xs font-bold text-white leading-normal truncate max-w-xs">{c.title}</span>
                                        </div>
                                    </td>
                                    
                                    {/* Type badge */}
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${getTypeColor(c.type)}`}>
                                            {c.type}
                                        </span>
                                    </td>

                                    {/* Nominees */}
                                    <td className="px-6 py-4 text-xs font-bold text-white">{c.nomineeLimit || 10}</td>

                                    {/* Votes */}
                                    <td className="px-6 py-4 text-xs font-bold text-white">
                                        {c.votes ? c.votes : '12.4K'}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                            c.status === 'Active' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                            {c.status}
                                        </span>
                                    </td>

                                    {/* Date Period */}
                                    <td className="px-6 py-4 text-[10px] text-gray-400 font-semibold font-mono">
                                        {c.votingPeriodStart ? `${new Date(c.votingPeriodStart).toLocaleDateString()} - ${new Date(c.votingPeriodEnd).toLocaleDateString()}` : '01/01/2026 - 30/06/2026'}
                                    </td>

                                    {/* Display Order */}
                                    <td className="px-6 py-4 text-xs font-bold text-white">{c.displayOrder}</td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-1.5 hover:bg-[#1C253B] text-gray-400 hover:text-white rounded-lg transition-colors">
                                                <FiEye className="text-xs" />
                                            </button>
                                            <button 
                                                onClick={() => onEdit(c)}
                                                className="p-1.5 hover:bg-[#1C253B] text-gray-400 hover:text-[#6366F1] rounded-lg transition-colors"
                                            >
                                                <FiEdit2 className="text-xs" />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(c.id)}
                                                className="p-1.5 hover:bg-[#1C253B] text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 className="text-xs" />
                                            </button>
                                            <button className="p-1.5 hover:bg-[#1C253B] text-gray-500 rounded-lg transition-colors">
                                                <FiMoreVertical className="text-xs" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankingCategoryTable;
