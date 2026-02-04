import React from "react";
import { Star } from "lucide-react";

// Display stars for a rating
export const RatingStars = ({ rating, size = 16, showNumber = true }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        className={`${star <= fullStars
                                ? "fill-yellow-400 text-yellow-400"
                                : star === fullStars + 1 && hasHalfStar
                                    ? "fill-yellow-400/50 text-yellow-400"
                                    : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
            {showNumber && rating > 0 && (
                <span className="text-sm font-medium text-gray-700 ml-1">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

// Display rating summary with count
export const RatingSummary = ({ averageRating, totalRatings, size = "default" }) => {
    const sizeClasses = {
        small: "text-xs",
        default: "text-sm",
        large: "text-base"
    };

    if (totalRatings === 0) {
        return (
            <div className={`flex items-center gap-1 text-gray-400 ${sizeClasses[size]}`}>
                <Star size={size === "small" ? 12 : size === "large" ? 20 : 16} className="text-gray-300" />
                <span>No ratings yet</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
            <RatingStars
                rating={averageRating}
                size={size === "small" ? 12 : size === "large" ? 20 : 16}
            />
            <span className="text-gray-500">
                ({totalRatings} {totalRatings === 1 ? "review" : "reviews"})
            </span>
        </div>
    );
};

// Individual review display
export const ReviewCard = ({ review, showRaterImage = true }) => {
    const rater = review.raterCompanyId || review.raterUserId;

    return (
        <div className="border-b border-gray-100 py-4 last:border-0">
            <div className="flex items-start gap-3">
                {showRaterImage && (
                    <div className="flex-shrink-0">
                        {rater?.image ? (
                            <img
                                src={rater.image}
                                alt={rater.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-medium text-sm">
                                    {rater?.name?.charAt(0) || "?"}
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-800">{rater?.name || "Anonymous"}</p>
                        <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <RatingStars rating={review.rating} size={14} showNumber={false} />
                    {review.review && (
                        <p className="text-gray-600 mt-2 text-sm">{review.review}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default { RatingStars, RatingSummary, ReviewCard };
