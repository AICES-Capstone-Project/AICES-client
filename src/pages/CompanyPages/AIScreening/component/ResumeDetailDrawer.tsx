import React from "react";
import { Drawer, Card, Space, Tag, Button, Alert, Typography } from "antd";
import { FilePdfOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import type { ResumeLocal, ScoreDetail } from "../../../../types/resume.types";

type Props = {
  open: boolean;
  loading: boolean;
  selectedResume: ResumeLocal | null;
  onClose: () => void;
};

const ResumeDetailDrawer: React.FC<Props> = ({ open, loading, selectedResume, onClose }) => {
  const isJobTitleMismatch = Boolean(
    selectedResume && (
      selectedResume.applicationErrorType?.toLowerCase() === "jobtitlenotmatched" ||
      String(selectedResume.status || "").toLowerCase() === "jobtitlenotmatched"
    )
  );

  const isCompleted = Boolean(
    selectedResume && (
      selectedResume.resumeStatus?.toLowerCase() === "completed" ||
      (selectedResume.applicationStatus && 
       ["reviewed", "shortlisted", "interview", "hired"].includes(selectedResume.applicationStatus.toLowerCase())) ||
      String(selectedResume.status || "").toLowerCase() === "completed"
    )
  );

  return (
    <Drawer
      title={selectedResume ? `Resume Detail - ${selectedResume.fullName}` : "Resume Detail"}
      width={800}
      onClose={onClose}
      open={open}
      destroyOnClose
      loading={loading}
    >
      {selectedResume && (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Card >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {selectedResume.email && (
                  <Typography.Text style={{ display: 'block' }}>
                    <MailOutlined style={{ marginRight: 8 }} />{selectedResume.email}
                  </Typography.Text>
                )}
                {selectedResume.phoneNumber && (
                  <Typography.Text style={{ display: 'block' }}>
                    <PhoneOutlined style={{ marginRight: 8 }} />{selectedResume.phoneNumber}
                  </Typography.Text>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                {selectedResume.fileUrl && (
                  <div style={{ marginTop: 10 }}>
                    <Button className="company-btn--filled" icon={<FilePdfOutlined />} size="small" href={selectedResume.fileUrl} target="_blank">
                      View resume
                    </Button>
                  </div>
                )}
                {selectedResume.applicationStatus && (
                  <Tag style={{ marginTop: 8, background: '#fde3e3', color: '#d93025', fontWeight: 600 }}>
                    {String(selectedResume.applicationStatus)}
                  </Tag>
                )}
              </div>
            </div>
          </Card>

          {selectedResume.resumeStatus &&
            selectedResume.resumeStatus.toLowerCase() !== "completed" &&
            selectedResume.errorMessage && (
              <Alert type="warning" showIcon message={selectedResume.errorMessage} />
            )}

          {!isJobTitleMismatch && isCompleted && (
            <Card
              size="small"
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>AI Evaluation</span>
                  {selectedResume.totalScore != null ? (
                    <Tag
                      color={
                        selectedResume.totalScore >= 70
                          ? 'green'
                          : selectedResume.totalScore >= 40
                            ? 'orange'
                            : 'red'
                      }                     
                    >
                      Total score: {selectedResume.totalScore}
                    </Tag>
                  ) : (
                    <span>—</span>
                  )}
                </div>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedResume.aiExplanation && (
                  <div>
                    <p
                      style={{
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

          {!isJobTitleMismatch && isCompleted && selectedResume.scoreDetails && selectedResume.scoreDetails.length > 0 && (
            <Card size="small" title="Criteria Scores">
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {selectedResume.scoreDetails.map((detail: ScoreDetail) => (
                  <div
                    key={detail.criteriaId}
                    style={{ padding: 12, border: "1px solid #d9d9d9", borderRadius: 4 }}
                  >
                    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong>{detail.criteriaName}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag
                          color={
                            detail.score >= 70 ? 'green' : detail.score >= 40 ? 'orange' : 'red'
                          }
                        >
                          Score:  {detail.score}
                        </Tag>
                        <Tag color={detail.matched ? 'success' : 'default'}>
                          {detail.matched ? 'Matched' : 'Not Matched'}
                        </Tag>
                      </div>
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
