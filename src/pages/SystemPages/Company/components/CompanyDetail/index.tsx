import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Tabs, Typography, Space, Button, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";

import { LeftOutlined } from "@ant-design/icons";

import { companyService } from "../../../../../services/companyService";
import type {
  Company,
  CompanyMember,
  Job,
} from "../../../../../types/company.types";
import { companySubscriptionService } from "../../../../../services/companySubscriptionService";
import type { CompanySubscription } from "../../../../../types/companySubscription.types";

import OverviewTab from "./OverviewTab";
import JobsTab from "./JobsTab";
import MembersTab from "./MembersTab";

const { Title } = Typography;
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

  // ====== LOADERS ======
  const loadCompany = async () => {
    setLoading(true);
    const res = await companyService.getSystemCompanyById(id);

    if (res.status === "Success" && res.data) {
      const d: any = res.data;

      setCompany({
        companyId: d.companyId,
        name: d.name,
        description: d.description ?? null,
        address: d.address ?? null,
        websiteUrl: d.websiteUrl ?? null,
        taxCode: d.taxCode ?? null,
        logoUrl: d.logoUrl ?? null,
        companyStatus: d.companyStatus ?? null,
        rejectionReason: d.rejectionReason ?? null,
        createdBy: d.createdBy ?? null,
        approvalBy: d.approvalBy ?? null,
        createdAt: d.createdAt ?? null,
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

      let items: CompanyMember[] = [];
      let totalPages = 1;

      if (Array.isArray(d)) {
        items = d;
      } else {
        if (Array.isArray(d.items)) {
          items = d.items;
        } else if (Array.isArray(d.members)) {
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

  // ====== EFFECTS ======
  useEffect(() => {
    loadCompany();
    loadSubscription();
  }, [id]);

  useEffect(() => {
    loadMembers(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersPg.current, membersPg.pageSize]);

  useEffect(() => {
    loadJobs(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobsPg.current, jobsPg.pageSize]);

  // ====== RENDER ======
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
        <OverviewTab company={company} subscription={subscription} />
      </Card>

      <Tabs
        style={{ marginTop: 16 }}
        items={[
          {
            key: "overview",
            label: "Overview",
            children: (
              <Card>
                <OverviewTab company={company} subscription={subscription} />
              </Card>
            ),
          },
          {
            key: "jobs",
            label: "Jobs",
            children: (
              <JobsTab
                jobs={jobs}
                pagination={jobsPg}
                total={jobsTotal}
                onChangePagination={setJobsPg}
                onViewJob={(jobId) =>
                  nav(`/system/company/${id}/jobs/${jobId}`)
                }
              />
            ),
          },
          {
            key: "members",
            label: "Members",
            children: (
              <MembersTab
                members={members}
                pagination={membersPg}
                total={membersTotal}
                onChangePagination={setMembersPg}
              />
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
