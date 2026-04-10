const mongoose = require("mongoose");

const bikeAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    listingReference: { type: String, unique: true, sparse: true, index: true },

    price: { type: Number, required: true },
    isPriceOnRequest: { type: Boolean, default: false },
    location: { type: String, required: true },

    images: [{ type: String }],

    brand: { type: String },
    brand_logo: { type: String },
    variant: { type: String },
    highlights: [{ type: String }],
    videoUrl: { type: String },

    keySpecifications: {
      engineCapacity: String,
      mileage: String,
      topSpeed: String,
      fuelType: String
    },

    // Modified based on the image sections: General, Engine, Chassis, Safety, Wheels
    specification: {
      // General
      yearOfConstruction: String,  //
      brand: String,               //
      model: String,               //
      variant: String,
      year: String,                //
      condition: String,           //
      topSpeed: String,

      // Engine & Performance
      engineType: String,          //
      engineCapacityCC: String,    // (Mapped from "803 cc")
      maxPower: String,            //
      maxTorque: String,           //
      transmission: String,        //
      fuelSystem: String,          //
      mileageKM: String,           // (Mapped from "18-20 km/l")
      fuelType: String,            //

      // Chassis & Suspension
      frame: String,               //
      frontSuspension: String,     //
      frontBrake: String,          //
      rearBrake: String,           //

      // Safety & Electronics
      abs: String,                 //
      tractionControl: String,     //
      rideModes: String,           //
      immobilizer: String,         //

      // Wheels & Tyres
      frontWheel: String,          //
      rearWheel: String,           //
      tyreType: String,            //

      // Additional fields from your previous schema
      color: String,
      ownershipCount: Number,
      accidentHistory: String,
      latitude: String,
      longitude: String,
    },

    agent: {
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
      joined: { type: Number },
    },

    documents: [{ type: String }],
    status: { type: String, enum: ['Active', 'Sold', 'Rented', 'Draft'], default: 'Active', index: true },
    category: { type: String, default: 'bikes', index: true },
    type: { type: String, enum: ['Sale', 'Rent'], default: 'Sale' },
    acquisition: {
      type: String,
      enum: ['rent', 'buy', 'rent/buy'],
      required: true,
      index: true
    },

    isTrending: { type: Boolean, default: false, index: true },

    popularity: { type: Number, min: 1, max: 10, index: true },

    views: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },

    keywords: [{ type: String }],

  },
  { timestamps: true }
);

// Compound index for status and price for category filtering
bikeAssetSchema.index({ status: 1, price: 1 });
// Compound index for trending assets on homepage
bikeAssetSchema.index({ status: 1, isTrending: 1 });

module.exports = mongoose.model("BikeAsset", bikeAssetSchema);