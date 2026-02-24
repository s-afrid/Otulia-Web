// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { getFolderPaths } = require('./cloudinaryFolders');
const User = require('../models/User.model');
require('dotenv').config();

// 1. Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage Settings
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder based on user session from DB if available
    let userEmail = null;
    if (req.user && req.user.id) {
        const user = await User.findById(req.user.id);
        if (user) userEmail = user.email;
    }
    
    const folders = getFolderPaths(userEmail);
    
    // Default to assets folder if no specific context is provided
    let folder = folders.assets;
    
    // You can add logic here to override folder based on req.path or other markers
    if (req.path.includes('verification')) {
        folder = folders.verification;
    } else if (req.path.includes('profile')) {
        folder = folders.profile;
    }

    return {
      folder: folder,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'docs', 'docx'],
    };
  },
});

// 3. Initialize Multer
const upload = multer({ storage });

module.exports = { upload, cloudinary };