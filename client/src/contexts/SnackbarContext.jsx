import React, { createContext, useState, useContext, useEffect } from 'react';
import { FiClock, FiX } from 'react-icons/fi';

const SnackbarContext = createContext(null);

export const useSnackbar = () => {
    return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [timerId, setTimerId] = useState(null);

    const showSnackbar = (msg) => {
        if (timerId) {
            clearTimeout(timerId);
        }
        setMessage(msg);
        setIsOpen(true);

        const id = setTimeout(() => {
            setIsOpen(false);
        }, 3000);
        setTimerId(id);
    };

    const closeSnackbar = () => {
        setIsOpen(false);
        if (timerId) {
            clearTimeout(timerId);
            setTimerId(null);
        }
    };

    useEffect(() => {
        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [timerId]);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {/* Premium Snackbar UI */}
            <div
                className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 ${
                    isOpen 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                }`}
            >
                <div className="flex items-center gap-4 bg-[#121212]/90 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.6)] min-w-[300px] max-w-md">
                    {/* Premium Golden Icon */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <FiClock className="w-4 h-4 animate-pulse" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                        <p className="text-white font-medium tracking-[0.15em] text-xs uppercase montserrat">
                            {message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={closeSnackbar} 
                        className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer"
                        aria-label="Close notification"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </SnackbarContext.Provider>
    );
};
