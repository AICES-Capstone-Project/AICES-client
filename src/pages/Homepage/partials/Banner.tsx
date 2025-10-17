import { Button } from "antd";

export default function Banner() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: `linear-gradient(
          135deg, 

          var(--color-primary) 0%, 
          var(--color-primary-medium) 50%, 
          var(--color-primary-light) 100%
        )`,
        padding: "60px 20px",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          10x Faster {" "} <span style={{ color: "var(--color-primary-dark)" }}> Resume Screening </span>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#f1f5f9",
            marginBottom: 28,
            lineHeight: 1.6,
          }}
        >
          Connect your ATS and analyze hundreds of resumes in minutes: <br />
          Save Time, Hire Faster and Improve Accuracy
        </p>

        <Button
          size="large"
          style={{
            paddingInline: 28,
            height: 52,
            fontSize: 16,
            borderRadius: 8,
            background: "var(--color-primary)",
            border: "none",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          <span role="img" aria-label="laptop" style={{ marginRight: 8 }}>
            💻
          </span>
          Book a Demo Now
        </Button>
      </div>
    </div>
  );
}
