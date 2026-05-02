const express = require("express");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const YachtAsset = require("../models/YachtAsset.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [carAssets, estateAssets, bikeAssets, yachtAssets] =
      await Promise.all([
        CarAsset.find({ isTrending: true }).limit(5).lean(),
        EstateAsset.find({ isTrending: true }).limit(5).lean(),
        BikeAsset.find({ isTrending: true }).limit(5).lean(),
        YachtAsset.find({ isTrending: true }).limit(5).lean(),
      ]);

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
