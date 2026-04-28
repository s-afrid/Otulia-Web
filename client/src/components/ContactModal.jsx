import React, { useState } from 'react';
import { FiX, FiSend } from 'react-icons/fi';

const ContactModal = ({ isOpen, onClose, type = 'Sales', token }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        estimatedListings: '1-5'
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    ...formData,
                    inquiryType: type
                })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                    setFormData({
                        name: '', email: '', phone: '', company: '', message: '', estimatedListings: '1-5'
                    });
                }, 2000);
            } else {
                alert('Failed to submit inquiry. Please try again.');
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
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                    <FiX className="text-xl text-gray-500" />
                </button>

                {success ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                        <h3 className="text-2xl font-bold playfair-display mb-2">Message Sent</h3>
                        <p className="text-gray-500">Our {type} team will get back to you shortly.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold playfair-display mb-2">Contact {type}</h2>
                        <p className="text-gray-500 text-sm mb-6">Fill out the form below and we'll be in touch.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D48D2A] transition-all" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D48D2A] transition-all" placeholder="john@company.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone</label>
                                    <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D48D2A] transition-all" placeholder="+1 234 567 890" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Company</label>
                                    <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D48D2A] transition-all" placeholder="Dealership LLC" />
                                </div>
                            </div>

                            {type === 'Sales' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Estimated Listings</label>
                                    <select value={formData.estimatedListings} onChange={e => setFormData({ ...formData, estimatedListings: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D48D2A] transition-all">
                                        <option>1-5</option>
                                        <option>6-25</option>
                                        <option>26-50</option>
                                        <option>50+</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message</label>
                                <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D48D2A] transition-all resize-none" placeholder="How can we help?"></textarea>
                            </div>

                            <button disabled={submitting} type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-black transition-colors disabled:bg-gray-400">
                                {submitting ? 'Sending...' : <><FiSend /> Send Message</>}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ContactModal;
