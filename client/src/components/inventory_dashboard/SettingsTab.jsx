import React from "react";
import {
  FiUpload,
  FiBriefcase,
  FiLink,
  FiMapPin,
  FiMail,
  FiPhone,
  FiCheck,
  FiChevronDown,
  FiSettings,
  FiEdit2,
  FiShield,
  FiFilter,
  FiLock,
  FiCheckCircle,
  FiMonitor,
  FiChevronRight,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";

import facebookIcon from "../../assets/icons/social/facebook.svg";
import instagramIcon from "../../assets/icons/social/instagram.svg";
import linkedinIcon from "../../assets/icons/social/linkedin.svg";
import whatsappIcon from "../../assets/icons/social/whatsapp.svg";
import xIcon from "../../assets/icons/social/x.svg";
import youtubeIcon from "../../assets/icons/social/youtube.svg";

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
  setIsVerificationModalOpen,
}) => {
  const countryCodes = [
    { code: "+971", iso: "ae", name: "UAE" },
    { code: "+91", iso: "in", name: "India" },
    { code: "+1", iso: "us", name: "USA" },
    { code: "+44", iso: "gb", name: "UK" },
    { code: "+966", iso: "sa", name: "Saudi Arabia" },
    { code: "+974", iso: "qa", name: "Qatar" },
    { code: "+965", iso: "kw", name: "Kuwait" },
    { code: "+968", iso: "om", name: "Oman" },
    { code: "+973", iso: "bh", name: "Bahrain" },
    { code: "+20", iso: "eg", name: "Egypt" },
    { code: "+33", iso: "fr", name: "France" },
    { code: "+49", iso: "de", name: "Germany" },
    { code: "+39", iso: "it", name: "Italy" },
    { code: "+34", iso: "es", name: "Spain" },
    { code: "+41", iso: "ch", name: "Switzerland" },
    { code: "+7", iso: "ru", name: "Russia" },
    { code: "+81", iso: "jp", name: "Japan" },
    { code: "+86", iso: "cn", name: "China" },
    { code: "+61", iso: "au", name: "Australia" },
    { code: "+65", iso: "sg", name: "Singapore" },
    { code: "+27", iso: "za", name: "South Africa" },
    { code: "+55", iso: "br", name: "Brazil" },
    { code: "+90", iso: "tr", name: "Turkey" },
  ];

  const getContactIcon = (method) => {
    if (method === "WhatsApp")
      return <img src={whatsappIcon} alt="WhatsApp" className="w-3.5 h-3.5" />;
    if (method === "Email") return <FiMail className="text-blue-500" />;
    if (method === "Phone Call") return <FiPhone className="text-gray-500" />;
    return <FiMessageSquare className="text-emerald-500" />;
  };

  return (
    <div className="min-h-full flex flex-col gap-8 animate-in fade-in duration-700 pb-12">
      {/* 1 Column Layout - Stacked for Full Width Scalability */}
      <div className="flex flex-col gap-8">
        {/* Personal Details */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-[1.5rem] p-5 md:p-8 flex flex-col relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 shrink-0">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-[16px] shrink-0 border border-purple-100">
                1
              </div>
              <div className="flex flex-col">
                <h3 className="text-[17px] md:text-[20px] font-bold text-gray-900 leading-tight">
                  Your Personal (Agent) Details
                </h3>
                <p className="text-[12px] md:text-[14px] text-gray-400 font-medium leading-tight mt-1.5">
                  This information will be visible to clients and used for
                  communication.
                </p>
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 flex items-center gap-2 rounded-full text-[11px] md:text-[13px] font-bold shrink-0 border border-emerald-100">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>{" "}
              Verified
            </div>
          </div>

          {/* Form Fields container */}
          <div className="flex-1 overflow-visible flex flex-col gap-8">
            {/* Photo & Basic Info Row */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 pb-2">
              <div className="flex flex-col gap-3">
                <label className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                  Profile Photo
                </label>
                <div className="flex items-center gap-5">
                  <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden shrink-0 border-4 border-white shadow-lg">
                    <img
                      src={
                        agentInfo.photo ||
                        user?.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(agentInfo.fullName || user?.name || "User")}&background=random`
                      }
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="px-6 py-3 cursor-pointer bg-white border border-gray-200 rounded-2xl text-[12px] font-bold text-gray-700 flex items-center gap-2 whitespace-nowrap hover:bg-gray-50 hover:border-[#D48D2A] transition-all shadow-sm">
                      <FiUpload className="text-[#D48D2A] text-lg" /> Upload Photo
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                      />
                    </label>
                    <span className="text-[10px] text-gray-400 mt-2 font-medium ml-1">
                      JPG, PNG up to 5MB
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex-1">
                  <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={agentInfo.fullName}
                    onChange={(e) =>
                      setAgentInfo((p) => ({ ...p, fullName: e.target.value }))
                    }
                    placeholder="Enter your full name"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium focus:border-[#D48D2A] focus:ring-4 focus:ring-[#D48D2A]/5 outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={agentInfo.jobTitle}
                    onChange={(e) =>
                      setAgentInfo((p) => ({ ...p, jobTitle: e.target.value }))
                    }
                    placeholder="e.g. Luxury Real Estate Advisor"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium focus:border-[#D48D2A] focus:ring-4 focus:ring-[#D48D2A]/5 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    value={agentInfo.email}
                    onChange={(e) =>
                      setAgentInfo((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[14px] font-medium focus:border-[#D48D2A] outline-none transition-all shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Phone Number
                </label>
                <div className="flex border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm focus-within:border-[#D48D2A] focus-within:ring-4 focus-within:ring-[#D48D2A]/5 transition-all">
                  <div className="flex items-center px-4 py-3.5 bg-gray-50 border-r border-gray-200 text-[14px] shrink-0 relative">
                    <div className="pointer-events-none flex items-center gap-2 font-bold text-gray-700">
                      <img
                        src={`https://flagcdn.com/w20/${countryCodes.find(c => c.code === agentInfo.phoneCode)?.iso || "ae"}.png`}
                        srcSet={`https://flagcdn.com/w40/${countryCodes.find(c => c.code === agentInfo.phoneCode)?.iso || "ae"}.png 2x`}
                        alt="flag"
                        className="w-5 h-auto rounded-sm shadow-sm"
                      />
                      <span>{agentInfo.phoneCode}</span>
                    </div>
                    <FiChevronDown className="ml-3 text-[12px] text-gray-500 pointer-events-none" />
                    <select
                      value={agentInfo.phoneCode}
                      onChange={(e) =>
                        setAgentInfo((p) => ({
                          ...p,
                          phoneCode: e.target.value,
                        }))
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={agentInfo.phone}
                    onChange={(e) =>
                      setAgentInfo((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full bg-transparent px-4 py-3.5 text-[14px] font-medium focus:outline-none min-w-0"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  WhatsApp Number
                </label>
                <div className="flex border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm focus-within:border-[#D48D2A] focus-within:ring-4 focus-within:ring-[#D48D2A]/5 transition-all">
                  <div className="flex items-center px-4 py-3.5 bg-gray-50 border-r border-gray-200 text-[14px] shrink-0 relative">
                    <div className="pointer-events-none flex items-center gap-2 font-bold text-gray-700">
                      <img
                        src={`https://flagcdn.com/w20/${countryCodes.find(c => c.code === agentInfo.whatsappCode)?.iso || "ae"}.png`}
                        srcSet={`https://flagcdn.com/w40/${countryCodes.find(c => c.code === agentInfo.whatsappCode)?.iso || "ae"}.png 2x`}
                        alt="flag"
                        className="w-5 h-auto rounded-sm shadow-sm"
                      />
                      <span>{agentInfo.whatsappCode}</span>
                    </div>
                    <FiChevronDown className="ml-3 text-[12px] text-gray-500 pointer-events-none" />
                    <select
                      value={agentInfo.whatsappCode}
                      onChange={(e) =>
                        setAgentInfo((p) => ({
                          ...p,
                          whatsappCode: e.target.value,
                        }))
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={agentInfo.whatsapp}
                    onChange={(e) =>
                      setAgentInfo((p) => ({ ...p, whatsapp: e.target.value }))
                    }
                    className="w-full bg-transparent px-4 py-3.5 text-[14px] font-medium focus:outline-none min-w-0"
                    placeholder="Enter WhatsApp number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Preferred Contact Method
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    {getContactIcon(agentInfo.contactMethod)}
                  </div>
                  <select
                    value={agentInfo.contactMethod}
                    onChange={(e) =>
                      setAgentInfo((p) => ({
                        ...p,
                        contactMethod: e.target.value,
                      }))
                    }
                    className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer transition-all"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Language
                </label>
                <div className="relative w-full">
                  <select
                    value={agentInfo.language}
                    onChange={(e) =>
                      setAgentInfo((p) => ({ ...p, language: e.target.value }))
                    }
                    className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer transition-all"
                  >
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Time Zone
                </label>
                <div className="relative w-full">
                  <select
                    value={agentInfo.timezone}
                    onChange={(e) =>
                      setAgentInfo((p) => ({ ...p, timezone: e.target.value }))
                    }
                    className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer transition-all"
                  >
                    <option value="(GMT+4) Dubai, UAE">
                      (GMT+4) Dubai, UAE
                    </option>
                    <option value="(GMT+5:30) Mumbai, New Delhi">
                      (GMT+5:30) Mumbai, New Delhi
                    </option>
                    <option value="(GMT+0) London, UK">
                      (GMT+0) London, UK
                    </option>
                    <option value="(GMT-5) New York, USA">
                      (GMT-5) New York, USA
                    </option>
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                Agent Description
              </label>
              <div className="relative">
                <textarea
                  value={agentInfo.bio}
                  onChange={(e) =>
                    setAgentInfo((p) => ({ ...p, bio: e.target.value }))
                  }
                  maxLength={1000}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm resize-none transition-all"
                  rows="5"
                  placeholder="Tell clients about your expertise in luxury assets..."
                ></textarea>
                <span className="absolute bottom-4 right-6 text-[11px] text-gray-400 font-bold bg-white px-2">
                  {agentInfo.bio.length} / 1000
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-4">
                Social Profiles{" "}
                <span className="text-gray-400 font-medium normal-case ml-1">
                  (Connect with more clients)
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <img
                      src={instagramIcon}
                      alt="Instagram"
                      className="w-5 h-5 opacity-70"
                    />
                  </div>
                  <input
                    type="text"
                    value={agentInfo.social.instagram}
                    onChange={(e) =>
                      setAgentInfo((p) => ({
                        ...p,
                        social: { ...p.social, instagram: e.target.value },
                      }))
                    }
                    placeholder="instagram.com/username"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[13px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <img
                      src={linkedinIcon}
                      alt="LinkedIn"
                      className="w-5 h-5 opacity-70"
                    />
                  </div>
                  <input
                    type="text"
                    value={agentInfo.social.linkedin}
                    onChange={(e) =>
                      setAgentInfo((p) => ({
                        ...p,
                        social: { ...p.social, linkedin: e.target.value },
                      }))
                    }
                    placeholder="linkedin.com/in/username"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[13px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <img
                      src={xIcon}
                      alt="X"
                      className="w-4.5 h-4.5 opacity-70"
                    />
                  </div>
                  <input
                    type="text"
                    value={agentInfo.social.x}
                    onChange={(e) =>
                      setAgentInfo((p) => ({
                        ...p,
                        social: { ...p.social, x: e.target.value },
                      }))
                    }
                    placeholder="x.com/username"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[13px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <img
                      src={facebookIcon}
                      alt="Facebook"
                      className="w-5 h-5 opacity-70"
                    />
                  </div>
                  <input
                    type="text"
                    value={agentInfo.social.facebook}
                    onChange={(e) =>
                      setAgentInfo((p) => ({
                        ...p,
                        social: { ...p.social, facebook: e.target.value },
                      }))
                    }
                    placeholder="facebook.com/username"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[13px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 mt-10 shrink-0 border-t border-gray-50 flex">
            <button
              onClick={handleSavePersonalDetails}
              disabled={isSavingPersonal}
              className="px-10 py-4 bg-gray-900 border border-transparent shadow-xl text-white rounded-2xl text-[14px] font-bold hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
            >
              {isSavingPersonal && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Save Personal Details
            </button>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-[1.5rem] p-5 md:p-8 flex flex-col relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 shrink-0">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-[16px] shrink-0 border border-blue-100">
                2
              </div>
              <div className="flex flex-col">
                <h3 className="text-[17px] md:text-[20px] font-bold text-gray-900 leading-tight">
                  Your Dealer / Company Details
                </h3>
                <p className="text-[12px] md:text-[14px] text-gray-400 font-medium leading-tight mt-1.5">
                  This information represents your business and will be visible
                  to clients.
                </p>
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 flex items-center gap-2 rounded-full text-[10px] md:text-[13px] font-bold shrink-0 border border-emerald-100">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>{" "}
              Verified
            </div>
          </div>

          <div className="flex-1 overflow-visible flex flex-col gap-8">
            {/* Cover Image */}
            <div className="relative h-48 sm:h-64 bg-gray-50 rounded-[2rem] overflow-hidden group shrink-0 shadow-sm border border-gray-100 mb-2">
              {companyInfo.coverImage ? (
                <img
                  src={companyInfo.coverImage}
                  className="w-full h-full object-cover"
                  alt="Cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                  <FiBriefcase className="text-5xl opacity-20" />{" "}
                  <span className="text-[12px] font-bold uppercase tracking-[0.3em]">
                    No Cover Image
                  </span>
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
                <span className="text-white text-[14px] font-bold flex items-center gap-3 px-8 py-4 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all">
                  <FiUpload className="text-xl" />{" "}
                  {isUploadingCover ? "Uploading..." : "Change Cover Photo"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCompanyCoverUpload}
                />
              </label>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-10">
              <div className="flex-1 flex flex-col gap-6">
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                    Company / Dealership Name
                  </label>
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={(e) =>
                      setCompanyInfo((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Enter company name"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                    Website
                  </label>
                  <div className="relative">
                    <FiLink className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      value={companyInfo.website}
                      onChange={(e) =>
                        setCompanyInfo((p) => ({
                          ...p,
                          website: e.target.value,
                        }))
                      }
                      placeholder="https://yourwebsite.com"
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[240px]">
                <label className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                  Company Logo
                </label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-[1.5rem] bg-gray-50 flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden relative">
                    {companyInfo.logo ? (
                      <img
                        src={companyInfo.logo}
                        className="w-full h-full object-contain p-3"
                        alt="Logo"
                      />
                    ) : (
                      <FiBriefcase className="text-gray-300 text-4xl" />
                    )}
                    {logoLoading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="w-6 h-6 border-3 border-[#D48D2A] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="px-5 py-3 bg-white border border-gray-200 rounded-2xl text-[12px] font-bold text-gray-700 flex items-center gap-2 whitespace-nowrap hover:bg-gray-50 hover:border-[#D48D2A] transition-all shadow-sm cursor-pointer">
                      <FiUpload className="text-[#D48D2A] text-lg" /> Upload Logo
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleCompanyLogoUpload}
                      />
                    </label>
                    <span className="text-[10px] text-gray-400 mt-2 font-medium ml-1">
                      JPG, PNG up to 5MB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Company Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) =>
                      setCompanyInfo((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Business Type
                </label>
                <div className="relative w-full">
                  <select
                    value={companyInfo.businessType}
                    onChange={(e) =>
                      setCompanyInfo((p) => ({
                        ...p,
                        businessType: e.target.value,
                      }))
                    }
                    className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer transition-all"
                  >
                    <option value="Luxury Cars & Supercars Dealer">
                      Luxury Cars & Supercars Dealer
                    </option>
                    <option value="Real Estate Agency">
                      Real Estate Agency
                    </option>
                    <option value="Yacht Brokerage">Yacht Brokerage</option>
                    <option value="Multi-Asset Dealership">
                      Multi-Asset Dealership
                    </option>
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Established Year
                </label>
                <div className="relative w-full">
                  <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={companyInfo.establishedYear}
                    onChange={(e) =>
                      setCompanyInfo((p) => ({
                        ...p,
                        establishedYear: e.target.value,
                      }))
                    }
                    placeholder="e.g. 2010"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Office Address
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={companyInfo.address}
                    onChange={(e) =>
                      setCompanyInfo((p) => ({ ...p, address: e.target.value }))
                    }
                    placeholder="City, Country"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Phone Number
                </label>
                <div className="flex border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm focus-within:border-[#D48D2A] focus-within:ring-4 focus-within:ring-[#D48D2A]/5 transition-all">
                  <div className="flex items-center px-4 py-3.5 bg-gray-50 border-r border-gray-200 text-[14px] shrink-0 relative">
                    <div className="pointer-events-none flex items-center gap-2 font-bold text-gray-700">
                      <img
                        src={`https://flagcdn.com/w20/${countryCodes.find(c => c.code === companyInfo.phoneCode)?.iso || "ae"}.png`}
                        srcSet={`https://flagcdn.com/w40/${countryCodes.find(c => c.code === companyInfo.phoneCode)?.iso || "ae"}.png 2x`}
                        alt="flag"
                        className="w-5 h-auto rounded-sm shadow-sm"
                      />
                      <span>{companyInfo.phoneCode}</span>
                    </div>
                    <FiChevronDown className="ml-3 text-[12px] text-gray-500 pointer-events-none" />
                    <select
                      value={companyInfo.phoneCode}
                      onChange={(e) =>
                        setCompanyInfo((p) => ({
                          ...p,
                          phoneCode: e.target.value,
                        }))
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={companyInfo.phone}
                    onChange={(e) =>
                      setCompanyInfo((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full bg-transparent px-4 py-3.5 text-[14px] font-medium focus:outline-none min-w-0"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                Dealer / Agent Description
              </label>
              <div className="relative">
                <textarea
                  value={companyInfo.description}
                  onChange={(e) =>
                    setCompanyInfo((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  maxLength={1000}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-[14px] font-medium focus:border-[#D48D2A] outline-none shadow-sm resize-none transition-all"
                  rows="5"
                  placeholder="Describe your dealership and the luxury assets you specialize in..."
                ></textarea>
                <span className="absolute bottom-4 right-6 text-[11px] text-gray-400 font-bold bg-white px-2">
                  {companyInfo.description.length} / 1000
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-4">
                Company Social Media{" "}
                <span className="text-gray-400 font-medium normal-case ml-1">
                  (Showcase your presence)
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <img
                      src={instagramIcon}
                      alt="Instagram"
                      className="w-5 h-5 opacity-70"
                    />
                  </div>
                  <input
                    type="text"
                    value={companyInfo.social.instagram}
                    onChange={(e) =>
                      setCompanyInfo((p) => ({
                        ...p,
                        social: { ...p.social, instagram: e.target.value },
                      }))
                    }
                    placeholder="instagram.com/username"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[13px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <img
                      src={linkedinIcon}
                      alt="LinkedIn"
                      className="w-5 h-5 opacity-70"
                    />
                  </div>
                  <input
                    type="text"
                    value={companyInfo.social.linkedin}
                    onChange={(e) =>
                      setCompanyInfo((p) => ({
                        ...p,
                        social: { ...p.social, linkedin: e.target.value },
                      }))
                    }
                    placeholder="linkedin.com/company/username"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[13px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <img
                      src={facebookIcon}
                      alt="Facebook"
                      className="w-5 h-5 opacity-70"
                    />
                  </div>
                  <input
                    type="text"
                    value={companyInfo.social.facebook}
                    onChange={(e) =>
                      setCompanyInfo((p) => ({
                        ...p,
                        social: { ...p.social, facebook: e.target.value },
                      }))
                    }
                    placeholder="facebook.com/username"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[13px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <img
                      src={youtubeIcon}
                      alt="YouTube"
                      className="w-5 h-5 opacity-70"
                    />
                  </div>
                  <input
                    type="text"
                    value={companyInfo.social.youtube}
                    onChange={(e) =>
                      setCompanyInfo((p) => ({
                        ...p,
                        social: { ...p.social, youtube: e.target.value },
                      }))
                    }
                    placeholder="youtube.com/@username"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-[13px] font-medium focus:border-[#D48D2A] outline-none shadow-sm transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 mt-10 shrink-0 border-t border-gray-50 flex">
            <button
              onClick={handleSaveCompanyDetails}
              disabled={isSavingCompany}
              className="px-10 py-4 bg-gray-900 border border-transparent shadow-xl text-white rounded-2xl text-[14px] font-bold hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
            >
              {isSavingCompany && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Save Company Details
            </button>
          </div>
        </div>
      </div>

      {/* 3 Bottom Cards - Grid Adjusted for Ultra-Wide */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 shrink-0 min-h-[160px]">
        {/* Card 1: Verification Status */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-[1.5rem] flex flex-col justify-between overflow-hidden group hover:shadow-md transition-all">
          <div className="p-4 pb-2 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
              <FiShield className="text-[18px]" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[13px] font-bold text-gray-900 leading-tight">
                Verification Status
              </h4>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                Increase trust and lead priority.
              </p>
            </div>
          </div>
          <div className="px-5 flex flex-col gap-1.5 bg-white flex-1 justify-center py-2">
            {[
              "Identity Verification",
              "Business Verification",
              "Phone Verification",
            ].map((v) => (
              <div
                key={v}
                className="flex justify-between items-center text-[11px]"
              >
                <span className="flex items-center gap-2 text-gray-600 font-medium">
                  <FiCheckCircle className="text-emerald-500 text-[12px]" /> {v}
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full text-[9px]">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>{" "}
                  Verified
                </span>
              </div>
            ))}
          </div>
          <div className="bg-gray-50/50 py-2.5 border-t border-gray-100 text-center">
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="text-[11px] font-bold text-gray-600 hover:text-[#D48D2A] transition-colors w-full flex items-center justify-center gap-2"
            >
              View Verification Details <FiChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>

        {/* Card 2: Lead Preferences */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-[1.5rem] flex flex-col justify-between overflow-hidden group hover:shadow-md transition-all">
          <div className="p-4 pb-2 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100 group-hover:bg-purple-100 transition-colors">
              <FiFilter className="text-[18px]" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[13px] font-bold text-gray-900 leading-tight">
                Lead Preferences
              </h4>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                Manage how you receive inquiries.
              </p>
            </div>
          </div>
          <div className="px-5 flex flex-col xl:flex-row gap-4 bg-white flex-1 py-2 items-center">
            <div className="flex-1 w-full flex flex-col justify-center gap-2">
              {[
                { label: "Lead Alerts", active: true },
                { label: "WhatsApp Alerts", active: true },
              ].map((n) => (
                <div
                  key={n.label}
                  className="flex justify-between items-center text-[11px] font-medium text-gray-600"
                >
                  <span>{n.label}</span>
                  <div className="w-8 h-4 bg-orange-400 rounded-full flex items-center p-0.5 cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full ml-auto shadow-sm"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 w-full flex flex-col justify-center gap-2">
              <div>
                <span className="text-[10px] text-gray-400 font-bold mb-1 block uppercase tracking-wide">
                  Lead Categories
                </span>
                <div className="border border-gray-200 rounded-lg flex justify-between items-center px-2 py-1 hover:border-[#D48D2A] transition-all cursor-pointer">
                  <span className="text-[11px] text-gray-600 font-medium">
                    All Active
                  </span>
                  <FiChevronDown className="text-gray-400 text-[10px]" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50/50 py-2.5 border-t border-gray-100 text-center">
            <button className="text-[11px] font-bold text-gray-600 hover:text-[#D48D2A] transition-colors w-full flex items-center justify-center gap-2">
              Manage Lead Preferences <FiChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>

        {/* Card 3: Account & Security */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-[1.5rem] flex flex-col justify-between overflow-hidden group hover:shadow-md transition-all md:col-span-2 2xl:col-span-1">
          <div className="p-4 pb-2 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-100 transition-colors">
              <FiLock className="text-[18px]" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[13px] font-bold text-gray-900 leading-tight">
                Account & Security
              </h4>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                Manage security and access.
              </p>
            </div>
          </div>
          <div className="px-5 flex flex-col gap-2 bg-white flex-1 justify-center py-2 relative">
            <div className="flex justify-between items-center text-[11px] font-medium text-gray-600">
              <span className="flex items-center gap-2 text-gray-700 font-bold cursor-pointer hover:text-[#D48D2A] transition-all">
                <FiShield className="text-[14px] text-blue-400" /> Change
                Password
              </span>
              <FiChevronRight className="text-gray-400" />
            </div>
            <div className="flex justify-between items-center text-[11px] font-medium text-gray-600">
              <span className="flex items-center gap-2 text-gray-700">
                <FiCheckCircle className="text-[14px] text-emerald-400" />{" "}
                Two-Factor Auth
              </span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[9px]">Enabled</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-medium text-gray-600">
              <span className="flex items-center gap-2 text-gray-700">
                <FiMonitor className="text-[14px] text-purple-400" /> Active
                Sessions
              </span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold border border-gray-200 text-[9px]">
                2
              </span>
            </div>
          </div>
          <div className="bg-gray-50/50 py-2.5 border-t border-gray-100 text-center">
            <button className="text-[11px] font-bold text-gray-600 hover:text-[#D48D2A] transition-colors w-full flex items-center justify-center gap-2">
              Manage Security <FiChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
