const authMiddleware = require("../middleware/auth.middleware");
const mongoose = require("mongoose");
const express = require("express");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const YachtAsset = require("../models/YachtAsset.model");
const Listing = require("../models/Listing.model");
const User = require("../models/User.model");

const axios = require("axios");
const router = express.Router();

/**
 * CAR ASSETS
 * /api/assets/cars
 */
router.get("/cars", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 1000, type, minPrice, maxPrice, location, brand, builder, model, category, country, sort, acquisition } = req.query;

    let query = { status: 'Active' };
    
    // Acquisition remains a strict mode (Buy/Rent)
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const orClauses = [];

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      orClauses.push(
        { title: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { builder: searchRegex },
        { 'specification.model': searchRegex },
        { keywords: searchRegex },
        { location: searchRegex }
      );
    }

    if (type) orClauses.push({ type: type });
    
    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      locations.forEach(loc => {
        orClauses.push({ location: { $regex: loc.trim(), $options: "i" } });
      });
    }
    
    if (brand || builder) {
      const brandVal = brand || builder;
      orClauses.push({ brand: { $regex: brandVal, $options: "i" } });
      orClauses.push({ builder: { $regex: brandVal, $options: "i" } });
    }
    
    if (model) orClauses.push({ 'specification.model': { $regex: model, $options: "i" } });
    if (category) orClauses.push({ category: { $regex: category, $options: "i" } });

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      orClauses.push({ price: priceQuery });
    }

    if (orClauses.length > 0) {
      query.$or = orClauses;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const total = await CarAsset.countDocuments(query);
    const data = await CarAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions);

    res.json({
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Error in /api/assets/cars:", err);
    res.status(500).json({ message: "Failed to fetch vehicle assets" });
  }
});

/**
 * ESTATE ASSETS
 * /api/assets/estates
 */
router.get("/estates", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12, type, minPrice, maxPrice, location, bedrooms, bathrooms, propertyType, sort, acquisition, country } = req.query;

    let query = { status: 'Active' };
    
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const orClauses = [];

    if (search) {
      orClauses.push({ title: { $regex: search, $options: "i" } });
      orClauses.push({ description: { $regex: search, $options: "i" } });
    }

    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      locations.forEach(loc => {
        orClauses.push({ location: { $regex: loc.trim(), $options: "i" } });
      });
    }

    if (propertyType) orClauses.push({ 'keySpecifications.propertyType': propertyType });
    if (bedrooms && bedrooms !== 'Any') {
      const val = Number(bedrooms.replace('+', ''));
      if (bedrooms.includes('+')) orClauses.push({ 'specification.bedrooms': { $gte: val } });
      else orClauses.push({ 'specification.bedrooms': val });
    }
    if (bathrooms && bathrooms !== 'Any') {
      const val = Number(bathrooms.replace('+', ''));
      if (bathrooms.includes('+')) orClauses.push({ 'specification.bathrooms': { $gte: val } });
      else orClauses.push({ 'specification.bathrooms': val });
    }

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      orClauses.push({ price: priceQuery });
    }

    if (orClauses.length > 0) {
      query.$or = orClauses;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const total = await EstateAsset.countDocuments(query);
    const data = await EstateAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions);

    res.json({
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch estate assets" });
  }
});

/**
 * BIKE ASSETS
 * /api/assets/bikes
 */
router.get("/bikes", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 1000, type, minPrice, maxPrice, location, brand, builder, model, sort, acquisition, country } = req.query;

    let query = { status: 'Active' };
    
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const orClauses = [];

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      orClauses.push({ title: searchRegex });
      orClauses.push({ description: searchRegex });
    }

    if (type) orClauses.push({ type: type });
    
    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      locations.forEach(loc => {
        orClauses.push({ location: { $regex: loc.trim(), $options: "i" } });
      });
    }

    if (brand || builder) {
      const brandVal = brand || builder;
      orClauses.push({ brand: { $regex: brandVal, $options: "i" } });
      orClauses.push({ builder: { $regex: brandVal, $options: "i" } });
    }
    
    if (model) orClauses.push({ 'specification.model': { $regex: model, $options: "i" } });

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      orClauses.push({ price: priceQuery });
    }

    if (orClauses.length > 0) {
      query.$or = orClauses;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const total = await BikeAsset.countDocuments(query);
    const data = await BikeAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions);

    res.json({
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bike assets" });
  }
});

