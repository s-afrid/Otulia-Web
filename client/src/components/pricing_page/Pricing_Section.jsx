import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const LockIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
  </svg>
);

const StarIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
  </svg>
);

const CoinsIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const PricingSection = () => {
  const { user, token, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  // ... (handleDirectActivation, handleApplyCoupon, calculateDiscountedPrice - kept as is)

  const plans = [
    {
      id: 1,
      name: 'Free',
      displayName: 'FREE',
      price: '0',
      frequency: 'Always Free',
      accentColor: '#b18b24',
      features: [
        'Upto 5 Listings',
        'Basic Inventory Management System',
        'Standard visibility in search',
        'Email Support',
        'Pricing Charts (Market Insights)'
      ],
      lockedFeatures: [
        'Extra Listings',
        'Promotional Features',
        'Ranking System Perks',
        'Google Trends API',
        'WhatsApp Integration',
        'Graphic Designs',
        'Featured Placement Days',
        'Credit System Suite'
      ]
    },
    {
      id: 2,
      name: 'Premium Basic',
      displayName: 'STARTER',
      price: '99',
      frequency: 'Every month',
      accentColor: '#b18b24',
      features: [
        'Upto 50 Listings',
        '$25 extra per listing',
        '5 Days of Featured Placement',
        'Full Inventory Management System',
        'Priority Placement Across Categories',
        'Priority Email Support',
        'Ranking System Perks',
        'Google Trends API',
        'WhatsApp Integration',
        'Graphic Designs for 10 Listings / month',
        'Credit System Suite',
        'Pricing Charts (Market Insights)'
      ]
    },
    {
      id: 3,
      name: 'Business VIP',
      displayName: 'PROFESSIONAL',
      price: '299',
      frequency: 'Every month',
      accentColor: '#b18b24',
      isPopular: true,
      features: [
        'Upto 100 Listings',
        '$20 per extra listing',
        '13 Days Of Featured Listing',
        'Advanced Inventory Management System',
        'Priority Placement Across Categories',
        'Dedicated Account Manager',
        'Ranking System Perks',
        'Google Trends API',
        'WhatsApp Integration',
        'Graphic Designs for All Listings',
        'Credit System Suite',
        'Pricing Charts (Market Insights)'
      ]
    }
  ];

  // ... (handlePlanSelection - kept as is)

  return (
    <div className="w-full py-[clamp(1rem,4vh,3rem)] px-[clamp(0.5rem,2vw,2rem)] bg-[#fcfcfc] montserrat">
      {statusMessage.text && (
        <div className={`max-w-md mx-auto p-3 rounded-md mb-6 text-[clamp(11px,1.2vh,14px)] ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700' :
          statusMessage.type === 'info' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
          }`}>
          {statusMessage.text}
        </div>
      )}

      {/* CARDS GRID */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[clamp(0.5rem,1.5vw,1.5rem)] items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden pt-[clamp(1.5rem,5vh,3rem)] pb-[clamp(1rem,3vh,2rem)] px-[clamp(1rem,2vw,2rem)]
                ${plan.isPopular ? 'ring-2 ring-[#b18b24]' : ''}
            `}
          >
            {/* POPULAR BADGE */}
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#b18b24] text-white text-[clamp(8px,1vh,10px)] font-bold uppercase tracking-widest px-4 py-1 rounded-b-lg whitespace-nowrap">
                Most Popular
              </div>
            )}

            <div className="flex flex-col items-center mb-[clamp(1rem,3vh,2rem)]">
              <h3 className="text-[clamp(11px,1.2vh,13px)] font-bold mb-1 tracking-widest" style={{ color: plan.accentColor }}>
                {plan.displayName}
              </h3>

              <div className="flex items-center gap-0.5">
                <span className="text-[clamp(1.2rem,2vh,2rem)] font-bold text-black self-start mt-1">$</span>
                <span className="text-[clamp(3rem,8vh,6rem)] font-bold text-black tracking-tight leading-none">
                  {plan.price}
                </span>
              </div>

              <span className="text-[clamp(10px,1vh,12px)] text-gray-400 mt-1">
                {plan.frequency}
              </span>
            </div>

            <div className="w-full h-px bg-gray-100 mb-[clamp(1rem,3vh,2rem)]"></div>

            {/* FEATURES */}
            <div className="flex flex-col gap-[clamp(0.4rem,1vh,0.8rem)] mb-[clamp(1rem,3vh,2rem)] flex-grow">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckIcon className="w-[clamp(12px,1.2vh,16px)] h-[clamp(12px,1.2vh,16px)] mt-0.5 shrink-0" style={{ color: plan.accentColor }} />
                  <span className="text-[clamp(11px,1.2vh,13px)] text-gray-600 font-medium leading-tight">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* LOCKED FEATURES (FOR FREE PLAN) */}
            {plan.lockedFeatures && (
              <div className="bg-[#f8f8f8] -mx-[clamp(1rem,2vw,2rem)] px-[clamp(1rem,2vw,2rem)] py-[clamp(1rem,2vh,1.5rem)] mb-[clamp(1rem,3vh,2rem)]">
                <h4 className="text-[clamp(9px,1vh,11px)] font-bold text-[#b18b24] mb-3 tracking-widest uppercase">
                  Locked in Free Plan
                </h4>
                <div className="flex flex-col gap-[clamp(0.4rem,1vh,0.8rem)]">
                  {plan.lockedFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 opacity-60">
                      <LockIcon className="w-[clamp(12px,1.2vh,16px)] h-[clamp(12px,1.2vh,16px)] mt-0.5 shrink-0 text-gray-400" />
                      <span className="text-[clamp(11px,1.2vh,13px)] text-gray-600 font-medium leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto">
              <p className="text-[clamp(8px,0.8vh,10px)] text-gray-400 mb-[clamp(1rem,2vh,1.5rem)] text-center">
                Valid until canceled • Tax included
              </p>
              
              <button
                onClick={() => handlePlanSelection(plan)}
                disabled={loadingPlanId === plan.id || user?.plan === plan.name}
                className={`
                  w-full py-[clamp(0.6rem,1.5vh,1rem)] rounded-full font-bold text-[clamp(10px,1vh,12px)] tracking-widest uppercase transition-all duration-300
                  ${plan.displayName === 'FREE' 
                    ? 'border-2 border-[#b18b24] text-[#b18b24] hover:bg-[#b18b24] hover:text-white' 
                    : 'bg-[#b18b24] text-white hover:brightness-105'}
                  ${user?.plan === plan.name ? 'opacity-50 cursor-default' : 'active:scale-95'}
                `}
              >
                {user?.plan === plan.name ? 'Active' : 'Get Started'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER LEGENDS */}
      <div className="max-w-[1600px] mx-auto mt-[clamp(2rem,6vh,4rem)] pt-6 border-t border-gray-100 flex flex-wrap justify-center gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-3">
        <div className="flex items-center gap-1.5">
          <CheckIcon className="w-[clamp(12px,1.2vh,16px)] h-[clamp(12px,1.2vh,16px)] text-[#b18b24]" />
          <span className="text-[clamp(10px,1vh,11px)] text-gray-500 font-medium">Included in Plan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <LockIcon className="w-[clamp(12px,1.2vh,16px)] h-[clamp(12px,1.2vh,16px)] text-gray-400" />
          <span className="text-[clamp(10px,1vh,11px)] text-gray-500 font-medium">Not Included</span>
        </div>
        <div className="flex items-center gap-1.5">
          <StarIcon className="w-[clamp(12px,1.2vh,16px)] h-[clamp(12px,1.2vh,16px)] text-[#b18b24]" />
          <span className="text-[clamp(10px,1vh,11px)] text-gray-500 font-medium">Featured Placement Days</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CoinsIcon className="w-[clamp(12px,1.2vh,16px)] h-[clamp(12px,1.2vh,16px)] text-[#b18b24]" />
          <span className="text-[clamp(10px,1vh,11px)] text-gray-500 font-medium whitespace-nowrap">Credit System Suite available on paid plans</span>
        </div>
      </div>

      {/* PAYPAL MODAL (Logic Preserved) */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative">
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold canela text-gray-800">Complete Upgrade</h3>
                <p className="text-sm text-gray-500">Upgrade to {selectedPlan.name}</p>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="text-gray-400 hover:text-gray-600 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Original Price</span>
                <span className="text-lg font-medium text-gray-400 line-through">${selectedPlan.price}</span>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Have a Coupon?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter Code"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#b18b24]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded uppercase hover:bg-gray-800"
                  >
                    {isValidatingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-[10px] mt-1 font-medium">{couponError}</p>}
                {appliedCoupon && (
                  <div className="flex justify-between items-center mt-2 text-emerald-600 text-xs font-bold">
                    <span>Coupon "{appliedCoupon.code}" Applied!</span>
                    <span>-{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `$${appliedCoupon.discountValue}`}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-black">${calculateDiscountedPrice(selectedPlan.price)}</span>
              </div>

              <div className="min-h-[150px]">
                {selectedPlan.name === 'Premium Basic' && appliedCoupon?.code === 'FREE100' ? (
                  <button
                    onClick={handleDirectActivation}
                    disabled={isActivating}
                    className="w-full py-4 bg-[#b18b24] text-white font-bold rounded-lg uppercase tracking-widest hover:brightness-110 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isActivating ? 'Activating...' : 'Directly Activate'}
                  </button>
                ) : (
                  <PayPalScriptProvider options={paypalOptions}>
                    <PayPalButtons
                      style={{ layout: "vertical", shape: "rect", color: "gold", label: "pay" }}
                      createOrder={async (data, actions) => {
                        try {
                          const response = await fetch('/api/payment/create-order', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ 
                              plan: selectedPlan.name,
                              couponCode: appliedCoupon ? appliedCoupon.code : null
                            })
                          });
                          const order = await response.json();
                          return order.id;
                        } catch (err) {
                          alert("Failed to initialize payment.");
                          throw err;
                        }
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const response = await fetch('/api/payment/capture-order', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              orderID: data.orderID,
                              plan: selectedPlan.name,
                              couponCode: appliedCoupon ? appliedCoupon.code : null
                            })
                          });
                          const details = await response.json();
                          if (details.success) {
                            setStatusMessage({ text: `Successfully upgraded to ${selectedPlan.name}!`, type: 'success' });
                            await refreshUser();
                            setSelectedPlan(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          } else {
                            alert("Payment failed: " + details.error);
                          }
                        } catch (err) {
                          alert("Payment verification failed.");
                        }
                      }}
                    />
                  </PayPalScriptProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingSection;