import React from "react";

// Base skeleton pulse animation
const pulseClass = "animate-pulse bg-gray-200 rounded";

// Skeleton for text lines
export const SkeletonText = ({ className = "", width = "w-full" }) => (
    <div className={`${pulseClass} h-4 ${width} ${className}`}></div>
);

// Skeleton for avatars/circles
export const SkeletonAvatar = ({ size = "w-10 h-10" }) => (
    <div className={`${pulseClass} ${size} rounded-full`}></div>
);

// Skeleton for images/rectangles
export const SkeletonBox = ({ className = "" }) => (
    <div className={`${pulseClass} ${className}`}></div>
);

// Skeleton for a card (used in worker lists, etc.)
export const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
        <div className="flex items-start gap-3 mb-4">
            <SkeletonAvatar size="w-12 h-12" />
            <div className="flex-1 space-y-2">
                <SkeletonText width="w-3/4" />
                <SkeletonText width="w-1/2" />
            </div>
        </div>
        <div className="space-y-2">
            <SkeletonText width="w-full" />
            <SkeletonText width="w-2/3" />
        </div>
        <div className="flex gap-2 mt-4">
            <SkeletonBox className="h-8 w-20" />
            <SkeletonBox className="h-8 w-20" />
        </div>
    </div>
);

// Skeleton for table rows
export const SkeletonTableRow = ({ columns = 5 }) => (
    <tr className="animate-pulse">
        {[...Array(columns)].map((_, i) => (
            <td key={i} className="px-4 py-4">
                {i === 0 ? (
                    <div className="flex items-center gap-2">
                        <SkeletonAvatar size="w-8 h-8" />
                        <SkeletonText width="w-24" />
                    </div>
                ) : (
                    <SkeletonText width={i === columns - 1 ? "w-16" : "w-20"} />
                )}
            </td>
        ))}
    </tr>
);

// Skeleton for stats cards (dashboard overview)
export const SkeletonStatCard = () => (
    <div className="animate-pulse rounded-xl p-4 bg-gray-100">
        <SkeletonText width="w-20" className="mb-2 h-3" />
        <SkeletonBox className="h-8 w-16" />
    </div>
);

// Skeleton for document cards
export const SkeletonDocumentCard = () => (
    <div className="border-2 rounded-xl p-5 border-gray-100 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
            <SkeletonBox className="w-10 h-10 rounded-lg" />
            <div className="space-y-2 flex-1">
                <SkeletonText width="w-24" />
                <SkeletonText width="w-16" className="h-3" />
            </div>
        </div>
        <SkeletonBox className="h-24 w-full" />
    </div>
);

// Skeleton for profile header
export const SkeletonProfileHeader = () => (
    <div className="flex items-center gap-4 animate-pulse">
        <SkeletonAvatar size="w-16 h-16" />
        <div className="space-y-2">
            <SkeletonText width="w-40" className="h-6" />
            <SkeletonText width="w-32" className="h-3" />
        </div>
    </div>
);

// Grid skeleton for cards
export const SkeletonCardGrid = ({ count = 6, columns = 3 }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
        {[...Array(count)].map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);

// Table skeleton
export const SkeletonTable = ({ rows = 5, columns = 5 }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full">
            <thead className="bg-gray-50">
                <tr>
                    {[...Array(columns)].map((_, i) => (
                        <th key={i} className="px-4 py-3">
                            <SkeletonText width="w-20" className="h-3" />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {[...Array(rows)].map((_, i) => (
                    <SkeletonTableRow key={i} columns={columns} />
                ))}
            </tbody>
        </table>
    </div>
);

export default {
    SkeletonText,
    SkeletonAvatar,
    SkeletonBox,
    SkeletonCard,
    SkeletonTableRow,
    SkeletonStatCard,
    SkeletonDocumentCard,
    SkeletonProfileHeader,
    SkeletonCardGrid,
    SkeletonTable
};
