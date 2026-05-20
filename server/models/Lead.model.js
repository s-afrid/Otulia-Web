const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Make optional for manual leads
        },
        name: { type: String },
        email: { type: String },
        phoneCode: { type: String },
        phone: { type: String },
        source: { type: String, default: 'Manual' },
        agentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        assetModel: {
            type: String,
            required: true,
            enum: ["CarAsset", "EstateAsset", "YachtAsset", "BikeAsset"],
        },
        assetTitle: {
            type: String,
            required: true,
        },
        assetPrice: {
            type: Number, // To cache the value instead of deeply populating every time
            default: 0
        },
        assetImage: {
            type: String, // To cache the image
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "New",
            enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiating", "Closed"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
