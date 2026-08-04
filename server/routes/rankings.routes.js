const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const RankingCategory = require("../models/RankingCategory.model");
const authMiddleware = require("../middleware/auth.middleware");

// Import all nominee models
const CarNominee = require("../models/CarNominee.model");
const EstateNominee = require("../models/EstateNominee.model");
const YachtNominee = require("../models/YachtNominee.model");
const BikeNominee = require("../models/BikeNominee.model");
const ContentCreatorNominee = require("../models/ContentCreatorNominee.model");
const OtherNominee = require("../models/OtherNominee.model");
const AssetNominee = require("../models/AssetNominee.model");
const DealerNominee = require("../models/DealerNominee.model");
const VoteLog = require("../models/VoteLog.model");

const nomineeModelMap = {
    'CarNominee': CarNominee,
    'EstateNominee': EstateNominee,
    'YachtNominee': YachtNominee,
    'BikeNominee': BikeNominee,
    'ContentCreatorNominee': ContentCreatorNominee,
    'OtherNominee': OtherNominee,
    'AssetNominee': AssetNominee,
    'DealerNominee': DealerNominee
};

/**
 * GET ALL ACTIVE RANKING CATEGORIES
 */
router.get("/categories", async (req, res) => {
    try {
        const filter = { status: "Active" };
        if (req.query.type) {
            filter.type = req.query.type;
        }
        
        const categories = await RankingCategory.find(filter)
            .sort({ displayOrder: 1, createdAt: -1 });
            
        res.json(categories);
    } catch (err) {
        console.error("GET public categories error:", err);
        res.status(500).json({ error: "FETCH_CATEGORIES_FAILED" });
    }
});

/**
 * GET SEARCH SUGGESTIONS FOR CATEGORIES AND NOMINEES
 */
router.get("/search", async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.json({ categories: [], nominees: [] });
        }
        
        // Escape regex special chars to prevent issues
        const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escapedQ, 'i');
        
        // Find matching active categories
        const categories = await RankingCategory.find({
            status: "Active",
            $or: [
                { title: { $regex: regex } },
                { shortDescription: { $regex: regex } }
            ]
        }).limit(5);
        
        // Find matching nominees across all models
        const nomineePromises = Object.entries(nomineeModelMap).map(async ([modelName, Model]) => {
            return Model.find({
                $or: [
                    { name: { $regex: regex } },
                    { brand: { $regex: regex } },
                    { model: { $regex: regex } },
                    { description: { $regex: regex } }
                ]
            })
            .populate('category')
            .limit(5);
        });
        
        const nomineeResults = await Promise.all(nomineePromises);
        const allNominees = nomineeResults.flat();
        
        // Filter out nominee records that don't have a valid active category
        const activeNominees = allNominees.filter(nominee => nominee.category && nominee.category.status === 'Active');
        
        // Map category items
        const mappedCategories = categories.map(cat => ({
            id: cat._id,
            title: cat.title,
            slug: cat.slug,
            type: cat.type,
            image: cat.categoryImage || cat.bannerImage,
            shortDescription: cat.shortDescription,
            url: `/ranking/${cat.type.toLowerCase().replace(/\s+/g, "").replace(/contentcreator/i, "contentcreators")}/${cat.slug}`
        }));
        
        // Map nominee items
        const mappedNominees = activeNominees.map(nominee => {
            const cat = nominee.category;
            const categoryUrlParam = cat.type.toLowerCase().replace(/\s+/g, "").replace(/contentcreator/i, "contentcreators");
            return {
                id: nominee._id,
                name: nominee.name,
                brand: nominee.brand,
                model: nominee.model,
                image: nominee.image,
                description: nominee.description || nominee.detail,
                categoryTitle: cat.title,
                categorySlug: cat.slug,
                url: `/ranking/${categoryUrlParam}/${cat.slug}`
            };
        }).slice(0, 8); // limit final nominees to 8
        
        res.json({
            categories: mappedCategories,
            nominees: mappedNominees
        });
    } catch (err) {
        console.error("Rankings search error:", err);
        res.status(500).json({ error: "SEARCH_FAILED" });
    }
});

/**
 * GET A SINGLE RANKING CATEGORY BY SLUG (WITH NOMINEES SORTED BY VOTES DESC)
 */
