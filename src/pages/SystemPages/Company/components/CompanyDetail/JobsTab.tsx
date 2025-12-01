import { Card, Table, Tag, Button } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";

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
  onViewJob,
}: JobsTabProps) {
  const jobCols: ColumnsType<Job> = [
    { title: "Job ID", dataIndex: "jobId", width: 90 },
    { title: "Title", dataIndex: "title" },
    {
      title: "Status",
      width: 140,
      render: (_, r) => {
        const s = (r.status || r.jobStatus || "") as string;
        if (!s) return "—";

        const normalized = s.toLowerCase();
        let color: "green" | "gold" | "red" | "blue" = "blue";

        if (normalized === "open" || normalized === "published")
          color = "green";
        else if (normalized === "draft" || normalized === "pending")
          color = "gold";
        else if (normalized === "closed" || normalized === "cancelled")
          color = "red";

        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Created",
      width: 200,
      render: (_, r) =>
        r.createdAt ? new Date(r.createdAt).toLocaleString() : "—",
    },

    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, r) => (
        <Button icon={<EyeOutlined />} onClick={() => onViewJob(r.jobId)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <Table<Job>
        rowKey="jobId"
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
