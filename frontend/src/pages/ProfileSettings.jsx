import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Building2, Home, Mail, User, CheckCircle, Clock, AlertCircle, Upload, FileText, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ProfileSettings = () => {
    const { companyData, backendUrl, companyToken, setCompanyData } = useContext(AppContext);
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(companyData?.name || "");
    const [email, setEmail] = useState(companyData?.email || "");
    const [city, setCity] = useState(companyData?.city || "");
    const [state, setState] = useState(companyData?.state || "");
    const [contactPerson, setContactPerson] = useState(companyData?.contactPerson || "");
    const [contactPhone, setContactPhone] = useState(companyData?.contactPhone || "");

    // Document upload states
    const [idProofType, setIdProofType] = useState(companyData?.idProofType || "Aadhar Card");
    const [idProofFile, setIdProofFile] = useState(null);
    const [addressProofType, setAddressProofType] = useState(companyData?.addressProofType || "Utility Bill");
    const [addressProofFile, setAddressProofFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSaveProfile = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/company/update-profile`,
                { name, email, city, state, contactPerson, contactPhone },
                { headers: { token: companyToken } }
            );

            if (data.success) {
                toast.success("Profile updated successfully");
                setCompanyData(data.companyData);
                setEditing(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const handleDocumentUpload = async () => {
        if (!idProofFile || !addressProofFile) {
            toast.error("Please upload both ID proof and address proof");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("idProofType", idProofType);
            formData.append("idProofDocument", idProofFile);
            formData.append("addressProofType", addressProofType);
            formData.append("addressProofDocument", addressProofFile);

            const { data } = await axios.post(
                `${backendUrl}/company/upload-documents`,
                formData,
                {
                    headers: {
                        token: companyToken,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (data.success) {
                toast.success("Documents uploaded successfully! Awaiting admin verification.");
                setCompanyData(data.companyData);
                setIdProofFile(null);
                setAddressProofFile(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to upload documents");
        } finally {
            setUploading(false);
        }
    };

    const getVerificationStatusBadge = () => {
        if (companyData?.isVerified) {
            return (
                <span className="flex items-center gap-1 text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-full">
                    <CheckCircle size={16} /> Verified
                </span>
            );
        } else {
            return (
                <span className="flex items-center gap-1 text-sm bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full">
                    <Clock size={16} /> Pending Verification
                </span>
            );
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Profile Settings</h1>
                <p className="text-gray-600">Manage your account information and settings</p>
            </div>

            {/* Verification Status Banner */}
            {!companyData?.isVerified && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-semibold text-yellow-800 mb-1">Verification Pending</h3>
                            <p className="text-sm text-yellow-700">
                                {companyData?.accountType === "Household"
                                    ? "Please upload your ID and address proof below for verification. You'll be able to browse workers once approved."
                                    : "Your account is currently under review. You'll be notified once verified."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={companyData?.image}
                            alt={companyData?.name}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{companyData?.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                {companyData?.accountType === "Household" ? (
                                    <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                        <Home size={12} /> Individual / Household
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        <Building2 size={12} /> Company
                                    </span>
                                )}
                                {getVerificationStatusBadge()}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setEditing(!editing)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        {editing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {companyData?.accountType === "Household" ? "Your Name" : "Company Name"}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!editing}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={!editing}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            disabled={!editing}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                        <input
                            type="text"
                            value={contactPerson}
                            onChange={(e) => setContactPerson(e.target.value)}
                            disabled={!editing}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                        <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            disabled={!editing}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>
                </div>

                {editing && (
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleSaveProfile}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Document Upload Section - Only for Households */}
            {companyData?.accountType === "Household" && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Documents</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        Upload your ID and address proof for account verification. Accepted formats: JPG, PNG, PDF (Max 5MB each)
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ID Proof */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof Type</label>
                            <select
                                value={idProofType}
                                onChange={(e) => setIdProofType(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm mb-3"
                                disabled={companyData?.idProofDocument}
                            >
                                <option>Aadhar Card</option>
                                <option>Driving License</option>
                                <option>PAN Card</option>
                                <option>Passport</option>
                            </select>

                            {companyData?.idProofDocument ? (
                                <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="text-green-600" size={20} />
                                            <div>
                                                <p className="text-sm font-medium text-green-800">Document Uploaded</p>
                                                <p className="text-xs text-green-600">{companyData?.idProofType}</p>
                                            </div>
                                        </div>
                                        <CheckCircle className="text-green-600" size={20} />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition">
                                        <Upload className="text-gray-400 mb-2" size={24} />
                                        <span className="text-sm text-gray-600">Click to upload ID proof</span>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => setIdProofFile(e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                    {idProofFile && (
                                        <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <span className="text-sm text-gray-700 truncate">{idProofFile.name}</span>
                                            <button onClick={() => setIdProofFile(null)} className="text-red-500">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Address Proof */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address Proof Type</label>
                            <select
                                value={addressProofType}
                                onChange={(e) => setAddressProofType(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm mb-3"
                                disabled={companyData?.addressProofDocument}
                            >
                                <option>Utility Bill</option>
                                <option>Rent Agreement</option>
                                <option>Property Tax Receipt</option>
                                <option>Bank Statement</option>
                            </select>

                            {companyData?.addressProofDocument ? (
                                <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="text-green-600" size={20} />
                                            <div>
                                                <p className="text-sm font-medium text-green-800">Document Uploaded</p>
                                                <p className="text-xs text-green-600">{companyData?.addressProofType}</p>
                                            </div>
                                        </div>
                                        <CheckCircle className="text-green-600" size={20} />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition">
                                        <Upload className="text-gray-400 mb-2" size={24} />
                                        <span className="text-sm text-gray-600">Click to upload address proof</span>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => setAddressProofFile(e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                    {addressProofFile && (
                                        <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <span className="text-sm text-gray-700 truncate">{addressProofFile.name}</span>
                                            <button onClick={() => setAddressProofFile(null)} className="text-red-500">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {!companyData?.idProofDocument && !companyData?.addressProofDocument && (
                        <button
                            onClick={handleDocumentUpload}
                            disabled={uploading || !idProofFile || !addressProofFile}
                            className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Uploading..." : "Submit Documents for Verification"}
                        </button>
                    )}
                </div>
            )}

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700">
                    If you have any questions about verification or account settings, please contact our support team.
                </p>
            </div>
        </div>
    );
};

export default ProfileSettings;
