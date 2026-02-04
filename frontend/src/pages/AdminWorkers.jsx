import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import {
    Search, Filter, CheckCircle, XCircle, Clock,
    Eye, User, MapPin, Briefcase, ChevronRight, RefreshCw
} from "lucide-react";

const AdminWorkers = () => {
    const { backendUrl } = useContext(AppContext);

    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        category: ""
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchWorkers();
        fetchCategories();
    }, [pagination.page, filters]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${backendUrl}/services`);
            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const params = new URLSearchParams({
                page: pagination.page,
                limit: 20,
                ...filters
            });

            const response = await axios.get(`${backendUrl}/admin/workers?${params}`, {
                headers: { token }
            });

            if (response.data.success) {
                setWorkers(response.data.workers);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching workers:", error);
            toast.error("Failed to fetch workers");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (workerId, status) => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await axios.patch(
                `${backendUrl}/admin/workers/${workerId}/verify`,
                { status },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(`Worker ${status.toLowerCase()} successfully`);
                fetchWorkers();
            }
        } catch (error) {
            toast.error("Failed to update verification status");
        }
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Verified":
                return <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" /> Verified
                </span>;
            case "In Progress":
                return <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs">
                    <RefreshCw className="w-3 h-3" /> In Progress
                </span>;
            case "Rejected":
                return <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs">
                    <XCircle className="w-3 h-3" /> Rejected
                </span>;
            default:
                return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs">
                    <Clock className="w-3 h-3" /> Pending
                </span>;
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Workers Management</h1>
                <span className="text-gray-500">{pagination.total} Workers</span>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search by name, phone, city..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Workers Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : workers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No workers found
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Worker</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Location</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Documents</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {workers.map(worker => (
                                <tr key={worker._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={worker.image || "https://via.placeholder.com/40"}
                                                alt={worker.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{worker.name}</p>
                                                <p className="text-xs text-gray-500">{worker.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-600">
                                            {worker.serviceCategory?.name || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-600">
                                            {worker.address?.city}, {worker.address?.state}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs
                                                ${worker.documents?.idProof?.file ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                                                ID
                                            </span>
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs
                                                ${worker.documents?.addressProof?.file ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                                                A
                                            </span>
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs
                                                ${worker.documents?.policeClearance?.file ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                                                P
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(worker.verificationStatus)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/admin/workers/${worker._id}`}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            {worker.verificationStatus === "Pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleVerify(worker._id, "Verified")}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                        title="Verify"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleVerify(worker._id, "Rejected")}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 p-4 border-t">
                        {[...Array(pagination.pages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                                className={`w-8 h-8 rounded-lg text-sm
                                    ${pagination.page === i + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminWorkers;
