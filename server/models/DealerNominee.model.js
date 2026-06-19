const mongoose = require('mongoose');

const dealerNomineeSchema = new mongoose.Schema({
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
    }]
}, { timestamps: true });

module.exports = mongoose.model('DealerNominee', dealerNomineeSchema);
