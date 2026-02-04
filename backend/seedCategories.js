// Seed script to populate service categories
import mongoose from "mongoose";
import "dotenv/config";
import ServiceCategory from "./src/models/ServiceCategory.js";

const categories = [
    {
        name: "Japa Maid Services",
        slug: "japa-maid",
        description: "Expert postnatal care specialists providing dedicated support for new mothers and newborns. Our Japa maids are trained in newborn care, mother's recovery assistance, and household management.",
        shortDescription: "Expert Postnatal Care...",
        image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop",
        requiredSkills: ["Newborn Care", "Postnatal Care", "Cooking", "Baby Massage", "Mother Care"],
        requiredDocuments: ["ID Proof", "Address Proof", "Health Certificate"],
        minExperienceMonths: 12,
        salaryRange: { min: 15000, max: 35000, type: "monthly" },
        displayOrder: 1
    },
    {
        name: "Yoga Teacher Services",
        slug: "yoga-teacher",
        description: "Certified yoga instructors for homes, gyms, and corporate wellness programs. Our teachers are trained in various yoga forms including Hatha, Ashtanga, and therapeutic yoga.",
        shortDescription: "Balance Your Body...",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
        requiredSkills: ["Yoga Certification", "Pranayama", "Meditation", "Therapeutic Yoga"],
        requiredDocuments: ["ID Proof", "Yoga Certification", "Experience Certificate"],
        minExperienceMonths: 24,
        salaryRange: { min: 20000, max: 50000, type: "monthly" },
        displayOrder: 2
    },
    {
        name: "Physiotherapist Services",
        slug: "physiotherapist",
        description: "Professional physiotherapists for home visits, clinics, and hospitals. Specialized in rehabilitation, pain management, and mobility improvement.",
        shortDescription: "Professional Physiotherapy at...",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
        requiredSkills: ["BPT/MPT Degree", "Rehabilitation", "Pain Management", "Manual Therapy"],
        requiredDocuments: ["ID Proof", "Degree Certificate", "Registration Certificate"],
        minExperienceMonths: 12,
        salaryRange: { min: 25000, max: 60000, type: "monthly" },
        displayOrder: 3
    },
    {
        name: "Massage Therapist Services",
        slug: "massage-therapist",
        description: "Trained massage therapists for spas, wellness centers, and home services. Expertise in various massage techniques for relaxation and therapeutic purposes.",
        shortDescription: "Relaxing &...",
        image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop",
        requiredSkills: ["Swedish Massage", "Deep Tissue", "Aromatherapy", "Sports Massage"],
        requiredDocuments: ["ID Proof", "Training Certificate", "Health Certificate"],
        minExperienceMonths: 6,
        salaryRange: { min: 12000, max: 30000, type: "monthly" },
        displayOrder: 4
    },
    {
        name: "Babysitting Services",
        slug: "babysitting",
        description: "Caring and experienced babysitters for your little ones. Our babysitters are trained in child care, safety protocols, and engaging activities.",
        shortDescription: "Babysitting Services...",
        image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop",
        requiredSkills: ["Child Care", "First Aid", "Activity Planning", "Safety Awareness"],
        requiredDocuments: ["ID Proof", "Address Proof", "Police Verification"],
        minExperienceMonths: 6,
        salaryRange: { min: 10000, max: 25000, type: "monthly" },
        displayOrder: 5
    },
    {
        name: "Care Taker Services",
        slug: "care-taker",
        description: "Compassionate care takers for elderly and patients. Trained in personal care, medication management, and companionship.",
        shortDescription: "At Samrat Manpower Solutions...",
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&h=400&fit=crop",
        requiredSkills: ["Elder Care", "Patient Care", "Medication Management", "First Aid"],
        requiredDocuments: ["ID Proof", "Health Certificate", "Police Verification"],
        minExperienceMonths: 12,
        salaryRange: { min: 12000, max: 30000, type: "monthly" },
        displayOrder: 6
    },
    {
        name: "Beautician Staff Services",
        slug: "beautician",
        description: "Professional beauticians for salons, spas, and home services. Skilled in makeup, hair styling, skin care, and beauty treatments.",
        shortDescription: "Professional Beauticians for...",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
        requiredSkills: ["Makeup", "Hair Styling", "Skin Care", "Mehendi", "Nail Art"],
        requiredDocuments: ["ID Proof", "Beauty Course Certificate"],
        minExperienceMonths: 6,
        salaryRange: { min: 10000, max: 35000, type: "monthly" },
        displayOrder: 7
    },
    {
        name: "Peon Staff Services",
        slug: "peon-staff",
        description: "Reliable peon and office support staff for offices, institutions, and organizations. Dependable for document handling, errands, and office assistance.",
        shortDescription: "Dependable Peon &...",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
        requiredSkills: ["Document Handling", "Office Assistance", "Errands", "Basic Computer"],
        requiredDocuments: ["ID Proof", "Address Proof"],
        minExperienceMonths: 0,
        salaryRange: { min: 8000, max: 15000, type: "monthly" },
        displayOrder: 8
    },
    {
        name: "Hotel Staff Services",
        slug: "hotel-staff",
        description: "Trained hotel staff including housekeeping, waiters, and front desk personnel. Professional hospitality staff for hotels and restaurants.",
        shortDescription: "Efficient &...",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
        requiredSkills: ["Housekeeping", "Food Service", "Customer Service", "Hospitality"],
        requiredDocuments: ["ID Proof", "Health Certificate", "Hotel Training Certificate"],
        minExperienceMonths: 6,
        salaryRange: { min: 10000, max: 25000, type: "monthly" },
        displayOrder: 9
    },
    {
        name: "Driver Services",
        slug: "driver",
        description: "Professional drivers for personal, commercial, and corporate use. Licensed drivers with excellent road knowledge and safety records.",
        shortDescription: "Professional...",
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop",
        requiredSkills: ["Valid License", "Route Knowledge", "Vehicle Maintenance", "Safety Driving"],
        requiredDocuments: ["Driving License", "ID Proof", "Address Proof", "Police Verification"],
        minExperienceMonths: 24,
        salaryRange: { min: 12000, max: 30000, type: "monthly" },
        displayOrder: 10
    },
    {
        name: "Patient Care Services",
        slug: "patient-care",
        description: "Trained patient care attendants and nurses for hospitals and home care. Compassionate and skilled in medical assistance.",
        shortDescription: "Compassionate and...",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop",
        requiredSkills: ["Patient Care", "Vital Monitoring", "Medication Assistance", "First Aid"],
        requiredDocuments: ["ID Proof", "Nursing Certificate", "Health Certificate"],
        minExperienceMonths: 12,
        salaryRange: { min: 15000, max: 40000, type: "monthly" },
        displayOrder: 11
    },
    {
        name: "Cook/Chef Services",
        slug: "cook",
        description: "Experienced cooks and chefs for homes, restaurants, and events. Skilled in various cuisines and dietary requirements.",
        shortDescription: "Delicious cooking...",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop",
        requiredSkills: ["Cooking", "Multiple Cuisines", "Menu Planning", "Kitchen Management"],
        requiredDocuments: ["ID Proof", "Health Certificate"],
        minExperienceMonths: 12,
        salaryRange: { min: 12000, max: 35000, type: "monthly" },
        displayOrder: 12
    },
    {
        name: "Security Guard Services",
        slug: "security-guard",
        description: "Trained security personnel for residential, commercial, and event security. Professional guards with security training certification.",
        shortDescription: "Professional security...",
        image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=600&h=400&fit=crop",
        requiredSkills: ["Security Training", "Surveillance", "Emergency Response", "First Aid"],
        requiredDocuments: ["ID Proof", "Security Training Certificate", "Police Verification"],
        minExperienceMonths: 6,
        salaryRange: { min: 10000, max: 20000, type: "monthly" },
        displayOrder: 13
    },
    {
        name: "Housekeeping Services",
        slug: "housekeeping",
        description: "Professional housekeeping staff for homes and offices. Reliable maids and cleaners for daily, weekly, or monthly services.",
        shortDescription: "Clean and organized...",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
        requiredSkills: ["Cleaning", "Organizing", "Laundry", "Basic Cooking"],
        requiredDocuments: ["ID Proof", "Address Proof"],
        minExperienceMonths: 0,
        salaryRange: { min: 8000, max: 18000, type: "monthly" },
        displayOrder: 14
    }
];

async function seedCategories() {
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION_URL);
        console.log("✅ Database connected");

        // Clear existing categories
        await ServiceCategory.deleteMany({});
        console.log("🗑️ Cleared existing categories");

        // Insert new categories
        await ServiceCategory.insertMany(categories);
        console.log(`✅ Inserted ${categories.length} service categories`);

        console.log("\n📋 Categories added:");
        categories.forEach((cat, i) => {
            console.log(`   ${i + 1}. ${cat.name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

seedCategories();
