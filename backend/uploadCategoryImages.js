// Script to download and upload service category images to Cloudinary
import mongoose from "mongoose";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import ServiceCategory from "./src/models/ServiceCategory.js";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(imageUrl, categoryName) {
    try {
        // Upload directly from URL to Cloudinary
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: "service_categories",
            public_id: categoryName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
            transformation: [
                { width: 600, height: 400, crop: "fill" },
                { quality: "auto" }
            ]
        });
        console.log(`✅ Uploaded: ${categoryName}`);
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Failed to upload ${categoryName}:`, error.message);
        return imageUrl; // Return original URL if upload fails
    }
}

async function migrateImages() {
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION_URL);
        console.log("✅ Database connected");

        const categories = await ServiceCategory.find({});
        console.log(`Found ${categories.length} categories\n`);

        for (const category of categories) {
            if (category.image && category.image.includes("unsplash.com")) {
                console.log(`📷 Processing: ${category.name}`);

                // Upload to Cloudinary
                const cloudinaryUrl = await uploadToCloudinary(
                    category.image,
                    category.slug
                );

                // Update database
                await ServiceCategory.findByIdAndUpdate(category._id, {
                    image: cloudinaryUrl
                });

                console.log(`   New URL: ${cloudinaryUrl}\n`);
            } else {
                console.log(`⏭️ Skipping ${category.name} (already uploaded or no image)`);
            }
        }

        console.log("\n✅ All images migrated to Cloudinary!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

migrateImages();
