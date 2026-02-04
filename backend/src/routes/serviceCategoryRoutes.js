import express from "express";
import {
    getAllCategories,
    getCategoryBySlug,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryImage
} from "../controllers/serviceCategoryController.js";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);

// Admin routes
router.post("/", adminAuthMiddleware, createCategory);
router.put("/:id", adminAuthMiddleware, updateCategory);
router.delete("/:id", adminAuthMiddleware, deleteCategory);
router.patch("/:id/image", adminAuthMiddleware, updateCategoryImage);

export default router;