router.get("/category/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await RankingCategory.findOne({ slug, status: "Active" })
            .populate('assetNominees')
            .populate('dealerNominees');
            
        if (!category) {
            return res.status(404).json({ error: "CATEGORY_NOT_FOUND" });
        }
        
        const nominees = category.targetType === 'Assets' 
            ? (category.assetNominees || [])
            : (category.dealerNominees || []);
            
        // Sort nominees by votes descending
        const sortedNominees = [...nominees].sort((a, b) => (b.votes || 0) - (a.votes || 0));
        
        // Map ranks
        const rankedNominees = sortedNominees.map((n, index) => ({
            id: n._id,
            _id: n._id,
            rank: index + 1,
            name: n.name,
            detail: n.detail,
            image: n.image,
            banner: n.banner || n.coverImage || n.bannerImage || '',
            profilePic: n.profilePic || n.profilePicture || n.avatar || n.image || '',
            channelName: n.channelName || '',
            youtube: n.youtube || '',
            instagram: n.instagram || '',
            twitter: n.twitter || '',
            tiktok: n.tiktok || '',
            votes: n.votes,
            votedBy: n.votedBy || [],
            brand: n.brand || '',
            model: n.model || '',
            description: n.description || '',
            listingLink: n.listingLink || '',
            keyDetails: n.keyDetails || {},
            sources: n.sources || []
        }));
        
        const totalVotesVal = rankedNominees.reduce((acc, curr) => acc + (curr.votes || 0), 0);
        let formattedVotes = "0";
        if (totalVotesVal >= 1000) {
            formattedVotes = (totalVotesVal / 1000).toFixed(1) + 'K';
        } else {
            formattedVotes = totalVotesVal.toString();
        }
        
        res.json({
            _id: category._id,
            id: category._id,
            title: category.title,
            slug: category.slug,
            type: category.type,
            targetType: category.targetType,
            shortDescription: category.shortDescription || '',
            detailedDescription: category.detailedDescription || '',
            categoryImage: category.categoryImage || '',
            bannerImage: category.bannerImage || '',
            icon: category.icon || '',
            nomineeLimit: category.nomineeLimit || 10,
            allowMultipleVotes: category.allowMultipleVotes !== undefined ? category.allowMultipleVotes : true,
            featuredCategory: category.featuredCategory !== undefined ? category.featuredCategory : true,
            categoryColor: category.categoryColor || '#6366F1',
            nominees: rankedNominees,
            votes: formattedVotes
        });
    } catch (err) {
        console.error("GET public category by slug error:", err);
        res.status(500).json({ error: "FETCH_CATEGORY_FAILED" });
    }
});

/**
 * GET VOTES CAST BY CURRENT USER TODAY
 */
router.get("/votes-today", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const votesCastToday = await VoteLog.countDocuments({
            userId,
            createdAt: { $gte: startOfToday }
        });

        res.json({
            votesToday: votesCastToday,
            votesRemaining: Math.max(0, 3 - votesCastToday),
            dailyLimit: 3
        });
    } catch (err) {
        console.error("GET votes-today error:", err);
        res.status(500).json({ error: "FETCH_VOTES_TODAY_FAILED" });
    }
});

/**
 * CAST A VOTE FOR A NOMINEE (LIMIT: 3 VOTES PER USER PER DAY, ALL VOTES ADDED)
 */
router.post("/vote", authMiddleware, async (req, res) => {
    try {
        const { categoryId, nomineeId } = req.body;
        const userId = req.user.id;
        
        if (!categoryId || !nomineeId) {
            return res.status(400).json({ error: "CATEGORY_AND_NOMINEE_REQUIRED" });
        }
        
        const category = await RankingCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "CATEGORY_NOT_FOUND" });
        }
        
        const NomineeModel = nomineeModelMap[category.nomineeModel];
        if (!NomineeModel) {
            return res.status(500).json({ error: "INVALID_NOMINEE_MODEL" });
        }
        
        const nominee = await NomineeModel.findOne({ _id: nomineeId, category: categoryId });
        if (!nominee) {
            return res.status(404).json({ error: "NOMINEE_NOT_FOUND" });
        }
        
        // Calculate start of today (midnight)
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Check user's daily vote count (3 votes max per day)
        const votesCastToday = await VoteLog.countDocuments({
            userId,
            createdAt: { $gte: startOfToday }
        });

        if (votesCastToday >= 3) {
            return res.status(400).json({ 
                error: "You have reached your daily limit of 3 votes. Please try again tomorrow.",
                dailyLimit: 3,
                votesToday: votesCastToday,
                votesRemaining: 0
            });
        }
        
        // Record vote: Increment total votes for the nominee
        nominee.votes = (nominee.votes || 0) + 1;
        if (!nominee.votedBy.some(id => id.toString() === userId.toString())) {
            nominee.votedBy.push(userId);
        }
        await nominee.save();
        
        // Save vote entry to VoteLog
        await VoteLog.create({
            userId,
            categoryId,
            nomineeId
        });

        const newVotesToday = votesCastToday + 1;

        res.json({ 
            success: true, 
            message: "Vote cast successfully", 
            votes: nominee.votes,
            votesToday: newVotesToday,
            votesRemaining: Math.max(0, 3 - newVotesToday)
        });
    } catch (err) {
        console.error("POST vote error:", err);
        res.status(500).json({ error: "CAST_VOTE_FAILED" });
    }
});

module.exports = router;
