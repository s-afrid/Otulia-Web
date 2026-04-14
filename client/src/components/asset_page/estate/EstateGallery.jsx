import React, { useState, useRef, useEffect } from 'react';
import { optimizeCloudinaryUrl } from '../../../utils/imageUtils';

const EstateGallery = ({ images, videoUrl }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const hasVideo = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const totalItems = images.length + (hasVideo ? 1 : 0);

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = hasVideo ? getYouTubeId(videoUrl) : null;
  
  // Combine all media for easier indexing, prioritizing video
  const allMedia = [];
  if (hasVideo) {
    allMedia.push({ type: 'video', url: videoUrl, id: videoId });
  }
  images.forEach(img => {
    allMedia.push({ type: 'image', url: img });
  });

  const totalItems = allMedia.length;

  // Handlers for main arrows
  const handlePrev = () => {
    setActiveIndex((prev) => {
      const newIndex = prev === 0 ? totalItems - 1 : prev - 1;
      scrollToThumbnail(newIndex);
      return newIndex;
    });
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      const newIndex = prev === totalItems - 1 ? 0 : prev + 1;
      scrollToThumbnail(newIndex);
      return newIndex;
    });
  };

  // Helper to scroll the thumbnail strip to keep active image in view
  const scrollToThumbnail = (index) => {
    if (scrollContainerRef.current) {
      const thumbnailWidth = 80; // approximate width of thumbnail + gap
      scrollContainerRef.current.scrollTo({
        left: index * thumbnailWidth - (scrollContainerRef.current.clientWidth / 2) + (thumbnailWidth / 2),
        behavior: 'smooth'
      });
    }
  };

  // Sync active index change (e.g. from clicks) with scroll
  useEffect(() => {
    scrollToThumbnail(activeIndex);
  }, [activeIndex]);

  // Safety check: If no media, show a placeholder
  if (totalItems === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
        No Media Available
      </div>
    );
  }

  return (
    <div className="w-full p-0 bg-white">
      
      {/* 1. MAIN MEDIA CONTAINER */}
      <div className="relative w-full aspect-[16/9] md:aspect-[2/1] bg-gray-100 overflow-hidden mb-4 shadow-sm group">
        {allMedia[activeIndex].type === 'image' ? (
          <img 
            src={optimizeCloudinaryUrl(allMedia[activeIndex].url, 1200)} 
            alt={`Estate View ${activeIndex + 1}`} 
            fetchpriority="high"
            width="1200"
            height="675"
            className="w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${allMedia[activeIndex].id}?autoplay=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Navigation Arrows (Overlay) - Only show if more than 1 item */}
        {totalItems > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              aria-label="Previous media"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-black rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              aria-label="Next media"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-black rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* Overlay Dots (Bottom Center) - Only if totalItems < 15 to avoid clutter */}
        {totalItems > 1 && totalItems < 15 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {[...Array(totalItems)].map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full shadow-sm cursor-pointer transition-all duration-300 ${
                  activeIndex === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* 2. THUMBNAIL STRIP - Hide if only 1 item */}
      {totalItems > 1 && (
        <div className="relative flex items-center justify-between border border-gray-200 p-2 rounded-sm bg-gray-50">
          
          {/* Thumbnails Grid with Ref for auto-scroll */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto no-scrollbar px-2 w-full scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for standard look
          >
            {allMedia.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`
                  relative cursor-pointer shrink-0 
                  w-20 h-14 md:w-28 md:h-20 
                  overflow-hidden rounded-sm
                  transition-all duration-300
                  ${activeIndex === idx 
                    ? 'ring-2 ring-black opacity-100 scale-95' 
                    : 'opacity-60 hover:opacity-100'
                  }
                  ${item.type === 'video' ? 'bg-black' : ''}
                `}
              >
                {item.type === 'image' ? (
                  <img 
                    src={optimizeCloudinaryUrl(item.url, 150, 150)} 
                    alt={`Thumbnail ${idx}`} 
                    loading="lazy"
                    width="112"
                    height="80"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <img 
                      src={`https://img.youtube.com/vi/${item.id}/mqdefault.jpg`} 
                      alt="Video Thumbnail" 
                      loading="lazy"
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-8 h-8">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default EstateGallery;