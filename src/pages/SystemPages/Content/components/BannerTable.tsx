import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { BannerConfig } from "../../../../types/banner.types";

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
      title: "Image",
      dataIndex: "sourceUrl", // nhớ đang dùng sourceUrl
      width: 120,
      render: (src: string) => (
        <div
          style={{
            width: 80,
            height: 48,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
            background: "#fafafa",
          }}
        >
          <img
            src={src}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
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
                border: "1px solid #f0f0f0",
                backgroundColor: c,
              }}
            />
            <Tag style={{ marginInlineStart: 0 }} color="gold">
              {c}
            </Tag>
          </Space>
        ) : (
          <Tag color="default">No color</Tag>
        ),
    },
    {
      title: "Actions",
      align: "right",
      render: (_: unknown, record: BannerConfig) => (
        <Space size="middle">
          <Button
            type="default"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete this banner?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.bannerId)}
          >
            <Button danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<BannerConfig>
      rowKey="bannerId"
      size="middle"
      style={{ marginTop: 12 }}
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={{
        ...pagination,
        showSizeChanger: false,
      }}
      onChange={(p) => onChangePage(p)}
    />
  );
}
