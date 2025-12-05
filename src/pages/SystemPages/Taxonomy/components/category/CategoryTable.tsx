import { Button, Space, Table, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Category } from "../../../../../types/category.types";

interface CategoryTableProps {
  loading: boolean;
  data: Category[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onEdit: (record: Category) => void;
  onDelete: (record: Category) => void;
}

export default function CategoryTable({
  loading,
  data,
  pagination,
  onChangePage,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const columns: ColumnsType<Category> = [
    {
      title: "ID",
      dataIndex: "categoryId",
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
      width: 180,
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Actions",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          <Tooltip title="Deactivate">
            <Button
              size="small"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table<Category>
      className="accounts-table"
      rowKey="categoryId"
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={pagination}
      onChange={onChangePage}
    />
  );
}
