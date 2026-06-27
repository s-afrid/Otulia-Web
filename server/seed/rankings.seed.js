const mongoose = require("mongoose");
require("dotenv").config();
const RankingCategory = require("../models/RankingCategory.model");
const CarNominee = require("../models/CarNominee.model");
const EstateNominee = require("../models/EstateNominee.model");

const seedData = [
  {
    category: {
      title: "Best Hypercars",
      slug: "hypercars",
      type: "Cars",
      targetType: "Assets",
      shortDescription: "The ultimate ranking of the world's most extraordinary hypercars based on performance, design, innovation, and overall impact.",
      detailedDescription: "The ultimate ranking of the world's most extraordinary hypercars based on performance, design, innovation, and overall impact.",
      status: "Active",
      nomineeLimit: 10,
      nomineeModel: "CarNominee",
      displayOrder: 1,
    },
    nominees: [
      {
        name: "Bugatti Tourbillon",
        detail: "The next era of performance and luxury.",
        image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop",
        brand: "France",
        model: "2 Door Coupe",
        votes: 73500,
        keyDetails: {
          power: "1,800 HP",
          topSpeed: "445 km/h",
          engine: "8.3L V16",
          transmission: "2.0 sec"
        },
        sources: [
          { title: "Bugatti Official", url: "https://www.bugatti.com" }
        ]
      }
    ]
  },
  {
    category: {
      title: "Best Luxury Cars",
      slug: "luxury-cars",
      type: "Cars",
      targetType: "Assets",
      shortDescription: "The finest luxury vehicles available today.",
      detailedDescription: "The finest luxury vehicles available today.",
      status: "Active",
      nomineeLimit: 10,
      nomineeModel: "CarNominee",
      displayOrder: 2,
    },
    nominees: [
      {
        name: "Rolls Royce Phantom",
        detail: "The pinnacle of luxury.",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
        brand: "United Kingdom",
        model: "Sedan",
        votes: 1600,
        keyDetails: {
          power: "563 HP",
          topSpeed: "250 km/h",
          engine: "6.75L V12"
        }
      }
    ]
  },
  {
    category: {
      title: "Best Luxury Estates",
      slug: "best-luxury-estates",
      type: "Real Estate",
      targetType: "Assets",
      shortDescription: "The most prestigious luxury estates of 2026.",
      detailedDescription: "An extraordinary selection of the world's finest architectural masterpieces, ultra-luxury estates, and prime residential developments.",
      status: "Active",
      nomineeLimit: 10,
      nomineeModel: "EstateNominee",
      displayOrder: 1,
    },
    nominees: [
      {
        name: "Beverly Hills Ultra Estate",
        detail: "An extraordinary architectural masterpiece set on 5 acres in Beverly Hills. This ultra-luxury estate offers unmatched privacy, world-class amenities, and breathtaking city views.",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
        brand: "Beverly Hills, California, USA",
        model: "Mansion",
        votes: 3100,
        keyDetails: {
          price: "$195,000,000",
          livingArea: "45,000 sq ft",
          landSize: "5 Acres",
          bedroom: "12",
          bathroom: "18",
          propertyType: "Mansion",
          availabilityStatus: "For Sale"
        },
        sources: [
          { title: "Zillow Listing", url: "https://www.zillow.com" }
        ]
      },
      {
        name: "Palm Jumeirah Signature Villa",
        detail: "A waterfront sanctuary with resort-style living and breathtaking views of the Arabian Gulf and Dubai skyline. This signature villa offers exceptional design and premium finishes.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
        brand: "Palm Jumeirah, Dubai, UAE",
        model: "Villa",
        votes: 2800,
        keyDetails: {
          price: "$82,000,000",
          livingArea: "32,000 sq ft",
          landSize: "Waterfront",
          bedroom: "8",
          bathroom: "10",
          propertyType: "Villa",
          availabilityStatus: "For Sale"
        },
        sources: [
          { title: "Dubai Sotheby's", url: "https://www.sothebysrealty.com" }
        ]
      }
    ]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // Clean existing
  await RankingCategory.deleteMany({});
  await CarNominee.deleteMany({});
  await EstateNominee.deleteMany({});
  console.log("Cleaned existing rankings data");

  for (const item of seedData) {
    const category = new RankingCategory(item.category);
    await category.save();
    console.log(`Saved Category: ${category.title}`);

    const nomineeIds = [];
    for (const nom of item.nominees) {
      let nominee;
      if (item.category.nomineeModel === "CarNominee") {
        nominee = new CarNominee({ ...nom, category: category._id });
      } else if (item.category.nomineeModel === "EstateNominee") {
        nominee = new EstateNominee({ ...nom, category: category._id });
      }
      await nominee.save();
      nomineeIds.push(nominee._id);
      console.log(` - Saved Nominee: ${nominee.name}`);
    }

    category.assetNominees = nomineeIds;
    await category.save();
  }

  console.log("Seeding completed successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
