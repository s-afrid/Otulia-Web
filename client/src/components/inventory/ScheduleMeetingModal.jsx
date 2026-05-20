import React, { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiSend } from 'react-icons/fi';

const ScheduleMeetingModal = ({ isOpen, onClose, lead, agentName, token }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('10:00 AM');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !lead) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !time) {
            alert("Please select both date and time.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/leads/schedule-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    leadId: lead.id,
                    date,
                    time,
                    leadName: lead.name,
                    leadEmail: lead.email,
                    assetTitle: lead.assetName,
                    assetImage: lead.assetImage,
                    listingReference: lead.listingReference,
                    agentName: agentName
                })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Meeting request sent successfully!');
                onClose();
            } else {
                alert(result.error === 'VALID_EMAIL_REQUIRED' ? 'Lead email is hidden. Please upgrade your plan to contact this lead.' : 'Failed to send meeting request.');
            }
        } catch (error) {
            console.error('Schedule meeting error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300 shadow-2xl">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                    <FiX className="text-xl text-gray-500" />
                </button>

                <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-2xl font-bold canela text-gray-900">Schedule Meeting</h2>
                    <p className="text-gray-500 text-xs font-medium">Propose a meeting date to <strong>{lead.name}</strong></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Proposed Date</label>
                        <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                required 
                                type="date" 
                                value={date} 
                                onChange={e => setDate(e.target.value)} 
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-xs outline-none focus:border-[#D48D2A] transition-all font-medium" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Proposed Time</label>
                        <div className="relative">
                            <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select 
                                required
                                value={time} 
                                onChange={e => setTime(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-xs outline-none focus:border-[#D48D2A] transition-all font-medium appearance-none"
                            >
                                {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                            A predefined email will be sent to the lead's address asking if they are available to meet regarding <strong>{lead.assetName}</strong> on the selected schedule.
                        </p>
                    </div>

                    <button 
                        disabled={submitting} 
                        type="submit" 
                        className="w-full py-3.5 bg-[#D48D2A] hover:bg-[#b5751c] text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50 text-xs shadow-lg shadow-amber-200/50"
                    >
                        {submitting ? 'Sending Request...' : <><FiSend className="text-sm"/> Send Meeting Request</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleMeetingModal;
