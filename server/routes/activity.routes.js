const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/User.model");
const UserActivity = require("../models/UserActivity.model");
const router = express.Router();

/**
 * OPTIONAL AUTH HELPER
 */
const getUserIdFromHeader = async (header) => {
    if (!header || !header.startsWith("Bearer ")) return null;
    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (e) {
        return null;
    }
};

/**
 * RECORD ACTIVITY
 * POST /api/activity/record
 */
router.post("/record", async (req, res) => {
    try {
        const { assetId, assetModel, activityType, metadata } = req.body;
        
        // Use optional auth for VIEW, required for others if needed
        const userId = await getUserIdFromHeader(req.headers.authorization);

        const activity = new UserActivity({
            userId, // Can be null for anonymous views
            assetId,
            assetModel,
            activityType,
            metadata,
        });

        await activity.save();

        res.status(201).json({ message: "ACTIVITY_RECORDED", activity });
    } catch (error) {
        console.error("Activity Record Error:", error);
        res.status(500).json({ error: "FAILED_TO_RECORD_ACTIVITY" });
    }
});

/**
 * GET USER ACTIVITY
 * GET /api/activity/me
 */
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const activities = await UserActivity.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: "FAILED_TO_FETCH_ACTIVITY" });
    }
});

module.exports = router;
