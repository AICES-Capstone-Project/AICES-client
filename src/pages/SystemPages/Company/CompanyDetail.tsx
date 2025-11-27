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
import { companyService } from "../../../services/companyService";
import type { Company, CompanyMember, Job } from "../../../types/company.types";
import { EyeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const DEFAULT_PAGE_SIZE = 10;

export default function CompanyDetail() {
  const { companyId } = useParams();
  const id = Number(companyId);
  const nav = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  // Members
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [membersTotal, setMembersTotal] = useState(0);
  const [membersPg, setMembersPg] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // Jobs
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [jobsPg, setJobsPg] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const loadCompany = async () => {
    setLoading(true);
    const res = await companyService.getSystemCompanyById(id); // dùng /system/companies/{id}
    if (res.status === "Success" && res.data) {
      const d = res.data;
      setCompany({
        companyId: d.companyId,
        name: d.name,
        domain: (d as any).domain || null,
        email: (d as any).email || null,
        phone: (d as any).phone || null,
        address: d.address || null,
        size: (d as any).size || null,
        logoUrl: d.logoUrl || null,
        isActive: d.isActive ?? true,
        createdAt: d.createdAt || new Date().toISOString(),
      });
    } else message.error(res.message || "Failed to load company");
    setLoading(false);
  };

  const loadMembers = async () => {
    const res = await companyService.getMembers(id, {
      page: membersPg.current,
      pageSize: membersPg.pageSize,
    });
    if (res.status === "Success" && res.data) {
      setMembers(res.data.items);
      setMembersTotal(
        res.data.totalPages * (membersPg.pageSize || DEFAULT_PAGE_SIZE)
      );
    }
  };

  const loadJobs = async () => {
    const res = await companyService.getJobs(id, {
      page: jobsPg.current,
      pageSize: jobsPg.pageSize,
    });
    if (res.status === "Success" && res.data) {
      setJobs(res.data.items);
      setJobsTotal(
        res.data.totalPages * (jobsPg.pageSize || DEFAULT_PAGE_SIZE)
      );
    }
  };

  useEffect(() => {
    loadCompany();
  }, [id]);
  useEffect(() => {
    loadMembers(); /* eslint-disable-next-line */
  }, [membersPg.current, membersPg.pageSize]);
  useEffect(() => {
    loadJobs(); /* eslint-disable-next-line */
  }, [jobsPg.current, jobsPg.pageSize]);

  const memberCols: ColumnsType<CompanyMember> = [
    { title: "User ID", dataIndex: "userId", width: 90 },
    {
      title: "Name",
      dataIndex: "fullName",
      render: (v: string | null) => v || "—",
    },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "roleName", width: 160 },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 120,
      render: (b: boolean) =>
        b ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Joined At",
      dataIndex: "joinedAt",
      width: 200,
      render: (v: string) => new Date(v).toLocaleString(),
    },
  ];

  const jobCols: ColumnsType<Job> = [
    { title: "Job ID", dataIndex: "jobId", width: 90 },
    { title: "Title", dataIndex: "title" },
    {
      title: "Department",
      dataIndex: "department",
      width: 140,
      render: (v: string | null) => v || "—",
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 160,
      render: (v: string | null) => v || "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (s: Job["status"]) =>
        s === "Open" ? (
          <Tag color="green">Open</Tag>
        ) : s === "Draft" ? (
          <Tag color="gold">Draft</Tag>
        ) : (
          <Tag color="red">Closed</Tag>
        ),
    },
    {
      title: "Openings",
      dataIndex: "openings",
      width: 110,
      render: (v?: number) => v ?? "—",
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
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
          onClick={() => nav(`/system/company/${id}/jobs/${r.jobId}`)}
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
        <Title level={4} style={{ margin: 0 }}>
          Company Detail
        </Title>
      </Space>

      <Card loading={loading} style={{ marginTop: 12 }}>
        {company && (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Space align="center">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt="logo"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    objectFit: "cover",
                  }}
                />
              ) : null}
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {company.name}
                </Title>
                <Text type="secondary">{company.domain || "—"}</Text>
              </div>
            </Space>
            <Space wrap>
              <Tag color="blue">Email: {company.email || "—"}</Tag>
              <Tag color="blue">Phone: {company.phone || "—"}</Tag>
              <Tag color="blue">Size: {company.size || "—"}</Tag>
              <Tag color={company.isActive ? "green" : "red"}>
                {company.isActive ? "Active" : "Inactive"}
              </Tag>
            </Space>
            {/* <Text type="secondary">Created: {new Date(company.createdAt).toLocaleString()}</Text> */}
          </Space>
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
                <Text type="secondary">
                  General information of the company.
                </Text>
              </Card>
            ),
          },
          {
            key: "jobs",
            label: "Jobs",
            children: (
              <Card>
                <Table<Job>
                  rowKey="jobId"
                  dataSource={jobs}
                  columns={jobCols}
                  pagination={{
                    current: jobsPg.current,
                    pageSize: jobsPg.pageSize,
                    total: jobsTotal,
                    showSizeChanger: true,
                  }}
                  onChange={(p) => setJobsPg(p)}
                />
              </Card>
            ),
          },
          {
            key: "members",
            label: "Members",
            children: (
              <Card>
                <Table<CompanyMember>
                  rowKey="userId"
                  dataSource={members}
                  columns={memberCols}
                  pagination={{
                    current: membersPg.current,
                    pageSize: membersPg.pageSize,
                    total: membersTotal,
                    showSizeChanger: true,
                  }}
                  onChange={(p) => setMembersPg(p)}
                />
              </Card>
            ),
          },
          {
            key: "activity",
            label: "Activity",
            children: <Card>Activity log coming soon…</Card>,
          },
        ]}
      />
    </div>
  );
}
