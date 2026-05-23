const mongoose = require("mongoose");

const carRankingProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    windowDays: { type: Number, default: 30, min: 1, max: 365 },
    maxFreshnessDays: { type: Number, default: 90, min: 1, max: 3650 },
    weights: {
      views: { type: Number, default: 10 },
      likes: { type: Number, default: 20 },
      inquiries: { type: Number, default: 30 },
      freshness: { type: Number, default: 20 },
      completeness: { type: Number, default: 20 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarRankingProfile", carRankingProfileSchema);