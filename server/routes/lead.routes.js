const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead.model");
const User = require("../models/User.model");
const authMiddleware = require("../middleware/auth.middleware");
const nodemailer = require("nodemailer");

// Email Transporter (Support for Hostinger/Custom SMTP)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: parseInt(process.env.EMAIL_PORT) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * SEND LEAD
 */
router.post("/send", authMiddleware, async (req, res) => {
    try {
        const { agentId, assetId, assetModel, assetTitle, message, agentEmail, agentName } = req.body;

        const lead = new Lead({
            sender: req.user.id,
            agentId,
            assetId,
            assetModel,
            assetTitle,
            message,
        });

        await lead.save();

        await User.findByIdAndUpdate(agentId, {
            $push: {
                notifications: {
                    type: "LEAD",
                    message: `New lead for your ${assetModel.replace('Asset', '')}: ${assetTitle}`,
                    targetTab: "leads",
                    assetId,
                    assetTitle,
                    assetModel,
                    leadId: lead._id
                }
            }
        });

        // Email logic simplified for brevity
        res.status(201).json({ message: "LEAD_SENT_SUCCESSFULLY", lead });
    } catch (error) {
        console.error("Lead Error:", error);
        res.status(500).json({ error: "FAILED_TO_SEND_LEAD" });
    }
});

/**
 * ADD MANUAL LEAD
 */
router.post("/manual", authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, source, assetId, assetModel, assetTitle, assetPrice, assetImage, message, status } = req.body;

        const lead = new Lead({
            name, email, phone, source, agentId: req.user.id, assetId, assetModel, assetTitle, assetPrice, assetImage, message, status: status || 'New'
        });

        await lead.save();
        res.status(201).json({ message: "MANUAL_LEAD_ADDED", lead });
    } catch (error) {
        console.error("Manual Lead Error:", error);
        res.status(500).json({ error: "FAILED_TO_ADD_MANUAL_LEAD" });
    }
});

/**
 * REMOVE NOTIFICATION
 */
router.delete("/notification/:id", authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { notifications: { _id: req.params.id } }
        });
        res.json({ message: "NOTIFICATION_REMOVED" });
    } catch (error) {
        res.status(500).json({ error: "FAILED_TO_REMOVE_NOTIFICATION" });
    }
});

/**
 * GET AGENT LEADS
 */
router.get("/agent", authMiddleware, async (req, res) => {
    try {
        const leads = await Lead.find({ agentId: req.user.id })
            .populate("sender", "name email profilePicture")
            .sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: "FAILED_TO_FETCH_LEADS" });
    }
});

/**
 * UPDATE LEAD STATUS
 */
router.put("/status/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, isActivity } = req.body;

        if (isActivity) {
            const UserActivity = require("../models/UserActivity.model");
            const activity = await UserActivity.findByIdAndUpdate(id, { status }, { new: true });
            return res.json({ message: "STATUS_UPDATED", activity });
        } else {
            const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
            return res.json({ message: "STATUS_UPDATED", lead });
        }
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ error: "FAILED_TO_UPDATE_STATUS" });
    }
});

module.exports = router;
