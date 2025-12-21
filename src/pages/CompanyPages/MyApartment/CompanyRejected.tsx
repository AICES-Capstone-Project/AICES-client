import { useState } from "react";
import { Card, Alert, Button, Typography } from "antd";
import { ExclamationCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import MyApartment from "./RegisterCompany";

const { Text } = Typography;

interface CompanyRejectedProps {
  rejectionReason?: string;
}

export default function CompanyRejected({ rejectionReason }: CompanyRejectedProps) {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <MyApartment />;
  }

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <ExclamationCircleOutlined
            style={{
              fontSize: "64px",
              color: "#ff4d4f",
              marginBottom: "24px",
            }}
          />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Alert
                message={
                  <div style={{ textAlign: "center", width: "100%" }}>
                    Your company creation request has been rejected
                  </div>
                }
                description={
                  <div
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                      textAlign: "center",
                    }}
                  >
                    <Text strong>Reason:</Text>
                    <div>
                      <Text>{rejectionReason || "No specific reason provided."}</Text>
                    </div>
                  </div>
                }
                type="error"
                showIcon={false}
                style={{
                  marginBottom: "24px",
                  width: "100%",
                  maxWidth: "600px",
                  textAlign: "center",
                }}
              />
          </div>

          <div style={{ marginTop: "24px" }}>
            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={() => setShowForm(true)}
              className="company-btn"
            >
              Click here to create your company again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
