import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Search, Unlock, Trash2, Mail, MapPin, LoaderCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const AdminBlockedWorkers = () => {
    const { backendUrl, adminToken } = useContext(AppContext);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBlockedWorkers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/admin/blocked-workers`,
                { headers: { token: adminToken } }
            );
            if (data.success) {
                setWorkers(data.workers);
            }
        } catch (error) {
            toast.error("Failed to fetch blocked workers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (adminToken) {
            fetchBlockedWorkers();
        }
    }, [adminToken]);

    const handleUnblock = async (workerId) => {
        if (!window.confirm("Are you sure you want to unblock this worker?")) return;

        try {
            const { data } = await axios.patch(
                `${backendUrl}/admin/user/${workerId}/block`,
                {},
                { headers: { token: adminToken } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchBlockedWorkers();
            }
        } catch (error) {
            toast.error("Failed to unblock worker");
        }
    };

    const handleDelete = async (workerId, workerName) => {
        if (!window.confirm(`Permanently delete "${workerName}"? This cannot be undone.`)) return;

        try {
            const { data } = await axios.delete(
                `${backendUrl}/admin/user/${workerId}?permanent=true`,
                { headers: { token: adminToken } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchBlockedWorkers();
            }
        } catch (error) {
            toast.error("Failed to delete worker");
        }
    };

    const filteredWorkers = workers.filter(worker =>
        worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.serviceProfile?.primaryCategory?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold text-gray-700">Blocked Workers</h1>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                        {workers.length} blocked
                    </span>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search blocked workers..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <LoaderCircle className="animate-spin h-8 w-8 text-indigo-600" />
                </div>
            ) : filteredWorkers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <AlertTriangle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">
                        {searchTerm ? "No blocked workers match your search" : "No blocked workers"}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Worker</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden lg:table-cell">Block Reason</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredWorkers.map((worker) => (
                                <tr key={worker._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={worker.image}
                                                alt={worker.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-red-100"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{worker.name}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} /> {worker.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <p className="text-sm text-gray-700">{worker.serviceProfile?.primaryCategory || "N/A"}</p>
                                        {worker.serviceProfile?.city && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <MapPin size={10} /> {worker.serviceProfile.city}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <p className="text-sm text-gray-600">
                                            {worker.blockReason || <span className="text-gray-400 italic">No reason provided</span>}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 justify-end">
                                            <button
                                                onClick={() => handleUnblock(worker._id)}
                                                className="flex items-center gap-1 text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded hover:bg-green-100 transition"
                                                title="Unblock Worker"
                                            >
                                                <Unlock size={14} /> Unblock
                                            </button>
                                            <button
                                                onClick={() => handleDelete(worker._id, worker.name)}
                                                className="flex items-center gap-1 text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 transition"
                                                title="Delete Permanently"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminBlockedWorkers;
