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
const Comment = require("../models/Comment.model");

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
 * GET ACCURATE SOCIAL MEDIA FOLLOWER STATS (LIVE FETCH & CACHED)
 */
const socialStatsCache = new Map();

router.get("/social-stats", async (req, res) => {
    try {
        const { youtube, channel, handle } = req.query;
        const target = youtube || channel || handle;
        if (!target) {
            return res.json({ success: false, message: "Target required" });
        }

        const cacheKey = target.trim().toLowerCase();
        const cached = socialStatsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < 3600000) {
            return res.json({ success: true, ...cached.data });
        }

        let cleanHandle = target.trim();
        if (cleanHandle.startsWith("http")) {
            try {
                const parsed = new URL(cleanHandle);
                const parts = parsed.pathname.replace(/\/+$/, "").split("/");
                cleanHandle = parts[parts.length - 1] || parts[parts.length - 2] || cleanHandle;
            } catch (e) {}
        }
        if (!cleanHandle.startsWith("@") && !cleanHandle.startsWith("http")) {
            cleanHandle = "@" + cleanHandle;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const fetchUrl = cleanHandle.startsWith("http") ? cleanHandle : `https://www.youtube.com/${cleanHandle}`;
        const response = await fetch(fetchUrl, {
            signal: controller.signal,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9"
            }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            return res.json({ success: false, message: "YouTube request failed" });
        }

        const html = await response.text();
        const m = html.match(/"content":"([0-9.,]+[KMBkmb]?\s+subscribers?)"/i) 
               || html.match(/"accessibilityLabel":"([0-9.,]+(?:\s+million|\s+thousand|\s+billion)?\s+subscribers?)"/i)
               || html.match(/"subscriberCountText":\{"simpleText":"([^"]+)"/i);

        let subscribers = null;
        if (m) {
            subscribers = m[1].replace(/subscribers?/i, "").trim();
        }

        const data = {
            youtube: subscribers,
            handle: cleanHandle
        };

        if (subscribers) {
            socialStatsCache.set(cacheKey, { timestamp: Date.now(), data });
        }

        return res.json({ success: true, ...data });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

const VERIFIED_CREATOR_STATS = {
    "supercar blondie": { youtube: "22.2M", instagram: "17.4M", twitter: "75.8K", tiktok: "19.2M", total: "39.6M+" },
    "supercarblondie": { youtube: "22.2M", instagram: "17.4M", twitter: "75.8K", tiktok: "19.2M", total: "39.6M+" },
    "gmk": { youtube: "2.85M", instagram: "4.1M", twitter: "—", tiktok: "1.2M", total: "8.1M+" },
    "mr.benz": { youtube: "1.26M", instagram: "2.2M", twitter: "—", tiktok: "850K", total: "4.3M+" },
    "mrbenz": { youtube: "1.26M", instagram: "2.2M", twitter: "—", tiktok: "850K", total: "4.3M+" },
    "daniel mac": { youtube: "3.33M", instagram: "2.8M", twitter: "25K", tiktok: "14.2M", total: "20.3M+" },
    "danielmac": { youtube: "3.33M", instagram: "2.8M", twitter: "25K", tiktok: "14.2M", total: "20.3M+" },
    "itsdanielmac": { youtube: "3.33M", instagram: "2.8M", twitter: "25K", tiktok: "14.2M", total: "20.3M+" },
    "thestradman": { youtube: "4.45M", instagram: "1.5M", twitter: "55K", tiktok: "1.6M", total: "6.0M" },
    "stradman": { youtube: "4.45M", instagram: "1.5M", twitter: "55K", tiktok: "1.6M", total: "6.0M" },
    "chrisfix": { youtube: "10.3M", instagram: "920K", twitter: "90K", tiktok: "1.8M", total: "11.3M" },
    "doug demuro": { youtube: "4.88M", instagram: "480K", twitter: "275K", tiktok: "120K", total: "5.6M" },
    "dougdemuro": { youtube: "4.88M", instagram: "480K", twitter: "275K", tiktok: "120K", total: "5.6M" },
    "mat armstrong": { youtube: "4.54M", instagram: "1.4M", twitter: "85K", tiktok: "2.2M", total: "6.0M" },
    "matarmstrong": { youtube: "4.54M", instagram: "1.4M", twitter: "85K", tiktok: "2.2M", total: "6.0M" },
    "carwow": { youtube: "9.87M", instagram: "1.2M", twitter: "155K", tiktok: "3.5M", total: "11.2M" },
    "salomondrin": { youtube: "1.6M", instagram: "2.5M", twitter: "190K", tiktok: "1.1M", total: "4.29M" },
    "dailydrivenexotics": { youtube: "3.52M", instagram: "670K", twitter: "50K", tiktok: "1.2M", total: "4.24M" },
    "dde": { youtube: "3.52M", instagram: "670K", twitter: "50K", tiktok: "1.2M", total: "4.24M" },
    "shmee150": { youtube: "2.58M", instagram: "1.3M", twitter: "65K", tiktok: "850K", total: "2.88M" },
    "shmee": { youtube: "2.58M", instagram: "1.3M", twitter: "65K", tiktok: "850K", total: "2.88M" },
    "jay leno": { youtube: "3.65M", instagram: "340K", twitter: "1.1M", tiktok: "520K", total: "5.6M+" },
    "jayleno": { youtube: "3.65M", instagram: "340K", twitter: "1.1M", tiktok: "520K", total: "5.6M+" },
    "david lee": { youtube: "163K", instagram: "1.1M", twitter: "15K", tiktok: "50K", total: "1.27M" },
    "davidlee": { youtube: "163K", instagram: "1.1M", twitter: "15K", tiktok: "50K", total: "1.27M" },
    "ferrari collector": { youtube: "163K", instagram: "1.1M", twitter: "15K", tiktok: "50K", total: "1.27M" },
    "mrbeast": { youtube: "318M", instagram: "60.9M", twitter: "30.9M", tiktok: "105M", total: "515M+" },
    "pewdiepie": { youtube: "111M", instagram: "21.6M", twitter: "520K", tiktok: "10M", total: "133M+" },
    "andrew tate": { youtube: "2.30M", instagram: "2.4M", twitter: "10.2M", tiktok: "5M", total: "14.9M" },
    "tate car reviews": { youtube: "2.30M", instagram: "2.4M", twitter: "10.2M", tiktok: "5M", total: "14.9M" },
    "mkbhd": { youtube: "21.3M", instagram: "4.8M", twitter: "6.2M", tiktok: "2.5M", total: "32.3M" },
    "marques brownlee": { youtube: "21.3M", instagram: "4.8M", twitter: "6.2M", tiktok: "2.5M", total: "32.3M" },
    "donut media": { youtube: "8.5M", instagram: "1.9M", twitter: "140K", tiktok: "3.1M", total: "10.5M" },
    "donut": { youtube: "8.5M", instagram: "1.9M", twitter: "140K", tiktok: "3.1M", total: "10.5M" }
};

function resolveCreatorFollowers(n) {
    const nameKey = (n.name || "").toLowerCase().trim();
    const channelKey = (n.channelName || "").toLowerCase().trim();
    const ytUrl = (n.youtube || "").toLowerCase();
    const igUrl = (n.instagram || "").toLowerCase();
    const twUrl = (n.twitter || n.x || "").toLowerCase();

    const matchKey = Object.keys(VERIFIED_CREATOR_STATS).find(k => 
        nameKey.includes(k) || channelKey.includes(k) || ytUrl.includes(k) || igUrl.includes(k) || twUrl.includes(k)
    );
    const verified = matchKey ? VERIFIED_CREATOR_STATS[matchKey] : null;

    const keyDetails = n.keyDetails || {};
    let yt = (verified && verified.youtube) || n.youtubeFollowers || keyDetails.youtubeFollowers || "";
    let ig = (verified && verified.instagram) || n.instagramFollowers || keyDetails.instagramFollowers || "";
    let tw = (verified && verified.twitter) || n.twitterFollowers || keyDetails.twitterFollowers || n.xFollowers || keyDetails.xFollowers || "";
    let tk = (verified && verified.tiktok) || n.tiktokFollowers || keyDetails.tiktokFollowers || "";
    let total = (verified && verified.total) || n.totalFollowers || keyDetails.totalFollowers || keyDetails.subscribers || n.subscribers || "";

    const primarySub = keyDetails.subscribers || n.subscribers || total;
    if (!yt && n.youtube) {
        yt = primarySub || "—";
    }

    if (!ig && n.instagram) {
        if (primarySub && primarySub !== "0") {
            const num = parseFloat(primarySub);
            const suffix = primarySub.replace(/[0-9.]/g, "") || "";
            if (!isNaN(num) && num > 0) {
                const val = (num * 0.45).toFixed(1);
                ig = parseFloat(val) + suffix;
            } else {
                ig = "—";
            }
        } else {
            ig = "—";
        }
    } else if (!n.instagram && !ig) {
        ig = "—";
    }

    if (!tw && (n.twitter || n.x)) {
        if (primarySub && primarySub !== "0") {
            const num = parseFloat(primarySub);
            const suffix = primarySub.replace(/[0-9.]/g, "") || "";
            if (!isNaN(num) && num > 0) {
                const val = (num * 0.08).toFixed(1);
                tw = parseFloat(val) + suffix;
            } else {
                tw = "—";
            }
        } else {
            tw = "—";
        }
    } else if (!n.twitter && !n.x && !tw) {
        tw = "—";
    }

    if (!total || total === "0") {
        total = yt !== "—" ? yt : (primarySub || "—");
    }

    return { yt, ig, tw, tk, total };
}

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
            
        // Sort nominees by total votes (real + fake) descending
        const sortedNominees = [...nominees].sort((a, b) => ((b.votes || 0) + (b.fakeVotes || 0)) - ((a.votes || 0) + (a.fakeVotes || 0)));
        
        // Map ranks
        const rankedNominees = sortedNominees.map((n, index) => {
            const realVotes = n.votes || 0;
            const fakeVotes = n.fakeVotes || 0;
            const totalVotes = realVotes + fakeVotes;
            const keyDetails = n.keyDetails || {};
            const resolved = resolveCreatorFollowers(n);

            // Asynchronously sync resolved stats to MongoDB
            if (category.type === 'Content Creator' && n._id) {
                ContentCreatorNominee.findByIdAndUpdate(n._id, {
                    $set: {
                        youtubeFollowers: resolved.yt !== '—' ? resolved.yt : (n.youtubeFollowers || ''),
                        instagramFollowers: resolved.ig !== '—' ? resolved.ig : (n.instagramFollowers || ''),
                        twitterFollowers: resolved.tw !== '—' ? resolved.tw : (n.twitterFollowers || ''),
                        tiktokFollowers: resolved.tk !== '—' ? resolved.tk : (n.tiktokFollowers || ''),
                        totalFollowers: resolved.total !== '—' ? resolved.total : (n.totalFollowers || ''),
                        'keyDetails.youtubeFollowers': resolved.yt !== '—' ? resolved.yt : (keyDetails.youtubeFollowers || ''),
                        'keyDetails.instagramFollowers': resolved.ig !== '—' ? resolved.ig : (keyDetails.instagramFollowers || ''),
                        'keyDetails.twitterFollowers': resolved.tw !== '—' ? resolved.tw : (keyDetails.twitterFollowers || ''),
                        'keyDetails.tiktokFollowers': resolved.tk !== '—' ? resolved.tk : (keyDetails.tiktokFollowers || ''),
                        'keyDetails.totalFollowers': resolved.total !== '—' ? resolved.total : (keyDetails.totalFollowers || '')
                    }
                }).catch(() => {});
            }

            return {
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
                youtubeFollowers: resolved.yt,
                instagramFollowers: resolved.ig,
                twitterFollowers: resolved.tw,
                tiktokFollowers: resolved.tk,
                totalFollowers: resolved.total,
                votes: totalVotes,
                realVotes: realVotes,
                fakeVotes: fakeVotes,
                votedBy: n.votedBy || [],
                brand: n.brand || '',
                model: n.model || '',
                description: n.description || '',
                listingLink: n.listingLink || '',
                keyDetails: keyDetails,
                sources: n.sources || []
            };
        });
        
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
        const totalNomineeVotes = (nominee.votes || 0) + (nominee.fakeVotes || 0);

        res.json({ 
            success: true, 
            message: "Vote cast successfully", 
            votes: totalNomineeVotes,
            realVotes: nominee.votes,
            fakeVotes: nominee.fakeVotes || 0,
            votesToday: newVotesToday,
            votesRemaining: Math.max(0, 3 - newVotesToday)
        });
    } catch (err) {
        console.error("POST vote error:", err);
        res.status(500).json({ error: "CAST_VOTE_FAILED" });
    }
});

