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

  // ===========================
  // FORMAT HELPERS (AICES)
  // ===========================
  const formatDate = (v?: string | null) =>
    v ? new Date(v).toLocaleString() : "—";

  const renderStatusTag = (s: string) => {
    if (!s) return <Tag>—</Tag>;
    const state = s.toLowerCase();

    if (["open", "published"].includes(state))
      return <Tag className="status-tag status-tag-verified">{s}</Tag>;

    if (["draft", "pending"].includes(state))
      return <Tag className="status-tag status-tag-unverified">{s}</Tag>;

    if (["closed", "cancelled"].includes(state))
      return <Tag className="status-tag status-tag-locked">{s}</Tag>;

    return <Tag>{s}</Tag>;
  };

  const stageColor = (stage: string) => {
    const map: Record<string, string> = {
      Screening: "gold",
      Interview: "blue",
      Offer: "purple",
      Hired: "green",
      Rejected: "red",
    };
    return map[stage] || "default";
  };

  // ===========================
  // LOAD DATA
  // ===========================
  const loadJob = async () => {
    const res = await jobService.getSystemJobById(cid, jid);
    if (res.status === "Success" && res.data) setJob(res.data as Job);
    else message.error(res.message || "Failed to load job");
  };

  const loadResumes = async () => {
    try {
      const res = await resumeService.getSystemResumes(jid, {
        page: resumesPg.current,
        pageSize: resumesPg.pageSize,
      });

      if (res.status === "Success" && res.data) {
        const data: any = res.data; // ép any cho linh hoạt

        // List CV
        setResumes(data.items || []);

        // Tính total: ưu tiên totalItems -> totalCount -> totalPages
        const pageSize = resumesPg.pageSize || DEFAULT_PAGE_SIZE;
        const total =
          data.totalItems ??
          data.totalCount ??
          (data.totalPages ?? 0) * pageSize;

        setResumesTotal(total);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadJob();
  }, [cid, jid]);

  useEffect(() => {
    loadResumes();
  }, [resumesPg]);

  // ===========================
  // RESUME TABLE COLUMNS
  // ===========================
  const resumeCols: ColumnsType<Resume> = [
    { title: "Resume ID", dataIndex: "resumeId", width: 110 },

    { title: "Candidate", dataIndex: "candidateName" },

    {
      title: "Email",
      dataIndex: "email",
      width: 220,
      render: (v) => v || "—",
    },

    {
      title: "Phone",
      dataIndex: "phone",
      width: 140,
      render: (v) => v || "—",
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
      render: (stage) => (
        <Tag color={stageColor(stage)} className="role-tag">
          {stage}
        </Tag>
      ),
    },

    {
      title: "Submitted",
      dataIndex: "submittedAt",
      width: 200,
      render: (v) => formatDate(v),
    },

    {
      title: "Actions",
      width: 120,
      render: (_, r) => (
        <Button
          icon={<EyeOutlined />}
          className="btn-search"
          onClick={() =>
            nav(`/system/company/${cid}/jobs/${jid}/resumes/${r.resumeId}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  // ===========================
  // UI RENDER
  // ===========================
  return (
    <div className="page-layout">
      {/* HEADER */}
      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Button
          icon={<LeftOutlined />}
          className="accounts-reset-btn"
          onClick={() => nav(-1)}
        >
          Back
        </Button>

        <Title level={4} style={{ margin: 0 }}>
          Job Detail
        </Title>
      </Space>

      {/* JOB SUMMARY */}
      <Card className="aices-card" style={{ marginTop: 16 }}>
        {job ? (
          <Space direction="vertical" style={{ width: "100%" }} size="small">
            <Title level={5} style={{ margin: 0 }}>
              {job.title}
            </Title>

            <Space wrap>
              <Tag className="role-tag role-tag-hr">
                Category: {job.categoryName || "—"}
              </Tag>

              <Tag className="role-tag role-tag-hr">
                Specialization: {job.specializationName || "—"}
              </Tag>

              {renderStatusTag(job.jobStatus || job.status || "")}
            </Space>

            <Text type="secondary">Created: {formatDate(job.createdAt)}</Text>
          </Space>
        ) : (
          <Text type="secondary">Loading…</Text>
        )}
      </Card>

      {/* TABS */}
      <Tabs
        style={{ marginTop: 16 }}
        items={[
          {
            key: "overview",
            label: "Overview",
            children: (
              <Card className="aices-card">
                {job ? (
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
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
                        {job.employmentTypes?.length
                          ? job.employmentTypes.join(", ")
                          : "—"}
                      </Text>
                    </div>

                    <div>
                      <Text strong>Criteria: </Text>
                      {job.criteria?.length ? (
                        <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                          {job.criteria.map((c) => (
                            <li key={c.criteriaId}>
                              {c.name} — {(c.weight * 100).toFixed(0)}%
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "—"
                      )}
                    </div>

                    <div>
                      <Text strong>Skills: </Text>
                      <Text>
                        {job.skills?.length ? job.skills.join(", ") : "—"}
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
              <Card className="aices-card">
                <Table<Resume>
                  rowKey="resumeId"
                  className="accounts-table"
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
