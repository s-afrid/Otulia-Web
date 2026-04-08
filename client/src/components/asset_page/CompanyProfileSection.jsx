import React, { useState } from 'react';
import { FiMapPin, FiGlobe, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CompanyProfileSection = ({ agent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!agent || (!agent.company && !agent.companyDescription)) return null;

  const description = agent.companyDescription || agent.description || "";
  const isLongDescription = description.length > 300;
  const displayDescription = isExpanded ? description : description.slice(0, 300) + (isLongDescription ? "..." : "");

  return (
    <div className="w-[92%] md:w-[90%] mx-auto py-10 border-t border-gray-100 mt-10">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left: Logo */}
        <div className="w-full lg:w-1/4 flex justify-center lg:justify-start">
          {agent.companyLogo ? (
            <img 
              src={agent.companyLogo} 
              alt={agent.company} 
              className="max-h-24 md:max-h-32 w-auto object-contain"
            />
          ) : (
            <div className="h-24 md:h-32 aspect-square bg-gray-50 flex items-center justify-center rounded-xl border border-gray-100">
              <span className="text-gray-300 font-bold text-xl">{agent.company?.[0]}</span>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-black montserrat mb-2">{agent.company || "Agency Profile"}</h3>
            
            {agent.address && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <FiMapPin className="text-gray-400" />
                <span>{agent.address}</span>
              </div>
            )}

            {agent.website && (
              <a 
                href={agent.website.startsWith('http') ? agent.website : `https://${agent.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:underline"
              >
                <FiGlobe />
                <span>View agency profile</span>
              </a>
            )}
          </div>

          <div className="relative">
            <p className="text-gray-600 leading-relaxed text-sm md:text-base montserrat whitespace-pre-wrap">
              {displayDescription}
            </p>
            {isLongDescription && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-3 flex items-center gap-1 text-black font-bold text-sm uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                {isExpanded ? (
                  <>View less <FiChevronUp /></>
                ) : (
                  <>View more <FiChevronDown /></>
                )}
              </button>
            )}
          </div>

          {/* Metadata Grid (Simplified version of Image 4) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-50">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Company</p>
              <p className="text-sm font-medium text-gray-900">{agent.company || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Agent</p>
              <p className="text-sm font-medium text-gray-900">{agent.name || "N/A"}</p>
            </div>
            {agent.plan && (
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-medium text-emerald-600">Verified Partner</p>
              </div>
            )}
             <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Joined</p>
              <p className="text-sm font-medium text-gray-900">{agent.createdAt ? new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Recently"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileSection;
