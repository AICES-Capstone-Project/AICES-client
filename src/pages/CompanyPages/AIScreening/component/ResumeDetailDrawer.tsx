import React from "react";
import { Drawer, Card, Space, Tag, Button, Alert } from "antd";
import type { ResumeLocal, ScoreDetail } from "../../../../types/resume.types";

type Props = {
  open: boolean;
  loading: boolean;
  selectedResume: ResumeLocal | null;
  onClose: () => void;
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  completed: { label: "Completed", color: "green" },
  pending: { label: "Pending", color: "blue" },
  failed: { label: "Failed", color: "red" },
  timeout: { label: "Timeout", color: "orange" },
  invalidjobdata: { label: "Invalid Job Data", color: "magenta" },
  invalidresumedata: { label: "Invalid Resume Data", color: "magenta" },
  jobtitlenotmatched: { label: "Job Title Not Matched", color: "gold" },
  canceled: { label: "Canceled", color: "default" },
  corruptedfile: { label: "Corrupted File", color: "red" },
  duplicateresume: { label: "Duplicate Resume", color: "purple" },
  servererror: { label: "Server Error", color: "red" },
};

function formatStatusLabel(status: string | undefined) {
  if (!status) return "Processing";
  const key = String(status).trim();
  // split camelCase/PascalCase and underscores/hyphens into words and capitalize
  const withSpaces = key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return withSpaces.replace(/\b\w/g, (c) => c.toUpperCase());
}

const ResumeDetailDrawer: React.FC<Props> = ({ open, loading, selectedResume, onClose }) => {
  const isJobTitleMismatch = Boolean(
    selectedResume && String(selectedResume.status || "").toLowerCase() === "jobtitlenotmatched"
  );

  return (
    <Drawer
      title={selectedResume ? `Resume Detail - ${selectedResume.fullName}` : "Resume Detail"}
      width={720}
      onClose={onClose}
      open={open}
      destroyOnClose
      loading={loading}
    >
      {selectedResume && (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Card size="small" title="Basic Information">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <strong>Full Name:</strong> {" "}
                {selectedResume.fullName || "Unknown"}
              </div>
              {selectedResume.email && (
                <div>
                  <strong>Email:</strong> {selectedResume.email}
                </div>
              )}
              {selectedResume.phoneNumber && (
                <div>
                  <strong>Phone:</strong> {selectedResume.phoneNumber}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong style={{ marginRight: 8 }}>Status:</strong>
                {(() => {
                  const key = String(selectedResume.status || "").toLowerCase();
                  const mapped = STATUS_MAP[key];
                  const label = mapped ? mapped.label : formatStatusLabel(selectedResume.status || undefined);
                  const color = mapped ? mapped.color : "default";
                  return (
                    <Tag color={color} style={{ textTransform: "none" }}>
                      {label}
                    </Tag>
                  );
                })()}
              </div>
              {selectedResume.fileUrl && (
                <div>
                  <strong>Resume File:</strong>{" "}
                  <Button type="link" href={selectedResume.fileUrl} target="_blank">
                    View PDF
                  </Button>
                </div>
              )}
            </Space>
          </Card>

          {selectedResume.status &&
            String(selectedResume.status).toLowerCase() !== "completed" &&
            selectedResume.errorMessage && (
              <Alert type="warning" showIcon message={selectedResume.errorMessage} />
            )}

          {!isJobTitleMismatch && String(selectedResume.status || "").toLowerCase() === "completed" && (
            <Card size="small" title="AI Evaluation">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <strong>Total Score:</strong>{" "}
                {selectedResume.totalScore != null ? (
                  <Tag
                    color={
                      selectedResume.totalScore >= 70
                        ? "green"
                        : selectedResume.totalScore >= 40
                        ? "orange"
                        : "red"
                    }
                    style={{ fontSize: 16, padding: "4px 12px" }}
                  >
                    {selectedResume.totalScore}
                  </Tag>
                ) : (
                  <span>—</span>
                )}
              </div>
              {selectedResume.aiExplanation && (
                <div>
                  <strong>AI Explanation:</strong>
                  <p
                    style={{
                      marginTop: 8,
                      padding: 12,
                      background: "#f5f5f5",
                      borderRadius: 4,
                    }}
                  >
                    {selectedResume.aiExplanation.replace(/\\u0027/g, "'")}
                  </p>
                </div>
              )}
            </Space>
            </Card>
          )}

          {!isJobTitleMismatch && String(selectedResume.status || "").toLowerCase() === "completed" && selectedResume.scoreDetails && selectedResume.scoreDetails.length > 0 && (
            <Card size="small" title="Criteria Scores">
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {selectedResume.scoreDetails.map((detail: ScoreDetail) => (
                  <div
                    key={detail.criteriaId}
                    style={{ padding: 12, border: "1px solid #d9d9d9", borderRadius: 4 }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <strong>{detail.criteriaName}</strong>
                      <Tag
                        color={
                          detail.score >= 70 ? "green" : detail.score >= 40 ? "orange" : "red"
                        }
                        style={{ marginLeft: 8 }}
                      >
                        Score: {detail.score}
                      </Tag>
                      <Tag color={detail.matched ? "success" : "default"} style={{ marginLeft: 4 }}>
                        {detail.matched ? "Matched" : "Not Matched"}
                      </Tag>
                    </div>
                    <div style={{ color: "#666" }}>
                      <em>{detail.aiNote}</em>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>
          )}
        </Space>
      )}
    </Drawer>
  );
};

export default ResumeDetailDrawer;
