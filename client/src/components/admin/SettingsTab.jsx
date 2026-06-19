import React from 'react';

const SettingsTab = ({ handleSaveSettings, savingSettings }) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-4 sm:p-10 animate-in fade-in duration-500">
            <h3 className="text-xl font-bold text-gray-900 mb-8 canela">Admin Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Platform Name</label>
                        <input type="text" defaultValue="Otulia Luxury" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D48D2A]" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Support Email</label>
                        <input type="email" defaultValue="support@otulia.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D48D2A]" />
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Platform Fee (%)</label>
                        <input type="number" defaultValue="5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D48D2A]" />
                    </div>
                    <div className="pt-6">
                        <button
                            onClick={handleSaveSettings}
                            disabled={savingSettings}
                            className="px-6 py-3 bg-[#D48D2A] text-white rounded-xl font-bold text-sm hover:bg-[#B5751C] shadow-lg shadow-[#D48D2A]/20 transition-all w-full disabled:opacity-70 flex justify-center items-center gap-2"
                        >
                            {savingSettings ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
