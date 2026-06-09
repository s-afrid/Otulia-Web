import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish, isMobile, onInteraction }) => {
    const [opacity, setOpacity] = useState(1);
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // If it's NOT mobile, run the automatic timer immediately
        if (!isMobile) {
            const fadeTimer = setTimeout(() => {
                setIsFading(true);
                setOpacity(0);
            }, 2000);

            const removeTimer = setTimeout(() => {
                setIsVisible(false);
                if (onFinish) onFinish();
            }, 3000);

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [onFinish, isMobile]);

    const handleEnter = () => {
        if (hasInteracted) return;
        setHasInteracted(true);
        
        // Trigger audio
        if (onInteraction) onInteraction();

        // Start fade out sequence
        setIsFading(true);
        setOpacity(0);

        setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, 1000);
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${isFading ? 'pointer-events-none' : 'pointer-events-auto cursor-default'}`}
            style={{ opacity: opacity }}
        >
            <div className="flex flex-col items-center justify-center text-center px-4">
                {/* White Logo */}
                <div className="animate-pulse mb-6">
                    <img
                        src="/logos/otulia_logo_white.png"
                        alt="Otulia"
                        className="w-64 md:w-96 h-auto object-contain drop-shadow-2xl"
                    />
                </div>

                <p className="text-white text-sm md:text-base uppercase tracking-[0.4em] font-medium montserrat animate-fade-in text-center w-fit ml-6 md:ml-12 mb-12">
                    Luxury Redefined
                </p>

                {/* Mobile-only Enter Button */}
                {isMobile && !isFading && (
                    <button
                        onClick={handleEnter}
                        className="mt-4 px-10 py-4 border border-white/30 text-white text-xs tracking-[0.3em] font-medium uppercase montserrat hover:bg-white hover:text-black transition-all duration-500 animate-fade-in backdrop-blur-sm"
                    >
                        Explore Otulia
                    </button>
                )}
            </div>
        </div>
    );
};

export default SplashScreen;
