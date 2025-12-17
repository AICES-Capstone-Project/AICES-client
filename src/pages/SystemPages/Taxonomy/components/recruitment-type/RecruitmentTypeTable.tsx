import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { RecruitmentType } from "../../../../../types/recruitmentType.types";

interface RecruitmentTypeTableProps {
  loading: boolean;
  data: RecruitmentType[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onEdit: (record: RecruitmentType) => void;
  onDelete: (id: number) => void;
}

export default function RecruitmentTypeTable({
  loading,
  data,
  pagination,
  onChangePage,
  onEdit,
  onDelete,
}: RecruitmentTypeTableProps) {
  const columns: ColumnsType<RecruitmentType> = [
    {
      title: "ID",
      dataIndex: "employTypeId", // ✅ FIX
      width: 80,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (value) => <span style={{ fontWeight: 500 }}>{value}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 200,
      render: (value: string) =>
        value ? new Date(value).toLocaleString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />

          <Popconfirm
            title="Delete recruitment type?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.employTypeId)} // ✅ FIX
          >
            <Button
              size="small"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="employTypeId" // ✅ FIX
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={pagination}
      onChange={(p) => onChangePage(p)}
      className="accounts-table"
    />
  );
}
