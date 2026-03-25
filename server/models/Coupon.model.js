const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usageLimitPerUser: {
        type: Number,
        default: 1
    },
    usageCount: {
        type: Number,
        default: 0
    },
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Check if coupon is valid for a specific user
couponSchema.methods.isValid = function(userId) {
    const now = new Date();
    const isNotExpired = this.expiresAt > now;

    // Count how many times this user has already used the coupon
    const userUsageCount = userId && this.usedBy 
        ? this.usedBy.filter(id => id.toString() === userId.toString()).length 
        : 0;

    // Check if user has exceeded their individual limit
    const isUnderUserLimit = !userId || userUsageCount < (this.usageLimitPerUser || 1);

    // Check if global usage limit is reached
    const isUnderGlobalLimit = this.usageLimit === null || this.usageCount < this.usageLimit;

    console.log('--- Coupon Validation ---');
    console.log('Code:', this.code);
    console.log('User ID:', userId);
    console.log('User Usage:', userUsageCount, '/', this.usageLimitPerUser);
    console.log('Global Usage:', this.usageCount, '/', this.usageLimit);
    console.log('isNotExpired:', isNotExpired);
    console.log('isActive:', this.isActive);
    console.log('-------------------------');

    return this.isActive && isNotExpired && isUnderGlobalLimit && isUnderUserLimit;
};

module.exports = mongoose.model('Coupon', couponSchema);
