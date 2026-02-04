import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import About from "./pages/About";
import AllJobs from "./pages/AllJobs";
import ApplyJob from "./pages/ApplyJob";
import CandidatesLogin from "./pages/CandidatesLogin";
import CandidatesSignup from "./pages/CandidatesSignup";
import Home from "./pages/Home";
import RecruiterLogin from "./pages/RecruiterLogin";
import RecruiterSignup from "./pages/RecruiterSignup";
import Dashborad from "./pages/Dashborad";
import AddJobs from "./pages/AddJobs";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import ApplicantDetail from "./pages/ApplicantDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./pages/AdminOverview";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminCompanies from "./pages/AdminCompanies";
import AdminCompanyDetail from "./pages/AdminCompanyDetail";
import AdminWorkers from "./pages/AdminWorkers";
import AdminWorkerDetail from "./pages/AdminWorkerDetail";
import AdminBlockedUsers from "./pages/AdminBlockedUsers";
import AdminBlockedWorkers from "./pages/AdminBlockedWorkers";
import CompanyOnboarding from "./pages/CompanyOnboarding";
import CandidateProfile from "./pages/CandidateProfile";
import Notifications from "./pages/Notifications";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import ContactRequest from "./pages/ContactRequest";
import MyContactedWorkers from "./pages/MyContactedWorkers";
import CandidateDashboard from "./pages/CandidateDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import { AppContext } from "./context/AppContext";

const App = () => {
  const { companyToken } = useContext(AppContext);

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/service-profile" element={<Navigate to="/my-dashboard?tab=service" replace />} />
        <Route path="/all-jobs/:category" element={<AllJobs />} />
        <Route path="/about" element={<About />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        {/* Redirect old URLs to new dashboard */}
        <Route path="/applications" element={<Navigate to="/my-dashboard?tab=applications" replace />} />
        <Route path="/my-dashboard" element={<CandidateDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<CandidateProfile />} />
        <Route path="/candidate-login" element={<CandidatesLogin />} />
        <Route path="/candidate-signup" element={<CandidatesSignup />} />
        <Route path="/recruiter-login" element={<RecruiterLogin />} />
        <Route path="/recruiter-signup" element={<RecruiterSignup />} />
        <Route path="/company-onboarding" element={<CompanyOnboarding />} />
        <Route path="/contact-request/:notificationId" element={<ContactRequest />} />
        {/* Recruiter Dashboard */}
        <Route path="/dashboard" element={<Dashborad />}>
          <Route path="add-job" element={<AddJobs />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
          <Route path="applicant/:id" element={<ApplicantDetail />} />
          <Route path="my-workers" element={<MyContactedWorkers />} />
          <Route path="profile-settings" element={<ProfileSettings />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="blocked-users" element={<AdminBlockedUsers />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="companies/:id" element={<AdminCompanyDetail />} />
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="workers/:id" element={<AdminWorkerDetail />} />
          <Route path="blocked-users" element={<AdminBlockedUsers />} />
          <Route path="blocked-workers" element={<AdminBlockedWorkers />} />
        </Route>
      </Routes>
    </AppLayout>
  );
};

export default App;
