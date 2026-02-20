const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/Listing.model");

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

        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch listing details" })
    }
});

module.exports = router;
