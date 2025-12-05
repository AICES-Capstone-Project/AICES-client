import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Tabs, Typography, Space, Button } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { LeftOutlined } from "@ant-design/icons";

import { companyService } from "../../../../../services/companyService";
import { companySubscriptionService } from "../../../../../services/companySubscriptionService";
import type {
  Company,
  CompanyMember,
  Job,
} from "../../../../../types/company.types";
import type { CompanySubscription } from "../../../../../types/companySubscription.types";
import {
  toastError,
} from "../../../../../components/UI/Toast";

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

  // ================== LOADERS ==================
  const loadCompany = async () => {
    if (Number.isNaN(id)) return;

    try {
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
        toastError("Failed to load company", res.message);
      }
    } catch {
      toastError("Failed to load company");
    }
  };

  const loadMembers = async () => {
    if (Number.isNaN(id)) return;

    const pageSize = membersPg.pageSize || DEFAULT_PAGE_SIZE;

    try {
      const res = await companyService.getMembers(id, {
        page: membersPg.current,
        pageSize: membersPg.pageSize,
      });

      if (res.status === "Success" && res.data) {
        const d: any = res.data;

        let items: CompanyMember[] = [];
        if (Array.isArray(d)) {
          items = d;
        } else if (Array.isArray(d.items)) {
          items = d.items;
        } else if (Array.isArray(d.members)) {
          items = d.members;
        }

        const total =
          d.totalItems ??
          d.totalCount ??
          (d.totalPages ? d.totalPages * pageSize : items.length);

        setMembers(items);
        setMembersTotal(total);
      } else {
        setMembers([]);
        setMembersTotal(0);
        toastError("Failed to load members", res.message);
      }
    } catch {
      setMembers([]);
      setMembersTotal(0);
      toastError("Failed to load members");
    }
  };

  const loadJobs = async () => {
    if (Number.isNaN(id)) return;

    const pageSize = jobsPg.pageSize || DEFAULT_PAGE_SIZE;

    try {
      const res = await companyService.getJobs(id, {
        page: jobsPg.current,
        pageSize: jobsPg.pageSize,
      });

      if (res.status === "Success" && res.data) {
        const d: any = res.data;

        let items: Job[] = [];
        if (Array.isArray(d)) {
          items = d;
        } else if (Array.isArray(d.items)) {
          items = d.items;
        } else if (Array.isArray(d.jobs)) {
          items = d.jobs;
        }

        const total =
          d.totalItems ??
          d.totalCount ??
          (d.totalPages ? d.totalPages * pageSize : items.length);

        setJobs(items);
        setJobsTotal(total);
      } else {
        setJobs([]);
        setJobsTotal(0);
        toastError("Failed to load jobs", res.message);
      }
    } catch {
      setJobs([]);
      setJobsTotal(0);
      toastError("Failed to load jobs");
    }
  };

  const loadSubscription = async () => {
    if (Number.isNaN(id)) return;

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
    } catch {
      setSubscription(null);
    }
  };

  // ================== EFFECTS ==================
  useEffect(() => {
    loadCompany();
    loadSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersPg.current, membersPg.pageSize]);

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobsPg.current, jobsPg.pageSize]);

  // ================== RENDER ==================
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
          Company Detail
        </Title>
      </Space>

      {/* TABS */}
      <Tabs
        style={{ marginTop: 16 }}
        items={[
          {
            key: "overview",
            label: "Overview",
            children: (
              <Card className="aices-card">
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
          
        ]}
      />
    </div>
  );
}
