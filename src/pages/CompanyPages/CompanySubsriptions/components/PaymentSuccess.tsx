import { Card, Button, Result } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  // Mock payment info - TODO: Replace with actual API call using sessionId
  const paymentInfo = {
    amount: 299000,
    planName: "Pro Plan",
    duration: "30 days",
    date: new Date().toLocaleDateString()
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#f5f5f5"
    }}>
      <Card
        style={{
          maxWidth: 600,
          width: "90%",
          textAlign: "center",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a", fontSize: 72 }} />}
          status="success"
          title={<span style={{ fontSize: 24, fontWeight: 600 }}>Payment Successful!</span>}
          subTitle="Your subscription has been activated successfully. You can now enjoy all the benefits of your plan."
          extra={[
            <Button 
              key="subscription" 
              className="company-btn--filled" 
              size="large"
              onClick={() => navigate("/company/my-subscription")}
            >
              View My Subscription
            </Button>,
            <Button 
              key="dashboard" 
              className="company-btn" 
              size="large"
              onClick={() => navigate("/company/dashboard")}
            >
              Go to Dashboard
            </Button>
          ]}
        />
        
        {/* Payment Details */}
        <div style={{ 
          marginTop: 16, 
          padding: "16px 20px", 
          background: "#f0f9ff", 
          borderRadius: 8,
          border: "1px solid #bae7ff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "#666" }}>Plan:</span>
            <strong>{paymentInfo.planName}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "#666" }}>Duration:</span>
            <strong>{paymentInfo.duration}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "#666" }}>Date:</span>
            <strong>{paymentInfo.date}</strong>
          </div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            paddingTop: 12, 
            borderTop: "1px solid #d9d9d9",
            marginTop: 8
          }}>
            <span style={{ color: "#666", fontSize: 16 }}>Amount Paid:</span>
            <strong style={{ fontSize: 20, color: "#52c41a" }}>
              {paymentInfo.amount.toLocaleString()} VND
            </strong>
          </div>
        </div>

        {sessionId && (
          <div style={{ 
            marginTop: 12, 
            padding: "10px 16px", 
            background: "#e6f7ff", 
            borderRadius: 8,
            border: "1px solid #91d5ff"
          }}>
            <p style={{ margin: 0, fontSize: 13, color: "#0050b3" }}>
              <strong>Transaction ID:</strong> <code style={{ fontSize: 12 }}>{sessionId}</code>
            </p>
          </div>
        )}

        <div style={{ 
          marginTop: 24, 
          padding: "16px 24px", 
          background: "#f9f9f9", 
          borderRadius: 8,
          textAlign: "left"
        }}>
          <h4 style={{ marginBottom: 12, fontSize: 16 }}>What's Next?</h4>
          <ul style={{ paddingLeft: 20, margin: 0, color: "#666" }}>
            <li style={{ marginBottom: 8 }}>You can start posting jobs immediately</li>
            <li style={{ marginBottom: 8 }}>Check your subscription details in the dashboard</li>
            <li>Contact support if you have any questions</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
