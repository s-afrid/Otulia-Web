const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        images: [
            {
                type: String,
                required: true,
            },
        ],

        price: {
            type: Number,
            required: true,
        },

        isPriceOnRequest: {
            type: Boolean,
            default: false,
        },

        category: {
            type: String,
            required: true, // car , bike , yacht, estate
            index: true
        },

        location: {
            type: String,
            required: true,
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
            createdAt: Date
        },

        isFeatured: {
            type: Boolean,
            default: false,
            index: true
        },

        views: {
            type: Number,
            default: 0,
        },

        bookings: {
            type: Number,
            default: 0
        },

        documents: [
            {
                type: String, // URL/Path to document
                required: false
            }
        ],

        status: {
            type: String,
            enum: ['Active', 'Sold', 'Rented'],
            default: 'Active',
            index: true
        },

        type: {
            type: String,
            enum: ['Sale', 'Rent'],
            default: 'Sale',
            index: true
        },
        acquisition: {
            type: String,
            enum: ['rent', 'buy', 'rent/buy'],
            required: true
        }
    },
    { timestamps: true }
);

// Compound index for Featured listings on homepage
listingSchema.index({ status: 1, isFeatured: 1 });
// Compound index for category filtering and sorting by price
listingSchema.index({ status: 1, category: 1, price: 1 });

module.exports = mongoose.model("Listing", listingSchema);