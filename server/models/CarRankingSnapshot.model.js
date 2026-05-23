const mongoose = require("mongoose");

const breakdownSchema = new mongoose.Schema(
  {
    viewsScore: { type: Number, default: 0 },
    likesScore: { type: Number, default: 0 },
    inquiriesScore: { type: Number, default: 0 },
    freshnessScore: { type: Number, default: 0 },
    completenessScore: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
  },
  { _id: false }
);

const signalsSchema = new mongoose.Schema(
  {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    ageDays: { type: Number, default: 0 },
    completenessRatio: { type: Number, default: 0 },
  },
  { _id: false }
);

const specificationSchema = new mongoose.Schema(
  {
    yearOfConstruction: String,
    model: String,
    variant: String,
    body: String,
    series: String,
    mileage: String,
    power: String,
    cylinderCapacity: String,
    topSpeed: String,
    engineType: String,
    co2Emission: String,
    consumption: String,
    steering: String,
    transmission: String,
    drive: String,
    fuel: String,
    configuration: String,
    interiorMaterial: String,
    interiorColor: String,
    exteriorColor: String,
    manufacturerColorCode: String,
    matchingNumbers: String,
    condition: String,
    usageStatus: String,
    accidentFree: String,
    accidentHistory: String,
    countryOfFirstDelivery: String,
    numberOfOwners: Number,
    carLocation: String,
    latitude: String,
    longitude: String,
  },
  { _id: false }
);

const agentSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    photo: String,
    phone: String,
    email: String,
    company: String,
    companyLogo: String,
    companyDescription: String,
    address: String,
    website: String,
    plan: String,
    joined: Number,
  },
  { _id: false }
);

const carDataSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    listingReference: { type: String },
    price: { type: Number },
    isPriceOnRequest: { type: Boolean, default: false },
    location: { type: String },
    images: [{ type: String }],
    brand: { type: String },
    brand_logo: { type: String },
    variant: { type: String },
    highlights: [{ type: String }],
    videoUrl: { type: String },
    keySpecifications: {
      power: String,
      topSpeed: String,
      engineType: String,
      mileage: String,
    },
    specification: { type: specificationSchema, default: () => ({}) },
    agent: { type: agentSchema, default: () => ({}) },
    documents: [{ type: String }],
    status: { type: String },
    category: { type: String },
    type: { type: String },
    acquisition: { type: String },
    isTrending: { type: Boolean, default: false },
    popularity: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    keywords: [{ type: String }],
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { _id: false }
);

const carRankingSnapshotSchema = new mongoose.Schema(
  {
    carAssetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarAsset",
      required: true,
      unique: true,
      index: true,
    },
    profileName: { type: String, required: true },
    windowDays: { type: Number, required: true },
    computedAt: { type: Date, default: Date.now, index: true },
    rank: { type: Number, index: true },
    carData: { type: carDataSchema, default: () => ({}) },
    // Useful top-level filter fields for fast queries
    filterFields: {
      price: { type: Number, index: true },
      location: { type: String, index: true },
      brand: { type: String, index: true },
      model: { type: String, index: true },
      variant: { type: String, index: true },
      yearOfConstruction: { type: String, index: true },
      mileage: { type: String, index: true },
      status: { type: String, index: true },
      acquisition: { type: String, index: true },
      category: { type: String, index: true },
      type: { type: String, index: true },
      isPriceOnRequest: { type: Boolean, index: true },
      countryOfFirstDelivery: { type: String, index: true },
      fuel: { type: String, index: true },
      transmission: { type: String, index: true },
      body: { type: String, index: true },
      usageStatus: { type: String, index: true },
      condition: { type: String, index: true },
      steering: { type: String, index: true },
      drive: { type: String, index: true },
      exteriorColor: { type: String, index: true },
      interiorColor: { type: String, index: true },
      company: { type: String, index: true },
      latitude: { type: String },
      longitude: { type: String },
      numberOfOwners: { type: Number, index: true },
    },
    breakdown: { type: breakdownSchema, default: () => ({}) },
    signals: { type: signalsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

carRankingSnapshotSchema.index({ rank: 1, computedAt: -1 });
carRankingSnapshotSchema.index({ "breakdown.totalScore": -1, computedAt: -1 });

module.exports = mongoose.model("CarRankingSnapshot", carRankingSnapshotSchema);