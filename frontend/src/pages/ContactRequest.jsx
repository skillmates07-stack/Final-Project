import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-hot-toast";
import {
    Building, Mail, Calendar, CheckCircle, XCircle,
    ArrowLeft, Clock, User, Briefcase
} from "lucide-react";
import moment from "moment";

const ContactRequest = () => {
    const { notificationId } = useParams();
    const navigate = useNavigate();
    const { backendUrl, userToken, isLogin } = useContext(AppContext);

    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responding, setResponding] = useState(false);

    useEffect(() => {
        if (!isLogin) {
            navigate("/candidate-login");
            return;
        }
        fetchContactRequest();
    }, [notificationId, isLogin]);

    const fetchContactRequest = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${backendUrl}/user/contact-request/${notificationId}`,
                { headers: { token: userToken } }
            );
            if (data.success) {
                setNotification(data.notification);
            }
        } catch (error) {
            console.error("Error fetching contact request:", error);
            toast.error("Failed to load contact request");
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (response) => {
        try {
            setResponding(true);
            const { data } = await axios.post(
                `${backendUrl}/user/contact-request/${notificationId}/respond`,
                { response },
                { headers: { token: userToken } }
            );
            if (data.success) {
                toast.success(data.message);
                setNotification(prev => ({ ...prev, contactStatus: response }));
            }
        } catch (error) {
            console.error("Error responding to contact request:", error);
            toast.error("Failed to respond to contact request");
        } finally {
            setResponding(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </>
        );
    }

    if (!notification) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Request Not Found</h2>
                        <Link to="/" className="text-blue-600 hover:underline">Go to Home</Link>
                    </div>
                </div>
            </>
        );
    }

    const company = notification.fromCompany;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-2xl">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                    {company?.image ? (
                                        <img
                                            src={company.image}
                                            alt={company.name}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <Building className="w-8 h-8 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">{notification.title}</h1>
                                    <p className="text-blue-100 mt-1">
                                        From: {company?.name || "Unknown Company"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Message */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-gray-700">{notification.message}</p>
                                <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {moment(notification.createdAt).fromNow()}
                                </p>
                            </div>

                            {/* Company Info */}
                            {company && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-3">Company Details</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Building className="w-4 h-4" />
                                            <span>{company.name}</span>
                                        </div>
                                        {company.email && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="w-4 h-4" />
                                                <span>{company.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Status or Action Buttons */}
                            {notification.contactStatus === "pending" ? (
                                <div className="border-t pt-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">
                                        Would you like to share your contact information with this company?
                                    </h3>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleResponse("accepted")}
                                            disabled={responding}
                                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleResponse("rejected")}
                                            disabled={responding}
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-t pt-6">
                                    <div className={`flex items-center gap-2 p-4 rounded-lg ${notification.contactStatus === "accepted"
                                            ? "bg-green-50 text-green-700"
                                            : "bg-red-50 text-red-700"
                                        }`}>
                                        {notification.contactStatus === "accepted" ? (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="font-medium">
                                                    You accepted this contact request. The company can now reach out to you.
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-5 h-5" />
                                                <span className="font-medium">
                                                    You declined this contact request.
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ContactRequest;
