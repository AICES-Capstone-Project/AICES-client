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
import { EyeOutlined, LeftOutlined } from "@ant-design/icons";
import { companySubscriptionService } from "../../../services/companySubscriptionService";
import type { CompanySubscription } from "../../../types/companySubscription.types";


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

  // Company subscription (System Admin)
  const [subscription, setSubscription] = useState<CompanySubscription | null>(
    null
  );

  const loadCompany = async () => {
    setLoading(true);
    const res = await companyService.getSystemCompanyById(id);
    if (res.status === "Success" && res.data) {
      const d: any = res.data;

      setCompany({
        companyId: d.companyId,
        name: d.name,
        address: d.address ?? null,
        logoUrl: d.logoUrl ?? null,
        isActive: d.isActive ?? true,

        // ⬇️ các field BE trả trong detail
        websiteUrl: d.websiteUrl ?? null,
        companyStatus: d.companyStatus ?? null,
        createdBy: d.createdBy,
        approvalBy: d.approvalBy,
        createdAt: d.createdAt ?? new Date().toISOString(),
        taxCode: d.taxCode ?? null,
        description: d.description ?? null,
        rejectionReason: d.rejectionReason ?? null,
        documents: Array.isArray(d.documents) ? d.documents : [],
      });
    } else {
      message.error(res.message || "Failed to load company");
    }
    setLoading(false);
  };

  const loadMembers = async () => {
    const res = await companyService.getMembers(id, {
      page: membersPg.current,
      pageSize: membersPg.pageSize,
    });

    if (res.status === "Success" && res.data) {
      const d: any = res.data;

      // ✅ ưu tiên dạng phân trang { items, totalPages, ... }
      let items: CompanyMember[] = [];
      let totalPages = 1;

      if (Array.isArray(d)) {
        // data = [ ... ]
        items = d;
        totalPages = 1;
      } else {
        if (Array.isArray(d.items)) {
          items = d.items;
        } else if (Array.isArray(d.members)) {
          // phòng trường hợp BE đặt tên là 'members'
          items = d.members;
        }
        totalPages = d.totalPages ?? 1;
      }

      setMembers(items);
      setMembersTotal(totalPages * (membersPg.pageSize || DEFAULT_PAGE_SIZE));
    } else {
      setMembers([]);
      setMembersTotal(0);
      message.error(res.message || "Failed to load members");
    }
  };

  const loadJobs = async () => {
    const res = await companyService.getJobs(id, {
      page: jobsPg.current,
      pageSize: jobsPg.pageSize,
    });

    if (res.status === "Success" && res.data) {
      const d: any = res.data;

      let items: Job[] = [];
      let totalPages = 1;

      if (Array.isArray(d)) {
        items = d;
        totalPages = 1;
      } else {
        if (Array.isArray(d.items)) {
          items = d.items;
        } else if (Array.isArray(d.jobs)) {
          items = d.jobs;
        }
        totalPages = d.totalPages ?? 1;
      }

      setJobs(items);
      setJobsTotal(totalPages * (jobsPg.pageSize || DEFAULT_PAGE_SIZE));
    } else {
      setJobs([]);
      setJobsTotal(0);
      message.error(res.message || "Failed to load jobs");
    }
  };

  const loadSubscription = async () => {
    try {
      const data = await companySubscriptionService.getList({
        page: 1,
        pageSize: 1,
        search: String(id),
      });

      const first =
        data.companySubscriptions && data.companySubscriptions.length > 0
          ? data.companySubscriptions[0]
          : null;

      setSubscription(first);
    } catch (err) {
      console.error(err);
      setSubscription(null);
    }
  };

  useEffect(() => {
    loadCompany();
    loadSubscription();
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
        <Button icon={<LeftOutlined />} onClick={() => nav(-1)}>
          Back
        </Button>

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
              {company.companyStatus && (
                <Tag
                  color={
                    company.companyStatus === "Approved"
                      ? "green"
                      : company.companyStatus === "Pending"
                      ? "gold"
                      : "red"
                  }
                >
                  {company.companyStatus}
                </Tag>
              )}
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
                {company ? (
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                  >
                    <div>
                      <Text strong>Description: </Text>
                      <Text>{company.description || "—"}</Text>
                    </div>

                    <div>
                      <Text strong>Address: </Text>
                      <Text>{company.address || "—"}</Text>
                    </div>

                    <div>
                      <Text strong>Website: </Text>
                      {company.websiteUrl ? (
                        <a
                          href={company.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {company.websiteUrl}
                        </a>
                      ) : (
                        <Text>—</Text>
                      )}
                    </div>

                    <div>
                      <Text strong>Tax Code: </Text>
                      <Text>{company.taxCode || "—"}</Text>
                    </div>
                    <div>
                      <Text strong>Subscription: </Text>
                      {subscription ? (
                        <>
                          <Text>
                            {subscription.subscriptionName} (
                            {new Date(
                              subscription.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              subscription.endDate
                            ).toLocaleDateString()}
                            )
                          </Text>
                          <Tag
                            style={{ marginLeft: 8 }}
                            color={
                              subscription.subscriptionStatus === "Active"
                                ? "green"
                                : subscription.subscriptionStatus ===
                                  "Cancelled"
                                ? "red"
                                : "gold"
                            }
                          >
                            {subscription.subscriptionStatus}
                          </Tag>
                        </>
                      ) : (
                        <Text>—</Text>
                      )}
                    </div>

                    <div>
                      <Text strong>Status: </Text>
                      {company.companyStatus ? (
                        <Tag
                          color={
                            company.companyStatus === "Approved"
                              ? "green"
                              : company.companyStatus === "Pending"
                              ? "gold"
                              : "red"
                          }
                        >
                          {company.companyStatus}
                        </Tag>
                      ) : (
                        <Text>—</Text>
                      )}
                    </div>

                    <div>
                      <Text strong>Created by: </Text>
                      <Text>{company.createdBy ?? "—"}</Text>
                    </div>

                    <div>
                      <Text strong>Approved by: </Text>
                      <Text>{company.approvalBy ?? "—"}</Text>
                    </div>

                    <div>
                      <Text strong>Documents:</Text>
                      {company.documents && company.documents.length > 0 ? (
                        <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                          {company.documents.map((doc, idx) => (
                            <li key={idx}>
                              <Text>
                                {doc.documentType}{" "}
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  View
                                </a>
                              </Text>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Text type="secondary">No documents</Text>
                      )}
                    </div>
                  </Space>
                ) : (
                  <Text type="secondary">
                    General information of the company.
                  </Text>
                )}
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
