const mongoose = require('mongoose');

const carNomineeSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RankingCategory',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    detail: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    targetType: {
        type: String,
        enum: ['Assets', 'Dealers'],
        default: 'Assets'
    },
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'assetModel',
        required: false
    },
    assetModel: {
        type: String,
        enum: ['CarAsset', 'Listing'],
        required: false
    },
    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    votes: {
        type: Number,
        default: 0
    },
    fakeVotes: {
        type: Number,
        default: 0
    },
    votedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    brand: {
        type: String,
        default: ''
    },
    model: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    listingLink: {
        type: String,
        default: ''
    },
    keyDetails: {
        price: { type: String, default: '' },
        year: { type: String, default: '' },
        engine: { type: String, default: '' },
        power: { type: String, default: '' },
        topSpeed: { type: String, default: '' },
        model: { type: String, default: '' },
        drivetrain: { type: String, default: '' },
        transmission: { type: String, default: '' },
        productionUnits: { type: String, default: '' },
        country: { type: String, default: '' },
        fuelType: { type: String, default: '' }
    },
    sources: [{
        title: { type: String, default: '' },
        url: { type: String, default: '' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('CarNominee', carNomineeSchema);
