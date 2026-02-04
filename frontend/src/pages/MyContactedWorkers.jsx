import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import RatingModal from "../components/RatingModal";
import { RatingStars } from "../components/RatingDisplay";
import { SkeletonCard } from "../components/Skeleton";
import {
    Users, Star, Phone, Mail, Calendar, CheckCircle,
    Clock, XCircle, Filter, Eye, MessageCircle
} from "lucide-react";

const MyContactedWorkers = () => {
    const { backendUrl, companyToken } = useContext(AppContext);

    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, rated, unrated
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    // Rating modal
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);

    useEffect(() => {
        fetchContactedWorkers();
    }, [filter, pagination.page]);

    const fetchContactedWorkers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page,
                limit: 20
            });

            if (filter === "rated") params.append("rated", "true");
            if (filter === "unrated") params.append("rated", "false");

            const { data } = await axios.get(`${backendUrl}/company/my-workers?${params}`, {
                headers: { token: companyToken }
            });

            if (data.success) {
                setWorkers(data.workers);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Error fetching workers:", error);
            toast.error("Failed to load contacted workers");
        } finally {
            setLoading(false);
        }
    };

    const handleRateWorker = async (rating, review) => {
        if (!selectedWorker) return;

        try {
            const { data } = await axios.post(
                `${backendUrl}/company/rate-worker`,
                { workerId: selectedWorker._id, rating, review },
                { headers: { token: companyToken } }
            );

            if (data.success) {
                toast.success("Rating submitted successfully");
                setShowRatingModal(false);
                setSelectedWorker(null);
                fetchContactedWorkers();
            }
        } catch (error) {
            toast.error("Failed to submit rating");
        }
    };

    const openRatingModal = (worker) => {
        setSelectedWorker(worker);
        setShowRatingModal(true);
    };

    const getVerificationBadge = (status) => {
        const styles = {
            Verified: "bg-green-100 text-green-700",
            Pending: "bg-yellow-100 text-yellow-700",
            "In Progress": "bg-blue-100 text-blue-700",
            Rejected: "bg-red-100 text-red-700"
        };
        const icons = {
            Verified: <CheckCircle className="w-3 h-3" />,
            Pending: <Clock className="w-3 h-3" />,
            "In Progress": <Clock className="w-3 h-3" />,
            Rejected: <XCircle className="w-3 h-3" />
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${styles[status] || styles.Pending}`}>
                {icons[status] || icons.Pending}
                {status || "Pending"}
            </span>
        );
    };

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                        My Contacted Workers
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Workers you've contacted for service jobs
                    </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setPagination(p => ({ ...p, page: 1 }));
                        }}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Workers ({pagination.total})</option>
                        <option value="rated">Rated</option>
                        <option value="unrated">Not Yet Rated</option>
                    </select>
                </div>
            </div>

            {/* Workers List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : workers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">No contacted workers yet</p>
                    <Link
                        to="/browse-workers"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Browse Workers →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workers.map((worker) => (
                        <div
                            key={worker._id}
                            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Worker Header */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-start gap-3">
                                    <img
                                        src={worker.image || "https://via.placeholder.com/50"}
                                        alt={worker.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate">
                                            {worker.name}
                                        </h3>
                                        <p className="text-sm text-blue-600">{worker.category}</p>
                                        {getVerificationBadge(worker.verificationStatus)}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="px-4 py-3 bg-gray-50 space-y-2">
                                {worker.phone && (
                                    <a
                                        href={`tel:${worker.phone}`}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                                    >
                                        <Phone className="w-4 h-4" />
                                        {worker.phone}
                                    </a>
                                )}
                                {worker.email && (
                                    <a
                                        href={`mailto:${worker.email}`}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span className="truncate">{worker.email}</span>
                                    </a>
                                )}
                                {worker.contactedAt && (
                                    <p className="flex items-center gap-2 text-xs text-gray-400">
                                        <Calendar className="w-3 h-3" />
                                        Contacted {new Date(worker.contactedAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>

                            {/* Rating & Actions */}
                            <div className="p-4">
                                {/* Worker's Rating */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <RatingStars rating={worker.averageRating || 0} size={14} />
                                        <span className="text-xs text-gray-400">
                                            ({worker.totalRatings} reviews)
                                        </span>
                                    </div>
                                </div>

                                {/* Your Rating */}
                                {worker.hasRated ? (
                                    <div className="flex items-center justify-between bg-yellow-50 px-3 py-2 rounded-lg mb-3">
                                        <span className="text-sm text-yellow-700">Your rating:</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold text-yellow-700">{worker.myRating}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => openRatingModal(worker)}
                                        className="w-full mb-3 py-2 border-2 border-yellow-400 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <Star className="w-4 h-4" />
                                        Rate This Worker
                                    </button>
                                )}

                                {/* View Profile Link */}
                                <Link
                                    to={`/worker/profile/${worker._id}`}
                                    className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:underline"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Full Profile
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {[...Array(pagination.pages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPagination(p => ({ ...p, page: i + 1 }))}
                            className={`w-8 h-8 rounded-lg text-sm ${pagination.page === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Rating Modal */}
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => {
                    setShowRatingModal(false);
                    setSelectedWorker(null);
                }}
                onSubmit={handleRateWorker}
                targetName={selectedWorker?.name}
                existingRating={null}
            />
        </div>
    );
};

export default MyContactedWorkers;
