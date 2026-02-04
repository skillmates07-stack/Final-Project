import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Grid, List, Briefcase, Building2 } from "lucide-react";

// Category images mapping (for display purposes)
const categoryImages = {
    // IT Categories
    "Programming": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    "Designing": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    "Networking": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    "Management": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    "Marketing": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&h=400&fit=crop",
    "Cybersecurity": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    // Service Categories
    "Japa Maid": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop",
    "Driver": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop",
    "Cook & Chef": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop",
    "Yoga Teacher": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    "Physiotherapist": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    "Massage Therapist": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop",
    "Personal Trainer": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    "Nanny & Babysitter": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop",
    "Elderly Caregiver": "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&h=400&fit=crop",
    "Housekeeper": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    "Security Guard": "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=600&h=400&fit=crop",
    "Electrician": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    "Plumber": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop",
    "Carpenter": "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop"
};

const defaultImage = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop";

const Services = () => {
    const { jobs } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (jobs && jobs.length > 0) {
            // Group jobs by category
            const categoryMap = {};
            jobs.forEach(job => {
                if (job.category) {
                    if (!categoryMap[job.category]) {
                        categoryMap[job.category] = {
                            name: job.category,
                            count: 0,
                            jobs: []
                        };
                    }
                    categoryMap[job.category].count++;
                    categoryMap[job.category].jobs.push(job);
                }
            });

            // Convert to array and sort by count
            const categoryArray = Object.values(categoryMap).sort((a, b) => b.count - a.count);
            setCategories(categoryArray);
        }
    }, [jobs]);

    // Filter categories based on search
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCategorySlug = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                            Browse by Category
                        </h1>
                        <p className="text-blue-100 text-center max-w-2xl mx-auto mb-8">
                            Explore job opportunities across different tech categories.
                            Find the perfect job that matches your skills.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 focus:ring-2 focus:ring-blue-300 text-gray-800 bg-white shadow-lg placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-10">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {filteredCategories.length} {filteredCategories.length === 1 ? 'Category' : 'Categories'} with Jobs
                        </h2>
                    </div>

                    {/* No Jobs Message */}
                    {categories.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl">
                            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                No Job Categories Yet
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                When recruiters post jobs, the categories will appear here.
                            </p>
                            <Link
                                to="/all-jobs/all"
                                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Browse All Jobs
                            </Link>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No categories found matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        /* Categories Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCategories.map((cat) => (
                                <Link
                                    key={cat.name}
                                    to={`/all-jobs/${getCategorySlug(cat.name)}`}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={categoryImages[cat.name] || defaultImage}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <span className="inline-flex items-center gap-1 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                                <Building2 className="w-4 h-4" />
                                                {cat.count} {cat.count === 1 ? 'Job' : 'Jobs'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Click to view all {cat.name} jobs
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* View All Jobs Link */}
                    {categories.length > 0 && (
                        <div className="text-center mt-12">
                            <Link
                                to="/all-jobs/all"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                View All Jobs
                                <Briefcase className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Services;
