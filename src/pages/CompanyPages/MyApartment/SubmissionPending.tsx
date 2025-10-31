import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function SubmissionPending() {
  const navigate = useNavigate();

  return (
    <Card
      title="Request submitted"
      style={{ maxWidth: 800, margin: "40px auto", textAlign: "center" }}
    >
      <p>
        Thank you — your company account request has been submitted. Please wait up to 24 hours for approval.
      </p>
      <p>If you need to make changes, you can return to the dashboard.</p>
      <div style={{ marginTop: 16 }}>
        <Button onClick={() => navigate("/")}>Go to homepage</Button>
      </div>
    </Card>
  );
}
