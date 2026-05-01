const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon.model');
const authMiddleware = require('../middleware/auth.middleware');

// Get all coupons


// Validate a coupon code
router.get('/validate/:code', authMiddleware, async (req, res) => {
    try {
        const { code } = req.params;
        
        // 2. Validate Coupon existence and status
    

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        console.log("coupon datav", coupon);

        if (!coupon) {
            return res.status(404).json({ valid: false, message: 'Coupon not found' });
        }

        if (!coupon.isValid(req.user.id)) {
            return res.status(400).json({ valid: false, message: 'Coupon is expired, inactive, or already used' });
        }

        res.json({
            valid: true,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            code: coupon.code
        });
    } catch (error) {
        console.error('Coupon Validation Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
