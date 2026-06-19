import React from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const CouponsTab = ({
    coupons,
    setEditingCoupon,
    setCouponFormData,
    setIsCouponModalOpen,
    deleteCoupon
}) => {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 canela">Coupon Management</h3>
                    <p className="text-sm text-gray-400 font-medium">Create and manage promotional discount codes</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCoupon(null);
                        setCouponFormData({
                            code: '',
                            discountType: 'percentage',
                            discountValue: '',
                            expiresAt: '',
                            usageLimit: '',
                            usageLimitPerUser: 1,
                            isActive: true
                        });
                        setIsCouponModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg"
                >
                    <FiPlus /> Create Coupon
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Code</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discount</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiry</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Usage</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {coupons.map(coupon => (
                                <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-black tracking-widest uppercase">
                                            {coupon.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-gray-900">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{coupon.discountType}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-gray-900">{new Date(coupon.expiresAt).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                            {new Date(coupon.expiresAt) > new Date() ? 'Valid' : 'Expired'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-gray-900">{coupon.usageCount} / {coupon.usageLimit || '∞'}</p>
                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                            <div 
                                                className="h-full bg-black rounded-full" 
                                                style={{ width: `${coupon.usageLimit ? (coupon.usageCount / coupon.usageLimit) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${coupon.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingCoupon(coupon);
                                                    setCouponFormData({
                                                        code: coupon.code,
                                                        discountType: coupon.discountType,
                                                        discountValue: coupon.discountValue,
                                                        expiresAt: new Date(coupon.expiresAt).toISOString().split('T')[0],
                                                        usageLimit: coupon.usageLimit || '',
                                                        usageLimitPerUser: coupon.usageLimitPerUser || 1,
                                                        isActive: coupon.isActive
                                                    });
                                                    setIsCouponModalOpen(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-black transition-colors"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button 
                                                onClick={() => deleteCoupon(coupon._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CouponsTab;
