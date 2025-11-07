import { useEffect, useState } from "react";
import {
  Button, Card, Input, Modal, Space, Table, Tag, Typography, message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { companyService } from "../../../services/companyService";
import type { Company } from "../../../types/company.types";

const { Title, Text } = Typography;
const DEFAULT_PAGE_SIZE = 10;

export default function CompanyList() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [preview, setPreview] = useState<Company | null>(null);

  const nav = useNavigate();

  const fetchData = async (page = 1, pageSize = DEFAULT_PAGE_SIZE, search = "") => {
    setLoading(true);
    const res = await companyService.getAll({ page, pageSize, search });
    if (res.status === "Success" && res.data) {
      setCompanies(res.data.items as Company[]);
      // Prefer totalItems from API if provided, otherwise fall back to totalPages * pageSize or items length
      const totalCount = (res.data as any).totalItems ?? ((res.data as any).totalPages ? (res.data as any).totalPages * pageSize : (res.data.items || []).length);
      setTotal(totalCount);
    } else {
      message.error(res.message || "Failed to fetch companies");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(pagination.current || 1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize]);

  const onSearch = () => {
    setPagination((p) => ({ ...p, current: 1 }));
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword);
  };

  const onReset = () => {
    setKeyword("");
    setPagination((p) => ({ ...p, current: 1 }));
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, "");
  };

  const columns: ColumnsType<Company> = [
    { title: "ID", dataIndex: "companyId", width: 80 },
    {
      title: "Company",
      dataIndex: "name",
      render: (v, r) => (
        <Space>
          {r.logoUrl ? (
            <img src={r.logoUrl} alt="logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }} />
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#f0f0f0" }} />
          )}
          <span>{v}</span>
        </Space>
      ),
    },
    { title: "Domain", dataIndex: "domain", render: (v: string | null) => v || "—" },
    { title: "Email", dataIndex: "email", render: (v: string | null) => v || "—" },
    { title: "Phone", dataIndex: "phone", render: (v: string | null) => v || "—" },
    { title: "Size", dataIndex: "size", width: 110, render: (v: string | null) => v || "—" },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 120,
      render: (b: boolean) => (b ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openPreview(record)}>Preview</Button>
          <Button type="primary" onClick={() => nav(`/system/company/${record.companyId}`)}>
            Open
          </Button>
        </Space>
      ),
    },
  ];

  const openPreview = async (c: Company) => {
    setIsPreviewOpen(true);
    const res = await companyService.getById(c.companyId);
    if (res.status === "Success" && res.data) {
      const cd = res.data as any;
      // Map CompanyData to Company (frontend shape)
      const mapped: Company = {
        companyId: cd.companyId,
        name: cd.name,
        domain: cd.domain ?? cd.websiteUrl ?? null,
        email: cd.email ?? null,
        phone: cd.phone ?? null,
        address: cd.address ?? null,
        size: cd.size ?? null,
        logoUrl: cd.logoUrl ?? null,
        isActive: cd.isActive ?? false,
        createdAt: cd.createdAt ?? new Date().toISOString(),
      };
      setPreview(mapped);
    }
    else message.error(res.message || "Failed to load company");
  };

  return (
    <div>
      <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
        <Title level={4} style={{ margin: 0 }}>Company Management</Title>
        <Button icon={<ReloadOutlined />} onClick={() => fetchData(pagination.current || 1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword)}>Refresh</Button>
      </Space>

      <Card style={{ marginTop: 12 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="Search by company name or domain"
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={onSearch}
            style={{ width: 320 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" onClick={onSearch}>Search</Button>
          <Button onClick={onReset}>Reset</Button>
        </Space>

        <Table<Company>
          rowKey="companyId"
          loading={loading}
          dataSource={companies}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
          }}
          onChange={(p) => setPagination(p)}
        />
      </Card>

      <Modal
        open={isPreviewOpen}
        title="Company Preview"
        onCancel={() => { setIsPreviewOpen(false); setPreview(null); }}
        footer={null}
        width={640}
      >
        {preview ? (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Space>
              {preview.logoUrl ? (
                <img src={preview.logoUrl} alt="logo" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />
              ) : null}
              <div>
                <Title level={5} style={{ margin: 0 }}>{preview.name}</Title>
                <Text type="secondary">{preview.domain || "—"}</Text>
              </div>
            </Space>
            <div><b>Email:</b> {preview.email || "—"}</div>
            <div><b>Phone:</b> {preview.phone || "—"}</div>
            <div><b>Address:</b> {preview.address || "—"}</div>
            <div><b>Size:</b> {preview.size || "—"}</div>
            <div><b>Status:</b> {preview.isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}</div>
            <div><b>Created At:</b> {new Date(preview.createdAt).toLocaleString()}</div>
          </Space>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>
    </div>
  );
}
