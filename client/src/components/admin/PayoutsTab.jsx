import React from 'react';
import numberWithCommas from '../../modules/numberwithcomma';

const PayoutsTab = ({ payouts }) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-4 sm:p-8 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-1 canela">Payout Management</h3>
                <p className="text-sm text-gray-400 font-medium">Manage partner withdrawals and payments</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className='hidden md:table-header-group'>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Partner</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {payouts.map(payout => (
                            <tr key={payout.id} className="block md:table-row hover:bg-gray-50/50 transition-colors">
                                <td className="block md:table-cell px-8 py-5 font-bold text-gray-900" data-label="Partner">{payout.partner}</td>
                                <td className="block md:table-cell px-6 py-5 font-medium text-gray-600" data-label="Amount">${numberWithCommas(payout.amount)}</td>
                                <td className="block md:table-cell px-6 py-5 text-sm text-gray-500" data-label="Date">{new Date(payout.date).toLocaleDateString()}</td>
                                <td className="block md:table-cell px-6 py-5" data-label="Status">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${payout.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                        payout.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                        {payout.status}
                                    </span>
                                </td>
                                <td className="block md:table-cell px-8 py-5 text-right" data-label="Actions">
                                    {payout.status === 'Pending' && (
                                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">
                                            Process
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayoutsTab;
