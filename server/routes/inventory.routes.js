const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/User.model');
const Listing = require('../models/Listing.model');
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
    console.log('>>> [INVENTORY_DEBUG] Dashboard route hit for user:', req.user.id);
    try {
        const userId = req.user.id;
        const { timeframe = 'Week', interval = 'Week' } = req.query;
        
        // 1. Fetch user and their listings
        let user = await User.findById(userId).populate('myListings.item');

        if (!user) {
            console.log('>>> [INVENTORY_DEBUG] User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Gating for Freemium
        if (user.plan === 'Freemium') {
            console.log('>>> [INVENTORY_DEBUG] User is Freemium, blocked');
            return res.status(403).json({ error: 'INSUFFICIENT_PLAN', message: 'Please upgrade to access the Inventory Management System.' });
        }

        // 2. Robust Population Check & Fallback
        let listings = user.myListings.filter(l => l.item && typeof l.item.toObject === 'function');
        
        if (listings.length === 0 && user.myListings.length > 0) {
            console.log(`>>> [INVENTORY_DEBUG] Dynamic population failed for user ${userId}. Attempting manual fallback for ${user.myListings.length} items.`);
            // Manual population fallback
            const populatedListings = await Promise.all(user.myListings.map(async (l) => {
                if (!l.item) return null;
                if (typeof l.item.toObject === 'function') return l; 
                
                try {
                    let Model;
                    if (l.itemModel === 'CarAsset') Model = CarAsset;
                    else if (l.itemModel === 'EstateAsset') Model = EstateAsset;
                    else if (l.itemModel === 'YachtAsset') Model = YachtAsset;
                    else if (l.itemModel === 'BikeAsset') Model = BikeAsset;
                    else Model = Listing;

                    const item = await Model.findById(l.item);
                    if (item) {
                        console.log(`>>> [INVENTORY_DEBUG] Manually populated item: ${item.title || item._id}`);
                        return { ...l.toObject(), item };
                    }
                    console.log(`>>> [INVENTORY_DEBUG] Failed to find item ${l.item} in model ${l.itemModel}`);
                    return null;
                } catch (e) {
                    console.error(`>>> [INVENTORY_DEBUG] Manual population error:`, e.message);
                    return null;
                }
            }));
            listings = populatedListings.filter(Boolean);
        }

        const assetIds = listings.map(l => l.item._id);
        console.log(`>>> [INVENTORY_DEBUG] Returning ${listings.length} items.`);

        // 3. Time Ranges for Trends
        const now = new Date();
        let days = 7;
        if (timeframe === 'Month' || interval === 'Week') days = 30;
        else if (timeframe === 'Year' || interval === 'Year') days = 365;
        else if (interval === 'Day') days = 1;
        else if (interval === 'Month') days = 90;

        const rangeStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        const prevRangeStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // 4. Fetch All Relevant Data for Stat Calculation
        const currentActivities = await UserActivity.find({
            assetId: { $in: assetIds },
            createdAt: { $gte: sixtyDaysAgo }
        }).populate('userId', 'name email phone phoneCode profilePicture');

        const currentLeads = await Lead.find({
            agentId: userId,
            createdAt: { $gte: sixtyDaysAgo }
        }).populate('sender', 'name email phone phoneCode profilePicture');

        // Country detection helper
        const phoneToCountry = {
            '971': { name: 'UAE', code: 'ae' },
            '1': { name: 'USA/Canada', code: 'us' },
            '44': { name: 'UK', code: 'gb' },
            '91': { name: 'India', code: 'in' },
            '33': { name: 'France', code: 'fr' },
            '49': { name: 'Germany', code: 'de' },
            '81': { name: 'Japan', code: 'jp' },
            '82': { name: 'South Korea', code: 'kr' },
            '86': { name: 'China', code: 'cn' },
            '7': { name: 'Russia', code: 'ru' },
            '61': { name: 'Australia', code: 'au' },
            '966': { name: 'Saudi Arabia', code: 'sa' },
            '974': { name: 'Qatar', code: 'qa' },
            '965': { name: 'Kuwait', code: 'kw' },
            '968': { name: 'Oman', code: 'om' },
            '973': { name: 'Bahrain', code: 'bh' },
            '20': { name: 'Egypt', code: 'eg' },
            '90': { name: 'Turkey', code: 'tr' },
            '39': { name: 'Italy', code: 'it' },
            '34': { name: 'Spain', code: 'es' },
            '41': { name: 'Switzerland', code: 'ch' },
            '31': { name: 'Netherlands', code: 'nl' },
            '32': { name: 'Belgium', code: 'be' },
            '43': { name: 'Austria', code: 'at' },
            '46': { name: 'Sweden', code: 'se' },
            '47': { name: 'Norway', code: 'no' },
            '45': { name: 'Denmark', code: 'dk' },
            '351': { name: 'Portugal', code: 'pt' },
            '30': { name: 'Greece', code: 'gr' },
            '972': { name: 'Israel', code: 'il' },
            '961': { name: 'Lebanon', code: 'lb' },
            '962': { name: 'Jordan', code: 'jo' },
            '65': { name: 'Singapore', code: 'sg' },
            '60': { name: 'Malaysia', code: 'my' },
            '66': { name: 'Thailand', code: 'th' },
            '62': { name: 'Indonesia', code: 'id' },
            '63': { name: 'Philippines', code: 'ph' },
            '84': { name: 'Vietnam', code: 'vn' },
            '27': { name: 'South Africa', code: 'za' },
            '212': { name: 'Morocco', code: 'ma' },
            '234': { name: 'Nigeria', code: 'ng' },
            '55': { name: 'Brazil', code: 'br' },
            '52': { name: 'Mexico', code: 'mx' },
            '54': { name: 'Argentina', code: 'ar' },
            '56': { name: 'Chile', code: 'cl' },
            '57': { name: 'Colombia', code: 'co' }
        };

        const getCountryInfo = (phone) => {
            if (!phone || typeof phone !== 'string') return { name: 'Others', code: 'us' };
            
            // Remove all non-digits
            let cleanPhone = phone.replace(/\D/g, '');
            
            // Handle leading 00 as international prefix
            if (phone.startsWith('00')) {
                cleanPhone = cleanPhone.substring(2);
            }

            const sortedPrefixes = Object.keys(phoneToCountry).sort((a, b) => b.length - a.length);
            for (const prefix of sortedPrefixes) {
                if (cleanPhone.startsWith(prefix)) return phoneToCountry[prefix];
            }
            
            return { name: 'Others', code: 'us' };
        };

        // Views calculation
        const viewsCurrent = currentActivities.filter(a => a.activityType === 'VIEW' && a.createdAt >= rangeStart).length;
        const viewsPrev = currentActivities.filter(a => a.activityType === 'VIEW' && a.createdAt < rangeStart && a.createdAt >= prevRangeStart).length;
        const viewsChange = viewsPrev > 0 ? (((viewsCurrent - viewsPrev) / viewsPrev) * 100).toFixed(1) : (viewsCurrent > 0 ? 100 : 0);

        // Leads calculation
        const leadsCurrent = (currentActivities.filter(a => a.activityType !== 'VIEW' && a.createdAt >= rangeStart).length) +
                         (currentLeads.filter(l => l.createdAt >= rangeStart).length);
        const leadsPrev = (currentActivities.filter(a => a.activityType !== 'VIEW' && a.createdAt < rangeStart && a.createdAt >= prevRangeStart).length) +
                             (currentLeads.filter(l => l.createdAt < rangeStart && l.createdAt >= prevRangeStart).length);
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
            const itemId = item._id ? item._id.toString() : null;
            if (itemId) {
                if (leadAssetIdsCurrent.has(itemId)) estValueCurrent += price;
                if (leadAssetIdsPrev.has(itemId)) estValuePrev += price;
            }
        });
        const valueChange = estValuePrev > 0 ? (((estValueCurrent - estValuePrev) / estValuePrev) * 100).toFixed(1) : (estValueCurrent > 0 ? 100 : 0);

        const stats = {
            totalAssets: listings.length,
            totalViews: viewsCurrent,
            totalLeads: leadsCurrent,
            avgConversion: viewsCurrent > 0 ? ((leadsCurrent / viewsCurrent) * 100).toFixed(2) : 0,
            activeCount: listings.filter(l => l.item && l.item.status === 'Active').length,
            closedCount: listings.filter(l => l.item && l.item.status !== 'Active').length,
            savedCount: savedCurrent,
            estLeadValue: estValueCurrent,
            trends: {
                views: { current: viewsCurrent, previous: viewsPrev, change: viewsChange },
                leads: { current: leadsCurrent, previous: leadsPrev, change: leadsChange },
                saved: { current: savedCurrent, previous: savedPrev, change: savedChange },
                value: { current: estValueCurrent, previous: estValuePrev, change: valueChange }
            }
        };

        const detailedItems = listings.map((l, index) => {
            const item = l.item;
            if (!item) {
                console.log(`>>> [INVENTORY_DEBUG] Item at index ${index} is null`);
                return null;
            }

            const assetId = item._id ? item._id.toString() : 'unknown';
            console.log(`>>> [INVENTORY_DEBUG] Mapping item ${index}: id=${assetId}, model=${l.itemModel}, title=${item.title || item.propertyName || 'MISSING'}`);
            
            // Calculate leads for this specific asset
            const assetLeads = [
                ...currentLeads.filter(lead => lead.assetId?.toString() === assetId),
                ...currentActivities.filter(act => act.assetId?.toString() === assetId && act.activityType !== 'VIEW')
            ].length;

            const itemObj = item.toObject ? item.toObject() : item;

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
        }).filter(Boolean);

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
            ...currentLeads.map(l => {
                const phone = l.sender ? ((l.sender.phoneCode || "") + (l.sender.phone || "")) : l.phone;
                const country = getCountryInfo(phone);
                return {
                    id: l._id,
                    name: l.sender?.name || l.name || 'Anonymous Client',
                    photo: l.sender?.profilePicture,
                    phone: phone || 'No Phone Provided',
                    countryCode: country.code,
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
                };
            }),
            ...currentActivities.filter(a => a.activityType !== 'VIEW').map(act => {
                const asset = detailedItems.find(i => i.id.toString() === act.assetId.toString());
                const phone = act.userId ? ((act.userId.phoneCode || "") + (act.userId.phone || "")) : (act.phone || "No Phone Provided");
                const country = getCountryInfo(phone);
                return {
                    id: act._id,
                    name: act.userId?.name || 'Anonymous Client',
                    photo: act.userId?.profilePicture,
                    phone: phone || 'No Phone Provided',
                    countryCode: country.code,
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
        const locationStats = {};

        [...currentLeads, ...currentActivities.filter(a => a.activityType !== 'VIEW')].forEach(l => {
            const phone = l.sender ? ((l.sender.phoneCode || "") + (l.sender.phone || "")) : (l.userId ? ((l.userId.phoneCode || "") + (l.userId.phone || "")) : (l.phone || ""));
            const countryInfo = getCountryInfo(phone);
            const country = countryInfo.name;
            const countryCode = countryInfo.code;

            if (!locationStats[country]) {
                locationStats[country] = { leads: 0, views: 0, conversions: 0, code: countryCode };
            }
            locationStats[country].leads += 1;
            locationStats[country].conversions += 1;
        });

        // Add views to location stats
        currentActivities.filter(a => a.activityType === 'VIEW').forEach(a => {
            const country = 'Others'; 
            if (!locationStats[country]) locationStats[country] = { leads: 0, views: 0, conversions: 0, code: 'us' };
            locationStats[country].views += 1;
        });

        const leadsByLocation = Object.entries(locationStats)
            .map(([country, counts]) => ({
                country,
                count: counts.leads,
                leads: counts.leads,
                views: counts.views,
                conversions: counts.conversions,
                code: counts.code,
                pct: stats.totalLeads > 0 ? ((counts.leads / stats.totalLeads) * 100).toFixed(1) : 0
            }))
            .sort((a, b) => b.leads - a.leads);

        res.json({
            success: true,
            _v: Date.now(), // Version tag for debugging
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
                    leadsBySource: (() => {
                        const sourceCounts = { 'WhatsApp': 0, 'Website': 0, 'Facebook': 0, 'Instagram': 0, 'Others': 0 };
                        [...currentLeads, ...currentActivities.filter(a => a.activityType !== 'VIEW')].forEach(l => {
                            const src = l.source || 'Website';
                            if (sourceCounts.hasOwnProperty(src)) {
                                sourceCounts[src]++;
                            } else if (src === 'Direct' || src === 'Marketplace') {
                                sourceCounts['Website']++;
                            } else if (src === 'Social') {
                                sourceCounts['Instagram']++;
                            } else if (src === 'Whatsapp') {
                                sourceCounts['WhatsApp']++;
                            } else {
                                sourceCounts['Others']++;
                            }
                        });

                        return Object.entries(sourceCounts).map(([label, count]) => ({
                            label,
                            count,
                            p: stats.totalLeads > 0 ? ((count / stats.totalLeads) * 100).toFixed(1) + '%' : '0%'
                        })).sort((a, b) => b.count - a.count);
                    })()
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