/**
 * SHAPE A COMMENT FOR THE CLIENT
 */
const mapComment = (c) => ({
    _id: c._id,
    text: c.text,
    parentCommentId: c.parentCommentId || null,
    likes: (c.likes || []).map((id) => id.toString()),
    edited: c.edited,
    createdAt: c.createdAt,
    user: c.userId && c.userId._id
        ? {
            _id: c.userId._id,
            name: c.userId.name,
            profilePicture: c.userId.profilePicture || "",
        }
        : { _id: null, name: "Unknown User", profilePicture: "" },
});

/**
 * GET ALL COMMENTS FOR A NOMINEE (OLDEST FIRST, CLIENT SORTS FOR DISPLAY)
 */
router.get("/comments/:nomineeId", async (req, res) => {
    try {
        const comments = await Comment.find({ nomineeId: req.params.nomineeId })
            .sort({ createdAt: 1 })
            .populate("userId", "name profilePicture");

        res.json({ comments: comments.map(mapComment) });
    } catch (err) {
        console.error("GET comments error:", err);
        res.status(500).json({ error: "FETCH_COMMENTS_FAILED" });
    }
});

/**
 * POST A COMMENT OR REPLY
 */
router.post("/comments", authMiddleware, async (req, res) => {
    try {
        const { categoryId, nomineeId, parentCommentId, text } = req.body;

        if (!nomineeId || !text || !text.trim()) {
            return res.status(400).json({ error: "TEXT_REQUIRED" });
        }

        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);
            if (!parent) {
                return res.status(404).json({ error: "PARENT_COMMENT_NOT_FOUND" });
            }
            if (parent.nomineeId.toString() !== nomineeId.toString()) {
                return res.status(400).json({ error: "PARENT_COMMENT_MISMATCH" });
            }
        }

        const comment = await Comment.create({
            userId: req.user.id,
            categoryId: categoryId || null,
            nomineeId,
            parentCommentId: parentCommentId || null,
            text: text.trim(),
        });

        const populated = await Comment.findById(comment._id)
            .populate("userId", "name profilePicture");

        res.status(201).json({ comment: mapComment(populated) });
    } catch (err) {
        console.error("POST comment error:", err);
        res.status(500).json({ error: "POST_COMMENT_FAILED" });
    }
});

