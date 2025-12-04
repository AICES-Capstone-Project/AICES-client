import { Button, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import type { Category } from "../../../../../types/category.types";
import CategoryStatusTag from "./CategoryStatusTag";

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
    },
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 200,
      render: (value: string) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
          >
            Deactivate
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<Category>
      rowKey="categoryId"
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={pagination}
      onChange={(pag) => onChangePage(pag)}
    />
  );
}
