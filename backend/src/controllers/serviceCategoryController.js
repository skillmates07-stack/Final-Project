import ServiceCategory from "../models/ServiceCategory.js";

// Get all active service categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await ServiceCategory.find({ isActive: true })
            .sort({ displayOrder: 1 })
            .select('-__v');

        return res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("Get categories error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
};

// Get single category by slug
export const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const category = await ServiceCategory.findOne({ slug, isActive: true });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.error("Get category error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category"
        });
    }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await ServiceCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.error("Get category error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category"
        });
    }
};

// Admin: Create new category
export const createCategory = async (req, res) => {
    try {
        const {
            name,
            description,
            shortDescription,
            requiredSkills,
            requiredDocuments,
            minExperienceMonths,
            salaryRange
        } = req.body;

        // Generate slug from name
        const slug = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Check if category exists
        const existing = await ServiceCategory.findOne({ slug });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Category with this name already exists"
            });
        }

        const category = new ServiceCategory({
            name,
            slug,
            description,
            shortDescription,
            requiredSkills,
            requiredDocuments,
            minExperienceMonths,
            salaryRange
        });

        await category.save();

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.error("Create category error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create category"
        });
    }
};

// Admin: Update category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const category = await ServiceCategory.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.error("Update category error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update category"
        });
    }
};

// Admin: Delete category (soft delete)
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await ServiceCategory.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Delete category error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete category"
        });
    }
};

// Admin: Update category image
export const updateCategoryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { image } = req.body;

        const category = await ServiceCategory.findByIdAndUpdate(
            id,
            { image },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category image updated successfully",
            category
        });
    } catch (error) {
        console.error("Update category image error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update category image"
        });
    }
};
