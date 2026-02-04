import React, { useState } from "react";
import { Filter, X, Search } from "lucide-react";

// Skill tags similar to admin panel
const COMMON_SKILLS = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript",
    "Java", "SQL", "MongoDB", "AWS", "Docker",
    "UI/UX", "Figma", "Data Analysis", "Machine Learning", "Excel"
];

// Project Types (same as Admin panel)
const PROJECT_TYPES = [
    "UI/UX Design", "Web Development", "Mobile Development", "AI/ML",
    "Data Science", "IoT", "Cloud/DevOps", "Blockchain",
    "Game Development", "E-commerce", "Education"
];

const ApplicantFilters = ({ applicants, onFilter, className = "" }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedProjectTypes, setSelectedProjectTypes] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all"); // all, pending, accepted, rejected
    const [minExperience, setMinExperience] = useState("");
    const [maxExperience, setMaxExperience] = useState("");

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const toggleProjectType = (type) => {
        setSelectedProjectTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const applyFilters = () => {
        let filtered = [...applicants];

        // Search by name or email
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                app.userId?.name?.toLowerCase().includes(term) ||
                app.userId?.email?.toLowerCase().includes(term)
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(app =>
                app.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        // Skills filter - check technicalSkills, tools, and skills arrays (case-insensitive, partial match)
        if (selectedSkills.length > 0) {
            filtered = filtered.filter(app => {
                // Combine all skill-related arrays from user
                const techSkills = (app.userId?.technicalSkills || []).map(s => s.toLowerCase());
                const userTools = (app.userId?.tools || []).map(s => s.toLowerCase());
                const allUserSkills = [...techSkills, ...userTools];

                // Check if any selected skill matches any user skill (partial match)
                return selectedSkills.some(skill =>
                    allUserSkills.some(us => us.includes(skill.toLowerCase()))
                );
            });
        }

        // Project Types filter - check project categories AND projectTypes field
        if (selectedProjectTypes.length > 0) {
            filtered = filtered.filter(app => {
                // Get categories from user's projects
                const projectCategories = (app.userId?.projects || [])
                    .map(p => (p.category || "").toLowerCase())
                    .filter(c => c);
                const areasOfInterest = (app.userId?.areasOfInterest || []).map(a => a.toLowerCase());
                // ALSO check the projectTypes field directly (this was missing!)
                const projectTypes = (app.userId?.projectTypes || []).map(pt => pt.toLowerCase());
                const allTypes = [...projectCategories, ...areasOfInterest, ...projectTypes];

                return selectedProjectTypes.some(type =>
                    allTypes.some(pt => pt.includes(type.toLowerCase()))
                );
            });
        }

        // Experience filter
        if (minExperience !== "" || maxExperience !== "") {
            const min = parseInt(minExperience) || 0;
            const max = parseInt(maxExperience) || 100;
            filtered = filtered.filter(app => {
                const exp = app.userId?.experience?.years || 0;
                return exp >= min && exp <= max;
            });
        }

        onFilter(filtered);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedSkills([]);
        setSelectedProjectTypes([]);
        setStatusFilter("all");
        setMinExperience("");
        setMaxExperience("");
        onFilter(applicants);
    };

    const hasActiveFilters = searchTerm || selectedSkills.length > 0 || selectedProjectTypes.length > 0 || statusFilter !== "all" || minExperience || maxExperience;

    return (
        <div className={`${className}`}>
            {/* Filter Toggle Button */}
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${showFilters || hasActiveFilters
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    Filter Applicants
                    {hasActiveFilters && (
                        <span className="ml-1 bg-white text-blue-600 px-1.5 py-0.5 rounded-full text-xs">
                            {(selectedSkills.length > 0 ? 1 : 0) +
                                (selectedProjectTypes.length > 0 ? 1 : 0) +
                                (statusFilter !== "all" ? 1 : 0) +
                                (searchTerm ? 1 : 0) +
                                ((minExperience || maxExperience) ? 1 : 0)}
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-500 hover:text-red-500"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4 border border-gray-200">
                    {/* Search */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Search by Name/Email</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search applicants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
                        <div className="flex flex-wrap gap-2">
                            {["all", "pending", "accepted", "rejected"].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 text-xs rounded-full capitalize transition-colors ${statusFilter === status
                                        ? status === "all" ? "bg-blue-600 text-white"
                                            : status === "pending" ? "bg-yellow-500 text-white"
                                                : status === "accepted" ? "bg-green-500 text-white"
                                                    : "bg-red-500 text-white"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Skills Tags */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Skills (select to match)</label>
                        <div className="flex flex-wrap gap-2">
                            {COMMON_SKILLS.map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-2.5 py-1 text-xs rounded-full transition-colors ${selectedSkills.includes(skill)
                                        ? "bg-blue-600 text-white"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200"
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Project Types */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Project Types (select multiple)</label>
                        <div className="flex flex-wrap gap-2">
                            {PROJECT_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => toggleProjectType(type)}
                                    className={`px-2.5 py-1 text-xs rounded-full transition-colors ${selectedProjectTypes.includes(type)
                                        ? "bg-purple-600 text-white"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-200"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Experience Range */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Min Experience (years)</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={minExperience}
                                onChange={(e) => setMinExperience(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Max Experience (years)</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="Any"
                                value={maxExperience}
                                onChange={(e) => setMaxExperience(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={applyFilters}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantFilters;
