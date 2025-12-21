import { useState, useEffect } from "react";
import { Spin, Alert } from "antd";
import { authService } from "../../../services/authService";
import { companyService } from "../../../services/companyService";
import type { ProfileResponse } from "../../../types/auth.types";
import RegisterCompany from "./RegisterCompany";
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
        if (response?.status === "Success" && response?.data) {
          setUser(response.data);

          if (response.data.companyName) {
            try {
              const companyResponse = await companyService.getSelf();
              if (companyResponse?.status === "Success" && companyResponse?.data) {
                setCompanyData(companyResponse.data);
              }
            } catch {
            }
          }
        } else {
          throw new Error(response?.message || "Failed to fetch user data");
        }
      } catch {
        setError("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin spinning={true} tip="Loading...">
          <div style={{ width: 100, height: 100 }} />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  const companyStatus = user?.companyStatus;
  const joinStatus = user?.joinStatus;
  const rejectionReason = companyData?.rejectionReason || user?.rejectionReason;

  if (joinStatus && joinStatus.toLowerCase() === "pending") return <SubmissionPending />;

  if (companyStatus === "Approved") return <CompanyView />;
  if (companyStatus === "Pending") return <SubmissionPending />;
  if (companyStatus === "Rejected")
    return <CompanyRejected rejectionReason={rejectionReason} />;

  if (!user?.companyName && !joinStatus || joinStatus === "NotApplied") return <RegisterCompany />;

  return <SubmissionPending />;
}
