import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);

const LockIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    ></path>
  </svg>
);

const StarIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    ></path>
  </svg>
);

const CoinsIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const PricingSection = () => {
  const { user, token, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  const handlePlanSelection = (plan) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }
    if (user?.plan === plan.name) return;
    if (plan.name === "Free") {
      handleDirectActivation(plan);
      return;
    }
    setSelectedPlan(plan);
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    try {
      const response = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: couponCode, plan: selectedPlan.name }),
      });
      const data = await response.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
      } else {
        setCouponError(data.error || "Invalid coupon code");
      }
    } catch (err) {
      setCouponError("Failed to validate coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const calculateDiscountedPrice = (originalPrice) => {
    if (!appliedCoupon) return originalPrice;
    const price = parseFloat(originalPrice);
    if (appliedCoupon.discountType === "percentage") {
      return (price * (1 - appliedCoupon.discountValue / 100)).toFixed(2);
    } else {
      return Math.max(0, price - appliedCoupon.discountValue).toFixed(2);
    }
  };

  const handleDirectActivation = async (planOverride = null) => {
    const planToActivate = planOverride || selectedPlan;
    setIsActivating(true);
    try {
      const response = await fetch("/api/payment/direct-activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: planToActivate.name,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage({
          text: `Successfully activated ${planToActivate.name} plan!`,
          type: "success",
        });
        await refreshUser();
        setSelectedPlan(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatusMessage({
          text: data.error || "Failed to activate plan",
          type: "error",
        });
      }
    } catch (err) {
      setStatusMessage({
        text: "An error occurred during activation",
        type: "error",
      });
    } finally {
      setIsActivating(false);
    }
  };

  const plans = [
    {
      id: 1,
      name: "Free",
      displayName: "FREE",
      price: "0",
      frequency: "Always Free",
      accentColor: "#b18b24",
      features: [
        "Upto 5 Listings",
        "Basic Inventory Management System",
        "Standard visibility in search",
        "Email Support",
        "Pricing Charts (Market Insights)",
      ],
      lockedFeatures: [
        "Extra Listings",
        "Promotional Features",
        "Ranking System Perks",
        "Google Trends API",
        "WhatsApp Integration",
        "Graphic Designs",
        "Featured Placement Days",
        "Credit System Suite",
      ],
    },
    {
      id: 2,
      name: "Premium Basic",
      displayName: "STARTER",
      price: "99",
      frequency: "Every month",
      accentColor: "#b18b24",
      features: [
        "Upto 50 Listings",
        "$25 extra per listing",
        "5 Days of Featured Placement",
        "Full Inventory Management System",
        "Priority Placement Across Categories",
        "Priority Email Support",
        "Ranking System Perks",
        "Google Trends API",
        "WhatsApp Integration",
        "Graphic Designs for 10 Listings / month",
        "Credit System Suite",
        "Pricing Charts (Market Insights)",
      ],
    },
    {
      id: 3,
      name: "Business VIP",
      displayName: "PROFESSIONAL",
      price: "299",
      frequency: "Every month",
      accentColor: "#b18b24",
      isPopular: true,
      features: [
        "Upto 100 Listings",
        "$20 per extra listing",
        "13 Days Of Featured Listing",
        "Advanced Inventory Management System",
        "Priority Placement Across Categories",
        "Dedicated Account Manager",
        "Ranking System Perks",
        "Google Trends API",
        "WhatsApp Integration",
        "Graphic Designs for All Listings",
        "Credit System Suite",
        "Pricing Charts (Market Insights)",
      ],
    },
  ];

  return (
    <div className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-[#fcfcfc] montserrat">
      {/* Status banner */}
      {statusMessage.text && (
        <div
          className={`max-w-md mx-auto p-3 rounded-md mb-6 text-sm text-center ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-700"
              : statusMessage.type === "info"
                ? "bg-blue-50 text-blue-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Header Section */}
      <div className="text-center mb-16 pt-8">
        <h1 className="text-4xl md:text-5xl canela text-black mb-6">
          Built for <span className="text-[#b18b24]">Sales.</span> Not Just Listings.
        </h1>
        <p className="text-[#666666] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed px-4">
          We tell you <span className="text-[#b18b24] font-semibold">where</span> to list, <span className="text-[#b18b24] font-semibold">when</span> to promote, <span className="text-[#b18b24] font-semibold">how</span> to position,<br className="hidden sm:block" /> and <span className="text-[#b18b24] font-semibold">how to connect</span> with qualified buyers.
        </p>
      </div>

      {/* Cards grid — 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col bg-white border rounded-2xl overflow-hidden pt-12 pb-8 px-7 shadow-sm
              ${plan.isPopular ? "border-[#b18b24] border-2 shadow-[0_4px_24px_rgba(177,139,36,0.18)]" : "border-gray-100"}
              ${plan.isPopular ? "md:col-span-2 lg:col-span-1" : ""}
            `}
          >
            {/* Popular badge */}
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#b18b24] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-1.5 rounded-b-xl whitespace-nowrap">
                Most Popular
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col items-center mb-6 text-center">
              <h3 className="text-[13px] font-extrabold tracking-[0.2em] text-[#b18b24] uppercase mb-2">
                {plan.displayName}
              </h3>
              <div className="flex items-start leading-none">
                <span className="text-[28px] font-bold text-black mt-2.5">
                  $
                </span>
                <span className="text-[70px] sm:text-[65px] font-bold text-black leading-none tracking-tight">
                  {plan.price}
                </span>
              </div>
              <span className="text-xs text-gray-600 mt-2">
                {plan.frequency}
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-100 mb-6" />

            {/* Features */}
            <div className="flex flex-col gap-5 mb-5 flex-grow">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#b18b24]" />
                  <span className="text-[13px] text-gray-500 font-medium leading-snug">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Locked features (Free plan only) */}
            {plan.lockedFeatures && (
              <div className="bg-[#FBFAF8] rounded-lg px-5 py-3 mb-6">
                <h4 className="text-[10px] font-extrabold text-[#b18b24] tracking-[0.18em] uppercase mb-3">
                  Locked in Free Plan
                </h4>
                <div className="flex flex-col gap-2.5">
                  {plan.lockedFeatures.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5  opacity-50"
                    >
                      <LockIcon className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                      <span className="text-[13px] text-gray-500 font-medium leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-auto">
              <p className="text-[11px] text-gray-600 text-center mb-3 ">
                Valid until canceled · Tax included
              </p>
              <button
                onClick={() => handlePlanSelection(plan)}
                disabled={loadingPlanId === plan.id || user?.plan === plan.name}
                className={`
                  w-full py-3.5 rounded-full font-extrabold text-[11px] tracking-[0.2em] uppercase transition-all duration-200
                  ${
                    plan.displayName === "FREE"
                      ? "border-2 border-[#b18b24] text-[#b18b24] hover:bg-[#b18b24] hover:text-white"
                      : "bg-[#b18b24] text-white hover:brightness-110"
                  }
                  ${user?.plan === plan.name ? "opacity-50 cursor-default" : "active:scale-95"}
                `}
              >
                {user?.plan === plan.name ? "Active" : "Get Started"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer legends */}
      <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t border-gray-100 flex flex-wrap justify-center gap-x-8 gap-y-3">
        <div className="flex items-center gap-2">
          <CheckIcon className="w-[18px] h-[18px] text-[#b18b24]" />
          <span className="text-[13px] text-gray-400 font-medium">
            Included in Plan
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LockIcon className="w-[18px] h-[18px] text-gray-300" />
          <span className="text-[13px] text-gray-400 font-medium">
            Not Included
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StarIcon className="w-[18px] h-[18px] text-[#b18b24]" />
          <span className="text-[13px] text-gray-400 font-medium">
            Featured Placement Days
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CoinsIcon className="w-[18px] h-[18px] text-[#b18b24]" />
          <span className="text-[13px] text-gray-400 font-medium whitespace-nowrap">
            Credit System Suite available on paid plans
          </span>
        </div>
      </div>

      {/* PayPal Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[92vh] overflow-y-auto">
            {/* Modal header */}
            <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-extrabold text-gray-800 montserrat">
                  Complete Upgrade
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  Upgrade to {selectedPlan.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-gray-300 hover:text-gray-500 p-1 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6">
              {/* Original price */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-500">
                  Original Price
                </span>
                <span className="text-lg font-semibold text-gray-300 line-through">
                  ${selectedPlan.price}
                </span>
              </div>

              {/* Coupon box */}
              <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <label className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-gray-400 mb-2.5">
                  Have a Coupon?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter Code"
                    className="flex-1 min-w-0 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#b18b24] transition-colors"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="px-4 py-2.5 bg-black text-white text-[11px] font-extrabold rounded-lg uppercase tracking-wider hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    {isValidatingCoupon ? "..." : "Apply"}
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-[11px] mt-1.5 font-semibold">
                    {couponError}
                  </p>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between items-center mt-2.5 text-emerald-600 text-xs font-bold">
                    <span>Coupon "{appliedCoupon.code}" Applied!</span>
                    <span>
                      -
                      {appliedCoupon.discountType === "percentage"
                        ? `${appliedCoupon.discountValue}%`
                        : `$${appliedCoupon.discountValue}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold text-gray-500">
                  Total Amount
                </span>
                <span className="text-2xl font-black text-black tracking-tight">
                  ${calculateDiscountedPrice(selectedPlan.price)}
                </span>
              </div>

              {/* PayPal or direct activate */}
              <div className="min-h-[150px]">
                {selectedPlan.name === "Premium Basic" &&
                appliedCoupon?.code === "FREE100" ? (
                  <button
                    onClick={handleDirectActivation}
                    disabled={isActivating}
                    className="w-full py-4 bg-[#b18b24] text-white font-extrabold rounded-full uppercase tracking-widest text-[12px] hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isActivating ? "Activating..." : "Directly Activate"}
                  </button>
                ) : (
                  <PayPalScriptProvider options={paypalOptions}>
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        shape: "rect",
                        color: "gold",
                        label: "pay",
                      }}
                      createOrder={async (data, actions) => {
                        try {
                          const response = await fetch(
                            "/api/payment/create-order",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                plan: selectedPlan.name,
                                couponCode: appliedCoupon
                                  ? appliedCoupon.code
                                  : null,
                              }),
                            },
                          );
                          const order = await response.json();
                          return order.id;
                        } catch (err) {
                          alert("Failed to initialize payment.");
                          throw err;
                        }
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const response = await fetch(
                            "/api/payment/capture-order",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                orderID: data.orderID,
                                plan: selectedPlan.name,
                                couponCode: appliedCoupon
                                  ? appliedCoupon.code
                                  : null,
                              }),
                            },
                          );
                          const details = await response.json();
                          if (details.success) {
                            setStatusMessage({
                              text: `Successfully upgraded to ${selectedPlan.name}!`,
                              type: "success",
                            });
                            await refreshUser();
                            setSelectedPlan(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
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
