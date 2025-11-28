import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Space, Tag, Typography } from "antd";
import { resumeService } from "../../../services/resumeService";
import type { Resume } from "../../../types/company.types";
import { toastError } from "../../../components/UI/Toast";

const { Title, Text } = Typography;

export default function ResumeDetail() {
  const { companyId, jobId, resumeId } = useParams();
  const cid = Number(companyId);
  const jid = Number(jobId);
  const rid = Number(resumeId);

  const [resume, setResume] = useState<Resume | null>(null);

  const load = async () => {
  const res = await resumeService.getSystemResumeById(jid, rid);
  if (res.status === "Success" && res.data) setResume(res.data);
  else toastError("Failed to load resume", res.message);
};


  useEffect(() => {
    load();
  }, [cid, jid, rid]);

  return (
    <div>
      <Title level={4} style={{ margin: 0 }}>
        Resume Detail
      </Title>

      <Card style={{ marginTop: 12 }}>
        {resume ? (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0 }}>
              {resume.candidateName}
            </Title>
            <Space wrap>
              <Tag color="blue">Email: {resume.email || "—"}</Tag>
              <Tag color="blue">Phone: {resume.phone || "—"}</Tag>
              <Tag color="purple">
                Score: {resume.score != null ? `${resume.score}%` : "—"}
              </Tag>
              <Tag>{resume.stage}</Tag>
            </Space>
            <Text type="secondary">
              Submitted: {new Date(resume.submittedAt).toLocaleString()}
            </Text>
            <Card type="inner" title="Parsed Summary">
              {/* Bạn có thể render các field đã parse ở đây */}
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
