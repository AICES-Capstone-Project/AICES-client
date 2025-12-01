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
              {/* map với categoryName & specializationName từ API */}
              <Tag color="blue">Category: {job.categoryName || "—"}</Tag>
              <Tag color="blue">
                Specialization: {job.specializationName || "—"}
              </Tag>

              {(() => {
                // ưu tiên jobStatus, fallback về status cũ
                const s = (job.jobStatus || job.status || "") as string;
                if (!s) return <Tag>—</Tag>;

                const normalized = s.toLowerCase();
                let color: "green" | "gold" | "red" | "blue" = "blue";

                if (normalized === "open" || normalized === "published")
                  color = "green";
                else if (normalized === "draft" || normalized === "pending")
                  color = "gold";
                else if (normalized === "closed" || normalized === "cancelled")
                  color = "red";

                return <Tag color={color}>{s}</Tag>;
              })()}

            </Space>

            <Text type="secondary">
              Created:{" "}
              {job.createdAt ? new Date(job.createdAt).toLocaleString() : "—"}
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
            children: (
              <Card>
                {job ? (
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                  >
                    <div>
                      <Text strong>Description: </Text>
                      <Text>{job.description || "—"}</Text>
                    </div>

                    <div>
                      <Text strong>Requirements: </Text>
                      <Text>{job.requirements || "—"}</Text>
                    </div>

                    <div>
                      <Text strong>Employment Types: </Text>
                      <Text>
                        {job.employmentTypes && job.employmentTypes.length
                          ? job.employmentTypes.join(", ")
                          : "—"}
                      </Text>
                    </div>
                    <div>
                      <Text strong>Criteria: </Text>
                      {job.criteria && job.criteria.length > 0 ? (
                        <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                          {job.criteria.map((c) => (
                            <li key={c.criteriaId}>
                              <Text>
                                {c.name} — weight: {(c.weight * 100).toFixed(0)}
                                %
                              </Text>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Text>—</Text>
                      )}
                    </div>

                    <div>
                      <Text strong>Skills: </Text>
                      <Text>
                        {job.skills && job.skills.length
                          ? job.skills.join(", ")
                          : "—"}
                      </Text>
                    </div>

                    <div>
                      <Text strong>Created by: </Text>
                      <Text>{job.fullName || "—"}</Text>
                    </div>
                  </Space>
                ) : (
                  <Text type="secondary">Loading…</Text>
                )}
              </Card>
            ),
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
