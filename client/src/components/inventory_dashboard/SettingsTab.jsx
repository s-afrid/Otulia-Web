import React from 'react';
import { 
    FiUpload, FiBriefcase, FiLink, FiMapPin, FiMail, FiPhone, FiCheck, 
    FiChevronDown, FiSettings, FiEdit2, FiShield, FiFilter, FiLock, FiCheckCircle, FiMonitor, 
    FiChevronRight, FiMessageSquare, FiCalendar 
} from 'react-icons/fi';

import facebookIcon from '../../assets/icons/social/facebook.svg';
import instagramIcon from '../../assets/icons/social/instagram.svg';
import linkedinIcon from '../../assets/icons/social/linkedin.svg';
import whatsappIcon from '../../assets/icons/social/whatsapp.svg';
import xIcon from '../../assets/icons/social/x.svg';
import youtubeIcon from '../../assets/icons/social/youtube.svg';

const SettingsTab = ({ 
    agentInfo, 
    setAgentInfo, 
    companyInfo, 
    setCompanyInfo, 
    user, 
    handleProfilePicUpload, 
    handleCompanyLogoUpload, 
    handleCompanyCoverUpload, 
    logoLoading, 
    isUploadingCover, 
    isSavingPersonal,
    isSavingCompany,
    handleSavePersonalDetails,
    handleSaveCompanyDetails,
    setIsVerificationModalOpen
}) => {
    const countryCodes = [
        { code: '+971', flag: '🇦🇪', name: 'UAE' },
        { code: '+91', flag: '🇮🇳', name: 'India' },
        { code: '+1', flag: '🇺🇸', name: 'USA' },
        { code: '+44', flag: '🇬🇧', name: 'UK' },
        { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
        { code: '+974', flag: '🇶🇦', name: 'Qatar' },
        { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
        { code: '+968', flag: '🇴🇲', name: 'Oman' },
        { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
        { code: '+20', flag: '🇪🇬', name: 'Egypt' },
        { code: '+33', flag: '🇫🇷', name: 'France' },
        { code: '+49', flag: '🇩🇪', name: 'Germany' },
        { code: '+39', flag: '🇮🇹', name: 'Italy' },
        { code: '+34', flag: '🇪🇸', name: 'Spain' },
        { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
        { code: '+7', flag: '🇷🇺', name: 'Russia' },
        { code: '+81', flag: '🇯🇵', name: 'Japan' },
        { code: '+86', flag: '🇨🇳', name: 'China' },
        { code: '+61', flag: '🇦🇺', name: 'Australia' },
        { code: '+65', flag: '🇸🇬', name: 'Singapore' },
        { code: '+27', flag: '🇿🇦', name: 'South Africa' },
        { code: '+55', flag: '🇧🇷', name: 'Brazil' },
        { code: '+90', flag: '🇹🇷', name: 'Turkey' },
    ];

    const getContactIcon = (method) => {
        if (method === 'WhatsApp') return <img src={whatsappIcon} alt="WhatsApp" className="w-3.5 h-3.5" />;
        if (method === 'Email') return <FiMail className="text-blue-500" />;
        if (method === 'Phone Call') return <FiPhone className="text-gray-500" />;
        return <FiMessageSquare className="text-emerald-500" />;
    };

    return (
        <div className="h-[calc(100vh-6rem-1rem)] flex flex-col gap-3 animate-in fade-in duration-700">
            {/* 2 Main Columns */}
            <div className="flex flex-1 gap-4 min-h-0">
                {/* Personal Details */}
                <div className="flex-1 bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[1.2rem] p-4 flex flex-col relative h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 shrink-0">
                        <div className="flex gap-3 items-center">
                            <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-[12px] shrink-0">1</div>
                            <div className="flex flex-col">
                                <h3 className="text-[13px] font-bold text-gray-900 leading-tight">Your Personal (Agent) Details</h3>
                                <p className="text-[9px] text-gray-400 font-medium leading-tight mt-0.5">This information will be visible to clients and used for communication.</p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-2 py-1 flex items-center gap-1 rounded-full text-[9px] font-bold shrink-0">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Verified
                        </div>
                    </div>

                    {/* Form Fields container */}
                    <div className="flex-1 overflow-auto custom-scrollbar pr-2 flex flex-col gap-3">
                        {/* Photo Row */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col gap-1.5 w-[30%]">
                                <label className="text-[9px] font-bold text-gray-700 capitalize tracking-wide">Profile Photo</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                        <img src={agentInfo.photo || user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(agentInfo.fullName || user?.name || "User")}&background=random`} className="w-full h-full object-cover" alt="Profile" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <label className="px-3 py-1.5 cursor-pointer bg-white border border-gray-200 rounded-lg text-[9px] font-bold text-gray-700 flex items-center gap-1 whitespace-nowrap hover:bg-gray-50 shadow-sm">
                                            <FiUpload/> Upload Photo
                                            <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicUpload} />
                                        </label>
                                        <span className="text-[8px] text-gray-400 mt-1 font-medium">JPG, PNG up to 5MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Full Name</label>
                                    <input type="text" value={agentInfo.fullName} onChange={e => setAgentInfo(p => ({...p, fullName: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Job Title / Role</label>
                                    <input type="text" value={agentInfo.jobTitle} onChange={e => setAgentInfo(p => ({...p, jobTitle: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Email Address</label>
                                <input type="email" value={agentInfo.email} onChange={e => setAgentInfo(p => ({...p, email: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Phone Number</label>
                                <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm focus-within:border-[#D48D2A]">
                                    <div className="flex items-center px-2 bg-gray-50 border-r border-gray-200 text-[10px] relative">
                                        <select value={agentInfo.phoneCode} onChange={e => setAgentInfo(p => ({...p, phoneCode: e.target.value}))} className="appearance-none bg-transparent outline-none pr-4 cursor-pointer font-bold">
                                            {countryCodes.map(c => (
                                                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="absolute right-1 text-[8px] text-gray-500 pointer-events-none"/>
                                    </div>
                                    <input type="text" value={agentInfo.phone} onChange={e => setAgentInfo(p => ({...p, phone: e.target.value}))} className="w-full bg-transparent px-3 py-1.5 text-[10px] font-medium focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">WhatsApp Number</label>
                                <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm focus-within:border-[#D48D2A]">
                                    <div className="flex items-center px-2 bg-gray-50 border-r border-gray-200 text-[10px] relative">
                                        <select value={agentInfo.whatsappCode} onChange={e => setAgentInfo(p => ({...p, whatsappCode: e.target.value}))} className="appearance-none bg-transparent outline-none pr-4 cursor-pointer font-bold">
                                            {countryCodes.map(c => (
                                                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="absolute right-1 text-[8px] text-gray-500 pointer-events-none"/>
                                    </div>
                                    <input type="text" value={agentInfo.whatsapp} onChange={e => setAgentInfo(p => ({...p, whatsapp: e.target.value}))} className="w-full bg-transparent px-3 py-1.5 text-[10px] font-medium focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Preferred Contact Method</label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-xs">{getContactIcon(agentInfo.contactMethod)}</div>
                                    <select value={agentInfo.contactMethod} onChange={e => setAgentInfo(p => ({...p, contactMethod: e.target.value}))} className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-8 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer">
                                        <option value="WhatsApp">WhatsApp</option>
                                        <option value="Email">Email</option>
                                        <option value="Phone Call">Phone Call</option>
                                    </select>
                                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Language</label>
                                <div className="relative w-full">
                                    <select value={agentInfo.language} onChange={e => setAgentInfo(p => ({...p, language: e.target.value}))} className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer">
                                        <option value="English">English</option>
                                        <option value="Arabic">Arabic</option>
                                        <option value="French">French</option>
                                        <option value="Spanish">Spanish</option>
                                    </select>
                                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Time Zone</label>
                                <div className="relative w-full">
                                    <select value={agentInfo.timezone} onChange={e => setAgentInfo(p => ({...p, timezone: e.target.value}))} className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer">
                                        <option value="(GMT+4) Dubai, UAE">(GMT+4) Dubai, UAE</option>
                                        <option value="(GMT+5:30) Mumbai, New Delhi">(GMT+5:30) Mumbai, New Delhi</option>
                                        <option value="(GMT+0) London, UK">(GMT+0) London, UK</option>
                                        <option value="(GMT-5) New York, USA">(GMT-5) New York, USA</option>
                                    </select>
                                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"/>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Agent Description</label>
                            <div className="relative">
                                <textarea value={agentInfo.bio} onChange={e => setAgentInfo(p => ({...p, bio: e.target.value}))} maxLength={1000} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm resize-none" rows="3" placeholder="I am a luxury asset consultant..."></textarea>
                                <span className="absolute bottom-1.5 right-2 text-[8px] text-gray-400 font-bold bg-white">{agentInfo.bio.length} / 1000</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Social Profiles <span className="text-gray-400 font-medium normal-case">(Optional)</span></label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[10px]"><img src={instagramIcon} alt="Instagram" className="w-3.5 h-3.5" /></div>
                                    <input type="text" value={agentInfo.social.instagram} onChange={e => setAgentInfo(p => ({...p, social: {...p.social, instagram: e.target.value}}))} placeholder="instagram.com/username" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[10px]"><img src={linkedinIcon} alt="LinkedIn" className="w-3.5 h-3.5" /></div>
                                    <input type="text" value={agentInfo.social.linkedin} onChange={e => setAgentInfo(p => ({...p, social: {...p.social, linkedin: e.target.value}}))} placeholder="linkedin.com/in/username" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[10px] font-serif font-black"><img src={xIcon} alt="X" className="w-3 h-3" /></div>
                                    <input type="text" value={agentInfo.social.x} onChange={e => setAgentInfo(p => ({...p, social: {...p.social, x: e.target.value}}))} placeholder="x.com/username" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[10px]"><img src={facebookIcon} alt="Facebook" className="w-3.5 h-3.5" /></div>
                                    <input type="text" value={agentInfo.social.facebook} onChange={e => setAgentInfo(p => ({...p, social: {...p.social, facebook: e.target.value}}))} placeholder="facebook.com/username" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 mt-auto shrink-0 border-t border-gray-50 flex">
                        <button onClick={handleSavePersonalDetails} disabled={isSavingPersonal} className="px-5 py-2 bg-gray-900 border border-transparent shadow-sm text-white rounded-[10px] text-[10px] font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                            {isSavingPersonal && <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            Save Personal Details
                        </button>
                    </div>
                </div>

                {/* Company Details */}
                <div className="flex-1 bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[1.2rem] p-4 flex flex-col relative h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 shrink-0">
                        <div className="flex gap-3 items-center">
                            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-[12px] shrink-0">2</div>
                            <div className="flex flex-col">
                                <h3 className="text-[13px] font-bold text-gray-900 leading-tight">Your Dealer / Company Details</h3>
                                <p className="text-[9px] text-gray-400 font-medium leading-tight mt-0.5">This information represents your business and will be visible to clients.</p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-2 py-1 flex items-center gap-1 rounded-full text-[9px] font-bold shrink-0">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Verified
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar pr-2 flex flex-col gap-3">
                        {/* Cover Image */}
                        <div className="relative h-20 bg-gray-50 rounded-xl overflow-hidden group shrink-0 shadow-sm border border-gray-100 mb-2">
                            {companyInfo.coverImage ? <img src={companyInfo.coverImage} className="w-full h-full object-cover" alt="Cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1"><FiBriefcase className="text-xl opacity-30"/> <span className="text-[8px] font-bold uppercase tracking-widest">No Cover Image</span></div>}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="text-white text-[10px] font-bold flex items-center gap-2"><FiUpload/> {isUploadingCover ? 'Uploading...' : 'Change Cover Photo'}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleCompanyCoverUpload} />
                            </label>
                        </div>

                        <div className="flex justify-between gap-4">
                            <div className="flex-1 flex flex-col gap-3">
                                <div>
                                    <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Company / Dealership Name</label>
                                    <input type="text" value={companyInfo.name} onChange={e => setCompanyInfo(p => ({...p, name: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Website</label>
                                    <input type="text" value={companyInfo.website} onChange={e => setCompanyInfo(p => ({...p, website: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 min-w-[140px]">
                                <label className="text-[9px] font-bold text-gray-700 capitalize tracking-wide">Company Logo</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden">
                                        {companyInfo.logo ? <img src={companyInfo.logo} className="w-full h-full object-contain" alt="Logo" /> : <FiBriefcase className="text-gray-300 text-lg"/>}
                                        {logoLoading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-3 h-3 border-2 border-[#D48D2A] border-t-transparent rounded-full animate-spin"></div></div>}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <label className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[9px] font-bold text-gray-700 flex items-center gap-1 whitespace-nowrap hover:bg-gray-50 shadow-sm cursor-pointer">
                                            <FiUpload/> Upload Logo
                                            <input type="file" className="hidden" accept="image/*" onChange={handleCompanyLogoUpload} />
                                        </label>
                                        <span className="text-[8px] text-gray-400 mt-1 font-medium">JPG, PNG up to 5MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Company Email</label>
                                <input type="email" value={companyInfo.email} onChange={e => setCompanyInfo(p => ({...p, email: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Business Type</label>
                                <div className="relative w-full">
                                    <select value={companyInfo.businessType} onChange={e => setCompanyInfo(p => ({...p, businessType: e.target.value}))} className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer">
                                        <option value="Luxury Cars & Supercars Dealer">Luxury Cars & Supercars Dealer</option>
                                        <option value="Real Estate Agency">Real Estate Agency</option>
                                        <option value="Yacht Brokerage">Yacht Brokerage</option>
                                        <option value="Multi-Asset Dealership">Multi-Asset Dealership</option>
                                    </select>
                                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Established Year</label>
                                <div className="relative w-full">
                                    <div className="absolute right-2.5 inset-y-0 flex items-center text-gray-400 pointer-events-none text-[10px]"><FiCalendar/></div>
                                    <input type="text" value={companyInfo.establishedYear} onChange={e => setCompanyInfo(p => ({...p, establishedYear: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Office Address</label>
                                <input type="text" value={companyInfo.address} onChange={e => setCompanyInfo(p => ({...p, address: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Phone Number</label>
                                <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm focus-within:border-[#D48D2A]">
                                    <div className="flex items-center px-2 bg-gray-50 border-r border-gray-200 text-[10px] relative">
                                        <select value={companyInfo.phoneCode} onChange={e => setCompanyInfo(p => ({...p, phoneCode: e.target.value}))} className="appearance-none bg-transparent outline-none pr-4 cursor-pointer font-bold">
                                            {countryCodes.map(c => (
                                                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="absolute right-1 text-[8px] text-gray-500 pointer-events-none"/>
                                    </div>
                                    <input type="text" value={companyInfo.phone} onChange={e => setCompanyInfo(p => ({...p, phone: e.target.value}))} className="w-full bg-transparent px-3 py-1.5 text-[10px] font-medium focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Dealer / Agent Description</label>
                            <div className="relative">
                                <textarea value={companyInfo.description} onChange={e => setCompanyInfo(p => ({...p, description: e.target.value}))} maxLength={1000} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm resize-none" rows="3"></textarea>
                                <span className="absolute bottom-1.5 right-2 text-[8px] text-gray-400 font-bold bg-white">{companyInfo.description.length} / 1000</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Company Social Media <span className="text-gray-400 font-medium normal-case">(Optional)</span></label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[10px]"><img src={instagramIcon} alt="Instagram" className="w-3.5 h-3.5" /></div>
                                    <input type="text" value={companyInfo.social.instagram} onChange={e => setCompanyInfo(p => ({...p, social: {...p.social, instagram: e.target.value}}))} placeholder="instagram.com/username" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[10px]"><img src={linkedinIcon} alt="LinkedIn" className="w-3.5 h-3.5" /></div>
                                    <input type="text" value={companyInfo.social.linkedin} onChange={e => setCompanyInfo(p => ({...p, social: {...p.social, linkedin: e.target.value}}))} placeholder="linkedin.com/company/username" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[10px]"><img src={facebookIcon} alt="Facebook" className="w-3.5 h-3.5" /></div>
                                    <input type="text" value={companyInfo.social.facebook} onChange={e => setCompanyInfo(p => ({...p, social: {...p.social, facebook: e.target.value}}))} placeholder="facebook.com/username" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[10px]"><img src={youtubeIcon} alt="YouTube" className="w-3.5 h-3.5" /></div>
                                    <input type="text" value={companyInfo.social.youtube} onChange={e => setCompanyInfo(p => ({...p, social: {...p.social, youtube: e.target.value}}))} placeholder="youtube.com/@username" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 mt-auto shrink-0 border-t border-gray-50 flex">
                        <button onClick={handleSaveCompanyDetails} disabled={isSavingCompany} className="px-5 py-2 bg-gray-900 border border-transparent shadow-sm text-white rounded-[10px] text-[10px] font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                            {isSavingCompany && <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            Save Company Details
                        </button>
                    </div>
                </div>
            </div>

            {/* 3 Bottom Cards */}
            <div className="grid grid-cols-3 gap-4 shrink-0 h-[85px]">
                {/* Card 1: Verification Status */}
                <div className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[1.2rem] flex flex-col justify-between overflow-hidden">
                    <div className="p-3 pb-1 flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100"><FiShield className="text-[10px]"/></div>
                        <div className="flex flex-col">
                            <h4 className="text-[11px] font-bold text-gray-900 leading-tight">Verification Status</h4>
                            <p className="text-[9px] text-gray-400 font-medium">Get verified to increase trust and lead priority.</p>
                        </div>
                    </div>
                    <div className="px-3 flex flex-col gap-0.5 bg-white flex-1 justify-center">
                        {['Identity Verification', 'Business Verification', 'Phone Verification'].map(v => (
                            <div key={v} className="flex justify-between items-center text-[9px]">
                                <span className="flex items-center gap-1.5 text-gray-600 font-medium"><FiCheckCircle className="text-gray-400 text-[9px]"/> {v}</span>
                                <span className="text-emerald-500 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Verified</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-50 py-1.5 border-t border-gray-100 text-center">
                        <button onClick={() => setIsVerificationModalOpen(true)} className="text-[9px] font-bold text-gray-600 hover:text-[#D48D2A] transition-colors w-full">View Verification Details</button>
                    </div>
                </div>

                {/* Card 2: Lead Preferences */}
                <div className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[1.2rem] flex flex-col justify-between overflow-hidden">
                    <div className="p-3 pb-1 flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100"><FiFilter className="text-[10px]"/></div>
                        <div className="flex flex-col">
                            <h4 className="text-[11px] font-bold text-gray-900 leading-tight">Lead Preferences</h4>
                            <p className="text-[9px] text-gray-400 font-medium">Control how and when you receive leads.</p>
                        </div>
                    </div>
                    <div className="px-3 flex gap-4 bg-white flex-1 pt-0.5 items-center">
                        <div className="flex-1 flex flex-col justify-center gap-1">
                            {['Lead Notifications', 'Email Notifications', 'WhatsApp Notifications'].map(n => (
                                <div key={n} className="flex justify-between items-center text-[9px] font-medium text-gray-600">
                                    <span>{n}</span>
                                    <div className="w-6 h-3 bg-orange-400 rounded-full flex items-center p-0.5"><div className="w-2.5 h-2.5 bg-white rounded-full ml-auto shadow-sm"></div></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-1">
                            <div>
                                <span className="text-[8px] text-gray-400 font-bold mb-0.5 block">Preferred Lead Types</span>
                                <div className="border border-gray-200 rounded flex justify-between items-center px-1.5 py-0.5">
                                    <span className="text-[9px] text-gray-600 font-medium">All Categories</span><FiChevronDown className="text-gray-400 text-[8px]"/>
                                </div>
                            </div>
                            <div>
                                <span className="text-[8px] text-gray-400 font-bold mb-0.5 block">Preferred Locations</span>
                                <div className="border border-gray-200 rounded flex justify-between items-center px-1.5 py-0.5">
                                    <span className="text-[9px] text-gray-600 font-medium">All Locations</span><FiChevronDown className="text-gray-400 text-[8px]"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 py-1.5 border-t border-gray-100 text-center">
                        <button className="text-[9px] font-bold text-gray-600 hover:text-[#D48D2A] transition-colors w-full">Manage Lead Preferences</button>
                    </div>
                </div>

                {/* Card 3: Account & Security */}
                <div className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[1.2rem] flex flex-col justify-between overflow-hidden">
                    <div className="p-3 pb-1 flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100"><FiLock className="text-[10px]"/></div>
                        <div className="flex flex-col">
                            <h4 className="text-[11px] font-bold text-gray-900 leading-tight">Account & Security</h4>
                            <p className="text-[9px] text-gray-400 font-medium">Manage your account security and access.</p>
                        </div>
                    </div>
                    <div className="px-3 flex flex-col gap-1 bg-white flex-1 justify-center relative">
                        <div className="flex justify-between items-center text-[9px] font-medium text-gray-600">
                            <span className="flex items-center gap-1.5 text-gray-700 font-bold cursor-pointer hover:text-[#D48D2A]"><FiShield className="text-[10px] text-gray-400"/> Change Password</span>
                            <FiChevronRight className="text-gray-400"/>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-medium text-gray-600">
                            <span className="flex items-center gap-1.5 text-gray-700"><FiCheckCircle className="text-[10px] text-gray-400"/> Two-Factor Authentication</span>
                            <span className="text-emerald-500 font-bold">Enabled</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-medium text-gray-600">
                            <span className="flex items-center gap-1.5 text-gray-700"><FiMonitor className="text-[10px] text-gray-400"/> Active Sessions</span>
                            <span className="bg-gray-100 text-gray-600 px-1.5 rounded font-bold border border-gray-200">2</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 py-1.5 border-t border-gray-100 text-center">
                        <button className="text-[9px] font-bold text-gray-600 hover:text-[#D48D2A] transition-colors w-full">Manage Security</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
