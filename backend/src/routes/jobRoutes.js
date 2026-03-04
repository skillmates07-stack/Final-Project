import express from "express";
import getAllJobs, { getJobById } from "../controllers/jobController.js";

const router = express.Router();

router.get("/all-jobs", getAllJobs);
router.get("/job/:id", getJobById);

export default router;
