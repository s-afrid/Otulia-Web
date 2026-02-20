const mongoose = require('mongoose');
const Coupon = require('../models/Coupon.model');
require('dotenv').config();

const coupons = [
    {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        expiresAt: new Date('2026-12-31'),
        usageLimit: null
    },
    {
        code: 'OFF50',
        discountType: 'fixed',
        discountValue: 50,
        expiresAt: new Date('2026-12-31'),
        usageLimit: 100
    },
    {
        code: 'VIP20',
        discountType: 'percentage',
        discountValue: 20,
        expiresAt: new Date('2026-12-31'),
        usageLimit: 10
    }
];

const seedCoupons = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing coupons
        await Coupon.deleteMany({});
        console.log('Cleared existing coupons');

        // Insert new coupons
        await Coupon.insertMany(coupons);
        console.log('Seeded coupons successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding coupons:', error);
        process.exit(1);
    }
};

seedCoupons();
