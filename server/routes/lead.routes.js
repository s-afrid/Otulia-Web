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
        const { name, email, phone, phoneCode, source, assetId, assetModel, assetTitle, assetPrice, assetImage, message, status } = req.body;

        const lead = new Lead({
            name, email, phone, phoneCode, source, agentId: req.user.id, assetId, assetModel, assetTitle, assetPrice, assetImage, message, status: status || 'New'
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

/**
 * SCHEDULE MEETING (Send Email)
 */
router.post("/schedule-meeting", authMiddleware, async (req, res) => {
    try {
        const { leadId, date, time, leadName, leadEmail, assetTitle, agentName } = req.body;

        if (!leadEmail || leadEmail === 'Upgrade to VIP to view contact') {
            return res.status(400).json({ error: "VALID_EMAIL_REQUIRED" });
        }

        const mailOptions = {
            from: `"Otulia Concierge" <${process.env.EMAIL_USER}>`,
            to: leadEmail,
            subject: `Meeting Request: ${assetTitle}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px; padding: 24px; color: #333;">
                    <h2 style="color: #D48D2A; margin-top: 0;">Meeting Request</h2>
                    <p>Hello <strong>${leadName}</strong>,</p>
                    <p>I hope you are doing well. I'm reaching out regarding your interest in <strong>${assetTitle}</strong> on Otulia.</p>
                    <p>I would like to propose a meeting to discuss this further and answer any questions you may have.</p>
                    <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px; color: #666;">Proposed Schedule:</p>
                        <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: bold; color: #000;">${new Date(date).toLocaleDateString()} @ ${time}</p>
                    </div>
                    <p>Are you available at this time? If not, please let me know a time that works better for you.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                    <p style="margin-bottom: 0;">Best regards,</p>
                    <p style="margin-top: 4px; font-weight: bold;">${agentName}</p>
                    <p style="font-size: 12px; color: #999;">Professional Partner | Otulia Luxury Marketplace</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "MEETING_REQUEST_SENT" });
    } catch (error) {
        console.error("Schedule Meeting Error:", error);
        res.status(500).json({ error: "FAILED_TO_SEND_MEETING_REQUEST" });
    }
});

module.exports = router;
