import React, { useState, useEffect } from "react";

/**
 * RankingScaleWrapper
 * Dynamically scales the Ranking Page layout proportionally based on monitor resolution
 * relative to the 1920x1080 baseline design.
 * 
 * Supports resolutions:
 * 1366x768, 1600x900, 1920x1080, 1920x1200, 2560x1440, 2560x1600, 3840x2160, 4096x2160, etc.
 */
export default function RankingScaleWrapper({ children }) {
  const [scale, setScale] = useState(1);
  const [useZoom, setUseZoom] = useState(true);

  useEffect(() => {
    // Check if browser supports zoom CSS property natively
    const isZoomSupported = () => {
      if (typeof CSS !== "undefined" && CSS.supports) {
        return CSS.supports("zoom", "1");
      }
      return true;
    };
    setUseZoom(isZoomSupported());

    const calculateScale = () => {
      const width = window.innerWidth;
      // For desktop resolutions (1024px and above), scale proportionally relative to 1920px design baseline
      if (width >= 1024) {
        const s = width / 1920;
        setScale(s);
      } else {
        setScale(1);
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  if (scale === 1) {
    return <div className="ranking-scale-container w-full min-h-screen bg-zinc-950">{children}</div>;
  }

  if (useZoom) {
    return (
      <div
        className="ranking-scale-container w-full min-h-screen bg-zinc-950"
        style={{
          zoom: scale,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className="ranking-scale-container bg-zinc-950"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${(100 / scale).toFixed(4)}%`,
        minHeight: `${(100 / scale).toFixed(4)}vh`,
      }}
    >
      {children}
    </div>
  );
}
