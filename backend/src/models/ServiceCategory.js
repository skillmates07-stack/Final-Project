import mongoose from "mongoose";

const serviceCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    shortDescription: {
        type: String,
        default: ""
    },
    // Skills/qualifications typically needed for this category
    requiredSkills: [{
        type: String
    }],
    // Documents required for workers in this category
    requiredDocuments: [{
        type: String
    }],
    // Minimum experience required (in months)
    minExperienceMonths: {
        type: Number,
        default: 0
    },
    // Salary range for this category
    salaryRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        type: { type: String, enum: ['monthly', 'daily', 'hourly'], default: 'monthly' }
    },
    // Is this category active/visible
    isActive: {
        type: Boolean,
        default: true
    },
    // Display order on homepage
    displayOrder: {
        type: Number,
        default: 0
    },
    // Number of workers in this category (for display)
    workerCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const ServiceCategory = mongoose.model("ServiceCategory", serviceCategorySchema);

export default ServiceCategory;
