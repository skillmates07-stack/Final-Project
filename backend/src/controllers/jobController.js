import Job from "../models/Job.js";

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true, isDeleted: { $ne: true } }).populate(
      "companyId",
      "-password"
    );

    // Only return jobs from verified companies
    const verifiedJobs = jobs.filter(
      (job) => job.companyId?.isVerified === true
    );

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      jobData: verifiedJobs,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Job fetched failed",
    });
  }
};

// Get a single job by ID (includes hidden jobs for notification links)
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate("companyId", "-password");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      jobData: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

export default getAllJobs;
