import React, { useState, useEffect, useContext, useRef } from "react";
import { Bell, User, Mail, Phone, CheckCircle } from "lucide-react";
import axios from "axios";
import moment from "moment";
import { AppContext } from "../context/AppContext";

const CompanyNotificationsDropdown = () => {
    const { backendUrl, companyToken } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        if (!companyToken) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/company/notifications`, {
                headers: { token: companyToken },
            });
            if (data.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error("Error fetching company notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(
                `${backendUrl}/company/notifications/${notificationId}/read`,
                {},
                { headers: { token: companyToken } }
            );
            fetchNotifications();
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(
                `${backendUrl}/company/notifications/all/read`,
                {},
                { headers: { token: companyToken } }
            );
            fetchNotifications();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    // Fetch notifications on mount and when token changes
    useEffect(() => {
        if (companyToken) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [companyToken]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!companyToken) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                aria-label="Notifications"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto max-h-96">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No notifications yet</p>
                                <p className="text-sm mt-1">When workers respond to your contact requests, you'll see them here</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => {
                                        if (!notification.isRead) {
                                            markAsRead(notification._id);
                                        }
                                    }}
                                    className={`px-4 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50" : ""
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Worker Image */}
                                        <div className="flex-shrink-0">
                                            {notification.fromUser?.image ? (
                                                <img
                                                    src={notification.fromUser.image}
                                                    alt={notification.fromUser.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-green-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                                )}
                                                <p className="text-sm font-medium text-gray-800">
                                                    {notification.title}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {notification.message}
                                            </p>

                                            {/* Worker Contact Info (for accepted requests) */}
                                            {notification.type === "contact_accepted" && notification.workerContactInfo && (
                                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                                    <p className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Contact Information
                                                    </p>
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-700 flex items-center gap-2">
                                                            <User className="w-3 h-3 text-gray-500" />
                                                            {notification.workerContactInfo.name}
                                                        </p>
                                                        {notification.workerContactInfo.email && (
                                                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                                                <Mail className="w-3 h-3 text-gray-500" />
                                                                <a href={`mailto:${notification.workerContactInfo.email}`} className="text-blue-600 hover:underline">
                                                                    {notification.workerContactInfo.email}
                                                                </a>
                                                            </p>
                                                        )}
                                                        {notification.workerContactInfo.phone && (
                                                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                                                <Phone className="w-3 h-3 text-gray-500" />
                                                                <a href={`tel:${notification.workerContactInfo.phone}`} className="text-blue-600 hover:underline">
                                                                    {notification.workerContactInfo.phone}
                                                                </a>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-400 mt-2">
                                                {moment(notification.createdAt).fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyNotificationsDropdown;
