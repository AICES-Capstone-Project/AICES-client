import { Table, Space, Tooltip, Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { CompanyJob } from "../../../../services/jobService";

type Props = {
  jobs: CompanyJob[];
  loading: boolean;
  onView: (job: CompanyJob) => void;
  onEdit: (job: CompanyJob) => void;
  onDelete: (job: CompanyJob) => void;
};

const JobTable = ({ jobs, loading, onView, onEdit, onDelete }: Props) => {
  const columns: ColumnsType<CompanyJob> = [
    {
      title: "No",
      key: "no",
      width: "5%",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "40%",
      align: "center",
      ellipsis: { showTitle: true },
      render: (title) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      width: "20%",
      align: "center",
      render: (cat) => <Tag>{cat || "-"}</Tag>,
    },
    {
      title: "Specialization",
      dataIndex: "specializationName",
      key: "specializationName",
      width: "20%",
      align: "center",
      render: (spec) => <Tag>{spec || "-"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Job">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Remove Job">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Table<CompanyJob>
        columns={columns}
        dataSource={jobs}
        loading={loading}
        rowKey="jobId"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        style={{ width: "100%" }}
        tableLayout="fixed"
        className="job-table"
        scroll={{ y: '57vh' }}
        rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
      />
    </div>
  );
};

export default JobTable;
