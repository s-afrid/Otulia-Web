const express = require("express");
const Listing = require("../models/Listing.model");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const YachtAsset = require("../models/YachtAsset.model");

const router = express.Router();


/**
 * FEATURED LISTINGS
 * Logic: isFeatured = true
 */

router.get("/featured", async (req, res) => {
  try {
    const listings = await Listing.find({ isFeatured: true })
      .limit(6)
      .select("title images price category location agent");

    res.json(listings);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured listings" });
  }
});


/**
 * POPULAR LISTINGS
 * Logic: highest bookings
 */

router.get("/popularity", async (req, res) => {
  try {
    // Fetch top 10 from each category at DB level first, then merge and pick top 10 overall
    // This is much more memory efficient than fetching ALL documents
    const limit = 10;
    const [carAssets, estateAssets, bikeAssets, yachtAssets] =
      await Promise.all([
        CarAsset.find().sort({ popularity: -1 }).limit(limit),
        EstateAsset.find().sort({ popularity: -1 }).limit(limit),
        BikeAsset.find().sort({ popularity: -1 }).limit(limit),
        YachtAsset.find().sort({ popularity: -1 }).limit(limit),
      ]);

    const combinedAssets = [
      ...carAssets,
      ...estateAssets,
      ...bikeAssets,
      ...yachtAssets,
    ];

    const popularAssets = combinedAssets
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);

    res.json(popularAssets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch popular assets" });
  }
});

/** 
 * TRENDIND LISTINGS
 * isTrending: true
 */

router.get("/trending", async (req, res) => {
  try {
    const limit = 5;
    let [carAssets, estateAssets, bikeAssets, yachtAssets] =
      await Promise.all([
        CarAsset.find({ isTrending: true }).limit(limit),
        EstateAsset.find({ isTrending: true }).limit(limit),
        BikeAsset.find({ isTrending: true }).limit(limit),
        YachtAsset.find({ isTrending: true }).limit(limit),
      ]);

    const totalTrending = carAssets.length + estateAssets.length + bikeAssets.length + yachtAssets.length;

    if (totalTrending === 0) {
      // Fallback: Fetch latest items if no trending items exist
      [carAssets, estateAssets, bikeAssets, yachtAssets] =
        await Promise.all([
          CarAsset.find().sort({ createdAt: -1 }).limit(limit),
          EstateAsset.find().sort({ createdAt: -1 }).limit(limit),
          BikeAsset.find().sort({ createdAt: -1 }).limit(limit),
          YachtAsset.find().sort({ createdAt: -1 }).limit(limit),
        ]);
    }

    const combinedAssets = [
      ...carAssets,
      ...estateAssets,
      ...bikeAssets,
      ...yachtAssets,
    ];

    res.json(combinedAssets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trending assets" });
  }
});

module.exports = router;