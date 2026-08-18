import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaTrophy, FaArrowRight, FaTimes } from "react-icons/fa";

const logoSrc = "/logos/logo.png";

function Sidebar({ categories = [], activeSlug }) {
  const { category, slug } = useParams();
  const currentSlug = activeSlug || slug;

  const [showNominateModal, setShowNominateModal] = useState(false);
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeReason, setNomineeReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Listen to open nominate modal event from Navbar or elsewhere
  useEffect(() => {
    const handleOpenModal = () => setShowNominateModal(true);
    window.addEventListener("otulia:open-nominate-modal", handleOpenModal);
    return () => window.removeEventListener("otulia:open-nominate-modal", handleOpenModal);
  }, []);

  const catParam = (category || "cars").toLowerCase();
  const isEstate = catParam.includes("estate") || catParam.includes("real");
  const isCreator = catParam.includes("creator");

  const promptText = isEstate
    ? "Know an extraordinary luxury estate that deserves to be on the list?"
    : isCreator
    ? "Know an exceptional content creator who deserves to be on the list?"
    : "Know an extraordinary hypercar that deserves to be on the list?";

  const modalTitle = isEstate
    ? "Nominate a Luxury Estate"
    : isCreator
    ? "Nominate a Content Creator"
    : "Nominate a Hypercar";

  const placeholderText = isEstate
    ? "e.g. Bel Air Luxury Compound, Dubai Penthouse"
    : isCreator
    ? "e.g. Marques Brownlee, Supercar Blondie"
    : "e.g. Bugatti Tourbillon, McLaren W1";

  const navItems = [
    {
      label: "All Rankings",
      path: `/ranking/${category || "cars"}`,
      slug: undefined,
    },
    ...(categories || []).map((cat) => {
      let formattedTitle = cat.title;
      if (!formattedTitle.toLowerCase().includes("2026") && !formattedTitle.toLowerCase().includes("all")) {
        formattedTitle = `${formattedTitle} Of 2026`;
      }
      return {
        label: formattedTitle,
        path: `/ranking/${cat.type ? cat.type.toLowerCase().replace(/\s+/g, "") : (category || "cars")}/${cat.slug}`,
        slug: cat.slug,
      };
    })
  ];

  const handleNominateSubmit = (e) => {
    e.preventDefault();
    if (!nomineeName.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setShowNominateModal(false);
      setSubmitted(false);
      setNomineeName("");
      setNomineeReason("");
    }, 2000);
  };

  return (
    <>
      {/* Sidebar Aside Panel (Desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[240px] xl:w-[260px] h-full bg-black z-40 flex-col border-r border-zinc-900 shadow-2xl select-none font-gilda">
        {/* Header Logo */}
        <div className="h-[76px] sm:h-[84px] md:h-[88px] flex items-center px-6 border-b border-zinc-900/80 shrink-0">
          <Link to="/">
            <img
              className="w-[130px] xl:w-[140px] h-auto object-contain transition-opacity hover:opacity-90"
              alt="Otulia Logo"
              src={logoSrc}
              title="Otulia"
            />
          </Link>
        </div>

        {/* Menu Navigation Items */}
        <nav className="flex-1 px-3 xl:px-4 py-5 overflow-y-auto space-y-2 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = !slug
              ? item.slug === undefined
              : item.slug === slug;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  block
                  w-full
                  px-3.5
                  py-2.5
                  rounded-lg
                  font-gilda
                  text-[14px]
                  xl:text-[15px]
                  leading-snug
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#A3732B] via-[#8C6226] to-[#7B531E] text-white font-medium shadow-md tracking-wide"
                      : "text-zinc-200 hover:text-[#D6A125] font-normal hover:translate-x-1"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA Card: Nominate Now */}
        <div className="p-3.5 xl:p-4 border-t border-zinc-900 bg-black shrink-0 font-sans inter mt-auto">
          <div className="rounded-xl border border-zinc-850 bg-[#0B0B0D] p-3.5 xl:p-4 text-center flex flex-col items-center shadow-lg relative overflow-hidden group">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#D6A125]/5 to-transparent pointer-events-none" />

            {/* Trophy Icon */}
            <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full bg-[#18181B] border border-zinc-800 flex items-center justify-center mb-2.5 xl:mb-3 text-[#D6A125] shadow-inner group-hover:scale-110 transition duration-300">
              <FaTrophy className="text-lg xl:text-xl text-[#D6A125]" />
            </div>

            {/* Description Text */}
            <p className="text-[11.5px] xl:text-[12px] text-zinc-300 font-sans inter leading-relaxed mb-3 px-1 font-normal">
              {promptText}
            </p>

            {/* Nominate Button */}
            <button
              onClick={() => setShowNominateModal(true)}
              className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#B8812D] via-[#A37025] to-[#8C5E1D] hover:from-[#A37025] hover:to-[#7B5118] text-white font-semibold text-xs tracking-wide transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 font-sans inter"
            >
              <span>Nominate Now</span>
              <FaArrowRight className="text-[10px]" />
            </button>
          </div>
        </div>
      </aside>

      {/* NOMINATE MODAL */}
      {showNominateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowNominateModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition w-7 h-7 rounded-lg flex items-center justify-center hover:bg-zinc-800"
            >
              <FaTimes className="text-base" />
            </button>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#D6A125]/20 border border-[#D6A125] text-[#D6A125] flex items-center justify-center mx-auto mb-4">
                  <FaTrophy className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nomination Submitted!</h3>
                <p className="text-xs text-zinc-400">
                  Thank you! Our editorial team will review your submission for inclusion in our 2026 Rankings.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNominateSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-[#D6A125] text-lg" />
                  <h3 className="text-lg font-bold text-white">{modalTitle}</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Submit an extraordinary nominee to be evaluated by our global luxury ranking board.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nominee Name / Model *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={placeholderText}
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D6A125]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Why should it be ranked?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state key performance metrics, architecture, or creative achievements..."
                    value={nomineeReason}
                    onChange={(e) => setNomineeReason(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D6A125]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNominateModal(false)}
                    className="px-4 py-2 rounded-lg border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#B8812D] to-[#8C5E1D] text-xs font-bold text-white hover:opacity-90"
                  >
                    Submit Nomination
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;

