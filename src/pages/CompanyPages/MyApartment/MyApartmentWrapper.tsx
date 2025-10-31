import { useState, useEffect } from "react";
import { Spin, Alert } from "antd";
import { authService } from "../../../services/authService";
import { companyService } from "../../../services/companyService";
import type { ProfileResponse } from "../../../types/auth.types";
import MyApartment from "./MyApartment";
import SubmissionPending from "./SubmissionPending";
import CompanyView from "./CompanyView";
import CompanyRejected from "./CompanyRejected";

export default function MyApartmentWrapper() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await authService.getCurrentUser();
        console.log("[MyApartmentWrapper] Full API response:", response);
        console.log("[MyApartmentWrapper] Response status:", response?.status);
        console.log("[MyApartmentWrapper] Response data:", response?.data);
        
        if (response?.status === "Success" && response?.data) {
          setUser(response.data);
          console.log("[MyApartmentWrapper] rejectionReason from API:", response.data.rejectionReason);
          console.log("[MyApartmentWrapper] All fields in response.data:", JSON.stringify(response.data, null, 2));
          
          // If user has a company, get company details for rejection reason
          if (response.data.companyName) {
            console.log("[MyApartmentWrapper] User has company, fetching company details...");
            try {
              const companyResponse = await companyService.getSelf();
              console.log("[MyApartmentWrapper] Company API response:", companyResponse);
              console.log("[MyApartmentWrapper] Company data:", JSON.stringify(companyResponse.data, null, 2));
              
              if (companyResponse?.status === "Success" && companyResponse?.data) {
                setCompanyData(companyResponse.data);
                console.log("[MyApartmentWrapper] Company rejectionReason:", companyResponse.data.rejectionReason);
              }
            } catch (companyErr) {
              console.error("[MyApartmentWrapper] Error fetching company:", companyErr);
              // Don't set error for company fetch failure, just log it
            }
          }
        } else {
          throw new Error(response?.message || "Failed to fetch user data");
        }
      } catch (err) {
        console.error("[MyApartmentWrapper] Error fetching user:", err);
        setError("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Show loading spinner while fetching user data
  if (loading) {
    return (
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "400px" 
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // Show error if failed to fetch user data
  if (error) {
    return (
      <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Check company status and render appropriate component
  console.log("[MyApartmentWrapper] User data full:", user);
  console.log("[MyApartmentWrapper] companyName:", user?.companyName);
  console.log("[MyApartmentWrapper] companyStatus:", user?.companyStatus);
  console.log("[MyApartmentWrapper] rejectionReason field:", user?.rejectionReason);
  console.log("[MyApartmentWrapper] All user fields:", Object.keys(user || {}));
  
  if (user?.companyStatus === "Approved") {
    console.log("[MyApartmentWrapper] Company approved - showing CompanyView");
    return <CompanyView />;
  }

  if (user?.companyStatus === "Pending") {
    console.log("[MyApartmentWrapper] Company pending approval - showing SubmissionPending");
    return <SubmissionPending />;
  }

  if (user?.companyStatus === "Rejected") {
    console.log("[MyApartmentWrapper] Company rejected - showing CompanyRejected");
    
    // Get rejection reason from company data first, then fallback to user data
    const rejectionReason = companyData?.rejectionReason || user?.rejectionReason;
    
    console.log("[MyApartmentWrapper] Company data rejectionReason:", companyData?.rejectionReason);
    console.log("[MyApartmentWrapper] User data rejectionReason:", user?.rejectionReason);
    console.log("[MyApartmentWrapper] Final rejectionReason to pass:", rejectionReason);
    
    return <CompanyRejected rejectionReason={rejectionReason} />;
  }

  // If user doesn't have companyName (hasn't created company), show creation form
  if (!user?.companyName) {
    console.log("[MyApartmentWrapper] User has no company, showing creation form");
    return <MyApartment />;
  }

  // Fallback case - if companyName exists but status is unknown
  console.log("[MyApartmentWrapper] Unknown company status, showing pending page");
  return <SubmissionPending />;
}