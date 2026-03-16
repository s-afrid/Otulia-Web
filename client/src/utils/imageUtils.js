/**
 * Optimizes a Cloudinary URL by injecting auto-format and auto-quality transformations.
 * f_auto: Automatically serves WebP, AVIF, or the best format for the browser.
 * q_auto: Automatically compresses the image while maintaining visual quality.
 * 
 * @param {string} originalUrl - The raw image URL.
 * @param {number} width - Optional width for resizing.
 * @param {number} height - Optional height for resizing.
 * @returns {string} - The optimized URL.
 */
export const optimizeCloudinaryUrl = (originalUrl, width = null, height = null) => {
  if (!originalUrl || typeof originalUrl !== 'string') return originalUrl;
  
  // If the URL isn't from Cloudinary, just return it safely
  if (!originalUrl.includes('cloudinary.com')) return originalUrl;

  // Base compression: Force WebP format for optimal performance and set quality to 'good' (or 'best') to preserve details.
  let transforms = "f_webp,q_auto:good";

  // If you pass dimensions, add them to shrink the physical file size
  if (width) transforms += `,w_${width}`;
  if (height) transforms += `,h_${height}`;
  
  // If we are resizing, crop it nicely so it doesn't stretch
  if (width || height) transforms += ",c_fill"; 

  // Inject our parameters right after the "/upload/" part of the URL
  // We use replace to find the FIRST occurrence of /upload/
  return originalUrl.replace('/upload/', `/upload/${transforms}/`);
};
