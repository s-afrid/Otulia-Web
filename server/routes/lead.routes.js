const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead.model");
const authMiddleware = require("../middleware/auth.middleware");
const nodemailer = require("nodemailer");

// Email Transporter (Placeholder - Update with real SMTP credentials in .env)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * SEND LEAD
 * POST /api/leads/send
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

        // Send Email to Agent
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: agentEmail,
            subject: `New Lead for ${assetTitle}`,
            text: `Hi ${agentName},

You have received a new lead for your asset "${assetTitle}".

Message: ${message}

Check your inventory for more details.`,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Email Error:", error);
                } else {
                    console.log("Email sent:", info.response);
                }
            });
        } else {
            console.log("Email not sent: SMTP credentials not configured in .env");
        }

        res.status(201).json({ message: "LEAD_SENT_SUCCESSFULLY", lead });
    } catch (error) {
        console.error("Lead Error:", error);
        res.status(500).json({ error: "FAILED_TO_SEND_LEAD" });
    }
});

/**
 * GET AGENT LEADS
 * GET /api/leads/agent
 */
router.get("/agent", authMiddleware, async (req, res) => {
    try {
        const leads = await Lead.find({ agentId: req.user.id })
            .populate("sender", "name email")
            .sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: "FAILED_TO_FETCH_LEADS" });
    }
});

module.exports = router;