/**
 * YACHT ASSETS
 * /api/assets/yachts
 */
router.get("/yachts", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 1000, type, minPrice, maxPrice, location, brand, builder, model, sort, acquisition, country } = req.query;

    let query = { status: 'Active' };
    
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const orClauses = [];

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      orClauses.push({ title: searchRegex });
      orClauses.push({ description: searchRegex });
    }

    if (type) orClauses.push({ type: type });
    
    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      locations.forEach(loc => {
        orClauses.push({ location: { $regex: loc.trim(), $options: "i" } });
      });
    }

    if (brand || builder) {
      const brandVal = brand || builder;
      orClauses.push({ brand: { $regex: brandVal, $options: "i" } });
      orClauses.push({ builder: { $regex: brandVal, $options: "i" } });
    }
    
    if (model) orClauses.push({ 'specification.model': { $regex: model, $options: "i" } });

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      orClauses.push({ price: priceQuery });
    }

    if (orClauses.length > 0) {
      query.$or = orClauses;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const total = await YachtAsset.countDocuments(query);
    const data = await YachtAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions);

    res.json({
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch yacht assets" });
  }
});

/**
 * ALL CAR ASSETS
 * /api/assets/all/cars
 */
router.get("/all/cars", async (req, res) => {
  try {
    const data = await CarAsset.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all car assets" });
  }
});

/**
 * ALL ESTATE ASSETS
 * /api/assets/all/estates
 */
router.get("/all/estates", async (req, res) => {
  try {
    const data = await EstateAsset.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all estate assets" });
  }
});

/**
 * ALL BIKE ASSETS
 * /api/assets/all/bikes
 */
router.get("/all/bikes", async (req, res) => {
  try {
    const data = await BikeAsset.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all bike assets" });
  }
});

/**
 * ALL YACHT ASSETS (NEW ENDPOINT)
 * /api/assets/all/yachts
 */
router.get("/all/yachts", async (req, res) => {
  try {
    const data = await YachtAsset.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all yacht assets" });
  }
});

/**
 * FETCH SINGLE CAR ASSET BY ID
 * /api/assets/car/:id
 */
router.get("/car/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid car asset ID" });
    }

    const asset = await CarAsset.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!asset) {
      return res.status(404).json({ message: "Car asset not found" });
    }

    const assetObj = asset.toObject();
    if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
      const agentUser = await User.findById(assetObj.agent.id);
      if (agentUser) {
        assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
        assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
        if (agentUser.company) {
          assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
          assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
        }
      }
    }

    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching car asset by ID:", error);
    res.status(500).json({ message: "Failed to fetch car asset" });
  }
});

/**
 * FETCH SINGLE ESTATE ASSET BY ID
 * /api/assets/estate/:id
 */
router.get("/estate/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid estate asset ID" });
    }

    const asset = await EstateAsset.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!asset) {
      return res.status(404).json({ message: "Estate asset not found" });
    }

    const assetObj = asset.toObject();
    if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
      const agentUser = await User.findById(assetObj.agent.id);
      if (agentUser) {
        assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
        assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
        if (agentUser.company) {
          assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
          assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
        }
      }
    }

    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching estate asset by ID:", error);
    res.status(500).json({ message: "Failed to fetch estate asset" });
  }
});

/**
 * FETCH SINGLE BIKE ASSET BY ID
 * /api/assets/bike/:id
 */
