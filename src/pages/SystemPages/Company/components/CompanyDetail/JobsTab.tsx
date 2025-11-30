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
          onClick={() => onViewJob(r.jobId)}
        >
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
