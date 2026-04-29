import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
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

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState("email");
    const [error, setError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleContinue = (e) => {
        e.preventDefault();
        if (step === "email") {
            if (!email) return;
            setStep("password");
        } else {
            handleSubmit(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const { success, error } = await login(email, password);
        if (success) {
            navigate("/");
        } else {
            setError(error || "Failed to login");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const { success, error } = await googleLogin(credentialResponse.credential);
        if (success) {
            navigate("/");
        } else {
            setError(error || "Google login failed");
        }
    };

    const handleGoogleError = () => {
        setError("Google login failed. Please try again.");
    };

    return (
        <div className="min-h-screen flex font-sans">
            <SEO
                title="Login"
                description="Access your personal sanctuary on Otulia. Log in to manage your luxury listings and favorites."
            />

            {/* ── LEFT PANEL ── */}
            <div className="relative w-full md:w-[450px] lg:w-[500px] flex-shrink-0 bg-black flex flex-col justify-center px-10 md:px-14 z-10 border-r border-white/5 overflow-y-auto">
                <div className="py-12">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#D48D2A]/80 rounded-b-full shadow-[0_0_15px_rgba(212,141,42,0.5)]"></div>

                    <div className="text-center mb-10 mt-2">
                        <h2 className="text-3xl md:text-4xl font-bold canela text-white mb-3">Welcome Back</h2>
                        <p className="text-gray-300 text-xs md:text-sm montserrat uppercase tracking-[0.2em] font-light">Access your personal sanctuary</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl text-sm text-center mb-6 backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 mb-8">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="filled_black"
                            size="large"
                            width="100%"
                            text="continue_with"
                            shape="pill"
                        />
                    </div>

                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-medium">Or via email</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-[#D48D2A] transition-colors">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-5 py-4 bg-black/20 border border-white/10 text-white rounded-xl focus:outline-none focus:border-[#D48D2A] focus:bg-black/40 transition-all text-sm font-medium placeholder-white/20 hover:border-white/20"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="group">
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-[#D48D2A] transition-colors">Password</label>
                                    <a href="#" className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-bold">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-5 py-4 bg-black/20 border border-white/10 text-white rounded-xl focus:outline-none focus:border-[#D48D2A] focus:bg-black/40 transition-all text-sm font-medium placeholder-white/20 hover:border-white/20 pr-12"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <FaEye className="w-5 h-5" />
                                        ) : (
                                            <FaEyeSlash className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#D48D2A] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#B5751C] hover:shadow-[0_0_20px_rgba(212,141,42,0.4)] transition-all duration-300 transform active:scale-[0.98] mt-4"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="text-center mt-10">
                        <p className="text-gray-400 text-xs">
                            Not a member yet?{' '}
                            <Link to="/signup" className="font-bold text-white hover:text-[#D48D2A] transition-colors ml-1 uppercase tracking-wider text-[10px]">
                                Apply for Access
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-white/20 text-[10px] mt-6 uppercase tracking-[0.3em] pb-8">
                    Otulia &copy; 2026
                </p>
            </div>

            {/* ── RIGHT PANEL — Slideshow ── */}
            <div className="hidden md:block relative flex-1 overflow-hidden bg-black">
                {images.map((src, i) => (
                    <div
                        key={src}
                        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                        style={{
                            backgroundImage: `url('${src}')`,
                            opacity: i === currentImageIndex ? 1 : 0,
                        }}
                    >
                        {/* Image overlay to ensure readability */}
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                ))}

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-16 z-10">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-white/60 text-[10px] tracking-[0.4em] uppercase font-bold mb-2">Established 2025</span>
                            <div className="w-12 h-0.5 bg-[#D48D2A]"></div>
                        </div>
                        <div className="flex gap-4">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentImageIndex(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentImageIndex ? 'bg-[#D48D2A] w-6' : 'bg-white/30'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <h2 className="text-white text-6xl lg:text-7xl font-bold leading-tight mb-6 canela">
                            Extraordinary<br />
                            <span className="text-[#D48D2A] italic">Lives</span> Begin Here
                        </h2>
                        <p className="text-white/80 text-lg montserrat font-light leading-relaxed max-w-md">
                            Experience the pinnacle of luxury with our curated collection of iconic assets and exclusive estates.
                        </p>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex gap-10">
                            <div className="flex flex-col">
                                <span className="text-[#D48D2A] text-2xl font-bold canela mb-1">500+</span>
                                <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Curated Assets</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#D48D2A] text-2xl font-bold canela mb-1">24/7</span>
                                <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold">VIP Concierge</span>
                            </div>
                        </div>
                        <span className="text-white/30 text-[10px] font-mono tracking-widest uppercase">
                            Slide {currentImageIndex + 1} / {images.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
