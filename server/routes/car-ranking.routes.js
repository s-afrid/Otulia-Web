const express = require("express");
const mongoose = require("mongoose");
const CarAsset = require("../models/CarAsset.model");
const Lead = require("../models/Lead.model");
const UserActivity = require("../models/UserActivity.model");
const CarRankingProfile = require("../models/CarRankingProfile.model");
const CarRankingSnapshot = require("../models/CarRankingSnapshot.model");

const router = express.Router();

const INQUIRY_ACTIVITY_TYPES = ["INQUIRY", "CALL_AGENT", "BUY_REQUEST", "RENT_REQUEST"];

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const applyRankingFilters = (queryParams = {}) => {
  const query = {};
  const andClauses = [];
  const textMatch = (paths, value) => ({
    $or: paths.map((path) => ({ [path]: { $regex: new RegExp(escapeRegex(value), "i") } })),
  });
  const {
    brand,
    model,
    variant,
    minPrice,
    maxPrice,
    location,
    year,
    category,
    type,
    acquisition,
    status,
    country,
    fuel,
    transmission,
    body,
    usageStatus,
    condition,
    steering,
    drive,
    exteriorColor,
    interiorColor,
    company,
    minOwners,
    maxOwners,
    isPriceOnRequest,
    preset,
    segment,
    search,
    q,
  } = queryParams;

  if (brand) {
    andClauses.push(textMatch(["filterFields.brand", "carData.brand"], brand));
  }
  if (model) {
    andClauses.push(textMatch(["filterFields.model", "carData.specification.model", "carData.variant"], model));
  }
  if (variant) {
    andClauses.push(textMatch(["filterFields.variant", "carData.variant", "carData.specification.variant"], variant));
  }
  if (year) query["filterFields.yearOfConstruction"] = String(year);
  if (location) {
    andClauses.push(textMatch(["filterFields.location", "carData.location", "carData.specification.carLocation"], location));
  }
  if (category) query["filterFields.category"] = String(category);
  if (type) query["filterFields.type"] = String(type);
  if (acquisition) query["filterFields.acquisition"] = String(acquisition);
  if (status) query["filterFields.status"] = String(status);
  if (country) query["filterFields.countryOfFirstDelivery"] = String(country);
  if (fuel) {
    andClauses.push(textMatch(["filterFields.fuel", "carData.specification.fuel"], fuel));
  }
  if (transmission) {
    andClauses.push(textMatch(["filterFields.transmission", "carData.specification.transmission"], transmission));
  }
  if (body) {
    andClauses.push(textMatch(["filterFields.body", "carData.specification.body"], body));
  }
  if (usageStatus) {
    andClauses.push(textMatch(["filterFields.usageStatus", "carData.specification.usageStatus"], usageStatus));
  }
  if (condition) {
    andClauses.push(textMatch(["filterFields.condition", "carData.specification.condition"], condition));
  }
  if (steering) {
    andClauses.push(textMatch(["filterFields.steering", "carData.specification.steering"], steering));
  }
  if (drive) {
    andClauses.push(textMatch(["filterFields.drive", "carData.specification.drive"], drive));
  }
  if (exteriorColor) {
    andClauses.push(textMatch(["filterFields.exteriorColor", "carData.specification.exteriorColor"], exteriorColor));
  }
  if (interiorColor) {
    andClauses.push(textMatch(["filterFields.interiorColor", "carData.specification.interiorColor"], interiorColor));
  }
  if (company) {
    andClauses.push(textMatch(["filterFields.company", "carData.agent.company"], company));
  }
  if (isPriceOnRequest !== undefined) {
    const normalized = String(isPriceOnRequest).toLowerCase();
    if (normalized === "true" || normalized === "false") {
      query["filterFields.isPriceOnRequest"] = normalized === "true";
    }
  }
  if (minPrice || maxPrice) {
    query["filterFields.price"] = {};
    if (minPrice) query["filterFields.price"].$gte = Number(minPrice);
    if (maxPrice) query["filterFields.price"].$lte = Number(maxPrice);
  }
  if (minOwners || maxOwners) {
    query["filterFields.numberOfOwners"] = {};
    if (minOwners) query["filterFields.numberOfOwners"].$gte = Number(minOwners);
    if (maxOwners) query["filterFields.numberOfOwners"].$lte = Number(maxOwners);
  }

  const presetKey = String(preset || segment || "").trim().toLowerCase();
  const searchText = String(search || q || "").trim();

  if (presetKey === "hypercar" || presetKey === "best-hypercar" || presetKey === "besthypercar") {
    andClauses.push({
      $or: [
      { "filterFields.body": { $regex: /hypercar|supercar|sports car|performance/i } },
      { "filterFields.category": { $regex: /luxury|performance|premium/i } },
      { "carData.title": { $regex: /hypercar|supercar|sports car|performance/i } },
      { "carData.description": { $regex: /hypercar|supercar|sports car|performance/i } },
      { "carData.keywords": { $regex: /hypercar|supercar|sports car|performance/i } },
      ],
    });
  }

  if (presetKey === "luxury-suv" || presetKey === "luxurysuv" || presetKey === "best-luxury-suv") {
    andClauses.push({
      $or: [
      { "filterFields.body": { $regex: /suv|xuv|crossover/i } },
      { "filterFields.category": { $regex: /luxury|premium/i } },
      { "carData.title": { $regex: /suv|xuv|crossover/i } },
      { "carData.description": { $regex: /suv|xuv|crossover/i } },
      { "carData.keywords": { $regex: /suv|xuv|crossover/i } },
      ],
    });
  }

  if (presetKey === "electric" || presetKey === "electric-car" || presetKey === "best-electric" || presetKey === "best-electric-cars") {
    andClauses.push(textMatch(["filterFields.fuel", "carData.specification.fuel", "carData.keySpecifications.engineType"], "electric"));
  }

  if (searchText) {
    const searchRegex = new RegExp(escapeRegex(searchText), "i");
    andClauses.push({
      $or: [
      { "carData.title": { $regex: searchRegex } },
      { "carData.description": { $regex: searchRegex } },
      { "carData.brand": { $regex: searchRegex } },
      { "carData.variant": { $regex: searchRegex } },
      { "carData.keywords": { $regex: searchRegex } },
      { "filterFields.brand": { $regex: searchRegex } },
      { "filterFields.model": { $regex: searchRegex } },
      { "filterFields.variant": { $regex: searchRegex } },
      ],
    });
  }

  if (andClauses.length > 0) {
    query.$and = andClauses;
  }

  return query;
};

