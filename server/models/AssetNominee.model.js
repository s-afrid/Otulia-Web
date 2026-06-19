const mongoose = require('mongoose');

const assetNomineeSchema = new mongoose.Schema({
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
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'assetModel',
        required: false
    },
    assetModel: {
        type: String,
        enum: ['CarAsset', 'EstateAsset', 'YachtAsset', 'BikeAsset', 'Listing'],
        required: false
    },
    votes: {
        type: Number,
        default: 0
    },
    votedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('AssetNominee', assetNomineeSchema);
