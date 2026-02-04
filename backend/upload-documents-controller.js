// Add this to companyController.js

export const uploadHouseholdDocuments = async (req, res) => {
    try {
        const companyId = req.companyData._id;
        const { idProofType, addressProofType } = req.body;

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        if (company.accountType !== "Household") {
            return res.status(400).json({
                success: false,
                message: "This endpoint is only for household accounts",
            });
        }

        // Check if files are uploaded
        if (!req.files || !req.files.idProofDocument || !req.files.addressProofDocument) {
            return res.status(400).json({
                success: false,
                message: "Please upload both ID proof and address proof",
            });
        }

        const idProofDocument = req.files.idProofDocument[0].path;
        const addressProofDocument = req.files.addressProofDocument[0].path;

        // Update company with documents
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            {
                idProofType,
                idProofDocument,
                addressProofType,
                addressProofDocument,
                documentsSubmitted: true,
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Documents uploaded successfully. Awaiting admin verification.",
            companyData: updatedCompany,
        });
    } catch (error) {
        console.error("Error uploading documents:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload documents",
        });
    }
};
