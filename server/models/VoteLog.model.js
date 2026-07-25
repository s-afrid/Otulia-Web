const mongoose = require("mongoose");

const voteLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RankingCategory",
            required: true,
        },
        nomineeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

// Index for fast querying of daily vote limits per user
voteLogSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model("VoteLog", voteLogSchema);
