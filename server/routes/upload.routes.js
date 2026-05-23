// server/routes/upload.js
const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); // Import from step 3
const authMiddleware = require('../middleware/auth.middleware');

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

module.exports = router;