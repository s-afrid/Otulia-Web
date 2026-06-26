const mongoose = require('mongoose');

const rankingCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    type: {
        type: String,
        enum: ['Cars', 'Real Estate', 'Yachts', 'Bikes', 'Content Creator', 'Other'],
        default: 'Cars'
    },
    targetType: {
        type: String,
        enum: ['Assets', 'Dealers'],
        default: 'Assets'
    },
    shortDescription: {
        type: String,
        trim: true
    },
    detailedDescription: {
        type: String,
        trim: true
    },
    categoryImage: {
        type: String,
        default: ''
    },
    bannerImage: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    },
    votingPeriodStart: {
        type: Date,
        default: Date.now
    },
    votingPeriodEnd: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
    },
    nomineeLimit: {
        type: Number,
        default: 10
    },
    allowMultipleVotes: {
        type: Boolean,
        default: true
    },
    showInPopularLinks: {
        type: Boolean,
        default: true
    },
    displayOrder: {
        type: Number,
        default: 1
    },
    featuredCategory: {
        type: Boolean,
        default: true
    },
    categoryColor: {
        type: String,
        default: '#6366F1'
    },
    status: {
        type: String,
        enum: ['Draft', 'Active'],
        default: 'Draft'
    },
    assetNominees: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'nomineeModel'
    }],
    dealerNominees: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'nomineeModel'
    }],
    nomineeModel: {
        type: String,
        enum: ['CarNominee', 'EstateNominee', 'YachtNominee', 'BikeNominee', 'ContentCreatorNominee', 'OtherNominee', 'AssetNominee', 'DealerNominee'],
        default: 'OtherNominee'
    }
}, { timestamps: true });

module.exports = mongoose.model('RankingCategory', rankingCategorySchema);
