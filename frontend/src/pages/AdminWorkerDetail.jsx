import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { SkeletonProfileHeader, SkeletonDocumentCard, SkeletonBox, SkeletonText } from "../components/Skeleton";
import {
    ArrowLeft, User, MapPin, Briefcase, Phone, Mail,
    FileText, CheckCircle, XCircle, Clock, Eye, X,
    Download, Shield, AlertTriangle, Loader2, Calendar
} from "lucide-react";

const AdminWorkerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContext);

    const [worker, setWorker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Modal states
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        fetchWorkerDetails();
    }, [id]);

    const fetchWorkerDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const { data } = await axios.get(`${backendUrl}/admin/workers/${id}`, {
                headers: { token }
            });

            if (data.success) {
                setWorker(data.worker);
            }
        } catch (error) {
            console.error("Error fetching worker:", error);
            toast.error("Failed to fetch worker details");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (status) => {
        if (status === "Rejected" && !rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        try {
            setActionLoading(true);
            const token = localStorage.getItem("adminToken");
            const { data } = await axios.patch(
                `${backendUrl}/admin/workers/${id}/verify`,
                { status, rejectionReason: status === "Rejected" ? rejectionReason : "" },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                setShowRejectModal(false);
                setRejectionReason("");
                fetchWorkerDetails();
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    const openDocumentModal = (docType, docData) => {
        setSelectedDocument({ type: docType, ...docData });
        setShowDocumentModal(true);
    };

    const getStatusBadge = (status) => {
        const styles = {
            Verified: "bg-green-100 text-green-700",
            Pending: "bg-yellow-100 text-yellow-700",
            "In Progress": "bg-blue-100 text-blue-700",
            Rejected: "bg-red-100 text-red-700"
        };
        const icons = {
            Verified: <CheckCircle className="w-4 h-4" />,
            Pending: <Clock className="w-4 h-4" />,
            "In Progress": <Loader2 className="w-4 h-4 animate-spin" />,
            Rejected: <XCircle className="w-4 h-4" />
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${styles[status] || styles.Pending}`}>
                {icons[status] || icons.Pending}
                {status || "Pending"}
            </span>
        );
    };

    const DocumentCard = ({ title, document, docKey }) => {
        const hasDocument = document?.file;
        return (
            <div className={`border rounded-lg p-4 ${hasDocument ? "border-gray-200" : "border-dashed border-gray-300"}`}>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">{title}</h4>
                    {hasDocument ? (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Uploaded</span>
                    ) : (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Not Uploaded</span>
                    )}
                </div>

                {hasDocument ? (
                    <div className="space-y-2">
                        {document.type && (
                            <p className="text-sm text-gray-600">Type: <span className="font-medium">{document.type}</span></p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => openDocumentModal(title, document)}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                            >
                                <Eye className="w-3.5 h-3.5" />
                                View
                            </button>
                            <a
                                href={document.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Download
                            </a>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">No document uploaded</p>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6">
                <div className="flex items-center gap-4 mb-6">
                    <SkeletonBox className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <SkeletonText width="w-48" className="h-6" />
                        <SkeletonText width="w-32" className="h-4" />
                    </div>
                    <SkeletonBox className="w-24 h-8 rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <SkeletonProfileHeader />
                            <div className="space-y-3 mt-4">
                                <SkeletonText width="w-full" />
                                <SkeletonText width="w-3/4" />
                                <SkeletonText width="w-2/3" />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <SkeletonText width="w-48" className="h-5 mb-6" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SkeletonDocumentCard />
                                <SkeletonDocumentCard />
                                <SkeletonDocumentCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!worker) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500">Worker not found</p>
                <Link to="/admin/workers" className="text-blue-600 hover:underline mt-2 inline-block">
                    Back to Workers
                </Link>
            </div>
        );
    }

    const sp = worker.serviceProfile || {};
    const docs = sp.documents || {};

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/admin/workers")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800">Worker Verification</h1>
                    <p className="text-gray-500 text-sm">Review documents and verify worker profile</p>
                </div>
                {getStatusBadge(sp.verificationStatus)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-center mb-4">
                            <img
                                src={worker.image || "https://via.placeholder.com/100"}
                                alt={worker.name}
                                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-100"
                            />
                            <h2 className="text-xl font-semibold mt-3">{worker.name}</h2>
                            <p className="text-blue-600">{sp.primaryCategory || "No Category"}</p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{worker.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span className={worker.phone ? "text-gray-800 font-medium" : "text-gray-400"}>
                                    {worker.phone || "Not provided"}
                                </span>
                            </div>
                            {worker.dob && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>DOB: {worker.dob}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{sp.preferredLocations?.[0] || "Not specified"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Briefcase className="w-4 h-4" />
                                <span>{sp.experience?.years || 0} years experience</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Verification Actions</h3>

                        {sp.verificationStatus === "Rejected" && sp.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-red-700">
                                    <strong>Rejection Reason:</strong> {sp.rejectionReason}
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={() => handleVerify("Verified")}
                                disabled={actionLoading || sp.verificationStatus === "Verified"}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircle className="w-5 h-5" />
                                {sp.verificationStatus === "Verified" ? "Already Verified" : "Approve Worker"}
                            </button>

                            <button
                                onClick={() => handleVerify("In Progress")}
                                disabled={actionLoading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <Clock className="w-5 h-5" />
                                Mark In Progress
                            </button>

                            <button
                                onClick={() => setShowRejectModal(true)}
                                disabled={actionLoading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                <XCircle className="w-5 h-5" />
                                Reject
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Documents */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Documents Section */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Verification Documents</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <DocumentCard
                                title="ID Proof"
                                document={docs.idProof}
                                docKey="idProof"
                            />
                            <DocumentCard
                                title="Address Proof"
                                document={docs.addressProof}
                                docKey="addressProof"
                            />
                            <DocumentCard
                                title="Police Clearance"
                                document={docs.policeClearance}
                                docKey="policeClearance"
                            />
                        </div>

                        {!docs.idProof?.file && !docs.addressProof?.file && !docs.policeClearance?.file && (
                            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-yellow-800 font-medium">No documents uploaded</p>
                                    <p className="text-sm text-yellow-700">This worker has not uploaded any verification documents yet.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Service Profile Details */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Profile Details</h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Primary Category</p>
                                <p className="font-medium">{sp.primaryCategory || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Availability</p>
                                <p className="font-medium">{sp.availability?.type || "Flexible"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Expected Salary</p>
                                <p className="font-medium">₹{sp.expectedSalary?.min?.toLocaleString() || 0} - ₹{sp.expectedSalary?.max?.toLocaleString() || 0}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Immediate Joining</p>
                                <p className="font-medium">{sp.availability?.immediateJoining ? "Yes" : "No"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Can Live-In</p>
                                <p className="font-medium">{sp.availability?.canLiveIn ? "Yes" : "No"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Profile Created</p>
                                <p className="font-medium">{sp.createdAt ? new Date(sp.createdAt).toLocaleDateString() : "N/A"}</p>
                            </div>
                        </div>

                        {sp.about && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-gray-500 text-sm mb-1">About</p>
                                <p className="text-gray-700">{sp.about}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Document Preview Modal */}
            {showDocumentModal && selectedDocument && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold">{selectedDocument.type}</h3>
                            <button
                                onClick={() => setShowDocumentModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                            {selectedDocument.file?.includes(".pdf") ? (
                                <iframe
                                    src={selectedDocument.file}
                                    className="w-full h-[600px]"
                                    title="Document Preview"
                                />
                            ) : (
                                <img
                                    src={selectedDocument.file}
                                    alt="Document"
                                    className="max-w-full mx-auto"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Reason Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Reject Worker</h3>
                                <p className="text-sm text-gray-500">Please provide a reason</p>
                            </div>
                        </div>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g., Blurry ID photo, expired documents, incomplete information..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason("");
                                }}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleVerify("Rejected")}
                                disabled={actionLoading || !rejectionReason.trim()}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading ? "Rejecting..." : "Reject Worker"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWorkerDetail;