router.get("/bike/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid bike asset ID" });
    }

    const asset = await BikeAsset.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!asset) {
      return res.status(404).json({ message: "Bike asset not found" });
    }

    const assetObj = asset.toObject();
    if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
      const agentUser = await User.findById(assetObj.agent.id);
      if (agentUser) {
        assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
        assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
        if (agentUser.company) {
          assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
          assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
        }
      }
    }

    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching bike asset by ID:", error);
    res.status(500).json({ message: "Failed to fetch bike asset" });
  }
});

/**
 * FETCH SINGLE YACHT ASSET BY ID
 * /api/assets/yacht/:id
 */
router.get("/yacht/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid yacht asset ID" });
    }

    const asset = await YachtAsset.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!asset) {
      return res.status(404).json({ message: "Yacht asset not found" });
    }

    const assetObj = asset.toObject();
    if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
      const agentUser = await User.findById(assetObj.agent.id);
      if (agentUser) {
        assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
        assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
        if (agentUser.company) {
          assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
          assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
        }
      }
    }

    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching yacht asset by ID:", error);
    res.status(500).json({ message: "Failed to fetch yacht asset" });
  }
});

/**
 * ASSET DETAIL
 * /api/assets/:type/:id
 */
router.get("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid asset ID" });
    }

    let Model;

    if (type === "cars") Model = CarAsset;
    else if (type === "estates") Model = EstateAsset;
    else if (type === "bikes") Model = BikeAsset;
    else if (type === "yachts") Model = YachtAsset;
    else return res.status(400).json({ message: "Invalid asset type" });

    const asset = await Model.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const assetObj = asset.toObject();
    if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
      const agentUser = await User.findById(assetObj.agent.id);
      if (agentUser) {
        assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
        assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
        if (agentUser.company) {
          assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
          assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
        }
      }
    }

    res.json(assetObj);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch asset detail" });
  }
});

/**
 * LIKE ASSET
 * /api/assets/:type/:id/like
 */
