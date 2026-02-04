import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import {
    MapPin, Briefcase, Star, Phone, Clock,
    CheckCircle, Calendar, Globe, User, ChevronLeft,
    Award, MessageCircle, DollarSign, ArrowLeft, LogOut
} from "lucide-react";
import RatingModal from "../components/RatingModal";
import { RatingSummary, ReviewCard } from "../components/RatingDisplay";
import toast from "react-hot-toast";

const WorkerProfile = () => {
    const { id } = useParams();
    const { backendUrl, isLogin, companyToken, companyData } = useContext(AppContext);

    const [worker, setWorker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showContact, setShowContact] = useState(false);

    // Rating state
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingData, setRatingData] = useState({ averageRating: 0, totalRatings: 0, ratings: [] });
    const [existingRating, setExistingRating] = useState(null);

    const isRecruiterMode = !!companyToken;

    useEffect(() => {
        fetchWorker();
        fetchRatings();
    }, [id]);

    // Check contact status when recruiter mode
    useEffect(() => {
        if (isRecruiterMode && id) {
            checkContactStatus();
        }
    }, [isRecruiterMode, id, companyToken]);

    const checkContactStatus = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/company/contact-status/${id}`,
                { headers: { token: companyToken } }
            );
            if (data.success && data.hasContacted) {
                setShowContact(true);
                // Also check if we've already rated this worker
                checkRatingStatus();
            }
        } catch (error) {
            console.error("Error checking contact status:", error);
        }
    };

    const fetchRatings = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/company/worker-ratings/${id}`);
            if (data.success) {
                setRatingData({
                    averageRating: data.averageRating,
                    totalRatings: data.totalRatings,
                    ratings: data.ratings
                });
            }
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    };

    const checkRatingStatus = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/company/rating-status/${id}`,
                { headers: { token: companyToken } }
            );
            if (data.success && data.hasRated) {
                setExistingRating(data.rating);
            }
        } catch (error) {
            console.error("Error checking rating status:", error);
        }
    };

    const handleRateWorker = async (rating, review) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/company/rate-worker`,
                { workerId: id, rating, review },
                { headers: { token: companyToken } }
            );
            if (data.success) {
                toast.success(data.message);
                setExistingRating(data.rating);
                fetchRatings(); // Refresh ratings
            }
        } catch (error) {
            console.error("Error rating worker:", error);
            toast.error("Failed to submit rating");
        }
    };

    const fetchWorker = async () => {
        try {
            setLoading(true);
            // Use the new endpoint that fetches user with serviceProfile
            const response = await axios.get(`${backendUrl}/user/workers/${id}`);

            if (response.data.success) {
                setWorker(response.data.worker);
            }
        } catch (error) {
            console.error("Error fetching worker:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleContactClick = async () => {
        if (!isLogin && !companyToken) {
            window.location.href = `/candidate-login?redirect=/worker/profile/${id}`;
            return;
        }

        // If recruiter mode, send notification to the worker
        if (isRecruiterMode) {
            try {
                const { data } = await axios.post(
                    `${backendUrl}/company/contact-worker`,
                    { workerId: id },
                    { headers: { token: companyToken } }
                );
                if (data.success) {
                    // Worker has been notified, now show their contact info
                    setShowContact(true);
                }
            } catch (error) {
                console.error("Error contacting worker:", error);
                // Still show contact info even if notification fails
                setShowContact(true);
            }
        } else {
            setShowContact(true);
        }
    };

    // Recruiter Header Component
    const RecruiterHeader = () => (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/dashboard" className="flex items-center">
                        <img className="w-[120px]" src={assets.logo} alt="Logo" />
                    </Link>
                    <Link to="/browse-workers" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Workers</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={companyData?.image}
                            alt={companyData?.name}
                        />
                        <span className="text-gray-600 text-sm">Hi, {companyData?.name}</span>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("companyToken");
                            window.location.href = "/recruiter-login";
                        }}
                        className="w-[30px] h-[30px] flex items-center justify-center rounded bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Logout"
                    >
                        <LogOut size={18} className="text-gray-700" />
                    </button>
                </div>
            </div>
        </header>
    );

    if (loading) {
        return (
            <>
                {isRecruiterMode ? <RecruiterHeader /> : <Navbar />}
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </>
        );
    }

    if (!worker) {
        return (
            <>
                {isRecruiterMode ? <RecruiterHeader /> : <Navbar />}
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Worker Not Found</h2>
                        <p className="text-gray-500 mb-4">This profile may not exist or has been removed.</p>
                        <Link to="/browse-workers" className="text-blue-600 hover:underline">
                            Browse Workers
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Extract serviceProfile data
    const sp = worker.serviceProfile || {};

    return (
        <>
            {isRecruiterMode ? <RecruiterHeader /> : <Navbar />}
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb - Only show for non-recruiter users */}
                    {!isRecruiterMode && (
                        <nav className="mb-6">
                            <Link
                                to="/browse-workers"
                                className="flex items-center gap-2 text-blue-600 hover:underline"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back to Workers
                            </Link>
                        </nav>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                                {/* Profile Image */}
                                <div className="text-center mb-6">
                                    <img
                                        src={worker.image || "https://via.placeholder.com/150"}
                                        alt={worker.name}
                                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-100"
                                    />
                                    <h1 className="text-xl font-bold text-gray-800 mt-4">
                                        {worker.name}
                                    </h1>
                                    <p className="text-blue-600 font-medium">{sp.primaryCategory}</p>

                                    {/* Rating Display */}
                                    <div className="mt-2">
                                        <RatingSummary
                                            averageRating={ratingData.averageRating}
                                            totalRatings={ratingData.totalRatings}
                                            size="default"
                                        />
                                    </div>

                                    {/* Active Badge */}
                                    {sp.isActive && (
                                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm mt-3">
                                            <CheckCircle className="w-4 h-4" />
                                            Active Profile
                                        </span>
                                    )}
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {sp.experience?.years || 0}+
                                        </p>
                                        <p className="text-xs text-gray-500">Years Exp.</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <p className="text-lg font-medium text-gray-700">
                                            {sp.availability?.type || "Flexible"}
                                        </p>
                                        <p className="text-xs text-gray-500">Availability</p>
                                    </div>
                                </div>

                                {/* Immediate Joining */}
                                {sp.availability?.immediateJoining && (
                                    <div className="mb-6">
                                        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium w-full text-center bg-green-100 text-green-700">
                                            ✓ Available for Immediate Joining
                                        </span>
                                    </div>
                                )}

                                {/* Expected Salary */}
                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <p className="text-sm text-gray-600 mb-1">Expected Salary</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        ₹{sp.expectedSalary?.min?.toLocaleString() || 0} - ₹{sp.expectedSalary?.max?.toLocaleString() || 0}
                                        <span className="text-sm font-normal text-gray-500">/month</span>
                                    </p>
                                </div>

                                {/* Contact Button */}
                                {showContact ? (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-2">Contact Information</p>
                                        <div className="space-y-2">
                                            {worker.phone && (
                                                <a
                                                    href={`tel:${worker.phone}`}
                                                    className="flex items-center gap-2 text-blue-600 hover:underline"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                    {worker.phone}
                                                </a>
                                            )}
                                            {worker.email && (
                                                <p className="flex items-center gap-2 text-gray-600">
                                                    <MessageCircle className="w-4 h-4" />
                                                    {worker.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleContactClick}
                                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Contact Worker
                                    </button>
                                )}

                                {!isLogin && !companyToken && (
                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        Login required to view contact details
                                    </p>
                                )}

                                {/* Rate Worker Button - Only for recruiters who have contacted */}
                                {isRecruiterMode && showContact && (
                                    <button
                                        onClick={() => setShowRatingModal(true)}
                                        className="w-full mt-4 py-3 border-2 border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <Star className={`w-5 h-5 ${existingRating ? "fill-yellow-500" : ""}`} />
                                        {existingRating ? `Update Rating (${existingRating.rating}★)` : "Rate This Worker"}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About Section */}
                            {sp.about && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-600" />
                                        About
                                    </h2>
                                    <p className="text-gray-600 whitespace-pre-line">{sp.about}</p>
                                </div>
                            )}

                            {/* Experience */}
                            {sp.experience?.description && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                        Experience
                                    </h2>
                                    <p className="text-gray-700 font-medium mb-2">
                                        {sp.experience.years} years of experience
                                    </p>
                                    <p className="text-gray-600">{sp.experience.description}</p>
                                </div>
                            )}

                            {/* Skills Section */}
                            {sp.skills && sp.skills.length > 0 && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-blue-600" />
                                        Skills & Expertise
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {sp.skills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Categories */}
                            {sp.additionalCategories && sp.additionalCategories.length > 0 && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                        Can Also Work As
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {sp.additionalCategories.map((cat, i) => (
                                            <span
                                                key={i}
                                                className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Availability Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    Availability
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500">Type</p>
                                        <p className="font-medium text-gray-700">{sp.availability?.type || "Flexible"}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500">Live-in</p>
                                        <p className="font-medium text-gray-700">{sp.availability?.canLiveIn ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500">Immediate</p>
                                        <p className="font-medium text-gray-700">
                                            {sp.availability?.immediateJoining ? "Yes" : "No"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Location Preferences */}
                            {sp.locationPreferences && sp.locationPreferences.length > 0 && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                        Preferred Locations
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {sp.locationPreferences.map((loc, i) => (
                                            <span
                                                key={i}
                                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm"
                                            >
                                                {loc}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Languages */}
                            {sp.languages && sp.languages.length > 0 && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-blue-600" />
                                        Languages
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {sp.languages.map((lang, i) => (
                                            <span
                                                key={i}
                                                className="bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm"
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reviews Section */}
                            {ratingData.ratings.length > 0 && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        Reviews ({ratingData.totalRatings})
                                    </h2>
                                    <div className="mb-4 flex items-center gap-4">
                                        <div className="text-3xl font-bold text-gray-800">
                                            {ratingData.averageRating.toFixed(1)}
                                        </div>
                                        <RatingSummary
                                            averageRating={ratingData.averageRating}
                                            totalRatings={ratingData.totalRatings}
                                            size="large"
                                        />
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {ratingData.ratings.map((review) => (
                                            <ReviewCard key={review._id} review={review} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                onSubmit={handleRateWorker}
                targetName={worker?.name}
                existingRating={existingRating}
            />

            <Footer />
        </>
    );
};

export default WorkerProfile;
