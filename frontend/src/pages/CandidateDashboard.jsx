import React, { useState, useEffect, useContext } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SkeletonTable, SkeletonCard, SkeletonStatCard } from "../components/Skeleton";
import { assets } from "../assets/assets";
import {
    LayoutDashboard, Briefcase, HandHelping, User, Bell,
    Eye, Phone, Mail, Calendar, CheckCircle, Clock, XCircle,
    Star, ChevronRight, FileText, MapPin, Settings, ToggleLeft, ToggleRight,
    Upload, Sparkles, FileCheck, LoaderCircle
} from "lucide-react";

// Job Categories for matchmaking - Tech Only
const JOB_CATEGORIES = [
    "Programming",
    "Data Science",
    "Designing",
    "Networking",
    "Cybersecurity"
];

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Freelance"];
const WORK_MODES = ["Remote", "Onsite", "Hybrid"];

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";

    const {
        userData,
        userToken,
        backendUrl,
        userApplication,
        applicationsLoading,
        fetchUserData,
        fetchUserApplication
    } = useContext(AppContext);

    const [contactHistory, setContactHistory] = useState([]);
    const [contactLoading, setContactLoading] = useState(false);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);

    // Resume upload states
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeUploading, setResumeUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Job Preferences State
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferencesLoading, setPreferencesLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [selectedWorkModes, setSelectedWorkModes] = useState([]);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        if (!userToken) {
            navigate("/candidate-login");
            return;
        }
        fetchUserApplication();
        if (activeTab === "contacts" || activeTab === "overview") {
            fetchContactHistory();
        }
    }, [userToken, activeTab]);

    const fetchContactHistory = async () => {
        try {
            setContactLoading(true);
            const { data } = await axios.get(`${backendUrl}/user/contact-history`, {
                headers: { token: userToken }
            });
            if (data.success) {
                setContactHistory(data.contacts || []);
            }
        } catch (error) {
            console.error("Error fetching contact history:", error);
        } finally {
            setContactLoading(false);
        }
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) {
            toast.error("Please select a resume file");
            return;
        }

        setResumeUploading(true);
        try {
            const formData = new FormData();
            formData.append("resume", resumeFile);

            const { data } = await axios.post(
                `${backendUrl}/user/upload-resume`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        token: userToken,
                    },
                }
            );

            if (data.success) {
                toast.success("✨ Resume uploaded and analyzed with AI!");
                setResumeFile(null);
                fetchUserData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            toast.error(error?.response?.data?.message || "Resume upload failed");
        } finally {
            setResumeUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf" || file.name.endsWith(".pdf") ||
                file.type === "application/msword" || file.name.endsWith(".doc") ||
                file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
                setResumeFile(file);
            } else {
                toast.error("Please upload PDF, DOC, or DOCX files only");
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === "application/pdf" || file.name.endsWith(".pdf") ||
                file.type === "application/msword" || file.name.endsWith(".doc") ||
                file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
                setResumeFile(file);
            } else {
                toast.error("Please upload PDF, DOC, or DOCX files only");
            }
        }
    };

    // Job Preferences Handlers
    useEffect(() => {
        if (userData?.jobPreferences) {
            setSelectedCategories(userData.jobPreferences.categories || []);
            setSelectedJobTypes(userData.jobPreferences.jobTypes || []);
            setSelectedWorkModes(userData.jobPreferences.workModes || []);
            setNotificationsEnabled(userData.jobPreferences.notifications !== false);
        }
    }, [userData]);

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleJobType = (type) => {
        setSelectedJobTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const toggleWorkMode = (mode) => {
        setSelectedWorkModes(prev =>
            prev.includes(mode)
                ? prev.filter(m => m !== mode)
                : [...prev, mode]
        );
    };

    const handleSavePreferences = async () => {
        setPreferencesLoading(true);
        try {
            const { data } = await axios.post(
                `${backendUrl}/user/update-job-preferences`,
                {
                    categories: selectedCategories,
                    jobTypes: selectedJobTypes,
                    workModes: selectedWorkModes,
                    notifications: notificationsEnabled
                },
                { headers: { token: userToken } }
            );

            if (data.success) {
                toast.success("Job preferences saved! You'll get notified for matching jobs.");
                fetchUserData();
                setShowPreferences(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to save preferences");
        } finally {
            setPreferencesLoading(false);
        }
    };

    const toggleAvailability = async () => {
        try {
            setAvailabilityLoading(true);
            const { data } = await axios.post(
                `${backendUrl}/user/toggle-availability`,
                {},
                { headers: { token: userToken } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchUserData();
            }
        } catch (error) {
            toast.error("Failed to update availability");
        } finally {
            setAvailabilityLoading(false);
        }
    };

    const setTab = (tab) => {
        setSearchParams({ tab });
    };

    const tabs = [
        { id: "overview", name: "Overview", icon: LayoutDashboard },
        { id: "applications", name: "Job Applications", icon: Briefcase },
    ];


    const totalApplications = userApplication?.length || 0;
    const pendingApplications = userApplication?.filter(a => a.status === "Pending").length || 0;
    const acceptedApplications = userApplication?.filter(a => a.status === "Accepted").length || 0;
    const totalViews = contactHistory.length;

    // Profile Completion Calculator
    const calculateProfileCompletion = () => {
        if (!userData) return { percentage: 0, missing: [] };

        const checks = [
            { field: 'name', label: 'Full Name', value: userData.name },
            { field: 'email', label: 'Email', value: userData.email },
            { field: 'resume', label: 'Resume', value: userData.resume },
            { field: 'technicalSkills', label: 'Technical Skills', value: userData.technicalSkills?.length > 0 },
            { field: 'tools', label: 'Tools/Software', value: userData.tools?.length > 0 },
            { field: 'education', label: 'Education', value: userData.education?.length > 0 },
            { field: 'experience', label: 'Work Experience', value: userData.experience?.years > 0 },
            { field: 'projects', label: 'Projects', value: userData.projects?.length > 0 },
            { field: 'phone', label: 'Phone Number', value: userData.contactInfo?.phone },
            { field: 'linkedin', label: 'LinkedIn Profile', value: userData.contactInfo?.linkedin },
        ];

        const completed = checks.filter(c => c.value).length;
        const missing = checks.filter(c => !c.value);
        const percentage = Math.round((completed / checks.length) * 100);

        return { percentage, missing, completed, total: checks.length };
    };

    const profileCompletion = calculateProfileCompletion();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <img
                                src={userData?.image || "https://via.placeholder.com/60"}
                                alt={userData?.name}
                                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Welcome back, {userData?.name?.split(" ")[0]}! 👋
                                </h1>
                                <p className="text-gray-500 text-sm">{userData?.email}</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-3">
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                <User className="w-4 h-4" />
                                Edit Profile
                            </Link>
                            <Link
                                to="/notifications"
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                <Bell className="w-4 h-4" />
                                Notifications
                            </Link>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        {/* OVERVIEW TAB */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                                        <p className="text-blue-100 text-sm">Total Applications</p>
                                        <p className="text-3xl font-bold mt-1">{totalApplications}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
                                        <p className="text-yellow-100 text-sm">Pending</p>
                                        <p className="text-3xl font-bold mt-1">{pendingApplications}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                                        <p className="text-green-100 text-sm">Accepted</p>
                                        <p className="text-3xl font-bold mt-1">{acceptedApplications}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                                        <p className="text-purple-100 text-sm">Profile Views</p>
                                        <p className="text-3xl font-bold mt-1">{totalViews}</p>
                                    </div>
                                </div>

                                {/* Profile Completion Card */}
                                <div className="border border-gray-200 rounded-xl p-5">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                                Profile Completion
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Complete your profile to increase your chances of getting hired!
                                            </p>
                                            {profileCompletion.missing.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs font-medium text-gray-700">Missing fields:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {profileCompletion.missing.map((item, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full"
                                                            >
                                                                {item.label}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <Link
                                                        to="/profile"
                                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                                                    >
                                                        Complete Profile <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-sm text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Your profile is 100% complete!
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-24 h-24">
                                                <svg className="w-24 h-24 transform -rotate-90">
                                                    <circle
                                                        cx="48"
                                                        cy="48"
                                                        r="40"
                                                        stroke="#E5E7EB"
                                                        strokeWidth="8"
                                                        fill="none"
                                                    />
                                                    <circle
                                                        cx="48"
                                                        cy="48"
                                                        r="40"
                                                        stroke={profileCompletion.percentage === 100 ? "#10B981" : "#3B82F6"}
                                                        strokeWidth="8"
                                                        fill="none"
                                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - profileCompletion.percentage / 100)}`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-2xl font-bold text-gray-800">{profileCompletion.percentage}%</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {profileCompletion.completed}/{profileCompletion.total} complete
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Resume Upload & AI Analysis Card */}
                                <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                                Resume & AI Profile Analysis
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Upload your resume and let AI extract your skills automatically
                                            </p>
                                        </div>
                                        {userData?.resume && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
                                                <FileCheck className="w-4 h-4 text-green-600" />
                                                <span className="text-xs font-medium text-green-700">Resume Uploaded</span>
                                            </div>
                                        )}
                                    </div>

                                    {userData?.resume ? (
                                        <div className="space-y-3">
                                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">Current Resume</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {userData?.technicalSkills?.length || 0} skills extracted
                                                            {userData?.resumeParseScore && ` • Parse Score: ${userData.resumeParseScore}/100`}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={userData.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    >
                                                        View
                                                    </a>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">Upload a new resume to update your profile</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-3">
                                            <Clock className="w-4 h-4" />
                                            <span>No resume uploaded yet. Upload to boost your profile!</span>
                                        </div>
                                    )}

                                    {/* Upload Area */}
                                    <div className="mt-4">
                                        <label
                                            htmlFor="resume-upload"
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragActive
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-300 hover:border-blue-400 hover:bg-white"
                                                }`}
                                        >
                                            <Upload className={`w-10 h-10 mx-auto mb-2 ${dragActive ? "text-blue-600" : "text-gray-400"}`} />
                                            <p className="text-sm font-medium text-gray-700 mb-1">
                                                {resumeFile ? resumeFile.name : "Drag & drop or click to upload"}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                                <Sparkles className="w-3 h-3 text-amber-500" />
                                                AI will auto-extract skills • PDF, DOC, DOCX (Max 5MB)
                                            </p>
                                            <input
                                                id="resume-upload"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>

                                        {resumeFile && (
                                            <button
                                                onClick={handleResumeUpload}
                                                disabled={resumeUploading}
                                                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                {resumeUploading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Analyzing with AI...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-4 h-4" />
                                                        Upload & Analyze with AI
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Job Preferences - Matchmaking */}
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setShowPreferences(!showPreferences)}
                                        className="w-full p-4 flex items-center justify-between transition-colors cursor-pointer hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Settings className="w-5 h-5 text-blue-600" />
                                            <div className="text-left">
                                                <h2 className="text-base font-semibold">Job Preferences</h2>
                                                {selectedCategories.length > 0 && (
                                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                                        {selectedCategories.length} categories selected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-gray-400">{showPreferences ? "▲" : "▼"}</span>
                                    </button>

                                    {showPreferences && (
                                        <div className="p-4 pt-0 space-y-4 border-t">
                                            <p className="text-sm text-gray-500">
                                                Select your preferences to get notified when matching jobs are posted.
                                            </p>

                                            {/* Job Categories */}
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">Job Categories *</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {JOB_CATEGORIES.map((category) => (
                                                        <button
                                                            key={category}
                                                            onClick={() => toggleCategory(category)}
                                                            className={`px-3 py-1.5 text-sm rounded-full border transition-colors cursor-pointer ${selectedCategories.includes(category)
                                                                ? "bg-blue-500 text-white border-blue-500"
                                                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                                                                }`}
                                                        >
                                                            {category}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Job Types */}
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">Preferred Job Types</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {JOB_TYPES.map((type) => (
                                                        <button
                                                            key={type}
                                                            onClick={() => toggleJobType(type)}
                                                            className={`px-3 py-1.5 text-sm rounded-full border transition-colors cursor-pointer ${selectedJobTypes.includes(type)
                                                                ? "bg-green-500 text-white border-green-500"
                                                                : "bg-white text-gray-700 border-gray-300 hover:border-green-300"
                                                                }`}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Work Modes */}
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">Preferred Work Mode</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {WORK_MODES.map((mode) => (
                                                        <button
                                                            key={mode}
                                                            onClick={() => toggleWorkMode(mode)}
                                                            className={`px-3 py-1.5 text-sm rounded-full border transition-colors cursor-pointer ${selectedWorkModes.includes(mode)
                                                                ? "bg-purple-500 text-white border-purple-500"
                                                                : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                                                                }`}
                                                        >
                                                            {mode}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Notifications Toggle */}
                                            <div className="flex items-center gap-3">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notificationsEnabled}
                                                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                                </label>
                                                <span className="text-sm text-gray-700">Receive job match notifications</span>
                                            </div>

                                            {/* Save Button */}
                                            <button
                                                onClick={handleSavePreferences}
                                                disabled={preferencesLoading || selectedCategories.length === 0}
                                                className={`flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${preferencesLoading || selectedCategories.length === 0
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                                                    }`}
                                            >
                                                {preferencesLoading ? (
                                                    <>
                                                        <LoaderCircle className="animate-spin w-4 h-4" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    "Save Preferences"
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>


                            </div>
                        )}

                        {/* APPLICATIONS TAB */}
                        {activeTab === "applications" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Your Job Applications</h2>
                                    <Link
                                        to="/all-jobs/all"
                                        className="text-blue-600 text-sm hover:underline"
                                    >
                                        Browse Jobs →
                                    </Link>
                                </div>

                                {applicationsLoading ? (
                                    <SkeletonTable rows={5} columns={5} />
                                ) : !userApplication || userApplication.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 mb-2">No applications yet</p>
                                        <Link
                                            to="/all-jobs/all"
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Start applying →
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Location</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {[...userApplication].reverse().map((app) => (
                                                    <tr key={app._id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={app?.companyId?.image || assets.default_profile}
                                                                    alt=""
                                                                    className="w-8 h-8 rounded-full object-cover"
                                                                />
                                                                <span className="text-sm font-medium truncate max-w-[120px]">
                                                                    {app?.companyId?.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-800">{app?.jobId?.title}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{app?.jobId?.location}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell">
                                                            {moment(app.date).format("ll")}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${app.status === "Pending"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : app.status === "Rejected"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-green-100 text-green-700"
                                                                }`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SERVICE PROFILE TAB */}
                        {activeTab === "service" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">Service Worker Profile</h2>
                                        <p className="text-sm text-gray-500">Offer your services to recruiters</p>
                                    </div>
                                    {isServiceActive && (
                                        <Link
                                            to={`/worker/profile/${userData?._id}`}
                                            className="text-blue-600 text-sm hover:underline"
                                        >
                                            View Public Profile →
                                        </Link>
                                    )}
                                </div>

                                <ServiceProfileForm
                                    onSuccess={() => {
                                        toast.success("Profile updated!");
                                        fetchUserData();
                                    }}
                                />
                            </div>
                        )}


                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CandidateDashboard;
