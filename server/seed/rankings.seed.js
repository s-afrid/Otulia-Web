const mongoose = require("mongoose");
require("dotenv").config();
const RankingCategory = require("../models/RankingCategory.model");
const CarNominee = require("../models/CarNominee.model");
const EstateNominee = require("../models/EstateNominee.model");
const ContentCreatorNominee = require("../models/ContentCreatorNominee.model");

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
  },
  {
    category: {
      title: "Top Content Creators",
      slug: "top-content-creators",
      type: "Content Creator",
      targetType: "Assets",
      shortDescription: "The most popular content creators of 2026.",
      detailedDescription: "Curated list of the world's most influential and popular content creators across YouTube, Instagram, TikTok, and Twitter.",
      status: "Active",
      nomineeLimit: 10,
      nomineeModel: "ContentCreatorNominee",
      displayOrder: 1,
    },
    nominees: [
      {
        name: "MrBeast",
        detail: "Pioneer of high-budget YouTube stunt videos and philanthropist.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
        channelName: "MrBeast",
        youtube: "https://www.youtube.com/@mrbeast",
        instagram: "https://www.instagram.com/mrbeast",
        twitter: "https://twitter.com/mrbeast",
        tiktok: "https://www.tiktok.com/@mrbeast",
        votes: 12500,
        keyDetails: {
          subscribers: "300M",
          views: "50B",
          category: "Entertainment",
          location: "USA",
          joinDate: "2012"
        },
        sources: [
          { title: "YouTube Channel", url: "https://www.youtube.com/@mrbeast" }
        ]
      },
      {
        name: "PewDiePie",
        detail: "One of the most famous individual gaming and vlog content creators on YouTube.",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop",
        channelName: "PewDiePie",
        youtube: "https://www.youtube.com/@pewdiepie",
        instagram: "https://www.instagram.com/pewdiepie",
        twitter: "https://twitter.com/pewdiepie",
        votes: 9800,
        keyDetails: {
          subscribers: "111M",
          views: "29B",
          category: "Gaming",
          location: "Sweden",
          joinDate: "2010"
        },
        sources: [
          { title: "YouTube Channel", url: "https://www.youtube.com/@pewdiepie" }
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
  await ContentCreatorNominee.deleteMany({});
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
      } else if (item.category.nomineeModel === "ContentCreatorNominee") {
        nominee = new ContentCreatorNominee({ ...nom, category: category._id });
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
