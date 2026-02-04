import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Search, Unlock, Trash2, Mail, LoaderCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const AdminBlockedUsers = () => {
    const { backendUrl, adminToken } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBlockedUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/admin/blocked-users`,
                { headers: { token: adminToken } }
            );
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            toast.error("Failed to fetch blocked users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (adminToken) {
            fetchBlockedUsers();
        }
    }, [adminToken]);

    const handleUnblock = async (userId) => {
        if (!window.confirm("Are you sure you want to unblock this user?")) return;

        try {
            const { data } = await axios.patch(
                `${backendUrl}/admin/user/${userId}/block`,
                {},
                { headers: { token: adminToken } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchBlockedUsers();
            }
        } catch (error) {
            toast.error("Failed to unblock user");
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`Permanently delete "${userName}"? This cannot be undone.`)) return;

        try {
            const { data } = await axios.delete(
                `${backendUrl}/admin/user/${userId}?permanent=true`,
                { headers: { token: adminToken } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchBlockedUsers();
            }
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold text-gray-700">Blocked Users</h1>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                        {users.length} blocked
                    </span>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search blocked users..."
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
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <AlertTriangle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">
                        {searchTerm ? "No blocked users match your search" : "No blocked users"}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Block Reason</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-red-100"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <p className="text-sm text-gray-600">
                                            {user.blockReason || <span className="text-gray-400 italic">No reason provided</span>}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 justify-end">
                                            <button
                                                onClick={() => handleUnblock(user._id)}
                                                className="flex items-center gap-1 text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded hover:bg-green-100 transition"
                                                title="Unblock User"
                                            >
                                                <Unlock size={14} /> Unblock
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id, user.name)}
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

export default AdminBlockedUsers;
