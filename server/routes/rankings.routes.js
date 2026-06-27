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
 * CAST A VOTE FOR A NOMINEE
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
        
        // Check vote limits
        if (!category.allowMultipleVotes) {
            // Check if user has voted for ANY nominee in this category
            const hasVotedAny = await NomineeModel.findOne({ 
                category: categoryId, 
                votedBy: userId 
            });
            if (hasVotedAny) {
                return res.status(400).json({ error: "ALREADY_VOTED_IN_THIS_CATEGORY" });
            }
        } else {
            // Check if user has voted for THIS nominee
            const hasVotedThis = nominee.votedBy.some(id => id.toString() === userId.toString());
            if (hasVotedThis) {
                return res.status(400).json({ error: "ALREADY_VOTED_FOR_THIS_NOMINEE" });
            }
        }
        
        // Record vote
        nominee.votes = (nominee.votes || 0) + 1;
        nominee.votedBy.push(userId);
        await nominee.save();
        
        res.json({ 
            success: true, 
            message: "Vote cast successfully", 
            votes: nominee.votes 
        });
    } catch (err) {
        console.error("POST vote error:", err);
        res.status(500).json({ error: "CAST_VOTE_FAILED" });
    }
});

module.exports = router;
