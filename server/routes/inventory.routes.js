const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/User.model');
const CarAsset = require('../models/CarAsset.model');
const EstateAsset = require('../models/EstateAsset.model');
const BikeAsset = require('../models/BikeAsset.model');
const YachtAsset = require('../models/YachtAsset.model');
const UserActivity = require('../models/UserActivity.model');
const Lead = require('../models/Lead.model');

/**
 * GET INVENTORY DASHBOARD DATA
 * Advanced features gated by plan: Premium Basic vs Business VIP
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { timeframe = 'Week', interval = 'Week' } = req.query;
        
        const user = await User.findById(userId).populate('myListings.item');

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Gating for Freemium
        if (user.plan === 'Freemium') {
            return res.status(403).json({ error: 'INSUFFICIENT_PLAN', message: 'Please upgrade to access the Inventory Management System.' });
        }

        const listings = user.myListings.filter(l => l.item && typeof l.item.toObject === 'function');
        const assetIds = listings.map(l => l.item._id);

        // 1. Time Ranges for Trends
        const now = new Date();
        let days = 7;
        if (timeframe === 'Month' || interval === 'Week') days = 30;
        else if (timeframe === 'Year' || interval === 'Year') days = 365;
        else if (interval === 'Day') days = 1;
        else if (interval === 'Month') days = 90;

        const rangeStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        const prevRangeStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);

        // 2. Fetch All Relevant Data for Stat Calculation
        const currentActivities = await UserActivity.find({
            assetId: { $in: assetIds },
            createdAt: { $gte: prevRangeStart }
        });

        const currentLeads = await Lead.find({
            agentId: userId,
            createdAt: { $gte: prevRangeStart }
        }).populate('sender', 'name email phone profilePicture');

        // Views calculation
        const viewsCurrent = currentActivities.filter(a => a.activityType === 'VIEW' && a.createdAt >= rangeStart).length;
        const viewsPrev = currentActivities.filter(a => a.activityType === 'VIEW' && a.createdAt < rangeStart).length;
        const viewsChange = viewsPrev > 0 ? (((viewsCurrent - viewsPrev) / viewsPrev) * 100).toFixed(1) : (viewsCurrent > 0 ? 100 : 0);

        // Leads calculation
        const leadsCurrent = (currentActivities.filter(a => a.activityType !== 'VIEW' && a.createdAt >= rangeStart).length) +
                         (currentLeads.filter(l => l.createdAt >= rangeStart).length);
        const leadsPrev = (currentActivities.filter(a => a.activityType !== 'VIEW' && a.createdAt < rangeStart).length) +
                             (currentLeads.filter(l => l.createdAt < rangeStart).length);
        const leadsChange = leadsPrev > 0 ? (((leadsCurrent - leadsPrev) / leadsPrev) * 100).toFixed(1) : (leadsCurrent > 0 ? 100 : 0);

        // Saved calculation
        const savedCurrent = await User.countDocuments({ 'favorites.assetId': { $in: assetIds }, 'favorites.addedAt': { $gte: rangeStart } });
        const savedPrev = await User.countDocuments({ 'favorites.assetId': { $in: assetIds }, 'favorites.addedAt': { $gte: prevRangeStart, $lt: rangeStart } });
        const savedChange = savedPrev > 0 ? (((savedCurrent - savedPrev) / savedPrev) * 100).toFixed(1) : (savedCurrent > 0 ? 100 : 0);

        // Lead Value calculation
        const leadAssetIdsCurrent = new Set([
            ...currentLeads.filter(l => l.createdAt >= rangeStart).map(l => l.assetId?.toString()),
            ...currentActivities.filter(a => a.activityType !== 'VIEW' && a.createdAt >= rangeStart).map(a => a.assetId?.toString())
        ].filter(Boolean));

        const leadAssetIdsPrev = new Set([
            ...currentLeads.filter(l => l.createdAt < rangeStart).map(l => l.assetId?.toString()),
            ...currentActivities.filter(a => a.activityType !== 'VIEW' && a.createdAt < rangeStart).map(a => a.assetId?.toString())
        ].filter(Boolean));

        let estValueCurrent = 0;
        let estValuePrev = 0;

        listings.forEach(l => {
            const item = l.item;
            const price = item.price || 0;
            if (leadAssetIdsCurrent.has(item._id.toString())) estValueCurrent += price;
            if (leadAssetIdsPrev.has(item._id.toString())) estValuePrev += price;
        });
        const valueChange = estValuePrev > 0 ? (((estValueCurrent - estValuePrev) / estValuePrev) * 100).toFixed(1) : (estValueCurrent > 0 ? 100 : 0);

        const stats = {
            totalAssets: listings.length,
            totalViews: viewsCurrent,
            totalLeads: leadsCurrent,
            avgConversion: viewsCurrent > 0 ? ((leadsCurrent / viewsCurrent) * 100).toFixed(2) : 0,
            activeCount: listings.filter(l => l.item.status === 'Active').length,
            closedCount: listings.filter(l => l.item.status !== 'Active').length,
            savedCount: savedCurrent,
            estLeadValue: estValueCurrent,
            trends: {
                views: { current: viewsCurrent, previous: viewsPrev, change: viewsChange },
                leads: { current: leadsCurrent, previous: leadsPrev, change: leadsChange },
                saved: { current: savedCurrent, previous: savedPrev, change: savedChange },
                value: { current: estValueCurrent, previous: estValuePrev, change: valueChange }
            }
        };

        const detailedItems = listings.map(l => {
            const item = l.item;
            const assetId = item._id.toString();
            
            // Calculate leads for this specific asset
            const assetLeads = [
                ...currentLeads.filter(lead => lead.assetId?.toString() === assetId),
                ...currentActivities.filter(act => act.assetId?.toString() === assetId && act.activityType !== 'VIEW')
            ].length;

            const itemObj = item.toObject();

            return {
                ...itemObj,
                id: assetId,
                itemModel: l.itemModel,
                title: item.title || item.propertyName || item.yachtName || item.name || "Unnamed Asset",
                price: item.price || 0,
                status: item.status || 'Draft',
                views: item.views || 0,
                leads: assetLeads,
                type: item.type,
                images: item.images || [],
                createdAt: item.createdAt,
                category: l.itemModel,
                // Ensure specific fields are at the top level for easy access
                propertyName: item.propertyName,
                yachtName: item.yachtName,
                name: item.name,
                make: item.make || item.brand || item.builder,
                model: item.model || item.specification?.model,
                fuelType: item.fuelType || item.specification?.fuel || item.specification?.fuelType,
                transmission: item.transmission || item.specification?.transmission,
                year: item.year || item.specification?.yearOfConstruction,
                location: item.location || item.specification?.carLocation || item.specification?.yachtLocation || item.specification?.city,
                description: item.description
            };
        });

        // Daily Trends for Sparklines
        const dailyTrends = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const start = new Date(date.setHours(0, 0, 0, 0));
            const end = new Date(date.setHours(23, 59, 59, 999));

            const dViews = currentActivities.filter(a => a.activityType === 'VIEW' && a.createdAt >= start && a.createdAt <= end).length;
            const dLeads = (currentActivities.filter(a => a.activityType !== 'VIEW' && a.createdAt >= start && a.createdAt <= end).length) +
                           (currentLeads.filter(l => l.createdAt >= start && l.createdAt <= end).length);
            
            const dLeadAssetIds = new Set([
                ...currentLeads.filter(l => l.createdAt >= start && l.createdAt <= end).map(l => l.assetId?.toString()),
                ...currentActivities.filter(a => a.activityType !== 'VIEW' && a.createdAt >= start && a.createdAt <= end).map(a => a.assetId?.toString())
            ].filter(Boolean));
            let dValue = 0;
            listings.forEach(l => { if (dLeadAssetIds.has(l.item._id.toString())) dValue += (l.item.price || 0); });

            dailyTrends.push({
                date: start.toISOString().split('T')[0],
                views: dViews,
                leads: dLeads,
                value: dValue
            });
        }
        stats.dailyTrends = dailyTrends;

        // Top Performing Assets (by views in last 30d)
        const topAssets = detailedItems
            .map(item => {
                const recentViews = currentActivities.filter(a => a.assetId?.toString() === item.id.toString() && a.activityType === 'VIEW' && a.createdAt >= thirtyDaysAgo).length;
                const prevViews = currentActivities.filter(a => a.assetId?.toString() === item.id.toString() && a.activityType === 'VIEW' && a.createdAt < thirtyDaysAgo && a.createdAt >= sixtyDaysAgo).length;
                const change = prevViews > 0 ? (((recentViews - prevViews) / prevViews) * 100).toFixed(1) : (recentViews > 0 ? 100 : 0);
                return {
                    name: item.title,
                    views: recentViews,
                    change: `↗ ${change}%`,
                    image: item.images?.[0] || null
                };
            })
            .sort((a, b) => b.views - a.views)
            .slice(0, 3);
        stats.topAssets = topAssets;

        // Leads Table
        const leadsTable = [
            ...currentLeads.map(l => ({
                id: l._id,
                name: l.sender?.name || l.name || 'Anonymous Client',
                photo: l.sender?.profilePicture,
                phone: l.sender?.phone || l.phone || 'No Phone Provided',
                email: user.plan === 'Business VIP' || user.plan === 'Enterprise Elite' ? (l.sender?.email || l.email) : 'Upgrade to VIP to view contact',
                assetId: l.assetId,
                assetName: l.assetTitle || 'Untitled Asset',
                assetPrice: l.assetPrice,
                assetImage: l.assetImage,
                category: l.assetModel || 'General',
                date: l.createdAt,
                status: l.status || 'New',
                message: l.message,
                isActivity: false,
                source: l.source || 'Website'
            })),
            ...currentActivities.filter(a => a.activityType !== 'VIEW').map(act => {
                const asset = detailedItems.find(i => i.id.toString() === act.assetId.toString());
                return {
                    id: act._id,
                    name: act.userId?.name || 'Anonymous Client',
                    photo: act.userId?.profilePicture,
                    phone: act.userId?.phone || 'No Phone Provided',
                    email: user.plan === 'Business VIP' || user.plan === 'Enterprise Elite' ? act.userId?.email : 'Upgrade to VIP to view contact',
                    assetId: act.assetId,
                    assetName: asset?.title || 'Untitled Asset',
                    assetPrice: asset?.price,
                    assetImage: asset?.images?.[0],
                    category: asset?.category || 'General',
                    date: act.createdAt,
                    status: act.status || 'New',
                    message: 'Activity: ' + act.activityType,
                    isActivity: true,
                    source: 'Website'
                };
            })
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Analytics Trends
        const leadsLast4Weeks = await UserActivity.aggregate([
            {
                $match: {
                    assetId: { $in: assetIds },
                    activityType: { $in: ['CALL_AGENT', 'INQUIRY', 'RENT_REQUEST', 'BUY_REQUEST'] },
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $week: "$createdAt" },
                    count: { $sum: 1 },
                    date: { $first: "$createdAt" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const performanceHistory = [1, 2, 3, 4].map(idx => {
            const weekDate = new Date(now.getTime() - (4 - idx) * 7 * 24 * 60 * 60 * 1000);
            const foundWeek = leadsLast4Weeks.find(w => Math.abs(new Date(w.date) - weekDate) < 604800000);
            return {
                week: `Week ${idx}`,
                views: Math.floor(stats.totalViews / 4),
                leads: foundWeek ? foundWeek.count : 0
            };
        });

        // Leads by Category
        const categoryCounts = { 'CarAsset': 0, 'YachtAsset': 0, 'EstateAsset': 0, 'BikeAsset': 0 };
        [...currentLeads, ...currentActivities.filter(a => a.activityType !== 'VIEW')].forEach(l => {
            const asset = detailedItems.find(i => (l.assetId && i.id.toString() === l.assetId.toString()) || (l.assetTitle && i.title === l.assetTitle));
            if (asset) categoryCounts[asset.category] = (categoryCounts[asset.category] || 0) + 1;
        });

        const leadsByCategory = [
            { label: 'Cars', count: categoryCounts['CarAsset'] || 0, p: stats.totalLeads > 0 ? ((categoryCounts['CarAsset'] / stats.totalLeads) * 100).toFixed(1) + '%' : '0%' },
            { label: 'Yachts', count: categoryCounts['YachtAsset'] || 0, p: stats.totalLeads > 0 ? ((categoryCounts['YachtAsset'] / stats.totalLeads) * 100).toFixed(1) + '%' : '0%' },
            { label: 'Real Estate', count: categoryCounts['EstateAsset'] || 0, p: stats.totalLeads > 0 ? ((categoryCounts['EstateAsset'] / stats.totalLeads) * 100).toFixed(1) + '%' : '0%' },
            { label: 'Others', count: categoryCounts['BikeAsset'] || 0, p: stats.totalLeads > 0 ? ((categoryCounts['BikeAsset'] / stats.totalLeads) * 100).toFixed(1) + '%' : '0%' }
        ];

        // Leads by Location (Determined from lead phone numbers or user profile)
        const countryCodes = {
            '971': 'UAE',
            '1': 'United States',
            '44': 'United Kingdom',
            '91': 'India',
            '33': 'France',
            '49': 'Germany',
            '81': 'Japan',
            '82': 'South Korea',
            '86': 'China',
            '7': 'Russia',
            '61': 'Australia',
            '1-416': 'Canada', // Simple Canada check
            '966': 'Saudi Arabia',
            '974': 'Qatar',
            '965': 'Kuwait'
        };

        const locationStats = {};

        [...currentLeads, ...currentActivities.filter(a => a.activityType !== 'VIEW')].forEach(l => {
            const phone = l.phone || l.sender?.phone || l.userId?.phone;
            let country = 'Others';
            
            if (phone) {
                const cleanPhone = phone.replace(/\D/g, '');
                for (const [code, name] of Object.entries(countryCodes)) {
                    if (cleanPhone.startsWith(code)) {
                        country = name;
                        break;
                    }
                }
            }

            if (!locationStats[country]) {
                locationStats[country] = { leads: 0, views: 0, conversions: 0 };
            }
            locationStats[country].leads += 1;
            locationStats[country].conversions += 1;
        });

        // Add views to location stats (Views often don't have phone, so we might need to distribute them or mock for now if no IP-country logic)
        currentActivities.filter(a => a.activityType === 'VIEW').forEach(a => {
            const country = 'Others'; // Placeholder for IP-based country
            if (!locationStats[country]) locationStats[country] = { leads: 0, views: 0, conversions: 0 };
            locationStats[country].views += 1;
        });

        const leadsByLocation = Object.entries(locationStats)
            .map(([country, counts]) => ({
                country,
                count: counts.leads,
                leads: counts.leads,
                views: counts.views,
                conversions: counts.conversions,
                pct: stats.totalLeads > 0 ? ((counts.leads / stats.totalLeads) * 100).toFixed(1) : 0
            }))
            .sort((a, b) => b.leads - a.leads);

        res.json({
            success: true,
            data: {
                plan: user.plan,
                userProfile: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profilePicture: user.profilePicture,
                    plan: user.plan,
                    memberSince: user.createdAt,
                    isVerified: user.isVerified,
                    company: user.company
                },
                stats,
                inventory: detailedItems,
                leads: leadsTable,
                notifications: user.notifications || [],
                analytics: {
                    performanceTrend: performanceHistory,
                    leadsByCategory,
                    leadsByLocation,
                    leadsBySource: [
                        { label: 'Direct', count: Math.floor(stats.totalLeads * 0.4), p: '40%' },
                        { label: 'Website', count: Math.floor(stats.totalLeads * 0.3), p: '30%' },
                        { label: 'Marketplace', count: Math.floor(stats.totalLeads * 0.2), p: '20%' },
                        { label: 'Social', count: Math.floor(stats.totalLeads * 0.1), p: '10%' }
                    ]
                }
            }
        });

    } catch (error) {
        console.error('Inventory Fetch Error:', error);
        res.status(500).json({ error: 'Failed to sync inventory data' });
    }
});

/**
 * TOGGLE VISIBILITY (Public vs Private)
 */
router.post('/toggle-visibility', authMiddleware, async (req, res) => {
    try {
        const { itemId, model, isPublic } = req.body;
        let Model;
        const modelLower = (model || "").toLowerCase();
        
        if (modelLower.includes('car')) Model = CarAsset;
        else if (modelLower.includes('estate')) Model = EstateAsset;
        else if (modelLower.includes('bike')) Model = BikeAsset;
        else if (modelLower.includes('yacht')) Model = YachtAsset;
        else return res.status(400).json({ error: 'Invalid asset model' });

        const item = await Model.findById(itemId);
        if (!item) return res.status(404).json({ error: 'Asset not found' });
        if (item.agent?.id !== req.user.id) return res.status(403).json({ error: 'Permission denied' });

        item.status = isPublic ? 'Active' : 'Draft';
        await item.save();
        res.json({ success: true, status: item.status });
    } catch (error) {
        res.status(500).json({ error: 'Sync failed' });
    }
});

module.exports = router;
