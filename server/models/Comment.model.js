const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
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
            default: null,
        },
        nomineeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        parentCommentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        reportedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        edited: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Fast lookup of all comments for a nominee, newest first
commentSchema.index({ nomineeId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
