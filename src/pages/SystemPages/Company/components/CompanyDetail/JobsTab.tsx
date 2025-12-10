import { Card, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";


import type { Job } from "../../../../../types/company.types";

interface JobsTabProps {
  jobs: Job[];
  pagination: TablePaginationConfig;
  total: number;
  onChangePagination: (p: TablePaginationConfig) => void;
  onViewJob: (jobId: number) => void;
}

export default function JobsTab({
  jobs,
  pagination,
  total,
  onChangePagination,

}: JobsTabProps) {
  const renderStatusTag = (raw?: string | null) => {
    const s = (raw || "").trim();
    if (!s) return "—";

    const normalized = s.toLowerCase();
    let cls = "status-tag";

    if (["open", "published"].includes(normalized)) {
      cls += " status-tag-verified";
    } else if (["draft", "pending"].includes(normalized)) {
      cls += " status-tag-unverified";
    } else if (["closed", "cancelled", "canceled"].includes(normalized)) {
      cls += " status-tag-locked";
    }

    return <Tag className={cls}>{s}</Tag>;
  };

  const jobCols: ColumnsType<Job> = [
    {
      title: "Job ID",
      dataIndex: "jobId",
      width: 90,
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Status",
      width: 160,
      render: (_, r) => renderStatusTag(r.status || r.jobStatus),
    },
    {
      title: "Created",
      width: 200,
      render: (_, r) =>
        r.createdAt ? new Date(r.createdAt).toLocaleString() : "—",
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   width: 130,
    //   render: (_, r) => (
    //     <Button
    //       icon={<EyeOutlined />}
    //       className="btn-search"
    //       onClick={() => onViewJob(r.jobId)}
    //     >
    //       View
    //     </Button>
    //   ),
    // },
  ];

  return (
    <Card className="aices-card">
      <Table<Job>
        rowKey="jobId"
        className="accounts-table"
        dataSource={jobs}
        columns={jobCols}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={onChangePagination}
      />
    </Card>
  );
}