router.post("/:type/:id/like", authMiddleware, async (req, res) => {
  try {
    const { type, id } = req.params;

    let asset;

    if (type === "cars") {
      asset = await CarAsset.findById(id);
    } else if (type === "estates") {
      asset = await EstateAsset.findById(id);
    } else if (type === "bikes") {
      asset = await BikeAsset.findById(id);
    } else if (type === "yachts") {
      asset = await YachtAsset.findById(id);
    } else {
      return res.status(400).json({ message: "Invalid asset type" });
    }

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // ❤️ increment likes
    asset.likes += 1;

    // 🔥 optional popularity logic
    if (asset.likes % 10 === 0 && asset.popularity < 10) {
      asset.popularity += 1;
    }

    await asset.save();

    res.json({
      message: "Liked successfully",
      likes: asset.likes,
      popularity: asset.popularity,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to like asset" });
  }
});

/**
 * COMBINED ASSETS
 * /api/assets/combined
 * Supports: ?search=&page=&limit=
 */
router.get("/combined", async (req, res) => {
  try {
    const { q, page = 1, limit = 12, type, minPrice, maxPrice, location, acquisition, brand, model, category, propertyType, bedrooms, bathrooms, amenities, architecture, sort } = req.query;

    const andClauses = [{ status: 'Active' }];

    if (q) {
      const words = q.split(' ').filter(word => word.length > 0);
      const qOrQuery = words.map(word => {
        const searchRegex = { $regex: word, $options: "i" };
        return {
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { location: searchRegex },
            { brand: searchRegex },
            { 'highlights': searchRegex },
            { 'keywords': searchRegex },
            { category: searchRegex },
            { type: searchRegex },
            { 'specification.model': searchRegex },
            { 'keySpecifications.propertyType': searchRegex },
            { 'specification.propertyType': searchRegex },
            { 'specification.architectureStyle': searchRegex },
            { 'specification.country': searchRegex },
            { 'specification.city': searchRegex },
            { 'specification.body': searchRegex },
            { 'specification.fuelType': searchRegex },
            { 'specification.transmission': searchRegex },
            { 'specification.exteriorColor': searchRegex },
            { 'specification.engineType': searchRegex },
            { 'specification.yachtType': searchRegex },
            { builder: searchRegex },
            { 'amenities': searchRegex },
          ]
        };
      });
      andClauses.push({ $or: qOrQuery });
    }

    if (type) andClauses.push({ type: type });
    
    if (acquisition) {
      if (acquisition === 'buy') {
        andClauses.push({ acquisition: { $in: ['buy', 'rent/buy'] } });
      } else if (acquisition === 'rent') {
        andClauses.push({ acquisition: { $in: ['rent', 'rent/buy'] } });
      }
    }

    if (location) {
      andClauses.push({ location: { $regex: location, $options: "i" } });
    }

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      andClauses.push({ price: priceQuery });
    }

    // Category, Brand, Model
    if (category && category !== 'Any') {
        // Handle variations in category naming
        const catRegex = { $regex: category.replace('Asset', '').replace('s', ''), $options: 'i' };
        andClauses.push({ category: catRegex });
    }
    if (brand) andClauses.push({ brand: { $regex: brand, $options: "i" } });
    if (model) andClauses.push({ 'specification.model': { $regex: model, $options: "i" } });

    // Property Specifics
    if (propertyType) andClauses.push({ 'keySpecifications.propertyType': propertyType });
    if (bedrooms && bedrooms !== 'Any') {
        const val = Number(bedrooms.replace('+', ''));
        if (bedrooms.includes('+')) andClauses.push({ 'specification.bedrooms': { $gte: val } });
        else andClauses.push({ 'specification.bedrooms': val });
    }
    if (bathrooms && bathrooms !== 'Any') {
        const val = Number(bathrooms.replace('+', ''));
        if (bathrooms.includes('+')) andClauses.push({ 'specification.bathrooms': { $gte: val } });
        else andClauses.push({ 'specification.bathrooms': val });
    }
    if (amenities && amenities !== 'Any') andClauses.push({ 'amenities': { $regex: amenities, $options: "i" } });
    if (architecture && architecture !== 'Any') andClauses.push({ 'specification.architectureStyle': architecture });

    const query = { $and: andClauses };

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const fetchResults = async (q) => {
        const [car, estate, bike, yacht, other] = await Promise.all([
            CarAsset.find(q).sort(sortOptions).skip((page - 1) * limit).limit(Number(limit)),
            EstateAsset.find(q).sort(sortOptions).skip((page - 1) * limit).limit(Number(limit)),
            BikeAsset.find(q).sort(sortOptions).skip((page - 1) * limit).limit(Number(limit)),
            YachtAsset.find(q).sort(sortOptions).skip((page - 1) * limit).limit(Number(limit)),
            Listing.find(q).sort(sortOptions).skip((page - 1) * limit).limit(Number(limit)),
        ]);
        return [...car, ...estate, ...bike, ...yacht, ...other];
    };

    const countResults = async (q) => {
        const [car, estate, bike, yacht, other] = await Promise.all([
            CarAsset.countDocuments(q),
            EstateAsset.countDocuments(q),
            BikeAsset.countDocuments(q),
            YachtAsset.countDocuments(q),
            Listing.countDocuments(q),
        ]);
        return car + estate + bike + yacht + other;
    };

    let total = await countResults(query);
    let combinedAssets = await fetchResults(query);

    // --- COMPREHENSIVE FALLBACK LOGIC ---
    // If no results for strict AND, try a broader search (OR logic for Category/Location/Brand)
    if (combinedAssets.length === 0 && andClauses.length > 1) {
        const fallbackOrClauses = [];
        
        if (category) {
            const catRegex = { $regex: category.replace('Asset', '').replace('s', ''), $options: 'i' };
            fallbackOrClauses.push({ category: catRegex });
        }
        if (location) fallbackOrClauses.push({ location: { $regex: location, $options: "i" } });
        if (brand) fallbackOrClauses.push({ brand: { $regex: brand, $options: "i" } });
        if (q) {
            const words = q.split(' ').filter(word => word.length > 0);
            words.forEach(w => fallbackOrClauses.push({ title: { $regex: w, $options: 'i' } }));
        }

        if (fallbackOrClauses.length > 0) {
            const fallbackQuery = { 
                $and: [
                    { status: 'Active' },
                    { $or: fallbackOrClauses }
                ]
            };
            total = await countResults(fallbackQuery);
            combinedAssets = await fetchResults(fallbackQuery);
        }
    }

    // Final global sort
    if (sort === 'Low to High') combinedAssets.sort((a, b) => a.price - b.price);
    else if (sort === 'High to Low') combinedAssets.sort((a, b) => b.price - a.price);
    else if (sort === 'Oldest') combinedAssets.sort((a, b) => a.createdAt - b.createdAt);
    else combinedAssets.sort((a, b) => b.createdAt - a.createdAt);

    res.json({
      data: combinedAssets,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Combined assets error:", err);
    res.status(500).json({ message: "Failed to fetch combined assets" });
  }
});

/**
 * ALL CAR ASSETS (NEW ENDPOINT)
 * /api/assets/car
 */
router.get("/car", async (req, res) => {
  try {
    const { limit = 15, location, acquisition } = req.query;
    const query = { status: 'Active' };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (acquisition) {
      query.acquisition = { $in: acquisition.toLowerCase().split(',') };
    }

    const data = await CarAsset.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all car assets" });
  }
});

/**
 * ALL ESTATE ASSETS (NEW ENDPOINT)
 * /api/assets/estate
 */
router.get("/estate", async (req, res) => {
  try {
    const { limit = 15, location, acquisition } = req.query;
    const query = { status: 'Active' };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const data = await EstateAsset.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all estate assets" });
  }
});

/**
 * ALL BIKE ASSETS (NEW ENDPOINT)
 * /api/assets/bike
 */
router.get("/bike", async (req, res) => {
  try {
    const { limit = 15, location, acquisition } = req.query;
    const query = { status: 'Active' };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const data = await BikeAsset.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all bike assets" });
  }
});

/**
 * ALL YACHT ASSETS (NEW ENDPOINT)
 * /api/assets/yacht
 */
router.get("/yacht", async (req, res) => {
  try {
    const { limit = 15, location, acquisition } = req.query;
    const query = { status: 'Active' };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const data = await YachtAsset.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all yacht assets" });
  }
});

/**
 * SEARCH SUGGESTIONS
 * /api/assets/suggestions
 */
router.get("/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    // 1. Fetch suggestions from Google's unofficial API
    const googleApiUrl = `https://suggestqueries.google.com/complete/search?client=firefox&ds=&q=${encodeURIComponent(q)}`;
    let googleSuggestions = [];
    try {
      const response = await axios.get(googleApiUrl);
      if (response.data && Array.isArray(response.data) && response.data.length > 1) {
        googleSuggestions = response.data[1];
      }
    } catch (apiErr) {
      console.error("Google Suggestion API Error:", apiErr.message);
      // Don't fail the request, just proceed with local suggestions
    }

    // 2. Fetch suggestions from the local database (as a supplement)
    const searchRegex = { $regex: `^${q}`, $options: "i" };
    const [brands, titles, models] = await Promise.all([
      CarAsset.find({ brand: searchRegex }).limit(5),
      CarAsset.find({ title: searchRegex }).limit(5),
      CarAsset.find({ 'specification.model': searchRegex }).limit(5),
      BikeAsset.find({ brand: searchRegex }).limit(5),
      BikeAsset.find({ title: searchRegex }).limit(5),
      BikeAsset.find({ 'specification.model': searchRegex }).limit(5),
      YachtAsset.find({ brand: searchRegex }).limit(5),
      YachtAsset.find({ title: searchRegex }).limit(5),
      YachtAsset.find({ 'specification.model': searchRegex }).limit(5),
      EstateAsset.find({ title: searchRegex }).limit(5)
    ]);

    const localSuggestions = {};
    const processAssets = (assets, field, type) => {
      assets.forEach(asset => {
        const value = asset[field] || (asset.specification && asset.specification.model);
        if (value && !localSuggestions[value]) {
          localSuggestions[value] = { value, type };
        }
      });
    };

    processAssets(brands, 'brand', 'Brand');
    processAssets(titles, 'title', 'Asset');
    processAssets(models, 'model', 'Model');

    // 3. Combine, deduplicate, and send
    const combined = [...googleSuggestions.map(s => ({ value: s, type: 'Global' })), ...Object.values(localSuggestions)];
    const uniqueValues = {};
    const uniqueSuggestions = [];

    for (const suggestion of combined) {
      if (!uniqueValues[suggestion.value]) {
        uniqueValues[suggestion.value] = true;
        uniqueSuggestions.push(suggestion);
      }
    }

    res.json(uniqueSuggestions.slice(0, 10));

  } catch (err) {
    console.error("Suggestions Error:", err);
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
});

/**
 * LOCATION SUGGESTIONS
 * /api/assets/location-suggestions
 */
router.get("/location-suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const photonApiUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=en`;

    try {
      const response = await axios.get(photonApiUrl);
      if (response.data && response.data.features) {
        const suggestions = response.data.features.map(feature => {
          const { name, city, country } = feature.properties;
          let suggestion = name;
          if (city && name !== city) {
            suggestion += `, ${city}`;
          }
          if (country && name !== country && city !== country) {
            suggestion += `, ${country}`;
          }
          return suggestion;
        });
        return res.json(suggestions);
      }
    } catch (apiErr) {
      console.error("Photon API Error:", apiErr.message);
      // Fallback to local search if Photon API fails
    }

    // Fallback to local database search
    const searchRegex = { $regex: q, $options: "i" };
    const [carLocations, estateLocations, bikeLocations, yachtLocations] = await Promise.all([
      CarAsset.distinct("location", { location: searchRegex }),
      EstateAsset.distinct("location", { location: searchRegex }),
      BikeAsset.distinct("location", { location: searchRegex }),
      YachtAsset.distinct("location", { location: searchRegex }),
    ]);

    const combinedLocations = [
      ...carLocations,
      ...estateLocations,
      ...bikeLocations,
      ...yachtLocations,
    ];

    const uniqueLocations = [...new Set(combinedLocations)];

    res.json(uniqueLocations.slice(0, 10));

  } catch (err) {
    console.error("Location Suggestions Error:", err);
    res.status(500).json({ message: "Failed to fetch location suggestions" });
  }
});

