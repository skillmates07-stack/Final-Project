import React, { useState } from "react";
import { Star, X } from "lucide-react";

const RatingModal = ({ isOpen, onClose, onSubmit, targetName, existingRating }) => {
    const [rating, setRating] = useState(existingRating?.rating || 0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [review, setReview] = useState(existingRating?.review || "");
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        try {
            await onSubmit(rating, review);
            onClose();
        } catch (error) {
            console.error("Error submitting rating:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const starLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 text-white flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {existingRating ? "Update Your Rating" : "Rate Your Experience"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 mb-4 text-center">
                        How was your experience with <span className="font-semibold text-gray-800">{targetName}</span>?
                    </p>

                    {/* Star Rating */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={40}
                                        className={`transition-colors ${star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 h-5">
                            {(hoveredRating || rating) > 0 && starLabels[(hoveredRating || rating) - 1]}
                        </p>
                    </div>

                    {/* Review Text */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Write a review (optional)
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your experience..."
                            rows={4}
                            maxLength={1000}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-gray-400 text-right mt-1">
                            {review.length}/1000 characters
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || submitting}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting..." : existingRating ? "Update Rating" : "Submit Rating"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
