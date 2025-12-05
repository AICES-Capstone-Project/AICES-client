// src/pages/SystemPages/Content/Blogs/components/BlogTable.tsx

import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import type { Blog } from "../../../../../types/blog.types";

interface BlogTableProps {
  loading: boolean;
  data: Blog[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onEdit: (blog: Blog) => void;
  onDelete: (id: number) => void;
}

export default function BlogTable({
  loading,
  data,
  pagination,
  onChangePage,
  onEdit,
  onDelete,
}: BlogTableProps) {
  const columns: ColumnsType<Blog> = [
    {
      title: "Title",
      dataIndex: "title",
      width: 260,
      ellipsis: true,
      render: (value) => <span style={{ fontWeight: 500 }}>{value}</span>,
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnailUrl",
      width: 160,
      render: (value: string | null) =>
        value ? (
          <a href={value} target="_blank" rel="noreferrer">
            <div
              style={{
                width: 96,
                height: 54,
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                background: "#fafafa",
              }}
            >
              <img
                src={value}
                alt="Thumbnail"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </a>
        ) : (
          "—"
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 200,
      render: (value: string) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—",
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      fixed: "right",
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
            title="Delete blog"
            description="Are you sure you want to delete this blog?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.blogId)}
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
    <Table<Blog>
      rowKey="blogId"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      onChange={(pag) => onChangePage(pag)}
      scroll={{ x: 900 }}
      className="accounts-table"
    />
  );
}
