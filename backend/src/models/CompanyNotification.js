import mongoose from "mongoose";

const companyNotificationSchema = mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    type: {
        type: String,
        enum: ["contact_accepted", "contact_rejected", "new_applicant", "system"],
        default: "system"
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    // Reference to the worker who responded
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // Worker contact info (shown when accepted)
    workerContactInfo: {
        name: { type: String },
        email: { type: String },
        phone: { type: String }
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Index for efficient querying
companyNotificationSchema.index({ companyId: 1, createdAt: -1 });
companyNotificationSchema.index({ companyId: 1, isRead: 1 });

const CompanyNotification = mongoose.model("CompanyNotification", companyNotificationSchema);

export default CompanyNotification;
