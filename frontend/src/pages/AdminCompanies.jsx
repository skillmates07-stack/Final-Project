import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Building2, CheckCircle, XCircle, LoaderCircle, Mail, Eye, MapPin, Briefcase, Home, Search } from "lucide-react";
import toast from "react-hot-toast";

const AdminCompanies = () => {
    const navigate = useNavigate();
    const { backendUrl, adminToken } = useContext(AppContext);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState(null);
    const [filter, setFilter] = useState("all"); // all, verified, pending
    const [accountTypeFilter, setAccountTypeFilter] = useState("all"); // NEWall, Company, Household
    const [searchTerm, setSearchTerm] = useState(""); // Company name/email search

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            let url = `${backendUrl}/admin/companies`;
            if (filter === "verified") {
                url += "?verified=true";
            } else if (filter === "pending") {
                url += "?verified=false";
            }

            const { data } = await axios.get(url, {
                headers: { token: adminToken },
            });

            if (data.success) {
                setCompanies(data.companies);
            }
        } catch (error) {
            toast.error("Failed to fetch companies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (adminToken) {
            fetchCompanies();
        }
    }, [adminToken, filter]);

    // Filter companies by account type and search term locally
    const filteredCompanies = companies.filter(c => {
        const matchesAccountType = accountTypeFilter === "all" || c.accountType === accountTypeFilter;
        const matchesSearch = searchTerm === "" ||
            c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesAccountType && matchesSearch;
    });

    const handleVerify = async (companyId, isVerified) => {
        setVerifyingId(companyId);
        try {
            const { data } = await axios.post(
                `${backendUrl}/admin/verify-company`,
                { companyId, isVerified },
                { headers: { token: adminToken } }
            );

            if (data.success) {
                toast.success(data.message);
                fetchCompanies();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update verification status");
        } finally {
            setVerifyingId(null);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Company Onboarding</h1>

                {/* Search and Filters */}
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[250px] max-w-md">
                        <p className="text-xs text-gray-500 mb-2">Search Companies</p>
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Verification Status Filter */}
                    <div>
                        <p className="text-xs text-gray-500 mb-2">Verification Status</p>
                        <div className="flex gap-2">
                            {["all", "pending", "verified"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm capitalize transition ${filter === f
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <LoaderCircle className="animate-spin h-8 w-8 text-indigo-600" />
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No companies found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredCompanies.map((company) => (
                        <div
                            key={company._id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow transition"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={company.image}
                                    alt={company.name}
                                    className="w-14 h-14 rounded-lg object-contain border border-gray-100"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-gray-800">{company.name}</h3>
                                        {/* Account Type Badge */}
                                        {company.accountType === "Household" && (
                                            <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                                🏠 Household
                                            </span>
                                        )}
                                        {/* Verification Badge */}
                                        {company.isVerified ? (
                                            <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
                                                <CheckCircle size={12} /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded">
                                                <XCircle size={12} /> Pending
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                        <Mail size={14} /> {company.email}
                                    </p>
                                    {company.verificationDate && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Verified on: {new Date(company.verificationDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                                        className="px-4 py-2 border border-indigo-300 text-indigo-600 rounded hover:bg-indigo-50 transition flex items-center gap-1"
                                    >
                                        <Eye size={16} />
                                        View
                                    </button>
                                    {company.isVerified ? (
                                        <button
                                            onClick={() => handleVerify(company._id, false)}
                                            disabled={verifyingId === company._id}
                                            className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition disabled:opacity-50"
                                        >
                                            {verifyingId === company._id ? (
                                                <LoaderCircle className="animate-spin h-5 w-5" />
                                            ) : (
                                                "Revoke"
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleVerify(company._id, true)}
                                            disabled={verifyingId === company._id}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                                        >
                                            {verifyingId === company._id ? (
                                                <LoaderCircle className="animate-spin h-5 w-5" />
                                            ) : (
                                                "Verify"
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCompanies;
