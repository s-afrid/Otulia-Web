// server/routes/upload.js
const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary'); // Import from step 3
const authMiddleware = require('../middleware/auth.middleware');

// Helper to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return null;
    try {
        const uploadSplit = url.split('/upload/');
        if (uploadSplit.length < 2) return null;
        
        const afterUpload = uploadSplit[1];
        const parts = afterUpload.split('/');
        
        const relevantParts = parts.filter(part => {
            if (part.includes(',') || part.includes('_')) return false;
            if (/^v\d+$/.test(part)) return false;
            return true;
        });
        
        const fullPublicId = relevantParts.join('/');
        const dotIndex = fullPublicId.lastIndexOf('.');
        if (dotIndex !== -1) {
            return fullPublicId.substring(0, dotIndex);
        }
        return fullPublicId;
    } catch (err) {
        console.error("Error parsing Cloudinary URL in upload.routes:", err);
        return null;
    }
};

// Middleware to delete old image if replaced
const deleteOldImageMiddleware = async (req, res, next) => {
    const { oldUrl } = req.query;
    if (oldUrl) {
        const publicId = getPublicIdFromUrl(oldUrl);
        if (publicId) {
            cloudinary.uploader.destroy(publicId)
                .then(result => console.log(`[Cloudinary] Successfully deleted old image ${publicId}:`, result))
                .catch(err => console.error(`[Cloudinary] Failed to delete old image ${publicId}:`, err));
        }
    }
    next();
};

function sendFileResponse(req, res) {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

  // Multer-storage-cloudinary may populate different properties depending on version.
  const url = req.file?.path || req.file?.secure_url || req.file?.url || req.file?.location || null;
  const public_id = req.file?.filename || req.file?.public_id || null;
  const format = req.file?.format || null;

  const payload = {
    success: true,
    url,
    public_id,
    format
  };

  // Attach full file object for debugging in non-production
  if (process.env.NODE_ENV !== 'production') payload.file = req.file;

  return res.json(payload);
}

// Generic upload (legacy) - accepts form key 'file'
router.post('/', upload.single('file'), sendFileResponse);

// Profile picture upload (frontend posts to /api/upload/profile-picture with field 'image')
router.post('/profile-picture', authMiddleware, upload.single('image'), sendFileResponse);

// Showroom logo upload
router.post('/showroom-logo', authMiddleware, upload.single('image'), sendFileResponse);

// Showroom cover upload
router.post('/showroom-cover', authMiddleware, upload.single('image'), sendFileResponse);

// Category cover upload
router.post('/category-cover', authMiddleware, deleteOldImageMiddleware, upload.single('image'), sendFileResponse);

// Category banner upload
router.post('/category-banner', authMiddleware, deleteOldImageMiddleware, upload.single('image'), sendFileResponse);

// Nominee image upload
router.post('/nominee-image', authMiddleware, deleteOldImageMiddleware, upload.single('image'), sendFileResponse);

module.exports = router;