/**
 * SIMILAR ASSETS
 * /api/assets/similar/:category/:id
 */
router.get("/similar/:category/:id", async (req, res) => {
  try {
    const { category, id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid asset ID" });
    }

    let Model;
    const catLower = category.toLowerCase();
    if (catLower.includes('car')) Model = CarAsset;
    else if (catLower.includes('estate')) Model = EstateAsset;
    else if (catLower.includes('bike')) Model = BikeAsset;
    else if (catLower.includes('yacht')) Model = YachtAsset;
    else return res.status(400).json({ message: "Invalid category" });

    const currentAsset = await Model.findById(id);
    if (!currentAsset) return res.status(404).json({ message: "Asset not found" });

    // Define similarity criteria: 
    // 1. Same brand/builder (for vehicles) or same location (for estates)
    // 2. Similar price (+/- 20%)
    const priceMin = currentAsset.price * 0.8;
    const priceMax = currentAsset.price * 1.2;

    let orClauses = [];
    
    if (catLower.includes('estate')) {
      // For estates: Location is primary
      if (currentAsset.location) {
        orClauses.push({ location: { $regex: currentAsset.location, $options: 'i' } });
      }
    } else {
      // For vehicles: Brand/Builder is primary
      if (currentAsset.brand) orClauses.push({ brand: currentAsset.brand });
      if (currentAsset.builder) orClauses.push({ builder: currentAsset.builder });
    }

    // Secondary: Similar Price
    orClauses.push({ price: { $gte: priceMin, $lte: priceMax } });

    const query = {
      _id: { $ne: id },
      status: 'Active',
      $or: orClauses
    };

    // To ensure "First Brand/Location then Price" priority, we can fetch them and sort or use a weighted approach.
    // For simplicity and performance, we'll fetch them and use JS to sort by match type.
    const similar = await Model.find(query).limit(20); 
    
    const sortedSimilar = similar.sort((a, b) => {
      // Priority 1: Brand/Location match
      let aMatch = false;
      let bMatch = false;

      if (catLower.includes('estate')) {
        aMatch = a.location === currentAsset.location;
        bMatch = b.location === currentAsset.location;
      } else {
        aMatch = (a.brand && a.brand === currentAsset.brand) || (a.builder && a.builder === currentAsset.builder);
        bMatch = (b.brand && b.brand === currentAsset.brand) || (b.builder && b.builder === currentAsset.builder);
      }

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0; // Both are matches or both are price-only matches
    }).slice(0, 10);

    res.json(sortedSimilar);
  } catch (error) {
    console.error("Similar assets error:", error);
    res.status(500).json({ message: "Failed to fetch similar assets" });
  }
});

