import express from "express";
import {
  fetchCompanyData,
  loginCompany,
  postJob,
  registerCompany,
  getCompanyPostedAllJobs,
  changeJobVisibility,
  getCompanyJobApplicants,
  changeStatus,
  updateCompanyProfile,
  uploadHouseholdDocuments,
  editJob,
  deleteJob,
  getApplicantDetail,
  getJobApplicantsGrouped,
  getCompanyNotifications,
  markCompanyNotificationRead,
  rateWorker,
  getWorkerRatings,
  checkWorkerRatingStatus,
  getContactedWorkers,
} from "../controllers/companyController.js";
import { contactWorker, checkContactStatus } from "../controllers/userController.js";
import upload from "../utils/upload.js";
import companyAuthMiddleware from "../middlewares/companyAuthMiddleware.js";

const router = express.Router();

router.post("/register-company", upload.single("image"), registerCompany);
router.post("/login-company", loginCompany);
router.get("/company-data", companyAuthMiddleware, fetchCompanyData);
router.post("/post-job", companyAuthMiddleware, postJob);
router.get(
  "/company/posted-jobs",
  companyAuthMiddleware,
  getCompanyPostedAllJobs
);
router.post("/change-visiblity", companyAuthMiddleware, changeJobVisibility);
router.post(
  "/view-applications",
  companyAuthMiddleware,
  getCompanyJobApplicants
);
router.post("/change-status", companyAuthMiddleware, changeStatus);
router.post("/update-profile", companyAuthMiddleware, updateCompanyProfile);
router.post(
  "/upload-documents",
  companyAuthMiddleware,
  upload.fields([
    { name: "idProofDocument", maxCount: 1 },
    { name: "addressProofDocument", maxCount: 1 }
  ]),
  uploadHouseholdDocuments
);


// New routes for job management
router.put("/edit-job/:id", companyAuthMiddleware, editJob);
router.delete("/delete-job/:id", companyAuthMiddleware, deleteJob);

// Applicant routes
router.get("/applicant/:id", companyAuthMiddleware, getApplicantDetail);
router.get("/applications-grouped", companyAuthMiddleware, getJobApplicantsGrouped);

// Contact workers
router.post("/contact-worker", companyAuthMiddleware, contactWorker);
router.get("/contact-status/:workerId", companyAuthMiddleware, checkContactStatus);
router.get("/my-workers", companyAuthMiddleware, getContactedWorkers);

// Company notifications
router.get("/notifications", companyAuthMiddleware, getCompanyNotifications);
router.post("/notifications/:notificationId/read", companyAuthMiddleware, markCompanyNotificationRead);

// Rating routes
router.post("/rate-worker", companyAuthMiddleware, rateWorker);
router.get("/worker-ratings/:workerId", getWorkerRatings); // Public
router.get("/rating-status/:workerId", companyAuthMiddleware, checkWorkerRatingStatus);

export default router;

