const authMiddleware = require("../middleware/auth.middleware");

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { OAuth2Client } = require("google-auth-library");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

/**
 * GOOGLE LOGIN
 */
router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "TOKEN_REQUIRED" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({
      $or: [{ email }, { googleId }]
    });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
      });
    } else {
      // Link googleId to existing email user and update profile picture only if not already set
      user.googleId = user.googleId || googleId;
      if (!user.profilePicture) {
        user.profilePicture = picture;
      }
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        profilePicture: user.profilePicture
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({
      error: "GOOGLE_LOGIN_FAILED",
    });
  }
});

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "ALL_FIELDS_REQUIRED",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "EMAIL_ALREADY_EXISTS",
      });
    }

    // 'Salt' adds random characters to the password before hashing to prevent hacking
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        profilePicture: user.profilePicture
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "REGISTER_FAILED",
    });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "ALL_FIELDS_REQUIRED",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        profilePicture: user.profilePicture
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "LOGIN_FAILED",
    });
  }
});

/**
 * GET CURRENT USER
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("rentedHistory.item")
      .populate("boughtHistory.item");

    if (!user) {
      return res.status(404).json({
        error: "USER_NOT_FOUND",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: "FETCH_USER_FAILED",
    });
  }
});

/**
 * TOGGLE FAVORITE
 */
router.post("/toggle-favorite", authMiddleware, async (req, res) => {
  try {
    const { assetId, assetModel } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    const existingIndex = user.favorites.findIndex(
      (fav) => fav.assetId && fav.assetId.toString() === assetId
    );

    let action;
    if (existingIndex > -1) {
      // Remove
      user.favorites.splice(existingIndex, 1);
      action = 'removed';
    } else {
      // Add
      user.favorites.push({ assetId, assetModel });
      action = 'added';
    }

    await user.save();
    res.json({ action, favorites: user.favorites });
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    res.status(500).json({ error: "TOGGLE_FAILED" });
  }
});

/**
 * GET MY LISTINGS
 */
router.get("/my-listings", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("myListings.item");
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    // Transform to flat array of items
    const listings = user.myListings
      .filter(entry => entry.item) // Filter out nulls if any
      .map(entry => {
        const item = entry.item.toObject();
        return {
          ...item,
          category: entry.itemModel // Ensure category is available for UI logic if needed
        };
      });

    res.json(listings);
  } catch (err) {
    console.error("Fetch My Listings Error:", err);
    res.status(500).json({ error: "FETCH_LISTINGS_FAILED" });
  }
});

/**
 * GET FAVORITES
 */
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites.assetId");
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    const favorites = user.favorites
      .filter(entry => entry.assetId) // Filter out nulls
      .map(entry => {
        const item = entry.assetId.toObject();
        return {
          ...item,
          category: entry.assetModel // Ensure category is available
        };
      });

    res.json(favorites);
  } catch (err) {
    console.error("Fetch Favorites Error:", err);
    res.status(500).json({ error: "FETCH_FAVORITES_FAILED" });
  }
});

/**
 * UPGRADE PLAN
 */
router.post("/upgrade-plan", authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    const validPlans = ["Freemium", "Premium Basic", "Business VIP"];

    if (!validPlans.includes(plan)) {
      return res.status(400).json({ error: "INVALID_PLAN" });
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { plan, planExpiresAt: expiryDate },
      { new: true }
    ).select("-password");

    res.json({ message: "PLAN_UPGRADED_SUCCESSFULLY", user });
  } catch (err) {
    res.status(500).json({ error: "UPGRADE_FAILED" });
  }
});

/**
 * UPDATE PROFILE
 */
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, profilePicture },
      { new: true }
    ).select("-password");

    res.json({ message: "PROFILE_UPDATED_SUCCESSFULLY", user });
  } catch (err) {
    res.status(500).json({ error: "UPDATE_FAILED" });
  }
});

/**
 * SUBMIT VERIFICATION DOCUMENTS
 */

const profilePicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: `users/${req.user.email}`,
      public_id: `profile_pic_${Date.now()}`,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const uploadProfilePic = multer({ storage: profilePicStorage });

router.post("/upload-profile-picture", authMiddleware, uploadProfilePic.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE_UPLOADED" });
    }

    // Delete old profile picture from Cloudinary
    const currentUser = await User.findById(req.user.id);
    if (currentUser.profilePicturePublicId) {
      cloudinary.uploader.destroy(currentUser.profilePicturePublicId, (error, result) => {
        if (error) {
          console.error("Failed to delete old profile picture from Cloudinary:", error);
        }
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        profilePicture: req.file.path,
        profilePicturePublicId: req.file.filename 
      },
      { new: true }
    ).select("-password");

    res.json({ message: "PROFILE_PICTURE_UPDATED_SUCCESSFULLY", user });
  } catch (err) {
    console.error("Profile Picture Upload Error:", err);
    res.status(500).json({ error: "UPLOAD_FAILED" });
  }
});

const verificationStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check if user is authenticated and has an email
    if (!req.user || !req.user.email) {
      // This will prevent multer from processing the file and trigger an error
      throw new Error('User authentication is required to upload verification documents.');
    }

    // For PDFs, we should use 'raw' resource type to prevent transformation and delivery issues.
    // For other file types like images, 'image' is appropriate.
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
    
    return {
      folder: `verification/${req.user.email}`,
      public_id: `${file.fieldname}-${Date.now()}`,
      resource_type: isPdf ? 'raw' : 'image',
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    };
  },
});

const uploadVerification = multer({ storage: verificationStorage });

const clearVerificationFolder = async (req, res, next) => {
  if (req.user && req.user.email) {
    const folder = `verification/${req.user.email}`;
    try {
      // We need to delete both image and raw files (for PDFs)
      await Promise.all([
        cloudinary.api.delete_resources_by_prefix(folder, { resource_type: 'image', invalidate: true }),
        cloudinary.api.delete_resources_by_prefix(folder, { resource_type: 'raw', invalidate: true })
      ]);
    } catch (error) {
      console.error(`Failed to clear Cloudinary folder ${folder}. This might leave orphaned files. Error:`, error);
      // We won't block the request, but this is a situation to monitor.
    }
  }
  next();
};
router.post("/submit-verification", authMiddleware, clearVerificationFolder, uploadVerification.any(), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "NO_FILES_UPLOADED" });
    }

    const verificationDocuments = {};
    files.forEach(file => {
      // For Cloudinary, 'file.filename' contains the public_id
      verificationDocuments[file.fieldname] = file.filename;
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        verificationStatus: "Pending",
        // Overwrite the documents with the new submission
        verificationDocuments: verificationDocuments
      },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("Verification Submit Error:", err);
    res.status(500).json({ error: "SUBMISSION_FAILED", details: err.message });
  }
});

module.exports = router;
