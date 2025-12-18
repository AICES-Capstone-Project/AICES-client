import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { BannerConfig } from "../../../../../types/banner.types";

interface BannerTableProps {
  loading: boolean;
  data: BannerConfig[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onEdit: (banner: BannerConfig) => void;
  onDelete: (id: number) => void;
}

export default function BannerTable({
  loading,
  data,
  pagination,
  onChangePage,
  onEdit,
  onDelete,
}: BannerTableProps) {
  const columns: ColumnsType<BannerConfig> = [
    {
      title: "No.",
      key: "no",
      width: 80,
      align: "center",
      render: (_: any, __: any, index: number) => {
        const current = pagination.current ?? 1;
        const pageSize = pagination.pageSize ?? 10;
        return (current - 1) * pageSize + index + 1;
      },
    },

    {
      title: "Image",
      dataIndex: "source",
      width: 140,
      render: (src: string) => (
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
          {src ? (
            <img
              src={src}
              alt="banner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "#9ca3af",
              }}
            >
              No image
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      ellipsis: true,
    },
    {
      title: "Color",
      dataIndex: "colorCode",
      width: 160,
      render: (c: string | null | undefined) =>
        c ? (
          <Space>
            <span
              style={{
                display: "inline-block",
                width: 18,
                height: 18,
                borderRadius: "999px",
                border: "1px solid #e5e7eb",
                backgroundColor: c,
              }}
            />
            <Tag style={{ marginInlineStart: 0 }}>{c}</Tag>
          </Space>
        ) : (
          <Tag color="default">No color</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      align: "center",
      render: (_: unknown, record: BannerConfig) => (
        <Space size="small">
          <Button
            type="default"
            shape="circle"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete this banner?"
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.bannerId)}
          >
            <Button
              danger
              shape="circle"
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<BannerConfig>
      rowKey="bannerId"
      size="middle"
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={{
        ...pagination,
        showSizeChanger: false,
      }}
      onChange={(p) => onChangePage(p)}
      className="accounts-table"
    />
  );
}
