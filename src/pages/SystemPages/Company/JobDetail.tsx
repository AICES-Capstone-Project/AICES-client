import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Tabs,
  Typography,
  Space,
  Tag,
  Table,
  Button,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { jobService } from "../../../services/jobService";
import { resumeService } from "../../../services/resumeService";
import type { Job, Resume } from "../../../types/company.types";
import { EyeOutlined, LeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const DEFAULT_PAGE_SIZE = 10;

export default function JobDetail() {
  const { companyId, jobId } = useParams();
  const cid = Number(companyId);
  const jid = Number(jobId);
  const nav = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumesTotal, setResumesTotal] = useState(0);
  const [resumesPg, setResumesPg] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const loadJob = async () => {
    const res = await jobService.getSystemJobById(cid, jid);
    if (res.status === "Success" && res.data) setJob(res.data as any);
    else message.error(res.message || "Failed to load job");
  };

  const loadResumes = async () => {
    const res = await resumeService.getSystemResumes(jid, {
      page: resumesPg.current,
      pageSize: resumesPg.pageSize,
    });
    if (res.status === "Success" && res.data) {
      setResumes(res.data.items);
      setResumesTotal(
        res.data.totalPages * (resumesPg.pageSize || DEFAULT_PAGE_SIZE)
      );
    }
  };

  useEffect(() => {
    loadJob();
  }, [cid, jid]);
  useEffect(() => {
    loadResumes(); /* eslint-disable-next-line */
  }, [resumesPg.current, resumesPg.pageSize]);

  const resumeCols: ColumnsType<Resume> = [
    { title: "Resume ID", dataIndex: "resumeId", width: 110 },
    { title: "Candidate", dataIndex: "candidateName" },
    {
      title: "Email",
      dataIndex: "email",
      width: 220,
      render: (v: string | null) => v || "—",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: 140,
      render: (v: string | null) => v || "—",
    },
    {
      title: "Score",
      dataIndex: "score",
      width: 100,
      render: (v?: number) => (v != null ? `${v}%` : "—"),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      width: 140,
      render: (s: Resume["stage"]) => {
        const color =
          s === "Hired"
            ? "green"
            : s === "Rejected"
            ? "red"
            : s === "Interview"
            ? "blue"
            : s === "Offer"
            ? "purple"
            : s === "Screening"
            ? "gold"
            : "default";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Submitted",
      dataIndex: "submittedAt",
      width: 200,
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, r) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() =>
            nav(`/system/company/${cid}/jobs/${jid}/resumes/${r.resumeId}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Button icon={<LeftOutlined />} onClick={() => nav(-1)}>
          Back
        </Button>

        <Title level={4} style={{ margin: 0 }}>
          Job Detail
        </Title>
      </Space>

      <Card style={{ marginTop: 12 }}>
        {job ? (
          <Space direction="vertical" style={{ width: "100%" }} size="small">
            <Title level={5} style={{ margin: 0 }}>
              {job.title}
            </Title>
            <Space wrap>
              <Tag color="blue">Department: {job.department || "—"}</Tag>
              <Tag color="blue">Location: {job.location || "—"}</Tag>
              <Tag
                color={
                  job.status === "Open"
                    ? "green"
                    : job.status === "Draft"
                    ? "gold"
                    : "red"
                }
              >
                {job.status}
              </Tag>
              <Tag>Openings: {job.openings ?? "—"}</Tag>
            </Space>
            <Text type="secondary">
              Updated: {new Date(job.updatedAt).toLocaleString()}
            </Text>
          </Space>
        ) : (
          <Text type="secondary">Loading…</Text>
        )}
      </Card>

      <Tabs
        style={{ marginTop: 16 }}
        items={[
          {
            key: "overview",
            label: "Overview",
            children: <Card>Job description / settings hiển thị ở đây…</Card>,
          },
          {
            key: "resumes",
            label: "Resumes",
            children: (
              <Card>
                <Table<Resume>
                  rowKey="resumeId"
                  dataSource={resumes}
                  columns={resumeCols}
                  pagination={{
                    current: resumesPg.current,
                    pageSize: resumesPg.pageSize,
                    total: resumesTotal,
                    showSizeChanger: true,
                  }}
                  onChange={(p) => setResumesPg(p)}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
