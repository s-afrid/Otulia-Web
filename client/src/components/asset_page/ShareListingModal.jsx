import React, { useEffect, useMemo, useState } from "react";
import { IoClose, IoCopyOutline, IoCheckmark, IoOpenOutline, IoShareSocialOutline } from "react-icons/io5";
import facebookIcon from "../../assets/icons/social/facebook.svg";
import instagramIcon from "../../assets/icons/social/instagram.svg";
import linkedInIcon from "../../assets/icons/social/linkedin.svg";
import whatsappIcon from "../../assets/icons/social/whatsapp.svg";
import xIcon from "../../assets/icons/social/x.svg";

const ShareListingModal = ({ asset, assetType, image, onClose }) => {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const listingUrl = useMemo(() => `${window.location.origin}${window.location.pathname}`, []);
  const title = asset?.title || `${assetType} listing on Otulia`;
  const location = asset?.location || asset?.carLocation || asset?.specification?.carLocation;
  const priceValue = Number(asset?.price);
  const currency = asset?.currency || asset?.priceCurrency || "USD";
  const price = asset?.isPriceOnRequest
    ? "Price on request"
    : Number.isFinite(priceValue) && asset?.price !== "" && asset?.price != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: /^[A-Z]{3}$/.test(currency) ? currency : "USD",
          maximumFractionDigits: 0,
        }).format(priceValue)
      : "Contact for price";
  const shareText = [title, location && `Location: ${location}`, `Price: ${price}`, listingUrl]
    .filter(Boolean)
    .join("\n");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const copyText = async (value, successMessage) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setMessage(successMessage);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setMessage("Copy was blocked by the browser. Select and copy the text manually.");
    }
  };

  const shareImageToApp = async () => {
    if (!image) {
      setMessage("This listing does not have a photo to share.");
      return;
    }

    try {
      const response = await fetch(image);
      if (!response.ok) throw new Error("The listing photo could not be downloaded.");
      const blob = await response.blob();
      const mimeType = blob.type || "image/jpeg";
      const extension = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
      const file = new File([blob], `${title.replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "") || "otulia-listing"}.${extension}`, {
        type: mimeType,
      });
      const shareData = { files: [file], title, text: shareText };

      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share(shareData);
        setMessage("Choose a social app in the share sheet to send the photo with its details and link.");
        return;
      }

      const imageUrl = URL.createObjectURL(blob);
      const download = document.createElement("a");
      download.href = imageUrl;
      download.download = file.name;
      document.body.appendChild(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
      await copyText(shareText, "Photo downloaded and listing details copied. Attach the photo when you post.");
    } catch (error) {
      if (error.name === "AbortError") return;
      setMessage("Your browser could not share the photo. Open the photo below, then copy the listing link.");
    }
  };

  const openShareWindow = (url) => window.open(url, "_blank", "noopener,noreferrer");
  const shareOptions = [
    {
      name: "WhatsApp",
      icon: whatsappIcon,
      action: () => openShareWindow(`https://wa.me/?text=${encodeURIComponent(shareText)}`),
    },
    {
      name: "Facebook",
      icon: facebookIcon,
      action: () => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listingUrl)}`),
    },
    {
      name: "Instagram",
      icon: instagramIcon,
      action: () => {
        openShareWindow("https://www.instagram.com/");
        void copyText(shareText, "Listing details copied. Use Share photo & listing to send the photo to Instagram.");
      },
    },
    {
      name: "X",
      icon: xIcon,
      action: () => openShareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(listingUrl)}`),
    },
    {
      name: "LinkedIn",
      icon: linkedInIcon,
      action: () => openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(listingUrl)}`),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-listing-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white text-gray-900 shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Otulia listing</p>
            <h2 id="share-listing-title" className="mt-1 text-xl font-semibold">Share this listing</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100" aria-label="Close share dialog">
            <IoClose size={22} />
          </button>
        </header>

        <div className="no-scrollbar max-h-[75vh] space-y-5 overflow-y-auto px-6 py-5">
          <div className="flex gap-4">
            {image && <img src={image} alt={title} className="h-20 w-28 shrink-0 rounded-lg bg-gray-100 object-cover" />}
            <div className="min-w-0">
              <h3 className="line-clamp-2 font-medium">{title}</h3>
              {location && <p className="mt-1 line-clamp-1 text-sm text-gray-500">{location}</p>}
              <p className="mt-1 text-sm font-medium text-gray-700">{price}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={shareImageToApp}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gray-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <IoShareSocialOutline className="h-5 w-5" />
            Share photo &amp; listing
          </button>
          <p className="-mt-3 text-xs leading-5 text-gray-500">
            Opens your device’s share sheet with the listing photo, details, and link. If unsupported, the photo downloads and the details are copied for you.
          </p>

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">Share the listing link</p>
            <div className="grid grid-cols-5 gap-2">
              {shareOptions.map(({ name, icon, action }) => (
                <button
                  key={name}
                  type="button"
                  onClick={action}
                  className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-gray-100 px-2 py-3 transition hover:border-gray-300 hover:bg-gray-50"
                  aria-label={`Share on ${name}`}
                >
                  <img src={icon} alt="" className="h-7 w-7 object-contain" />
                  <span className="text-xs text-gray-600">{name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="share-listing-url" className="mb-2 block text-sm font-semibold text-gray-700">Sharable link</label>
            <div className="flex gap-2">
              <input
                id="share-listing-url"
                readOnly
                value={listingUrl}
                onFocus={(event) => event.target.select()}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none"
              />
              <button
                type="button"
                onClick={() => copyText(listingUrl, "Listing link copied.")}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition hover:bg-gray-50"
              >
                {copied ? <IoCheckmark size={17} /> : <IoCopyOutline size={17} />}
                <span className="hidden sm:inline">Copy</span>
              </button>
            </div>
            {image && (
              <a href={image} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 underline underline-offset-2 hover:text-gray-800">
                Open listing photo <IoOpenOutline />
              </a>
            )}
          </div>

          {message && <p role="status" className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">{message}</p>}
        </div>
      </section>
    </div>
  );
};

export default ShareListingModal;
