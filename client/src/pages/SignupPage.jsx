import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash, FaEnvelope, FaApple } from "react-icons/fa";
import SEO from "../components/SEO";

// ✅ Add or remove paths to match your files in public/images/login/
const images = [
  "/images/login/1.webp",
  "/images/login/2.webp",
  "/images/login/3.webp",
  "/images/login/4.webp",
  "/images/login/5.webp",
  "/images/login/6.webp",
  "/images/login/7.webp",
  "/images/login/8.webp",
  "/images/login/9.webp",
  "/images/login/10.webp",
];

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { success, error } = await signup(name, email, password);
    if (success) {
      navigate("/");
    } else {
      setError(error || "Failed to sign up");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { success, error } = await googleLogin(credentialResponse.credential);
    if (success) {
      navigate("/");
    } else {
      setError(error || "Google signup failed");
    }
  };

  const handleGoogleError = () => {
    setError("Google signup failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex font-sans">
      <SEO
        title="Sign Up"
        description="Join Otulia and begin your legacy. Create an account to buy, sell, and rent exclusive luxury assets."
      />

      {/* ── LEFT PANEL ── */}
      <div className="relative w-full md:w-[420px] lg:w-[480px] flex-shrink-0 bg-white flex flex-col px-10 py-10 z-10 shadow-2xl overflow-y-auto">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <img
            src="/logos/otulia_logo_black.png"
            alt="Otulia"
            className="h-[3.30625rem] object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          {/* Fallback text logo */}
          <div style={{ display: "none" }} className="flex items-center gap-1">
            <span
              className="text-[1.98375rem] font-black tracking-tight text-black"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              OTULIA
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-center text-[13px] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-8">
          The World of Luxury
        </p>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1
            className="text-[2rem] font-bold leading-tight text-black"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join <span style={{ color: "#C8922A" }}>Otulia</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Begin your legacy among the world's finest.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-xs text-center mb-5">
            {error}
          </div>
        )}

        {/* Google & Apple Buttons */}
        <div className="w-[85%] mx-auto space-y-3 mb-5">
          <div className="h-[40px] w-full overflow-hidden">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
              text="signup_with"
              shape="rectangular"
            />
          </div>

          <button
            type="button"
            className="w-full h-[40px] flex items-center justify-center gap-3 border border-gray-200 rounded-lg text-sm font-medium text-black hover:bg-gray-50 transition-colors"
          >
            <FaApple className="w-5 h-5 shrink-0" />
            <span className="leading-none">Continue with Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center my-5 h-12 w-[85%] mx-auto">
          <div className="grow border-t border-gray-200"></div>
          <span className="shrink mx-4 text-gray-400 text-xs">or</span>
          <div className="grow border-t border-gray-200"></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 w-[85%] mx-auto">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
              placeholder="Enter your email address"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors pr-11"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-black"
              >
                {showPassword ? (
                  <FaEye className="w-4 h-4" />
                ) : (
                  <FaEyeSlash className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-x-2 py-3.5 px-5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors"
          >
            <span>Create Account</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>

        {/* Sign in link */}
        <p className="text-xs text-gray-400 mt-6 text-center">
          Already a member?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline"
            style={{ color: "#C8922A" }}
          >
            Sign in
          </Link>
        </p>

        {/* Footer links */}
        <div className="mt-auto pt-10 flex gap-5 text-[10px] text-gray-400 justify-center">
          <a href="#" className="hover:text-black transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>

      {/* ── RIGHT PANEL — Slideshow ── */}
      <div className="hidden md:block relative flex-1 overflow-hidden">
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url('${src}')`,
              opacity: i === currentImageIndex ? 1 : 0,
            }}
          />
        ))}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Slideshow index indicators */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {images.map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 justify-end cursor-pointer"
              onClick={() => setCurrentImageIndex(i)}
            >
              {i === currentImageIndex && (
                <div className="w-6 h-px bg-white/80" />
              )}
              <span
                className="text-xs font-mono transition-colors"
                style={{
                  color:
                    i === currentImageIndex
                      ? "white"
                      : "rgba(255,255,255,0.35)",
                  fontWeight: i === currentImageIndex ? "700" : "400",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom copy */}
        <div className="absolute bottom-12 left-10 right-16">
          <p
            className="text-white/60 text-xs uppercase tracking-[0.2em] font-medium mb-3"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.2em",
            }}
          >
            Curated Luxury
          </p>
          <h2
            className="text-white text-5xl lg:text-5xl font-bold leading-tight mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="font-bold">Extraordinary</span>
            <br />
            <span
              style={{ color: "#C8922A", fontStyle: "italic", fontWeight: 700 }}
            >
              Lives Begin Here
            </span>
          </h2>
          <p
            className="text-white/70 text-sm max-w-xs leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Explore exceptional properties, iconic cars,
            <br />
            luxury yachts and private jets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
