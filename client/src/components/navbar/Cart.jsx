import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { FiShoppingBag } from 'react-icons/fi'

const Cart = ({ text }) => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const count = cart.length;

  return (
    <button
      type="button"
      onClick={() => navigate('/cart')}
      className={`relative flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer hover:opacity-70 ${text}`}
      aria-label="View Shopping Bag"
    >
      {/* Shopping Bag Icon */}
      <FiShoppingBag className="w-6 h-6 stroke-[1.5]" />

      {/* Number Badge (Top Right) - Only show if count >= 1 */}
      {count >= 1 && (
        <span className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm transition-all animate-fade-in ${
          text.includes('text-white') 
          ? 'bg-white text-black' 
          : 'bg-black text-white'
        }`}>
          {count}
        </span>
      )}
    </button>
  )
}

export default Cart