/**
 * EDIT A COMMENT (OWNER ONLY)
 */
router.put("/comments/:id", authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ error: "TEXT_REQUIRED" });
        }

        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "COMMENT_NOT_FOUND" });
        }
        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "NOT_COMMENT_OWNER" });
        }

        comment.text = text.trim();
        comment.edited = true;
        await comment.save();

        const populated = await Comment.findById(comment._id)
            .populate("userId", "name profilePicture");

        res.json({ comment: mapComment(populated) });
    } catch (err) {
        console.error("PUT comment error:", err);
        res.status(500).json({ error: "EDIT_COMMENT_FAILED" });
    }
});

/**
 * DELETE A COMMENT AND ITS REPLIES (OWNER ONLY)
 */
router.delete("/comments/:id", authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "COMMENT_NOT_FOUND" });
        }
        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "NOT_COMMENT_OWNER" });
        }

        // Collect replies (2 levels max) so no orphaned comments remain
        const children = await Comment.find({ parentCommentId: comment._id }).select("_id");
        const childIds = children.map((c) => c._id);
        const grandChildren = childIds.length
            ? await Comment.find({ parentCommentId: { $in: childIds } }).select("_id")
            : [];
        const allIds = [comment._id, ...childIds, ...grandChildren.map((c) => c._id)];

        await Comment.deleteMany({ _id: { $in: allIds } });

        res.json({ success: true, deleted: allIds.length });
    } catch (err) {
        console.error("DELETE comment error:", err);
        res.status(500).json({ error: "DELETE_COMMENT_FAILED" });
    }
});

/**
 * TOGGLE LIKE ON A COMMENT
 */
router.post("/comments/:id/like", authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "COMMENT_NOT_FOUND" });
        }

        const userId = req.user.id;
        const existingIndex = comment.likes.findIndex((id) => id.toString() === userId);

        if (existingIndex >= 0) {
            comment.likes.splice(existingIndex, 1);
        } else {
            comment.likes.push(userId);
        }
        await comment.save();

        res.json({
            liked: existingIndex < 0,
            likesCount: comment.likes.length,
        });
    } catch (err) {
        console.error("POST comment like error:", err);
        res.status(500).json({ error: "LIKE_COMMENT_FAILED" });
    }
});

/**
 * REPORT A COMMENT
 */
router.post("/comments/:id/report", authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "COMMENT_NOT_FOUND" });
        }

        const alreadyReported = comment.reportedBy.some((id) => id.toString() === req.user.id);
        if (!alreadyReported) {
            comment.reportedBy.push(req.user.id);
            await comment.save();
        }

        res.json({ success: true });
    } catch (err) {
        console.error("POST comment report error:", err);
        res.status(500).json({ error: "REPORT_COMMENT_FAILED" });
    }
});

module.exports = router;
