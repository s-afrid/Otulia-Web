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
  const [photoData, setPhotoData] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(Boolean(image));
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

  useEffect(() => {
    if (!image) {
      setPhotoLoading(false);
      return undefined;
    }
    let isCurrent = true;
    setPhotoLoading(true);

    const loadPhoto = async () => {
      try {
        const response = await fetch(image);
        if (!response.ok) throw new Error("Photo download failed");
        const downloadBlob = await response.blob();
        let clipboardBlob = null;

        if (typeof createImageBitmap === "function") {
          const bitmap = await createImageBitmap(downloadBlob);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          canvas.getContext("2d").drawImage(bitmap, 0, 0);
          bitmap.close();
          clipboardBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        }

        if (isCurrent) setPhotoData({ downloadBlob, clipboardBlob });
      } catch {
        if (isCurrent) setPhotoData({ downloadBlob: null, clipboardBlob: null });
      } finally {
        if (isCurrent) setPhotoLoading(false);
      }
    };

    void loadPhoto();
    return () => {
      isCurrent = false;
    };
  }, [image]);

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

  const prepareBrowserShare = async (platform = "your post", useNativeShare = true) => {
    const blob = photoData?.downloadBlob;
    if (useNativeShare && blob && navigator.share && window.File) {
      const mimeType = blob.type || "image/jpeg";
      const extension = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
      const filename = `${title.replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "") || "otulia-listing"}.${extension}`;
      const file = new File([blob], filename, { type: mimeType });
      const sharePayload = { files: [file], title, text: shareText };

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share(sharePayload);
          setMessage(`Listing photo and details shared. Choose ${platform} in your device's share sheet if it is available.`);
          return;
        } catch (error) {
          if (error?.name === "AbortError") return;
          // Some browsers advertise file sharing but reject it at runtime; use the clipboard fallback below.
        }
      }
    }

    let clipboardPromise = null;
    try {
      if (photoData?.clipboardBlob && navigator.clipboard?.write && window.ClipboardItem) {
        clipboardPromise = navigator.clipboard.write([
          new ClipboardItem({
            "image/png": photoData.clipboardBlob,
            "text/plain": new Blob([shareText], { type: "text/plain" }),
          }),
        ]);
      }
    } catch {
      clipboardPromise = null;
    }

    let photoCopied = false;
    let detailsCopied = false;
    try {
      if (clipboardPromise) {
        await clipboardPromise;
        photoCopied = true;
        detailsCopied = true;
      } else {
        await navigator.clipboard.writeText(shareText);
        detailsCopied = true;
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareText);
        detailsCopied = true;
      } catch {
        // The platform composer still opens; the listing details remain visible in the modal.
      }
    }

    if (photoCopied) {
      setMessage(`Photo and listing details copied. Paste with Ctrl+V in ${platform}'s browser composer.`);
    } else if (detailsCopied) {
      setMessage(`Listing details copied. This browser cannot share the photo directly here; use the main Share photo & listing button on a device that supports photo sharing.`);
    } else {
      setMessage(`This browser could not copy the listing details or share the photo. Try the main Share photo & listing button on a device that supports photo sharing.`);
    }
  };

  const openBrowserShare = (platform, url) => {
    const tab = window.open(url, "_blank");
    if (!tab) {
      setMessage("Your browser blocked the new tab. Allow pop-ups for Otulia, then choose the platform again.");
      return;
    }
    tab.opener = null;
    void prepareBrowserShare(platform, false);
  };

  const shareOptions = [
    { name: "WhatsApp", icon: whatsappIcon, url: `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}` },
    { name: "Facebook", icon: facebookIcon, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listingUrl)}` },
    { name: "Instagram", icon: instagramIcon, url: "https://www.instagram.com/" },
    { name: "X", icon: xIcon, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(listingUrl)}` },
    { name: "LinkedIn", icon: linkedInIcon, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(listingUrl)}` },
  ];

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/55 p-2 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-listing-title"
        className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white text-gray-900 shadow-2xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)]"
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

        <div className="no-scrollbar min-h-0 space-y-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
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
            onClick={() => void prepareBrowserShare()}
            disabled={photoLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gray-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60"
          >
            <IoShareSocialOutline className="h-5 w-5" />
            {photoLoading ? "Preparing listing photo…" : "Share photo & listing"}
          </button>
          <p className="-mt-3 text-xs leading-5 text-gray-500">
            Shares the photo and listing details through your browser or device share sheet when supported. Otherwise, copy the photo and details, then paste them into the platform composer.
          </p>

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">Open a platform to share</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {shareOptions.map(({ name, icon, url }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => openBrowserShare(name, url)}
                  disabled={photoLoading}
                  className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-gray-100 px-2 py-3 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-50"
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
