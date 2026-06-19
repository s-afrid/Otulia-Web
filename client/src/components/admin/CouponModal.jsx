import React from 'react';
import { FiXCircle } from 'react-icons/fi';

const CouponModal = ({
    isCouponModalOpen,
    setIsCouponModalOpen,
    editingCoupon,
    couponFormData,
    setCouponFormData,
    handleCouponAction
}) => {
    if (!isCouponModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCouponModalOpen(false)}></div>
            <form onSubmit={handleCouponAction} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 canela">{editingCoupon ? 'Edit' : 'Create'} Coupon</h3>
                        <p className="text-sm text-gray-400">Configure your discount code</p>
                    </div>
                    <button type="button" onClick={() => setIsCouponModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                        <FiXCircle className="text-xl text-gray-400" />
                    </button>
                </div>
                <div className="p-8 space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Coupon Code</label>
                        <input
                            type="text"
                            required
                            value={couponFormData.code}
                            onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })}
                            placeholder="E.G. SUMMER50"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-black"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Type</label>
                            <select
                                value={couponFormData.discountType}
                                onChange={(e) => setCouponFormData({ ...couponFormData, discountType: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-black"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Value</label>
                            <input
                                type="number"
                                required
                                value={couponFormData.discountValue}
                                onChange={(e) => setCouponFormData({ ...couponFormData, discountValue: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-black"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Expiry Date</label>
                        <input
                            type="date"
                            required
                            value={couponFormData.expiresAt}
                            onChange={(e) => setCouponFormData({ ...couponFormData, expiresAt: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-black"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Global Usage Limit</label>
                            <input
                                type="number"
                                value={couponFormData.usageLimit}
                                onChange={(e) => setCouponFormData({ ...couponFormData, usageLimit: e.target.value })}
                                placeholder="∞"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Usage Per User</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={couponFormData.usageLimitPerUser}
                                onChange={(e) => setCouponFormData({ ...couponFormData, usageLimitPerUser: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-black"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={couponFormData.isActive}
                            onChange={(e) => setCouponFormData({ ...couponFormData, isActive: e.target.checked })}
                            className="w-4 h-4 accent-black"
                        />
                        <label htmlFor="isActive" className="text-sm font-bold text-gray-700">Coupon is Active</label>
                    </div>
                </div>
                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                    <button type="button" onClick={() => setIsCouponModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-800 shadow-lg">
                        {editingCoupon ? 'Update' : 'Create'} Coupon
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CouponModal;
