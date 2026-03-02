const mongoose = require("mongoose");

const yachtAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    isPriceOnRequest: { type: Boolean, default: false },
    location: { type: String, required: true },

    images: [{ type: String }],

    brand: { type: String },
    brand_logo: { type: String },
    builder: { type: String },
    highlights: [{ type: String }],
    videoUrl: { type: String },

    // Modified based on the 6 icons in the image header
    keySpecifications: {
      length: String,           // e.g. "27 M length"
      bathrooms: String,
      fuelCapacity: String,     // e.g. "9,500 L fuel capacity"
      engineType: String,
      bedrooms: String,         // e.g. "7"
      topSpeed: String          // e.g. "28 knots"
    },

    // Detailed fields from the "General" and "Fuel" columns in the image table
    specification: {
      // General Column
      yearOfConstruction: String, //
      brandBuilder: String,       //
      model: String,              //
      yachtType: String,          //
      usageHours: String,         //
      topSpeed: String,           //
      enginePower: String,        //
      engineType: String,
      cruisingSpeed: String,      //
      fuelConsumption: String,    //
      transmission: String,       //
      hullMaterial: String,       //
      length: String,
      beam: String,
      draft: String,
      guestCapacity: String,
      crewCapacity: String,
      yachtLocation: String,

      // Fuel / Right Column
      fuelType: String,           //
      configuration: String,      //
      interiorMaterial: String,   //
      interiorColor: String,      //
      exteriorColor: String,      //
      manufacturerColorCode: String, //
      matchingNumbers: String,    //
      condition: String,          //
      usageStatus: String,        // (New / Used)
      countryOfFirstDelivery: String, //
      numberOfOwners: String,     //
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
      plan: String,
      joined: { type: Number },
    },

    documents: [{ type: String }],
    status: { type: String, enum: ['Active', 'Sold', 'Rented', 'Draft'], default: 'Active', index: true },
    category: { type: String, default: 'yachts', index: true },
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
yachtAssetSchema.index({ status: 1, price: 1 });
// Compound index for trending assets on homepage
yachtAssetSchema.index({ status: 1, isTrending: 1 });

module.exports = mongoose.model("YachtAsset", yachtAssetSchema);