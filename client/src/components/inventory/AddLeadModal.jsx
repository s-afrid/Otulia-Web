import React, { useState, useEffect } from 'react';
import { FiX, FiSend } from 'react-icons/fi';

const AddLeadModal = ({ isOpen, onClose, onCreated, token, inventory }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        source: 'Website',
        assetId: '',
        message: '',
        status: 'New'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '', email: '', phone: '', source: 'Website', assetId: '', message: '', status: 'New'
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const selectedAsset = inventory.find(a => a._id === formData.assetId || a.id === formData.assetId);

            const payload = {
                ...formData,
                assetModel: selectedAsset?.type || 'EstateAsset',
                assetTitle: selectedAsset ? (selectedAsset.propertyName || selectedAsset.yachtName || selectedAsset.name || selectedAsset.title || `${selectedAsset.make || ''} ${selectedAsset.model || ''}`.trim() || 'Unnamed Asset') : 'Unknown Asset',
                assetPrice: selectedAsset?.price || 0,
                assetImage: selectedAsset?.images?.[0] || ''
            };

            const response = await fetch('/api/leads/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                onCreated();
                onClose();
            } else {
                alert('Failed to add manual lead. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-300 shadow-2xl">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                    <FiX className="text-xl text-gray-500" />
                </button>

                <h2 className="text-2xl font-bold font-playfair mb-2 text-gray-900">Add Lead manually</h2>
                <p className="text-gray-500 text-xs mb-6 font-medium">Input lead details manually to your leads record.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Full Name</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#D48D2A] transition-all font-medium" placeholder="E.g. James Carter" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#D48D2A] transition-all font-medium" placeholder="james@example.com" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Phone Number</label>
                            <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#D48D2A] transition-all font-medium" placeholder="+1 (555) 123-4567" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Source</label>
                            <select value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#D48D2A] transition-all font-medium shadow-none appearance-none">
                                <option value="Website">Website</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Email">Email</option>
                                <option value="Referral">Referral</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Manual">Manual</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Asset Interested</label>
                        <select required value={formData.assetId} onChange={e => setFormData({ ...formData, assetId: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#D48D2A] transition-all font-medium shadow-none appearance-none">
                            <option value="" disabled>Select an Asset...</option>
                            {inventory.map(asset => {
                                const assetName = asset.propertyName || asset.yachtName || asset.name || asset.title || `${asset.make || ''} ${asset.model || ''}`.trim() || 'Unnamed Asset';
                                return (
                                    <option key={asset._id || asset.id} value={asset._id || asset.id}>{assetName}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Status</label>
                        <div className="flex gap-2">
                            {['New', 'Contacted', 'Qualified', 'Proposal Sent'].map((s) => (
                                <button type="button" key={s} onClick={() => setFormData({ ...formData, status: s })} className={`flex-1 py-2 text-[10px] font-bold rounded-lg border focus:outline-none transition-colors ${formData.status === s ? 'bg-[#FFF8F0] border-[#D48D2A] text-[#D48D2A]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'}`}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Message / Inquiry</label>
                        <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#D48D2A] transition-all font-medium resize-none" placeholder="Provide any details about this lead..."></textarea>
                    </div>

                    <button disabled={submitting} type="submit" className="w-full mt-2 py-3.5 bg-[#D48D2A] hover:bg-[#b5751c] text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50 text-xs">
                        {submitting ? 'Saving...' : <><FiSend className="text-sm"/> Save Lead</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddLeadModal;
