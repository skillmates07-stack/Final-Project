import express from "express";
import {
    loginAdmin,
    getAllUsers,
    getUserResumeData,
    getCompanies,
    verifyCompany,
    getDashboardStats,
    reparseUserResume,
    getCompanyDetails,
    getBlockedUsers,
    toggleBlockUser,
    deleteUser,
} from "../controllers/adminController.js";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

// Public route - Admin login
router.post("/login", loginAdmin);

// Protected routes - Require admin authentication
router.get("/users", adminAuthMiddleware, getAllUsers);
router.get("/blocked-users", adminAuthMiddleware, getBlockedUsers);
router.get("/user/:id/resume", adminAuthMiddleware, getUserResumeData);
router.patch("/user/:id/block", adminAuthMiddleware, toggleBlockUser);
router.delete("/user/:id", adminAuthMiddleware, deleteUser);
router.post("/user/:id/reparse", adminAuthMiddleware, reparseUserResume);
router.get("/companies", adminAuthMiddleware, getCompanies);
router.get("/company/:id", adminAuthMiddleware, getCompanyDetails);
router.post("/verify-company", adminAuthMiddleware, verifyCompany);
router.get("/stats", adminAuthMiddleware, getDashboardStats);

export default router;
