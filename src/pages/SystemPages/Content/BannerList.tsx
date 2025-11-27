import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { bannerService } from "../../../services/bannerService";
import type { BannerConfig } from "../../../types/banner.types";
import BannerModal from "./BannerModal";

const { Title } = Typography;
const DEFAULT_PAGE_SIZE = 10;

export default function BannerList() {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState<BannerConfig[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<BannerConfig | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await bannerService.getAllSystem({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: keyword || undefined,
      });

      const data = res.data.data;

      setBanners(data.bannerConfigs);
      setPagination((prev) => ({
        ...prev,
        total: data.totalPages * (prev.pageSize || DEFAULT_PAGE_SIZE),
      }));
    } catch (error) {
      message.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current]);

  const handleTableChange = (p: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: p.current || 1,
    }));
  };

  const handleDelete = async (id: number) => {
    try {
      await bannerService.delete(id);
      message.success("Deleted banner successfully");
      fetchData();
    } catch {
      message.error("Failed to delete banner");
    }
  };

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
            onClick={() => {
              setEditData(record);
              setOpen(true);
            }}
          />
          <Popconfirm
            title="Delete this banner?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div className="flex justify-between mb-4">
        <Title level={3}>Banners</Title>

        <Space>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search by title..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={fetchData}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchData} />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
          >
            Create
          </Button>
        </Space>
      </div>

      <Table<BannerConfig>
        rowKey="id"
        loading={loading}
        dataSource={banners}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {open && (
        <BannerModal
          open={open}
          onClose={() => setOpen(false)}
          fetchData={fetchData}
          editData={editData}
        />
      )}
    </Card>
  );
}
