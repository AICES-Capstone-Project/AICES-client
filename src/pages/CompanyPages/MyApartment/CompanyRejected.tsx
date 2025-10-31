import { useState } from "react";
import { Card, Alert, Button, Typography } from "antd";
import { ExclamationCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import MyApartment from "./MyApartment";

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

          {/* ✅ Căn giữa toàn bộ Alert */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Alert
              message={
                <div style={{ textAlign: "center", width: "100%" }}>
                  Yêu cầu tạo công ty của bạn đã bị từ chối
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
                  <Text strong>Lý do:</Text>
                  <div>
                    <Text>{rejectionReason || "Không có lý do cụ thể được cung cấp."}</Text>
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
              type="primary"
              size="large"
              icon={<ReloadOutlined />}
              onClick={() => setShowForm(true)}
              className="!bg-[var(--color-primary-light)] 
                         hover:!bg-[var(--color-primary)] 
                         !text-white 
                         !border-none 
                         px-8 py-6 
                         rounded-2xl 
                         shadow-md 
                         hover:shadow-lg 
                         transition-all 
                         duration-300 
                         flex items-center gap-2
                         max-w-md
                         mx-auto"
            >
              Hãy bấm vào đây để tạo lại công ty của bạn
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
