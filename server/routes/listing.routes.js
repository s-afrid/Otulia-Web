const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/Listing.model");
const User = require("../models/User.model");

const  router = express.Router();


/**
 * LISTING DETAIL
 * Logic:
 * 1. Listing fetch by ID
 * 2. Increase views count
 */


router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid listing ID" });
        }

        const listing = await Listing.findById(id);

        if(!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // 🔥 increase views for trending logic
        listing.views +=1;
        await listing.save();

        const listingObj = listing.toObject();
        if (listingObj.agent && listingObj.agent.id && mongoose.Types.ObjectId.isValid(listingObj.agent.id)) {
            const agentUser = await User.findById(listingObj.agent.id);
            if (agentUser) {
                listingObj.agent.phone = agentUser.phone || listingObj.agent.phone;
                listingObj.agent.email = agentUser.email || listingObj.agent.email;
                listingObj.agent.plan = agentUser.plan || listingObj.agent.plan;
                listingObj.agent.createdAt = agentUser.createdAt || listingObj.agent.createdAt;
                if (agentUser.company) {
                    listingObj.agent.company = agentUser.company.companyName || listingObj.agent.company;
                    listingObj.agent.companyLogo = agentUser.company.companyLogo || listingObj.agent.companyLogo;
                    listingObj.agent.website = agentUser.company.website || listingObj.agent.website;
                }
            }
        }

        res.json(listingObj);
    } catch (error) {
        console.error("Listing Fetch Error:", error);
        res.status(500).json({ message: "Failed to fetch listing details" })
    }
});

module.exports = router;
