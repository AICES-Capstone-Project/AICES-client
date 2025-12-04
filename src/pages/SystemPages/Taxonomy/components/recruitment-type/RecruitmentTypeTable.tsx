import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import type { RecruitmentType } from "../../../../../types/recruitmentType.types";
import RecruitmentTypeStatusTag from "./RecruitmentTypeStatusTag";

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
      dataIndex: "recruitmentTypeId",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 220,
      render: (value: string) =>
        value ? new Date(value).toLocaleString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_: unknown, record: RecruitmentType) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this recruitment type?"
            onConfirm={() => onDelete(record.recruitmentTypeId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<RecruitmentType>
      rowKey="recruitmentTypeId"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={(pag) => onChangePage(pag)}
    />
  );
}
