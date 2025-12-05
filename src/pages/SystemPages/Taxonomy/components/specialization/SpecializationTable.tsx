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
      width: 80,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
      render: (value) => <span style={{ fontWeight: 500 }}>{value}</span>,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      ellipsis: true,
    },
    {
      title: "Category ID",
      dataIndex: "categoryId",
      width: 120,
      align: "center",
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
      width: 140,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />

          <Popconfirm
            title="Delete this specialization?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record)}
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
    <Table<Specialization>
      rowKey="specializationId"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={(pag) => onChangePage(pag)}
      scroll={{ x: 900 }}
      className="accounts-table"
    />
  );
}
