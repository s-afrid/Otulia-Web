import React from "react";

/**
 * RankingScaleWrapper
 * Responsive container wrapper for the Rankings module ensuring natural fluid scaling
 * across all monitor resolutions from mobile (320px) to 4K (3840px).
 */
export default function RankingScaleWrapper({ children }) {
  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-[#D6A125]/30 selection:text-white">
      {children}
    </div>
  );
}

