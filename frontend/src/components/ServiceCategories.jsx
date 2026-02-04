import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { ChevronRight, Building2 } from "lucide-react";

// Category images mapping
const categoryImages = {
    // IT Categories
    "Programming": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    "Designing": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    "Networking": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    "Management": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    "Marketing": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=300&fit=crop",
    "Cybersecurity": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
    // Service Categories
    "Japa Maid": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop",
    "Driver": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
    "Cook & Chef": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop",
    "Yoga Teacher": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    "Physiotherapist": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
    "Massage Therapist": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
    "Personal Trainer": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    "Nanny & Babysitter": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop",
    "Elderly Caregiver": "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=300&fit=crop",
    "Housekeeper": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    "Security Guard": "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400&h=300&fit=crop",
    "Electrician": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
    "Plumber": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop",
    "Carpenter": "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop"
};

const defaultImage = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop";

const ServiceCategories = () => {
    const { jobs } = useContext(AppContext);

    // Group jobs by category
    const getCategoriesFromJobs = () => {
        if (!jobs || jobs.length === 0) return [];

        const categoryMap = {};
        jobs.forEach(job => {
            if (job.category) {
                if (!categoryMap[job.category]) {
                    categoryMap[job.category] = {
                        name: job.category,
                        count: 0
                    };
                }
                categoryMap[job.category].count++;
            }
        });

        // Convert to array, sort by count, take top 8
        return Object.values(categoryMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    };

    const categories = getCategoriesFromJobs();

    const getCategorySlug = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    // Don't render if no categories
    if (categories.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">
                        Browse by Category
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore job opportunities across different categories. Find the perfect job
                        that matches your skills and interests.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={`/all-jobs/${getCategorySlug(category.name)}`}
                            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={categoryImages[category.name] || defaultImage}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="inline-flex items-center gap-1 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <Building2 className="w-4 h-4" />
                                        {category.count} {category.count === 1 ? 'Job' : 'Jobs'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                                    {category.name}
                                </h3>
                                <span className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                                    View Jobs
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        View All Categories
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ServiceCategories;
