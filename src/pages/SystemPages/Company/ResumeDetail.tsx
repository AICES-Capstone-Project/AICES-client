import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Space, Tag, Typography, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import { resumeService } from "../../../services/resumeService";
import type { Resume } from "../../../types/company.types";
import { toastError } from "../../../components/UI/Toast";

const { Title, Text } = Typography;

export default function ResumeDetail() {
  const { jobId, resumeId } = useParams();
  const jid = Number(jobId);
  const rid = Number(resumeId);

  const [resume, setResume] = useState<Resume | null>(null);
  const nav = useNavigate();

  const load = async () => {
    try {
      const res = await resumeService.getSystemResumeById(jid, rid);

      if (res.status === "Success" && res.data) {
        setResume(res.data as Resume);
      } else {
        toastError("Failed to load resume", res.message);
      }
    } catch (e) {
      toastError("Failed to load resume");
      // console.error(e);
    }
  };

  useEffect(() => {
    if (!Number.isNaN(jid) && !Number.isNaN(rid)) {
      load();
    }
  }, [jid, rid]);

  // ===== AICES STAGE TAG =====
  const renderStageTag = (stage: Resume["stage"]) => {
    const map: Record<string, string> = {
      Hired: "green",
      Rejected: "red",
      Interview: "blue",
      Offer: "purple",
      Screening: "gold",
      Applied: "default",
    };

    return <Tag color={map[stage] || "default"}>{stage}</Tag>;
  };

  return (
    <div className="page-layout">
      {/* HEADER */}
      <Space
        align="center"
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Button
          icon={<LeftOutlined />}
          className="accounts-reset-btn"
          onClick={() => nav(-1)}
        >
          Back
        </Button>

        <Title level={4} style={{ margin: 0 }}>
          Resume Detail
        </Title>
      </Space>

      <Card className="aices-card" style={{ marginTop: 14 }}>
        {resume ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Candidate Name */}
            <Title level={5} style={{ margin: 0 }}>
              {resume.candidateName}
            </Title>

            {/* TAGS */}
            <Space wrap>
              <Tag className="role-tag role-tag-hr">
                Email: {resume.email || "—"}
              </Tag>

              <Tag className="role-tag role-tag-hr">
                Phone: {resume.phone || "—"}
              </Tag>

              <Tag className="status-tag status-tag-verified">
                Score: {resume.score != null ? `${resume.score}%` : "—"}
              </Tag>

              {renderStageTag(resume.stage)}
            </Space>

            <Text type="secondary">
              Submitted:{" "}
              {resume.submittedAt
                ? new Date(resume.submittedAt).toLocaleString()
                : "—"}
            </Text>

            {/* PARSED SUMMARY */}
            <Card
              className="aices-card"
              type="inner"
              title={<span style={{ fontWeight: 600 }}>Parsed Summary</span>}
            >
              {/* TODO: render parsed CV fields sau này */}
              <Text type="secondary">
                Nội dung tóm tắt CV sẽ hiển thị tại đây…
              </Text>
            </Card>
          </Space>
        ) : (
          <Text type="secondary">Loading…</Text>
        )}
      </Card>
    </div>
  );
}
