// src/data/rankings.js

import { FaBolt } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

export const rankings = {
  hypercars: {
    header: {
      breadcrumbs: ["Home", "Rankings", "Cars", "Best Hypercars of 2026"],
      titleMain: "Best Hypercars",
      titleHighlight: "of 2026",
      description:
        "The ultimate ranking of the world's most extraordinary hypercars based on performance, design, innovation, and overall impact.",
      nominees: "10",
      votes: "2.4K",
      updated: "May 2026",
    },

    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Bugatti Tourbillon",
        description: "The next era of performance and luxury.",
        image:
          "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop",
        stats: [
          { icon: FaBolt, value: "1,800 HP", label: "Power" },
          { icon: LuTimerReset, value: "2.0 sec", label: "0-100 km/h" },
          { icon: MdOutlineSpeed, value: "445 km/h", label: "Top Speed" },
          { icon: TbEngine, value: "8.3L V16", label: "Engine" },
        ],
      },
    ],
  },

  "luxury-cars": {
    header: {
      breadcrumbs: ["Home", "Rankings", "Cars", "Best Luxury Cars"],
      titleMain: "Best Luxury Cars",
      titleHighlight: "2026",
      description: "The finest luxury vehicles available today.",
      nominees: "8",
      votes: "1.6K",
      updated: "May 2026",
    },

    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Rolls Royce Phantom",
        description: "The pinnacle of luxury.",
        image:
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
        stats: [],
      },
      {
        rank: 2,
        rankColor: "#D6A125",
        name: "Rolls Royce Phantom",
        description: "The pinnacle of luxury.",
        image:
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
        stats: [],
      },
    ],
  },
  "luxury-suvs": {
    header: {
      breadcrumbs: ["Home", "Rankings", "Cars", "Best Luxury SUVs"],
      titleMain: "Best Luxury SUVs",
      titleHighlight: "2026",
      description:
        "The most luxurious SUVs offering premium comfort, technology, and prestige.",
      nominees: "12",
      votes: "1.9K",
      updated: "May 2026",
    },

    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Range Rover SV",
        description: "Luxury, comfort and off-road capability combined.",
        image:
          "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop",
        stats: [],
      },
    ],
  },

  "electric-cars": {
    header: {
      breadcrumbs: ["Home", "Rankings", "Cars", "Electric Cars"],
      titleMain: "Best Electric Cars",
      titleHighlight: "2026",
      description:
        "The leading electric vehicles redefining performance and sustainability.",
      nominees: "15",
      votes: "3.1K",
      updated: "May 2026",
    },

    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Tesla Model S Plaid",
        description: "Extreme performance with cutting-edge EV technology.",
        image:
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop",
        stats: [],
      },
    ],
  },

  "sports-cars": {
    header: {
      breadcrumbs: ["Home", "Rankings", "Cars", "Sports Cars"],
      titleMain: "Best Sports Cars",
      titleHighlight: "2026",
      description:
        "Precision-engineered sports cars built for driving enthusiasts.",
      nominees: "10",
      votes: "2.2K",
      updated: "May 2026",
    },

    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Porsche 911 GT3 RS",
        description: "Track-focused performance with iconic heritage.",
        image:
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
        stats: [],
      },
    ],
  },

  supercars: {
    header: {
      breadcrumbs: ["Home", "Rankings", "Cars", "Supercars"],
      titleMain: "Best Supercars",
      titleHighlight: "2026",
      description:
        "The world's most exciting supercars blending speed and design.",
      nominees: "9",
      votes: "1.8K",
      updated: "May 2026",
    },

    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Ferrari SF90 XX",
        description: "Ferrari's most extreme road-going supercar.",
        image:
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop",
        stats: [],
      },
    ],
  },

  "car-brands": {
    header: {
      breadcrumbs: ["Home", "Rankings", "Cars", "Brands"],
      titleMain: "Best Car Brands",
      titleHighlight: "2026",
      description:
        "The most respected automotive brands ranked by innovation and prestige.",
      nominees: "20",
      votes: "4.8K",
      updated: "May 2026",
    },

    cards: [
      {
        rank: 1,
        rankColor: "#D6A125",
        name: "Porsche",
        description:
          "Benchmark for performance, quality and driving experience.",
        image:
          "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop",
        stats: [],
      },
    ],
  },
};
