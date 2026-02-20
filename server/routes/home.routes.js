const express = require("express");
const Listing = require("../models/Listing.model");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const YachtAsset = require("../models/YachtAsset.model");

const router = express.Router();


/**
 * FEATURED LISTINGS
 * Logic: isFeatured = true AND featuredExpiresAt > now (or null)
 * Premium Basic: 5 days featured
 * Business VIP: 13 days featured
 */

router.get("/featured", async (req, res) => {
  try {
    const now = new Date();
    
    // Query condition: isFeatured = true AND (featuredExpiresAt is null OR featuredExpiresAt > now)
    const featuredQuery = {
      isFeatured: true,
      $or: [
        { featuredExpiresAt: null },
        { featuredExpiresAt: { $gt: now } }
      ]
    };

    // Fetch from all collections
    const [listings, carAssets, estateAssets, bikeAssets, yachtAssets] = await Promise.all([
      Listing.find(featuredQuery).limit(6).select("title images price category location dealer"),
      CarAsset.find(featuredQuery).limit(6).select("title images price category location agent"),
      EstateAsset.find(featuredQuery).limit(6).select("title images price category location agent"),
      BikeAsset.find(featuredQuery).limit(6).select("title images price category location agent"),
      YachtAsset.find(featuredQuery).limit(6).select("title images price category location agent"),
    ]);

    // Combine all featured items
    const allFeatured = [
      ...listings.map(item => ({ ...item.toObject(), model: 'Listing' })),
      ...carAssets.map(item => ({ ...item.toObject(), model: 'CarAsset' })),
      ...estateAssets.map(item => ({ ...item.toObject(), model: 'EstateAsset' })),
      ...bikeAssets.map(item => ({ ...item.toObject(), model: 'BikeAsset' })),
      ...yachtAssets.map(item => ({ ...item.toObject(), model: 'YachtAsset' })),
    ];

    // Limit to 6 total
    const limitedFeatured = allFeatured.slice(0, 6);

    res.json(limitedFeatured);

  } catch (error) {
    console.error("Featured listings error:", error);
    res.status(500).json({ message: "Failed to fetch featured listings" });
  }
});


/**
 * POPULAR LISTINGS
 * Logic: highest bookings
 */

router.get("/popularity", async (req, res) => {
  try {
    const [carAssets, estateAssets, bikeAssets, yachtAssets] =
      await Promise.all([
        CarAsset.find(),
        EstateAsset.find(),
        BikeAsset.find(),
        YachtAsset.find(),
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
    let [carAssets, estateAssets, bikeAssets, yachtAssets] =
      await Promise.all([
        CarAsset.find({ isTrending: true }).limit(5),
        EstateAsset.find({ isTrending: true }).limit(5),
        BikeAsset.find({ isTrending: true }).limit(5),
        YachtAsset.find({ isTrending: true }).limit(5),
      ]);

    const totalTrending = carAssets.length + estateAssets.length + bikeAssets.length + yachtAssets.length;

    if (totalTrending === 0) {
      // Fallback: Fetch latest items if no trending items exist
      [carAssets, estateAssets, bikeAssets, yachtAssets] =
        await Promise.all([
          CarAsset.find().sort({ createdAt: -1 }).limit(5),
          EstateAsset.find().sort({ createdAt: -1 }).limit(5),
          BikeAsset.find().sort({ createdAt: -1 }).limit(5),
          YachtAsset.find().sort({ createdAt: -1 }).limit(5),
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