import { Table, Space, Tooltip, Button, Tag, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { CompanyJob } from "../../../../services/jobService";

import { tagColorFor } from "../../../../utils/tagUtils";

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
      render: (cat) => (
        <Tag color={tagColorFor(cat)}>{cat || "-"}</Tag>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specializationName",
      key: "specializationName",
      width: "20%",
      align: "center",
      render: (spec, record) => {
        // If category exists, use its color for specialization to match user's request
        const category = (record as CompanyJob).categoryName;
        const color = category ? tagColorFor(category) : tagColorFor(spec);
        return <Tag color={color}>{spec || "-"}</Tag>;
      },
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
            <Popconfirm
              title="Are you sure to delete this job?"
              onConfirm={() => onDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Popconfirm>
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
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          total: jobs.length,
          showTotal: (total) => `Total ${total} jobs`,
        }}
        style={{ width: "100%" }}
        tableLayout="fixed"
        className="job-table"
        scroll={{ y: '59.5vh' }}
        rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
      />
    </div>
  );
};

export default JobTable;
