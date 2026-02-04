import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServiceProfileForm from "../components/ServiceProfileForm";
import axios from "axios";
import { Briefcase, CheckCircle, ArrowLeft } from "lucide-react";

const ServiceProfile = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { backendUrl, userToken, userData } = useContext(AppContext);
    const [hasProfile, setHasProfile] = useState(false);
    const [loading, setLoading] = useState(true);

    const isFromWorkerSignup = searchParams.get("setup") === "true";

    useEffect(() => {
        if (!userToken) {
            navigate("/login?redirect=/service-profile");
            return;
        }
        checkProfile();
    }, [userToken]);

    const checkProfile = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/user/service-profile`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setHasProfile(data.hasServiceProfile);
        } catch (error) {
            console.error("Error checking profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        setHasProfile(true);
        // If coming from worker signup, redirect to jobs
        if (isFromWorkerSignup) {
            navigate("/all-jobs/all");
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-3xl">
                    {/* Back Button */}
                    {!isFromWorkerSignup && (
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>
                    )}

                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <Briefcase className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {hasProfile ? "Edit Service Profile" : "Create Service Profile"}
                                </h1>
                                <p className="text-gray-600">
                                    {isFromWorkerSignup
                                        ? "Complete your profile to start applying for service jobs"
                                        : "Add your service profile to apply for service jobs (Japa Maid, Driver, etc.)"}
                                </p>
                            </div>
                        </div>

                        {/* Info Box */}
                        {!hasProfile && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-medium text-blue-800 mb-2">Why create a Service Profile?</h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>✓ Apply to service jobs (Japa Maid, Driver, Cook, etc.)</li>
                                    <li>✓ Get discovered by clients looking for workers</li>
                                    <li>✓ Show your experience, skills, and availability</li>
                                    <li>✓ Keep your IT resume separate for tech jobs</li>
                                </ul>
                            </div>
                        )}

                        {hasProfile && (
                            <div className="mt-4 flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span>Service Profile Active</span>
                            </div>
                        )}
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <ServiceProfileForm
                            onSuccess={handleSuccess}
                            onCancel={!isFromWorkerSignup ? () => navigate(-1) : null}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ServiceProfile;
