import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
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
      dataIndex: "source",
      render: (src: string) => (
        <img src={src} width={80} style={{ borderRadius: 6 }} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Color",
      dataIndex: "colorCode",
      render: (c: string | null | undefined) =>
        c ? <Tag color={c}>{c}</Tag> : <Tag>None</Tag>,
    },
    {
      title: "Actions",
      render: (_: unknown, record: BannerConfig) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete this banner?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<BannerConfig>
      rowKey="id"
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={pagination}
      onChange={(p) => onChangePage(p)}
    />
  );
}