const safeLogScore = (value, weight) => {
  const v = Number(value) || 0;
  return Math.log10(v + 1) * (Number(weight) || 0);
};

const calculateCompletenessRatio = (car) => {
  const checks = [
    Boolean(car?.title),
    Boolean(car?.description),
    Number(car?.price) > 0,
    Boolean(car?.location),
    Array.isArray(car?.images) && car.images.length > 0,
    Boolean(car?.brand),
    Boolean(car?.specification?.model),
    Boolean(car?.keySpecifications?.engineType),
    Boolean(car?.keySpecifications?.power),
    Boolean(car?.keySpecifications?.topSpeed),
    Boolean(car?.videoUrl),
    Array.isArray(car?.documents) && car.documents.length > 0,
  ];

  const filled = checks.filter(Boolean).length;
  return checks.length ? filled / checks.length : 0;
};

const getActiveProfile = async () => {
  return CarRankingProfile.findOne({ isActive: true }).sort({ updatedAt: -1 });
};

const buildRanking = async (customWindowDays) => {
  const profile = await getActiveProfile();
  if (!profile) {
    throw new Error("No active car ranking profile found. Please create/update profile first.");
  }
  const windowDays = Number(customWindowDays) > 0 ? Number(customWindowDays) : profile.windowDays;
  const windowStart = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

  const cars = await CarAsset.find({ status: "Active" }).lean();
  if (cars.length === 0) {
    await CarRankingSnapshot.deleteMany({});
    return {
      profile,
      ranked: [],
      summary: { totalCars: 0, windowDays },
    };
  }

  const carIds = cars.map((car) => car._id);

  const [leadCounts, activityCounts] = await Promise.all([
    Lead.aggregate([
      {
        $match: {
          assetModel: "CarAsset",
          assetId: { $in: carIds },
          createdAt: { $gte: windowStart },
        },
      },
      { $group: { _id: "$assetId", count: { $sum: 1 } } },
    ]),
    UserActivity.aggregate([
      {
        $match: {
          assetModel: "CarAsset",
          assetId: { $in: carIds },
          activityType: { $in: INQUIRY_ACTIVITY_TYPES },
          createdAt: { $gte: windowStart },
        },
      },
      { $group: { _id: "$assetId", count: { $sum: 1 } } },
    ]),
  ]);

  const leadMap = new Map(leadCounts.map((x) => [String(x._id), Number(x.count) || 0]));
  const activityMap = new Map(activityCounts.map((x) => [String(x._id), Number(x.count) || 0]));

  const ranked = cars.map((car) => {
    const views = Number(car.views) || 0;
    const likes = Number(car.likes) || 0;
    const inquiries = (leadMap.get(String(car._id)) || 0) + (activityMap.get(String(car._id)) || 0);

    const ageDays = Math.max(0, (Date.now() - new Date(car.createdAt).getTime()) / (24 * 60 * 60 * 1000));
    const freshnessRatio = Math.max(
      0,
      Math.min(1, (profile.maxFreshnessDays - ageDays) / profile.maxFreshnessDays)
    );
    const completenessRatio = calculateCompletenessRatio(car);

    const viewsScore = safeLogScore(views, profile.weights.views);
    const likesScore = safeLogScore(likes, profile.weights.likes);
    const inquiriesScore = safeLogScore(inquiries, profile.weights.inquiries);
    const freshnessScore = freshnessRatio * (Number(profile.weights.freshness) || 0);
    const completenessScore = completenessRatio * (Number(profile.weights.completeness) || 0);

    const totalScore = Number(
      (viewsScore + likesScore + inquiriesScore + freshnessScore + completenessScore).toFixed(4)
    );

    return {
      car,
      score: {
        viewsScore,
        likesScore,
        inquiriesScore,
        freshnessScore,
        completenessScore,
        totalScore,
      },
      signals: {
        views,
        likes,
        inquiries,
        ageDays: Number(ageDays.toFixed(2)),
        completenessRatio: Number(completenessRatio.toFixed(4)),
      },
    };
  });

  ranked.sort((a, b) => b.score.totalScore - a.score.totalScore);

  const bulkOps = ranked.map((item, index) => ({
    updateOne: {
      filter: { carAssetId: item.car._id },
      update: {
        $set: {
          profileName: profile.name,
          windowDays,
          computedAt: new Date(),
          rank: index + 1,
          carData: {
            title: item.car.title,
            description: item.car.description,
            listingReference: item.car.listingReference,
            price: item.car.price,
            isPriceOnRequest: item.car.isPriceOnRequest,
            location: item.car.location,
            images: item.car.images,
            brand: item.car.brand,
            brand_logo: item.car.brand_logo,
            variant: item.car.variant,
            highlights: item.car.highlights,
            videoUrl: item.car.videoUrl,
            keySpecifications: {
              power: item.car.keySpecifications?.power,
              topSpeed: item.car.keySpecifications?.topSpeed,
              engineType: item.car.keySpecifications?.engineType,
              mileage: item.car.keySpecifications?.mileage,
            },
            specification: {
              yearOfConstruction: item.car.specification?.yearOfConstruction,
              model: item.car.specification?.model,
              variant: item.car.specification?.variant,
              body: item.car.specification?.body,
              series: item.car.specification?.series,
              mileage: item.car.specification?.mileage,
              power: item.car.specification?.power,
              cylinderCapacity: item.car.specification?.cylinderCapacity,
              topSpeed: item.car.specification?.topSpeed,
              engineType: item.car.specification?.engineType,
              co2Emission: item.car.specification?.co2Emission,
              consumption: item.car.specification?.consumption,
              steering: item.car.specification?.steering,
              transmission: item.car.specification?.transmission,
              drive: item.car.specification?.drive,
              fuel: item.car.specification?.fuel,
              configuration: item.car.specification?.configuration,
              interiorMaterial: item.car.specification?.interiorMaterial,
              interiorColor: item.car.specification?.interiorColor,
              exteriorColor: item.car.specification?.exteriorColor,
              manufacturerColorCode: item.car.specification?.manufacturerColorCode,
              matchingNumbers: item.car.specification?.matchingNumbers,
              condition: item.car.specification?.condition,
              usageStatus: item.car.specification?.usageStatus,
              accidentFree: item.car.specification?.accidentFree,
              accidentHistory: item.car.specification?.accidentHistory,
              countryOfFirstDelivery: item.car.specification?.countryOfFirstDelivery,
              numberOfOwners: item.car.specification?.numberOfOwners,
              carLocation: item.car.specification?.carLocation,
              latitude: item.car.specification?.latitude,
              longitude: item.car.specification?.longitude,
            },
            agent: {
              id: item.car.agent?.id,
              name: item.car.agent?.name,
              photo: item.car.agent?.photo,
              phone: item.car.agent?.phone,
              email: item.car.agent?.email,
              company: item.car.agent?.company,
              companyLogo: item.car.agent?.companyLogo,
              companyDescription: item.car.agent?.companyDescription,
              address: item.car.agent?.address,
              website: item.car.agent?.website,
              plan: item.car.agent?.plan,
              joined: item.car.agent?.joined,
            },
            documents: item.car.documents,
            status: item.car.status,
            category: item.car.category,
            type: item.car.type,
            acquisition: item.car.acquisition,
            isTrending: item.car.isTrending,
            popularity: item.car.popularity,
            views: item.car.views,
            likes: item.car.likes,
            keywords: item.car.keywords,
            createdAt: item.car.createdAt,
            updatedAt: item.car.updatedAt,
          },
          breakdown: {
            viewsScore: Number(item.score.viewsScore.toFixed(4)),
            likesScore: Number(item.score.likesScore.toFixed(4)),
            inquiriesScore: Number(item.score.inquiriesScore.toFixed(4)),
            freshnessScore: Number(item.score.freshnessScore.toFixed(4)),
            completenessScore: Number(item.score.completenessScore.toFixed(4)),
            totalScore: item.score.totalScore,
          },
          signals: item.signals,
          // Populate top-level filter fields for efficient querying/filtering
          filterFields: {
            price: item.car.price != null ? Number(item.car.price) : undefined,
            location: item.car.location || (item.car.locationName || undefined),
            brand: item.car.brand || undefined,
            model: (item.car.specification && item.car.specification.model) || undefined,
            variant: item.car.specification?.variant || item.car.variant || undefined,
            yearOfConstruction: (item.car.specification && item.car.specification.yearOfConstruction) || undefined,
            mileage:
              (item.car.keySpecifications && item.car.keySpecifications.mileage) || item.car.mileage || undefined,
            status: item.car.status || undefined,
            acquisition: item.car.acquisition || undefined,
            category: item.car.category || undefined,
            type: item.car.type || undefined,
            isPriceOnRequest: item.car.isPriceOnRequest === true,
            countryOfFirstDelivery: item.car.countryOfFirstDelivery || undefined,
            fuel: item.car.specification?.fuel || undefined,
            transmission: item.car.specification?.transmission || undefined,
            body: item.car.specification?.body || undefined,
            usageStatus: item.car.specification?.usageStatus || undefined,
            condition: item.car.specification?.condition || undefined,
            steering: item.car.specification?.steering || undefined,
            drive: item.car.specification?.drive || undefined,
            exteriorColor: item.car.specification?.exteriorColor || undefined,
            interiorColor: item.car.specification?.interiorColor || undefined,
            company: item.car.agent?.company || undefined,
            latitude: item.car.latitude || item.car.locationLat || undefined,
            longitude: item.car.longitude || item.car.locationLng || undefined,
            numberOfOwners: item.car.numberOfOwners != null ? Number(item.car.numberOfOwners) : undefined,
          },
        },
      },
      upsert: true,
    },
  }));

  if (bulkOps.length > 0) {
    await CarRankingSnapshot.bulkWrite(bulkOps, { ordered: false });
  }

  return {
    profile,
    ranked,
    summary: {
      totalCars: ranked.length,
      windowDays,
    },
  };
};

