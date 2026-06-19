const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon.model');
const authMiddleware = require('../middleware/auth.middleware');

// Get all coupons


// Validate a coupon code via GET
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

// Validate a coupon code via POST (used by pricing section)
router.post('/validate', authMiddleware, async (req, res) => {
    try {
        const { code, plan } = req.body;
        
        if (!code) {
            return res.status(400).json({ success: false, error: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        console.log("coupon validate post datav", coupon);

        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Coupon not found' });
        }

        if (!coupon.isValid(req.user.id)) {
            return res.status(400).json({ success: false, error: 'Coupon is expired, inactive, or already used' });
        }

        res.json({
            success: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            }
        });
    } catch (error) {
        console.error('Coupon Validation Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
