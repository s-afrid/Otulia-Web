import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'

const Cart = ({ isDark }) => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.length;
  const colorClass = isDark ? 'text-black' : 'text-white';

  return (
    <button
      type="button"
      onClick={() => navigate('/cart')}
      className={`relative flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer group ${colorClass}`}
      aria-label="View Shopping Bag"
    >
      {/* Premium Bag Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.2"
        stroke="currentColor"
        className="w-[26px] h-[26px] opacity-90 group-hover:opacity-100 transition-opacity"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>

      {/* Modern Notification Badge */}
      {totalItems > 0 && (
        <div className={`absolute -top-1.5 -right-2 w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg border transition-all duration-300 group-hover:scale-110 ${isDark ? 'bg-black text-white border-white/20' : 'bg-white text-black border-gray-100'}`}>
          <span className="text-[10px] font-black leading-none">
            {totalItems}
          </span>
        </div>
      )}
    </button>
  );
};

export default Cart
