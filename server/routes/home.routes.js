const express = require("express");
const Listing = require("../models/Listing.model");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const YachtAsset = require("../models/YachtAsset.model");
const UserActivity = require("../models/UserActivity.model");

const router = express.Router();


/**
 * FEATURED LISTINGS
 * Logic: isFeatured = true
 */

router.get("/featured", async (req, res) => {
  try {
    const listings = await Listing.find({ isFeatured: true })
      .limit(6)
      .select("title images price category location agent isPriceOnRequest type keySpecifications")
      .lean();

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
        CarAsset.find({ status: 'Active' }).sort({ popularity: -1 }).limit(limit).lean(),
        EstateAsset.find({ status: 'Active' }).sort({ popularity: -1 }).limit(limit).lean(),
        BikeAsset.find({ status: 'Active' }).sort({ popularity: -1 }).limit(limit).lean(),
        YachtAsset.find({ status: 'Active' }).sort({ popularity: -1 }).limit(limit).lean(),
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
 * TRENDING LISTINGS
 * Logic: Most views (VIEW) from UserActivity in the last 3 days
 */
router.get("/trending", async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    
    // Aggregate views from the last 3 days
    const trendingActivities = await UserActivity.aggregate([
      {
        $match: {
          activityType: "VIEW",
          createdAt: { $gte: threeDaysAgo }
        }
      },
      {
        $group: {
          _id: { assetId: "$assetId", assetModel: "$assetModel" },
          viewCount: { $sum: 1 }
        }
      },
      {
        $sort: { viewCount: -1 }
      },
      {
        $limit: 15
      }
    ]);

    let trendingAssets = [];

    if (trendingActivities.length > 0) {
      const modelIdMap = {
        CarAsset: [],
        BikeAsset: [],
        YachtAsset: [],
        EstateAsset: [],
      };

      for (const item of trendingActivities) {
        const modelKey = item._id.assetModel;
        if (modelIdMap[modelKey]) {
          modelIdMap[modelKey].push(item._id.assetId);
        }
      }

      const [cars, bikes, yachts, estates] = await Promise.all([
        modelIdMap.CarAsset.length
          ? CarAsset.find({ _id: { $in: modelIdMap.CarAsset } })
              .select("title images price category location agent isTrending status isPriceOnRequest type keySpecifications")
              .lean()
          : [],
        modelIdMap.BikeAsset.length
          ? BikeAsset.find({ _id: { $in: modelIdMap.BikeAsset } })
              .select("title images price category location agent isTrending status isPriceOnRequest type keySpecifications")
              .lean()
          : [],
        modelIdMap.YachtAsset.length
          ? YachtAsset.find({ _id: { $in: modelIdMap.YachtAsset } })
              .select("title images price category location agent isTrending status isPriceOnRequest type keySpecifications")
              .lean()
          : [],
        modelIdMap.EstateAsset.length
          ? EstateAsset.find({ _id: { $in: modelIdMap.EstateAsset } })
              .select("title images price category location agent isTrending status isPriceOnRequest type keySpecifications")
              .lean()
          : [],
      ]);

      const assetById = new Map();
      [...cars, ...bikes, ...yachts, ...estates].forEach((asset) => {
        if (asset && asset.status === 'Active') {
          assetById.set(asset._id.toString(), asset);
        }
      });

      for (const item of trendingActivities) {
        const asset = assetById.get(item._id.assetId.toString());
        if (asset) {
          trendingAssets.push(asset);
        }
      }
    }

    // Fallback: If no activity in last 3 days, use total views or marked trending
    if (trendingAssets.length < 5) {
     

      const [cars, bikes, yachts, estates] = await Promise.all([
        CarAsset.find({ status: 'Active' }).sort({ views: -1, isTrending: -1 }).limit(5).lean(),
        BikeAsset.find({ status: 'Active' }).sort({ views: -1, isTrending: -1 }).limit(5).lean(),
        YachtAsset.find({ status: 'Active' }).sort({ views: -1, isTrending: -1 }).limit(5).lean(),
        EstateAsset.find({ status: 'Active' }).sort({ views: -1, isTrending: -1 }).limit(5).lean(),
      ]);

      const fallbackAssets = [...cars, ...bikes, ...yachts, ...estates];

      // Merge unique assets
      const existingIds = new Set(trendingAssets.map(a => a._id.toString()));
      for (const asset of fallbackAssets) {
        if (!existingIds.has(asset._id.toString()) && trendingAssets.length < 15) {
          trendingAssets.push(asset);
          existingIds.add(asset._id.toString());
        }
      }
    }

   
    res.json(trendingAssets);

  } catch (error) {
    console.error("Trending Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch trending assets" });
  }
});
module.exports = router;