router.get("/profile", async (req, res) => {
  try {
    const profile = await getActiveProfile();
    if (!profile) {
      return res.status(404).json({ message: "No active car ranking profile found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Failed to fetch car ranking profile:", error);
    res.status(500).json({ message: "Failed to fetch car ranking profile" });
  }
});

router.put("/carprofile", async (req, res) => {
  try {
    const body = req.body || {};
    const { name, isActive, windowDays, maxFreshnessDays, weights } = body;

    if (!Object.keys(body).length) {
      return res.status(400).json({ message: "Request body is required" });
    }

    let profile = await getActiveProfile();
    if (!profile) {
      profile = new CarRankingProfile({
        name: typeof name === "string" && name.trim() ? name.trim() : `car-ranking-${Date.now()}`,
      });
    }

    if (name !== undefined) {
      profile.name = String(name).trim() || profile.name;
    }

    if (isActive !== undefined) {
      profile.isActive = Boolean(isActive);
    }

    if (windowDays !== undefined) profile.windowDays = Number(windowDays) || profile.windowDays;
    if (maxFreshnessDays !== undefined) {
      profile.maxFreshnessDays = Number(maxFreshnessDays) || profile.maxFreshnessDays;
    }

    if (weights && typeof weights === "object") {
      if (weights.views !== undefined) profile.weights.views = Number(weights.views) || profile.weights.views;
      if (weights.likes !== undefined) profile.weights.likes = Number(weights.likes) || profile.weights.likes;
      if (weights.inquiries !== undefined) {
        profile.weights.inquiries = Number(weights.inquiries) || profile.weights.inquiries;
      }
      if (weights.freshness !== undefined) {
        profile.weights.freshness = Number(weights.freshness) || profile.weights.freshness;
      }
      if (weights.completeness !== undefined) {
        profile.weights.completeness = Number(weights.completeness) || profile.weights.completeness;
      }
    }

    await profile.save();

    if (profile.isActive) {
      await CarRankingProfile.updateMany(
        { _id: { $ne: profile._id }, isActive: true },
        { $set: { isActive: false } }
      );
    }

    res.json({ message: "Car ranking profile updated", profile });
  } catch (error) {
    console.error("Failed to update car ranking profile:", error);
    res.status(500).json({ message: "Failed to update car ranking profile" });
  }
});

router.post("/rebuild", async (req, res) => {
  try {
    const { windowDays } = req.body || {};
    const { summary, profile } = await buildRanking(windowDays);
    res.json({
      message: "Car ranking rebuilt successfully",
      summary,
      profile: {
        name: profile.name,
        windowDays: profile.windowDays,
        maxFreshnessDays: profile.maxFreshnessDays,
        weights: profile.weights,
      },
    });
  } catch (error) {
    console.error("Failed to rebuild car ranking:", error);
    res.status(500).json({ message: "Failed to rebuild car ranking" });
  }
});

router.get("/top", async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const forceRebuild = String(req.query.forceRebuild || "false").toLowerCase() === "true";
    const windowDays = Number(req.query.windowDays);
    const snapshotQuery = applyRankingFilters(req.query || {});

    let snapshots = [];
    if (!forceRebuild) {
      snapshots = await CarRankingSnapshot.find(snapshotQuery)
        .sort({ rank: 1, "breakdown.totalScore": -1 })
        .limit(limit)
        .lean();
    }

    if (snapshots.length === 0 || forceRebuild) {
      await buildRanking(windowDays);
      snapshots = await CarRankingSnapshot.find(snapshotQuery)
        .sort({ rank: 1, "breakdown.totalScore": -1 })
        .limit(limit)
        .lean();
    }

    const ids = snapshots.map((s) => s.carAssetId).filter(Boolean);
    const cars = await CarAsset.find({ _id: { $in: ids } })
      .select("title price location images brand specification status createdAt")
      .lean();

    const carMap = new Map(cars.map((car) => [String(car._id), car]));

    const data = snapshots
      .map((snapshot) => {
        const car = carMap.get(String(snapshot.carAssetId));
        if (!car) return null;

        return {
          rank: snapshot.rank,
          score: snapshot.breakdown?.totalScore || 0,
          carData: snapshot.carData,
          breakdown: snapshot.breakdown,
          signals: snapshot.signals,
          computedAt: snapshot.computedAt,
          car,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, limit);

    res.json({ data, count: data.length });
  } catch (error) {
    console.error("Failed to fetch car ranking top list:", error);
    res.status(500).json({ message: "Failed to fetch car ranking top list" });
  }
});

router.get("/car/:carId", async (req, res) => {
  try {
    const { carId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }
    // console.log("Fetching ranking detail for car ID:", await CarRankingSnapshot.find());

    let snapshot = await CarRankingSnapshot.findOne({ carAssetId: carId }).lean();
    if (!snapshot) {
      await buildRanking();
      snapshot = await CarRankingSnapshot.findOne({ carAssetId: carId }).lean();
    }

    if (!snapshot) {
      return res.status(404).json({ message: "Ranking not found for this car" });
    }

    const car = await CarAsset.findById(carId)
      .select("title price location images brand specification status createdAt")
      .lean();

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.json({
      rank: snapshot.rank,
      score: snapshot.breakdown?.totalScore || 0,
      carData: snapshot.carData,
      breakdown: snapshot.breakdown,
      signals: snapshot.signals,
      computedAt: snapshot.computedAt,
      car,
    });
  } catch (error) {
    console.error("Failed to fetch car ranking detail:", error);
    res.status(500).json({ message: "Failed to fetch car ranking detail" });
  }
});

router.get("/all-filter-cars", async (req, res) => {
  try {
    const query = applyRankingFilters(req.query || {});
    console.log("Filter query for all cars:", req.query);

    const cars = await CarRankingSnapshot.find(query)
      .sort({ rank: 1, "breakdown.totalScore": -1 })
      .lean();

    res.json({ data: cars, count: cars.length });
  } catch (error) {
    console.error("Failed to fetch all filtered cars:", error);
    res.status(500).json({ message: "Failed to fetch all filtered cars" });
  }
});

module.exports = router;