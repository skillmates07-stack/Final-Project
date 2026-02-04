import mongoose from "mongoose";

const ratingSchema = mongoose.Schema({
    // Type of rating
    type: {
        type: String,
        enum: ["worker_rating", "company_rating"],  // worker_rating = company rates worker, company_rating = worker rates company
        required: true
    },

    // Who is being rated
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    targetCompanyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },

    // Who is giving the rating
    raterUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    raterCompanyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },

    // Rating details
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        maxlength: 1000
    },

    // Verification - linked to a contact request
    contactNotificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification"
    },

    // Status
    isVisible: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Indexes for efficient querying
ratingSchema.index({ targetUserId: 1, type: 1 });
ratingSchema.index({ targetCompanyId: 1, type: 1 });
ratingSchema.index({ raterCompanyId: 1, targetUserId: 1 }); // Prevent duplicate ratings

// Static method to get average rating for a worker
ratingSchema.statics.getWorkerRating = async function (userId) {
    const result = await this.aggregate([
        { $match: { targetUserId: new mongoose.Types.ObjectId(userId), type: "worker_rating", isVisible: true } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 }
            }
        }
    ]);
    return result[0] || { averageRating: 0, totalRatings: 0 };
};

// Static method to get average rating for a company
ratingSchema.statics.getCompanyRating = async function (companyId) {
    const result = await this.aggregate([
        { $match: { targetCompanyId: new mongoose.Types.ObjectId(companyId), type: "company_rating", isVisible: true } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 }
            }
        }
    ]);
    return result[0] || { averageRating: 0, totalRatings: 0 };
};

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
