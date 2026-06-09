import React, { useEffect, useState } from 'react';
import welcomeSound from "../assets/sounds/theme.mp3";

const SplashScreen = ({ onFinish }) => {
    const [opacity, setOpacity] = useState(1);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const audio = new Audio(welcomeSound);
        audio.volume = 0.5;
        let hasStarted = false;

        const startAudio = () => {
            if (hasStarted) return;
            audio.play()
                .then(() => {
                    hasStarted = true;
                })
                .catch((err) => {
                    console.log("Splash sound blocked, waiting for interaction:", err);
                });
        };

        // Try playing immediately
        startAudio();

        // Fallback: Play on first interaction if blocked
        const handleInteraction = () => {
            if (!hasStarted) {
                startAudio();
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);

        // Animation timeline
        const fadeTimer = setTimeout(() => {
            setOpacity(0);
        }, 2000);

        const removeTimer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, 3000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            // Stop sound on unmount
            audio.pause();
            audio.currentTime = 0;
        };
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out pointer-events-none"
            style={{ opacity: opacity }}
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
