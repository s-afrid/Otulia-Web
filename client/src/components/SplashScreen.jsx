import React, { useEffect, useState } from 'react';
import welcomeSound from "../assets/sounds/theme.mp3";

const SplashScreen = ({ onFinish }) => {
    const [opacity, setOpacity] = useState(1);
    const [isVisible, setIsVisible] = useState(true);
    const audioRef = React.useRef(null);
    const hasUnmutedRef = React.useRef(false);

    useEffect(() => {
        // Create audio once
        const audio = new Audio(welcomeSound);
        audio.volume = 0.5;
        audio.preload = "auto";
        audioRef.current = audio;

        const attemptPlay = () => {
            audio.play().catch(() => {
                // If blocked, we wait for interaction
                console.log("Autoplay blocked, waiting for interaction...");
            });
        };

        const handleInteraction = () => {
            if (audioRef.current && !hasUnmutedRef.current) {
                audioRef.current.play()
                    .then(() => {
                        hasUnmutedRef.current = true;
                    })
                    .catch(console.error);
            }
        };

        // Initial attempt
        attemptPlay();

        // Listen for ANY interaction to unmute/play
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });

        // Fade out after 2s, remove after 3s
        const fadeTimer = setTimeout(() => setOpacity(0), 2000);
        const removeTimer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, 3000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out pointer-events-auto cursor-default"
            style={{ opacity: opacity }}
            onClick={() => {
                if (audioRef.current && !hasUnmutedRef.current) {
                    audioRef.current.play().then(() => {
                        hasUnmutedRef.current = true;
                    }).catch(console.error);
                }
            }}
        >
            <div className="flex flex-col items-center animate-pulse justify-center text-center">
                {/* White Logo */}
                <img
                    src="/logos/otulia_logo_white.png"
                    alt="Otulia"
                    className="w-64 md:w-96 h-auto object-contain mb-6 drop-shadow-2xl"
                />
                <p className="text-white text-sm md:text-base uppercase tracking-[0.4em] font-medium montserrat animate-fade-in text-center w-fit ml-6 md:ml-12">
                    Luxury Redefined
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;
