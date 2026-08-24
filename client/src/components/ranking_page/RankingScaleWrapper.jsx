import React, { useState, useEffect } from "react";

/**
 * RankingScaleWrapper
 * Dynamically scales the entire Ranking module proportionally based on monitor resolution
 * relative to the 1920x1080 baseline design.
 * 
 * Supports:
 * - 4K/2K displays (3840px, 2560px)
 * - Standard desktop (1920px)
 * - Laptops (1600px, 1536px, 1440px, 1366px, 1280px)
 * - Tablets (1024px, 834px, 820px, 768px)
 * - Mobile screens (< 768px)
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
      // Scale proportionally relative to 1920px design baseline
      if (width > 0) {
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

  // Ensure body background is #09090b while on ranking pages so no white gaps appear on any viewport/zoom
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#09090b";
    return () => {
      document.body.style.backgroundColor = prevBg;
    };
  }, []);

  if (scale === 1) {
    return (
      <div 
        className="ranking-scale-container w-full min-h-screen bg-zinc-950 text-white flex flex-col"
        style={{ minHeight: "100vh", backgroundColor: "#09090b" }}
      >
        {children}
      </div>
    );
  }

  if (useZoom) {
    return (
      <div
        className="ranking-scale-container bg-zinc-950 text-white flex flex-col"
        style={{
          zoom: scale,
          width: "100%",
          minHeight: `calc(100vh / ${scale})`,
          backgroundColor: "#09090b",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#09090b",
        overflowX: "hidden",
      }}
    >
      <div
        className="ranking-scale-container bg-zinc-950 text-white flex flex-col"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${(100 / scale).toFixed(4)}%`,
          minHeight: `${(100 / scale).toFixed(4)}vh`,
          backgroundColor: "#09090b",
        }}
      >
        {children}
      </div>
    </div>
  );
}
