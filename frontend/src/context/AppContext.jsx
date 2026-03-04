import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);

  // Only auto-restore from localStorage if the user explicitly checked "Remember Me"
  const [userToken, setUserToken] = useState(() => {
    if (localStorage.getItem("rememberMe_user") === "true") {
      return localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    }
    // Clear any stale token left from pre-Remember-Me code
    localStorage.removeItem("userToken");
    return sessionStorage.getItem("userToken");
  });
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(!!userToken);
  const [userApplication, setUserApplication] = useState(null);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const [companyToken, setCompanyToken] = useState(() => {
    if (localStorage.getItem("rememberMe_company") === "true") {
      return localStorage.getItem("companyToken") || sessionStorage.getItem("companyToken");
    }
    localStorage.removeItem("companyToken");
    return sessionStorage.getItem("companyToken");
  });
  const [companyData, setCompanyData] = useState(null);
  const [isCompanyLogin, setIsCompanyLogin] = useState(!!companyToken);
  const [companyLoading, setIsCompanyLoading] = useState(false);

  // Admin state
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));
  const [adminData, setAdminData] = useState(null);
  const [isAdminLogin, setIsAdminLogin] = useState(!!adminToken);

  // Clear tokens from both storages on logout
  useEffect(() => {
    if (!userToken) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("rememberMe_user");
      sessionStorage.removeItem("userToken");
    }
  }, [userToken]);

  useEffect(() => {
    if (!companyToken) {
      localStorage.removeItem("companyToken");
      localStorage.removeItem("rememberMe_company");
      sessionStorage.removeItem("companyToken");
    }
  }, [companyToken]);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  const fetchUserData = async () => {
    if (!userToken) return;
    setUserDataLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/user/user-data`, {
        headers: { token: userToken },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch user data."
      );
    } finally {
      setUserDataLoading(false);
    }
  };

  const fetchCompanyData = async () => {
    if (!companyToken) return;
    setIsCompanyLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/company/company-data`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setCompanyData(data.companyData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch company data."
      );
    } finally {
      setIsCompanyLoading(false);
    }
  };

  const fetchJobsData = async () => {
    setJobLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/job/all-jobs`);
      if (data.success) {
        setJobs(data.jobData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch jobs.");
    } finally {
      setJobLoading(false);
    }
  };

  const fetchUserApplication = async () => {
    try {
      setApplicationsLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/user/get-user-applications`,
        {},
        {
          headers: {
            token: userToken,
          },
        }
      );

      if (data.success) {
        setUserApplication(data.jobApplications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchUserApplication();
    } else {
      setUserApplication([]);
    }
  }, [userToken]);

  useEffect(() => {
    fetchJobsData();
  }, []);

  useEffect(() => {
    if (userToken) {
      setIsLogin(true);
      fetchUserData();
    } else {
      setUserData(null);
      setIsLogin(false);
    }
  }, [userToken]);

  useEffect(() => {
    if (companyToken) {
      setIsCompanyLogin(true);
      fetchCompanyData();
    } else {
      setCompanyData(null);
      setIsCompanyLogin(false);
    }
  }, [companyToken]);

  const value = {
    // Search
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,

    // Jobs
    jobs,
    setJobs,
    jobLoading,
    fetchJobsData,

    // Backend
    backendUrl,

    // User
    userToken,
    setUserToken,
    userData,
    setUserData,
    userDataLoading,
    isLogin,
    setIsLogin,
    fetchUserData,

    // Company
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    isCompanyLogin,
    setIsCompanyLogin,
    fetchCompanyData,
    companyLoading,
    userApplication,
    applicationsLoading,
    fetchUserApplication,

    // Admin
    adminToken,
    setAdminToken,
    adminData,
    setAdminData,
    isAdminLogin,
    setIsAdminLogin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
