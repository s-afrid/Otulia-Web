// src/data/rankings.js

import { FaBolt, FaHome, FaTree, FaBed, FaBath, FaUsers, FaEye, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

export const rankings = {
  // ----------------------------------------------------
  // CARS / AUTOMOTIVE
  // ----------------------------------------------------
  hypercars: {
    header: {
      breadcrumbs: ["Home", "Rankings", "Cars", "Best Hyper Cars In 2026"],
      titleMain: "Best Hypercars",
      titleHighlight: "in 2026",
      description:
        "The ultimate ranking of the world's most extraordinary hypercars based on performance, design, innovation, and overall impact.",
      nominees: "10",
      votes: "73.5K",
      updated: "May 2026",
      bannerImage: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1600&auto=format&fit=crop",
    },
    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Ferrari F80",
        detail: "The Italian Pride",
        description: "The Italian Pride. Ferrari's definitive hybrid hypercar pushing the boundaries of aerodynamic downforce and V6 hybrid supremacy.",
        image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200&auto=format&fit=crop",
        brand: "Ferrari",
        model: "F80 Coupe",
        year: "2026",
        productionLimit: "799 Units",
        country: "Italy",
        origin: "Italy",
        votes: 13,
        rawVotes: 13,
        keyDetails: {
          power: "1184 HP",
          acceleration: "2.0 Sec",
          topSpeed: "350 Km/h",
          engine: "V6 Hybrid",
          brand: "Ferrari",
          model: "F80 Coupe",
          year: "2026",
          productionLimit: "799 Units",
          country: "Italy"
        },
        sources: [
          { title: "Ferrari Official", url: "https://www.ferrari.com" }
        ],
        status: "Leading",
        statusIcon: "trophy",
        statusColor: "#D6A125"
      },
      {
        rank: 2,
        rankColor: "#C0C0C0",
        name: "McLaren W1",
        detail: "The New Soul",
        description: "The New Soul. The true spiritual successor to the F1 and P1, combining an all-new 1258 HP V8 hybrid engine with active aerodynamic wings.",
        image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1200&auto=format&fit=crop",
        brand: "McLaren",
        model: "W1",
        year: "2026",
        productionLimit: "399 Units",
        country: "United Kingdom",
        origin: "United Kingdom",
        votes: 11,
        rawVotes: 11,
        keyDetails: {
          power: "1258 HP",
          acceleration: "2.0 Sec",
          topSpeed: "350 Km/h",
          engine: "V8 Hybrid",
          brand: "McLaren",
          model: "W1",
          year: "2026",
          productionLimit: "399 Units",
          country: "United Kingdom"
        },
        sources: [
          { title: "McLaren Official", url: "https://cars.mclaren.com" }
        ],
        status: "Strong Contender",
        statusIcon: "star",
        statusColor: "#6B7280"
      },
      {
        rank: 3,
        rankColor: "#CD7F32",
        name: "Bugatti Tourbillon",
        detail: "Pour L'Éternité",
        description: "Pour L'Éternité. An 1,800 HP naturally aspirated V16 hybrid masterpiece designed for timeless elegance and 445 km/h top speeds.",
        image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop",
        brand: "Bugatti",
        model: "Tourbillon",
        year: "2026",
        productionLimit: "250 Units",
        country: "France",
        origin: "France",
        votes: 9,
        rawVotes: 9,
        keyDetails: {
          power: "1800 HP",
          acceleration: "2.0 Sec",
          topSpeed: "445 Km/h",
          engine: "8.3L V16",
          brand: "Bugatti",
          model: "Tourbillon",
          year: "2026",
          productionLimit: "250 Units",
          country: "France"
        },
        sources: [
          { title: "Bugatti Official", url: "https://tourbillon.bugatti.com" }
        ],
        status: "Strong Contender",
        statusIcon: "star",
        statusColor: "#6B7280"
      },
      {
        rank: 4,
        rankColor: "#6B7280",
        name: "Koenigsegg Jesko Absolut",
        detail: "Maximum Velocity",
        description: "Engineered specifically to achieve the highest top speed of any Koenigsegg or street-legal production car in history.",
        image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop",
        brand: "Koenigsegg",
        model: "Jesko Absolut",
        year: "2026",
        productionLimit: "125 Units",
        country: "Sweden",
        origin: "Sweden",
        votes: 7,
        rawVotes: 7,
        keyDetails: {
          power: "1600 HP",
          acceleration: "2.2 Sec",
          topSpeed: "530 Km/h",
          engine: "5.0L Twin Turbo V8",
          brand: "Koenigsegg",
          model: "Jesko Absolut",
          year: "2026",
          productionLimit: "125 Units",
          country: "Sweden"
        },
        sources: [
          { title: "Koenigsegg Official", url: "https://www.koenigsegg.com" }
        ],
        status: "Contender",
        statusIcon: "star",
        statusColor: "#6B7280"
      }
    ]
  },

  "fastest-cars": {
    header: {
      breadcrumbs: ["Home", "Rankings", "Cars", "Fastest Cars Of 2026"],
      titleMain: "Fastest Cars",
      titleHighlight: "of 2026",
      description:
        "The fastest accelerating and highest top-speed production vehicles built to break world records.",
      nominees: "8",
      votes: "45.2K",
      updated: "May 2026",
      bannerImage: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1600&auto=format&fit=crop",
    },
    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Koenigsegg Jesko Absolut",
        detail: "530+ Km/h Theoretical Record",
        description: "The lowest drag coefficient hypercar built for pure straight-line supersonic dominance.",
        image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop",
        brand: "Koenigsegg",
        model: "Jesko Absolut",
        year: "2026",
        productionLimit: "125 Units",
        country: "Sweden",
        origin: "Sweden",
        votes: 28,
        rawVotes: 28,
        keyDetails: {
          power: "1600 HP",
          acceleration: "2.2 Sec",
          topSpeed: "530 Km/h",
          engine: "5.0L Twin Turbo V8",
          brand: "Koenigsegg",
          model: "Jesko Absolut",
          year: "2026",
          productionLimit: "125 Units",
          country: "Sweden"
        },
        status: "Leading",
        statusIcon: "trophy"
      }
    ]
  },

  "luxury-cars": {
    header: {
      breadcrumbs: ["Home", "Rankings", "Cars", "Best Luxury Cars Of 2026"],
      titleMain: "Best Luxury Cars",
      titleHighlight: "of 2026",
      description: "The finest luxury sedans and coupes embodying supreme craftsmanship, tranquility, and prestige.",
      nominees: "8",
      votes: "32.1K",
      updated: "May 2026",
      bannerImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
    },
    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Rolls Royce Phantom VIII",
        detail: "The Ultimate Statement of Luxury",
        description: "The pinnacle of motor car luxury. Hand-crafted whisper-quiet interior with starlight headliner and effortless V12 power.",
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
        brand: "Rolls-Royce",
        model: "Phantom",
        year: "2026",
        productionLimit: "Bespoke",
        country: "United Kingdom",
        origin: "United Kingdom",
        votes: 24,
        rawVotes: 24,
        keyDetails: {
          power: "563 HP",
          acceleration: "5.1 Sec",
          topSpeed: "250 Km/h",
          engine: "6.75L Twin Turbo V12",
          brand: "Rolls-Royce",
          model: "Phantom",
          year: "2026",
          productionLimit: "Bespoke",
          country: "United Kingdom"
        },
        status: "Leading",
        statusIcon: "trophy"
      }
    ]
  },

  // ----------------------------------------------------
  // REAL ESTATE
  // ----------------------------------------------------
  "best-luxury-estates": {
    header: {
      breadcrumbs: ["Home", "Rankings", "Real Estate", "Best Luxury Estates In 2026"],
      titleMain: "Best Luxury Estates",
      titleHighlight: "in 2026",
      description:
        "An extraordinary selection of the world's finest architectural masterpieces, ultra-luxury estates, and prime residential sanctuaries.",
      nominees: "8",
      votes: "48.9K",
      updated: "May 2026",
      bannerImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
    },
    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Beverly Hills Ultra Estate",
        detail: "Beverly Hills, California, USA",
        description: "An extraordinary architectural masterpiece set on 5 private acres in Beverly Hills with panoramic skyline views, infinity waterfall pools, and full wellness spa pavilion.",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
        brand: "Beverly Hills, California, USA",
        model: "Mega Mansion",
        price: "$ 195,000,000",
        votes: 35,
        rawVotes: 35,
        isEstate: true,
        showBadgeOnImage: true,
        badge: "NEW FOR 2026",
        keyDetails: {
          price: "$ 195,000,000",
          livingArea: "45,000 sq ft",
          landSize: "5.2 Acres",
          bedroom: "12 Beds",
          bathroom: "18 Baths",
          propertyType: "Modern Mega Mansion",
          availabilityStatus: "For Sale"
        },
        sources: [
          { title: "Sotheby's International Realty", url: "https://www.sothebysrealty.com" },
          { title: "Architectural Digest Feature", url: "https://www.architecturaldigest.com" }
        ],
        status: "Leading",
        statusIcon: "trophy"
      },
      {
        rank: 2,
        rankColor: "#C0C0C0",
        name: "Palm Jumeirah Signature Villa",
        detail: "Palm Jumeirah, Dubai, UAE",
        description: "Waterfront sanctuary with private beach access, custom marble finishes, glass elevator, rooftop sky lounge, and private yacht berth.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
        brand: "Palm Jumeirah, Dubai, UAE",
        model: "Waterfront Villa",
        price: "$ 82,000,000",
        votes: 27,
        rawVotes: 27,
        isEstate: true,
        showBadgeOnImage: false,
        keyDetails: {
          price: "$ 82,000,000",
          livingArea: "32,000 sq ft",
          landSize: "Private Beach",
          bedroom: "8 Beds",
          bathroom: "11 Baths",
          propertyType: "Waterfront Villa",
          availabilityStatus: "For Sale"
        },
        sources: [
          { title: "Luxury Real Estate Dubai", url: "https://www.luxhabitat.ae" }
        ],
        status: "Strong Contender",
        statusIcon: "star"
      },
      {
        rank: 3,
        rankColor: "#CD7F32",
        name: "Bel Air Modern Compound",
        detail: "Bel Air, Los Angeles, USA",
        description: "Spectacular ultra-modern compound perched atop Bel Air hills featuring a 100-ft glass-bottom cantilever pool and 20-car auto gallery.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
        brand: "Bel Air, California, USA",
        model: "Hilltop Compound",
        price: "$ 125,000,000",
        votes: 19,
        rawVotes: 19,
        isEstate: true,
        keyDetails: {
          price: "$ 125,000,000",
          livingArea: "38,000 sq ft",
          landSize: "3.8 Acres",
          bedroom: "10 Beds",
          bathroom: "15 Baths",
          propertyType: "Hilltop Compound",
          availabilityStatus: "For Sale"
        },
        sources: [
          { title: "The Agency RE", url: "https://www.theagencyre.com" }
        ],
        status: "Strong Contender",
        statusIcon: "star"
      }
    ]
  },

  // ----------------------------------------------------
  // CONTENT CREATORS
  // ----------------------------------------------------
  "top-content-creators": {
    header: {
      breadcrumbs: ["Home", "Rankings", "Content Creators", "Top Content Creators In 2026"],
      titleMain: "Top Content Creators",
      titleHighlight: "in 2026",
      description:
        "The world's most influential and iconic digital creators ranked by engagement, global reach, creativity, and verified audience votes.",
      nominees: "10",
      votes: "142.8K",
      updated: "May 2026",
      bannerImage: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1600&auto=format&fit=crop",
    },
    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "MrBeast",
        channelName: "MrBeast",
        detail: "Pioneer of large-scale entertainment and philanthropy",
        description: "Pioneer of viral philanthropy and ultra-high-production challenge entertainment. The most subscribed individual creator in YouTube history.",
        image: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?q=80&w=1200&auto=format&fit=crop",
        profilePic: "https://unavatar.io/youtube/@mrbeast",
        brand: "Greenville, North Carolina, USA",
        location: "USA",
        joinDate: "Feb 2012",
        genre: "Entertainment / Challenges",
        votes: 52,
        rawVotes: 52,
        isContentCreator: true,
        youtube: "https://www.youtube.com/@mrbeast",
        instagram: "https://www.instagram.com/mrbeast",
        twitter: "https://twitter.com/mrbeast",
        tiktok: "https://www.tiktok.com/@mrbeast",
        keyDetails: {
          subscribers: "310M+",
          views: "58B+",
          location: "USA",
          joinDate: "Feb 2012",
          category: "Entertainment"
        },
        sources: [
          { title: "YouTube Channel", url: "https://www.youtube.com/@mrbeast" },
          { title: "Official Website", url: "https://www.mrbeast.com" }
        ],
        status: "Leading",
        statusIcon: "trophy"
      },
      {
        rank: 2,
        rankColor: "#C0C0C0",
        name: "Supercar Blondie",
        channelName: "Supercar Blondie",
        detail: "Global automotive entertainer and design curator",
        description: "The world's leading automotive creator, reviewing the rarest hypercars, futuristic concept vehicles, and luxury tech.",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
        profilePic: "https://unavatar.io/youtube/@SupercarBlondie",
        brand: "Dubai, UAE",
        location: "UAE / Global",
        joinDate: "Sep 2017",
        genre: "Supercars / Tech",
        votes: 38,
        rawVotes: 38,
        isContentCreator: true,
        youtube: "https://www.youtube.com/@SupercarBlondie",
        instagram: "https://www.instagram.com/supercarblondie",
        twitter: "https://twitter.com/supercarblondie",
        tiktok: "https://www.tiktok.com/@supercarblondie",
        keyDetails: {
          subscribers: "19.5M+",
          views: "3.8B+",
          location: "Dubai, UAE",
          joinDate: "Sep 2017",
          category: "Automotive"
        },
        sources: [
          { title: "YouTube Channel", url: "https://www.youtube.com/@SupercarBlondie" },
          { title: "SBX Cars Platform", url: "https://sbxcars.com" }
        ],
        status: "Strong Contender",
        statusIcon: "star"
      },
      {
        rank: 3,
        rankColor: "#CD7F32",
        name: "PewDiePie",
        channelName: "PewDiePie",
        detail: "Legendary gaming & cultural icon",
        description: "A cultural pioneer who shaped YouTube content creation over a decade with authentic commentary, humor, and creative storytelling.",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
        profilePic: "https://unavatar.io/youtube/@pewdiepie",
        brand: "Tokyo, Japan",
        location: "Japan / Sweden",
        joinDate: "Apr 2010",
        genre: "Gaming / Commentary",
        votes: 29,
        rawVotes: 29,
        isContentCreator: true,
        youtube: "https://www.youtube.com/@pewdiepie",
        instagram: "https://www.instagram.com/pewdiepie",
        twitter: "https://twitter.com/pewdiepie",
        keyDetails: {
          subscribers: "111M+",
          views: "29B+",
          location: "Tokyo, Japan",
          joinDate: "Apr 2010",
          category: "Gaming"
        },
        sources: [
          { title: "YouTube Channel", url: "https://www.youtube.com/@pewdiepie" }
        ],
        status: "Strong Contender",
        statusIcon: "star"
      }
    ]
  }
};

