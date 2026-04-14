import React, { useState, useEffect } from 'react';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { HiOutlineSquares2X2 } from "react-icons/hi2";

const AssetGallery = ({ images = [], videoUrl, assetType = 'Asset' }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const hasVideo = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  
  // Combine all media into a single array for easier navigation, prioritizing video
  const allMedia = [];
  if (hasVideo) {
    allMedia.push({ type: 'video', url: videoUrl });
  }
  images.forEach(img => {
    allMedia.push({ type: 'image', url: img });
  });

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const openLightbox = (index) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextMedia = React.useCallback((e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % allMedia.length);
  }, [allMedia.length]);

  const prevMedia = React.useCallback((e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  }, [allMedia.length]);

  // Close lightbox on escape key
  useEffect(() => {
    if (!isLightboxOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextMedia();
      if (e.key === 'ArrowLeft') prevMedia();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextMedia, prevMedia]);

  if (allMedia.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 rounded-xl">
        No Media Available
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      {/* Collage Grid Layout */}
      <div className="relative group">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1 h-auto md:h-[450px] lg:h-[550px] overflow-hidden shadow-sm">
          
          {/* Main Large Image (Cover) */}
          <div 
            className="md:col-span-2 md:row-span-2 relative cursor-pointer overflow-hidden bg-gray-200"
            onClick={() => openLightbox(0)}
          >
            {allMedia[0].type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <img 
                  src={`https://img.youtube.com/vi/${getYouTubeId(allMedia[0].url)}/maxresdefault.jpg`}
                  className="w-full h-full object-cover opacity-70"
                  alt="Video cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
                  </div>
                </div>
              </div>
            ) : (
              <img 
                src={optimizeCloudinaryUrl(allMedia[0].url, 1200)} 
                alt={`${assetType} cover`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                fetchpriority="high"
              />
            )}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Smaller Images Grid */}
          {[1, 2, 3, 4].map((idx) => (
            <div 
              key={idx}
              className={`hidden md:block relative cursor-pointer overflow-hidden bg-gray-100 ${idx === 4 && allMedia.length > 5 ? 'relative' : ''}`}
              onClick={() => openLightbox(idx)}
            >
              {allMedia[idx] ? (
                allMedia[idx].type === 'video' ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <img 
                      src={`https://img.youtube.com/vi/${getYouTubeId(allMedia[idx].url)}/mqdefault.jpg`}
                      className="w-full h-full object-cover opacity-60"
                      alt="Video thumbnail"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={optimizeCloudinaryUrl(allMedia[idx].url, 600)} 
                    alt={`${assetType} view ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out"
                  />
                )
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                   <span className="text-gray-300 italic text-sm">More coming soon</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />

              {/* Overlap for "More" on the last small image */}
              {idx === 4 && allMedia.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                  <span className="text-2xl font-bold">+{allMedia.length - 5}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">Show All</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating "Show All Photos" Button */}
        <button 
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-bold rounded-lg border border-gray-300 shadow-lg hover:bg-gray-50 transition-all z-10"
        >
          <HiOutlineSquares2X2 className="text-lg" />
          <span>Show all photos</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col animate-in fade-in duration-300">
          {/* Header */}
          <div className="p-4 flex justify-between items-center text-white z-[1010]">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-400">
                {activeIndex + 1} / {allMedia.length}
              </span>
              <span className="font-semibold">{assetType} Gallery</span>
            </div>
            <button 
              onClick={closeLightbox} 
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
              aria-label="Close Gallery"
            >
              <IoClose size={28} />
            </button>
          </div>

          {/* Main Media View */}
          <div className="flex-1 relative flex items-center justify-center px-4 overflow-hidden">
            {allMedia[activeIndex].type === 'video' ? (
              <div className="w-full max-w-5xl aspect-video rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYouTubeId(allMedia[activeIndex].url)}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img 
                src={allMedia[activeIndex].url} 
                alt={`${assetType} full view ${activeIndex + 1}`}
                className="max-w-full max-h-full object-contain select-none shadow-2xl"
              />
            )}

            {/* Navigation Arrows */}
            {allMedia.length > 1 && (
              <>
                <button 
                  onClick={prevMedia}
                  className="absolute left-4 md:left-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 group/btn"
                >
                  <IoChevronBack size={28} className="group-hover/btn:-translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={nextMedia}
                  className="absolute right-4 md:right-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 group/btn"
                >
                  <IoChevronForward size={28} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Strip */}
          <div className="p-6 h-32 flex gap-3 overflow-x-auto justify-center items-center no-scrollbar bg-black/40 backdrop-blur-sm">
            {allMedia.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex-shrink-0 h-16 aspect-video rounded-md overflow-hidden transition-all duration-300 border-2 ${
                  activeIndex === idx ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                {item.type === 'video' ? (
                  <>
                    <img src={`https://img.youtube.com/vi/${getYouTubeId(item.url)}/mqdefault.jpg`} className="w-full h-full object-cover" alt="Video thumb" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-6 h-6 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1" />
                    </div>
                  </>
                ) : (
                  <img src={optimizeCloudinaryUrl(item.url, 200)} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetGallery;
