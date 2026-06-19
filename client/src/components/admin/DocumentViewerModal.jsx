import React from 'react';
import { FiXCircle, FiBriefcase, FiArrowUpRight, FiFileText } from 'react-icons/fi';

const DocumentViewerModal = ({
    selectedPartnerDocs,
    closeDocsModal,
    handleVerification
}) => {
    if (!selectedPartnerDocs) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDocsModal}></div>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 canela">{selectedPartnerDocs.name}'s Documents</h3>
                        <p className="text-sm text-gray-400">Review submitted verification files</p>
                    </div>
                    <button onClick={closeDocsModal} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                        <FiXCircle className="text-xl text-gray-400" />
                    </button>
                </div>
                <div className="p-8 max-h-[60vh] overflow-y-auto space-y-8">
                    {/* Company Profile Section (Show if data exists) */}
                    {selectedPartnerDocs.company && (selectedPartnerDocs.company.companyName || selectedPartnerDocs.company.website) && (
                        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <FiBriefcase className="text-sm" /> Company Profile Details
                                </h4>
                                {(selectedPartnerDocs.plan === 'Premium Basic' || selectedPartnerDocs.plan === 'Business VIP') && (
                                    <span className="px-2 py-0.5 bg-[#F2E8DB] text-[#D48D2A] text-[9px] font-bold uppercase rounded-md border border-[#E5DAC8]">
                                        {selectedPartnerDocs.plan}
                                    </span>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Logo */}
                                <div className="md:col-span-3 flex flex-col items-center gap-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Logo</p>
                                    <div className="w-24 h-24 rounded-xl bg-white border border-gray-100 p-1 shadow-sm overflow-hidden flex items-center justify-center">
                                        {selectedPartnerDocs.company?.companyLogo ? (
                                            <img src={selectedPartnerDocs.company.companyLogo} className="w-full h-full object-contain" alt="Company Logo" />
                                        ) : (
                                            <div className="text-2xl text-gray-200">🏢</div>
                                        )}
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Company Name</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedPartnerDocs.company?.companyName || 'Not Provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Website</p>
                                        {selectedPartnerDocs.company?.website ? (
                                            <a href={selectedPartnerDocs.company.website.startsWith('http') ? selectedPartnerDocs.company.website : `https://${selectedPartnerDocs.company.website}`} 
                                               target="_blank" rel="noopener noreferrer"
                                               className="text-sm font-bold text-[#D48D2A] hover:underline flex items-center gap-1">
                                                {selectedPartnerDocs.company.website} <FiArrowUpRight />
                                            </a>
                                        ) : (
                                            <p className="text-sm font-bold text-gray-900">Not Provided</p>
                                        )}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Office Address</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedPartnerDocs.company?.address || 'Not Provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FiFileText className="text-sm" /> Verification Documents
                        </h4>
                        {!selectedPartnerDocs.verificationDocuments || Object.keys(selectedPartnerDocs.verificationDocuments).length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <p>No documents found for this user.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {Object.entries(selectedPartnerDocs.verificationDocuments).map(([type, url]) => (
                                    <div key={type} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#D48D2A] hover:bg-[#FDF8F0] transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl group-hover:bg-white group-hover:text-[#D48D2A]">
                                                📄
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                <p className="text-xs text-gray-400">Document</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const docName = type.replace(/([A-Z])/g, ' $1').trim();
                                                const targetUrl = `/admin/view-document?url=${encodeURIComponent(url)}&name=${encodeURIComponent(docName)}`;
                                                window.open(targetUrl, '_blank', 'noopener,noreferrer');
                                            }}
                                            className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                                        >
                                            View File
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <button onClick={closeDocsModal} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50">
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            handleVerification(selectedPartnerDocs.id, 'reject');
                            closeDocsModal();
                        }}
                        className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 font-bold text-sm rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                        Reject Partner
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            handleVerification(selectedPartnerDocs.id, 'approve');
                            closeDocsModal();
                        }}
                        className="px-6 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                    >
                        Approve Partner
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewerModal;
