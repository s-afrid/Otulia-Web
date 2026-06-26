const mongoose = require('mongoose');

const contentCreatorNomineeSchema = new mongoose.Schema({
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
        enum: ['Listing'],
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
    votedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    channelName: {
        type: String,
        default: ''
    },
    banner: {
        type: String,
        default: ''
    },
    youtube: {
        type: String,
        default: ''
    },
    instagram: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    tiktok: {
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
        subscribers: { type: String, default: '' },
        views: { type: String, default: '' },
        category: { type: String, default: '' },
        location: { type: String, default: '' },
        joinDate: { type: String, default: '' }
    },
    sources: [{
        title: { type: String, default: '' },
        url: { type: String, default: '' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('ContentCreatorNominee', contentCreatorNomineeSchema);
