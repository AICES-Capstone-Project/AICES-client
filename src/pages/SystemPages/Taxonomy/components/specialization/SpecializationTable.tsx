import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import type { Specialization } from "../../../../../types/specialization.types";


interface SpecializationTableProps {
  loading: boolean;
  data: Specialization[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onEdit: (record: Specialization) => void;
  onDelete: (record: Specialization) => void;
}

export default function SpecializationTable({
  loading,
  data,
  pagination,
  onChangePage,
  onEdit,
  onDelete,
}: SpecializationTableProps) {
  const columns: ColumnsType<Specialization> = [
    {
      title: "ID",
      dataIndex: "specializationId",
      key: "specializationId",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      ellipsis: true,
    },
    {
      title: "Category ID",
      dataIndex: "categoryId",
      key: "categoryId",
      width: 120,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 220,
      render: (value: string) =>
        value ? new Date(value).toLocaleString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete this specialization?"
            onConfirm={() => onDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<Specialization>
      rowKey="specializationId"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={(pag) => onChangePage(pag)}
      scroll={{ x: 900 }}
    />
  );
}
