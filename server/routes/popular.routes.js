const express = require("express");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const YachtAsset = require("../models/YachtAsset.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = 10;
    const [carAssets, estateAssets, bikeAssets, yachtAssets] =
      await Promise.all([
        CarAsset.find().sort({ popularity: -1 }).limit(limit).lean(),
        EstateAsset.find().sort({ popularity: -1 }).limit(limit).lean(),
        BikeAsset.find().sort({ popularity: -1 }).limit(limit).lean(),
        YachtAsset.find().sort({ popularity: -1 }).limit(limit).lean(),
      ]);

    const combinedAssets = [
      ...carAssets,
      ...estateAssets,
      ...bikeAssets,
      ...yachtAssets,
    ];

    const popularAssets = combinedAssets
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10);

    res.json(popularAssets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch popular assets" });
  }
});

module.exports = router;
