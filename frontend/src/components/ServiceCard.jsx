import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ category }) => {
    // Default placeholder image if none provided
    const defaultImage = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop";

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={category.image || defaultImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {category.shortDescription || category.description?.substring(0, 80) + "..."}
                </p>

                {/* Skills preview */}
                {category.requiredSkills && category.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {category.requiredSkills.slice(0, 3).map((skill, index) => (
                            <span
                                key={index}
                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
                            >
                                {skill}
                            </span>
                        ))}
                        {category.requiredSkills.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{category.requiredSkills.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Salary Range */}
                {category.salaryRange && category.salaryRange.min > 0 && (
                    <p className="text-sm text-gray-500 mb-3">
                        ₹{category.salaryRange.min.toLocaleString()} - ₹{category.salaryRange.max.toLocaleString()}/month
                    </p>
                )}

                {/* View More Button */}
                <Link
                    to={`/services/${category.slug}`}
                    className="inline-block w-full text-center py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium"
                >
                    View More
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;
