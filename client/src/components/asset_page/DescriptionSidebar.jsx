import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

const DescriptionSidebar = ({ isOpen, onClose, description }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold playfair-display text-black">Description</h2>
          <button
            aria-label="Close description"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >            <FiX className="text-2xl text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-gray-700 leading-relaxed text-base montserrat whitespace-pre-wrap">
            {description}
          </div>
        </div>
      </div>
    </>
  );
};

export default DescriptionSidebar;