/**
 * ASSETS BY AGENT (SAME CATEGORY)
 * /api/assets/agent/:agentId/:category
 */
router.get("/agent/:agentId/:category", async (req, res) => {
  try {
    const { agentId, category } = req.params;
    const { excludeId } = req.query;

    let Model;
    const catLower = category.toLowerCase();
    if (catLower.includes('car')) Model = CarAsset;
    else if (catLower.includes('estate')) Model = EstateAsset;
    else if (catLower.includes('bike')) Model = BikeAsset;
    else if (catLower.includes('yacht')) Model = YachtAsset;
    else return res.status(400).json({ message: "Invalid category" });

    const query = {
      'agent.id': agentId,
      status: 'Active'
    };

    if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: excludeId };
    }

    const assets = await Model.find(query).limit(10);
    res.json(assets);
  } catch (error) {
    console.error("Agent assets error:", error);
    res.status(500).json({ message: "Failed to fetch agent assets" });
  }
});

/**
 * SEARCH BY LISTING REFERENCE ID
 * /api/assets/search/id/:id
 */
router.get("/search/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Clean ID (handle URL encoding like #)
    const cleanId = id.startsWith("#") ? id : `#${id}`;

    // Search across all models
    const [car, bike, yacht, estate, generic] = await Promise.all([
      CarAsset.findOne({ listingReference: cleanId }),
      BikeAsset.findOne({ listingReference: cleanId }),
      YachtAsset.findOne({ listingReference: cleanId }),
      EstateAsset.findOne({ listingReference: cleanId }),
      Listing.findOne({ listingReference: cleanId })
    ]);

    if (car) return res.json({ redirect: `/asset/car/${car._id}`, found: true });
    if (bike) return res.json({ redirect: `/asset/bike/${bike._id}`, found: true });
    if (yacht) return res.json({ redirect: `/asset/yacht/${yacht._id}`, found: true });
    if (estate) return res.json({ redirect: `/asset/estate/${estate._id}`, found: true });
    if (generic) return res.json({ redirect: `/asset/listing/${generic._id}`, found: true });

    res.json({ found: false, message: "No asset found with this reference ID" });
  } catch (err) {
    console.error("Search by ID error:", err);
    res.status(500).json({ message: "Failed to search by ID" });
  }
});

module.exports = router;