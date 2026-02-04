import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { Briefcase, MapPin, Clock, Building2, ArrowLeft } from "lucide-react";

const ServiceDetail = () => {
    const { slug } = useParams();
    const { backendUrl, jobs } = useContext(AppContext);

    const [category, setCategory] = useState(null);
    const [categoryJobs, setCategoryJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Map slug to job category name
    const slugToCategoryMap = {
        "japa-maid": "Japa Maid",
        "driver": "Driver",
        "cook": "Cook & Chef",
        "yoga-teacher": "Yoga Teacher",
        "physiotherapist": "Physiotherapist",
        "massage-therapist": "Massage Therapist",
        "babysitting": "Nanny & Babysitter",
        "care-taker": "Elderly Caregiver",
        "housekeeping": "Housekeeper",
        "security-guard": "Security Guard",
        "beautician": "Beautician",
        "hotel-staff": "Hotel Staff",
        "peon-staff": "Peon Staff",
        "patient-care": "Patient Care"
    };

    useEffect(() => {
        fetchCategory();
    }, [slug]);

    useEffect(() => {
        if (jobs && jobs.length > 0 && category) {
            // Filter jobs by category
            const categoryName = slugToCategoryMap[slug];
            const filtered = jobs.filter(job =>
                job.category?.toLowerCase() === categoryName?.toLowerCase()
            );
            setCategoryJobs(filtered);
            setLoading(false);
        } else if (category) {
            setLoading(false);
        }
    }, [jobs, slug, category]);

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${backendUrl}/services/${slug}`);
            if (response.data.success) {
                setCategory(response.data.category);
            }
        } catch (error) {
            console.error("Error fetching category:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
                    <div className="container mx-auto px-4">
                        {!category ? (
                            <div className="animate-pulse">
                                <div className="h-8 bg-blue-400 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-blue-400 rounded w-2/3"></div>
                            </div>
                        ) : (
                            <>
                                <nav className="text-blue-200 text-sm mb-4">
                                    <Link to="/" className="hover:text-white">Home</Link>
                                    <span className="mx-2">/</span>
                                    <Link to="/services" className="hover:text-white">Services</Link>
                                    <span className="mx-2">/</span>
                                    <span className="text-white">{category.name}</span>
                                </nav>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                    {category.name}
                                </h1>
                                <p className="text-blue-100 max-w-2xl">
                                    {category.description}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        {categoryJobs.length} Job{categoryJobs.length !== 1 ? 's' : ''} Available
                                    </span>
                                    <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm">
                                        ₹{category.salaryRange?.min?.toLocaleString()} - ₹{category.salaryRange?.max?.toLocaleString()}/month
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    {/* Back Link */}
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Services
                    </Link>

                    {/* Required Skills */}
                    {category?.requiredSkills && category.requiredSkills.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h3 className="font-semibold text-lg text-gray-800 mb-4">Skills Required for This Role</h3>
                            <div className="flex flex-wrap gap-2">
                                {category.requiredSkills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Jobs Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Job Openings in {category?.name?.replace(" Services", "")}
                        </h2>

                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                            <div className="flex-1">
                                                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : categoryJobs.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl">
                                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    No Job Openings Yet
                                </h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    Recruiters haven't posted any {category?.name?.replace(" Services", "")} jobs yet.
                                    Check back later or browse other categories.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Link
                                        to="/all-jobs/all"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Browse All Jobs
                                    </Link>
                                    <Link
                                        to="/services"
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        View Other Services
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {categoryJobs.map((job, i) => (
                                    <JobCard key={job._id || i} job={job} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Also Check Section */}
                    {categoryJobs.length > 0 && (
                        <div className="mt-12 text-center">
                            <Link
                                to="/all-jobs/all"
                                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium"
                            >
                                View All Job Categories
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ServiceDetail;
