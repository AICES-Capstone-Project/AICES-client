import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  message,
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
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [preview, setPreview] = useState<Company | null>(null);

  // === NEW: state cho chức năng Reject công ty ===
  const [rejectingCompany, setRejectingCompany] = useState<Company | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const nav = useNavigate();

  // === NEW: hàm gọi API update status công ty ===
  // Lưu ý: bạn cần tạo hàm companyService.updateStatus(id, body) bên service nếu chưa có
  const updateCompanyStatus = async (
    companyId: number,
    status: "Approved" | "Rejected",
    reason?: string
  ) => {
    setLoading(true);
    try {
      const res = await companyService.updateStatus(companyId, {
        status,
        rejectionReason: status === "Rejected" ? reason || "" : null,
      });

      if (res?.status === "Success") {
        message.success(
          status === "Approved"
            ? "Company approved successfully"
            : "Company rejected successfully"
        );
        // refresh lại list theo trang hiện tại & keyword hiện tại
        await fetchData(
          pagination.current || 1,
          pagination.pageSize || DEFAULT_PAGE_SIZE,
          keyword
        );
      } else {
        message.error(res?.message || "Failed to update company status");
      }
    } catch (e) {
      message.error("Failed to update company status");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    search = ""
  ) => {
    setLoading(true);
    try {
      const res = await companyService.getAll({ page, pageSize, search });
      if (res?.status === "Success" && res?.data) {
        const d = res.data as any;
        const list = (d.companies ?? []) as Company[];
        setCompanies(list);

        // total = totalPages * pageSize (nếu không có tổng tuyệt đối)
        const totalCount = (
          d.totalPages ? d.totalPages * (d.pageSize ?? pageSize) : list.length
        ) as number;
        setTotal(totalCount);

        // cập nhật current page nếu BE trả về
        if (d.currentPage || d.pageSize) {
          setPagination((p) => {
            const next = {
              ...p,
              current: d.currentPage ?? p.current,
              pageSize: d.pageSize ?? p.pageSize,
            };
            return next.current === p.current && next.pageSize === p.pageSize
              ? p
              : next;
          });
        }
      } else {
        message.error(res?.message || "Failed to fetch companies");
      }
    } catch (err) {
      message.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(
      pagination.current || 1,
      pagination.pageSize || DEFAULT_PAGE_SIZE,
      keyword
    );
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

  // === COLUMNS (đã khớp schema GET /api/companies) ===
  const columns: ColumnsType<Company> = [
    { title: "ID", dataIndex: "companyId", width: 80 },

    {
      title: "Company",
      dataIndex: "name",
      render: (v, r) => (
        <Space>
          {r.logoUrl ? (
            <img
              src={r.logoUrl}
              alt="logo"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "#f0f0f0",
              }}
            />
          )}
          <span>{v}</span>
        </Space>
      ),
    },

    // Website (schema: websiteUrl) – hiển thị host gọn gàng
    {
      title: "Website",
      // tránh lỗi type nếu Company type chưa có websiteUrl
      render: (_, r: any) => {
        const url = r.websiteUrl as string | undefined;
        if (!url) return "—";
        let host = "";
        try {
          host = new URL(url).hostname;
        } catch {
          host = url;
        }
        return (
          <a href={url} target="_blank" rel="noreferrer">
            {host}
          </a>
        );
      },
    },

    // Trạng thái duyệt (schema: companyStatus = Approved/Pending/Rejected)
    {
      title: "Company Status",
      // dùng render để không phụ thuộc type
      render: (_, r: any) => {
        const s = r.companyStatus as string | undefined;
        const color =
          s === "Approved" ? "green" : s === "Pending" ? "gold" : "red";
        return s ? <Tag color={color}>{s}</Tag> : "—";
      },
      width: 150,
    },

    // Kích hoạt (schema: isActive = boolean)
    {
      title: "Active",
      dataIndex: "isActive",
      width: 110,
      render: (b?: boolean) =>
        b ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },

    // Ngày tạo (schema: createdAt)
    {
      title: "Created",
      // dùng render để không phụ thuộc type
      render: (_, r: any) =>
        r.createdAt ? new Date(r.createdAt).toLocaleString() : "—",
      width: 170,
    },

    {
      title: "Actions",
      key: "actions",
      width: 260,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openPreview(record)}>
            Preview
          </Button>
          <Button
            type="primary"
            onClick={() => nav(`/system/company/${record.companyId}`)}
          >
            Open
          </Button>

          {/* === NEW: nút Approve / Reject === */}
          <Button
            size="small"
            disabled={record.companyStatus === "Approved"}
            onClick={() => updateCompanyStatus(record.companyId, "Approved")}
          >
            Approve
          </Button>

          <Button
            size="small"
            danger
            disabled={record.companyStatus === "Rejected"}
            onClick={() => {
              setRejectingCompany(record);
              setRejectionReason("");
            }}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  const openPreview = async (c: Company) => {
    setIsPreviewOpen(true);
    try {
      const res = await companyService.getById(c.companyId);
      if (res.status === "Success" && res.data) {
        const cd = res.data as any;
        const mapped: Company = {
          companyId: cd.companyId,
          name: cd.name,
          address: cd.address ?? null,
          logoUrl: cd.logoUrl ?? null,
          websiteUrl: cd.websiteUrl ?? null,
          companyStatus: cd.companyStatus ?? null,
          isActive: cd.isActive ?? false,
          createdAt: cd.createdAt ?? new Date().toISOString(),
        };
        setPreview(mapped);
      } else {
        message.error(res?.message || "Failed to load company");
        setIsPreviewOpen(false); // 👈
      }
    } catch {
      message.error("Failed to load company");
      setIsPreviewOpen(false); // 👈
    }
  };

  return (
    <div>
      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Company Management
        </Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={() =>
            fetchData(
              pagination.current || 1,
              pagination.pageSize || DEFAULT_PAGE_SIZE,
              keyword
            )
          }
        >
          Refresh
        </Button>
      </Space>

      <Card style={{ marginTop: 12 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="Search by company name or website"
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={onSearch}
            style={{ width: 320 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" onClick={onSearch} loading={loading}>
            Search
          </Button>
          <Button onClick={onReset} disabled={loading}>
            Reset
          </Button>
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
        onCancel={() => {
          setIsPreviewOpen(false);
          setPreview(null);
        }}
        footer={null}
        width={640}
      >
        {preview ? (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Space>
              {preview.logoUrl ? (
                <img
                  src={preview.logoUrl}
                  alt="logo"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    objectFit: "cover",
                  }}
                />
              ) : null}
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {preview.name}
                </Title>
                {/* Website */}
                {preview.websiteUrl ? (
                  <a href={preview.websiteUrl} target="_blank" rel="noreferrer">
                    {(() => {
                      try {
                        return new URL(preview.websiteUrl).hostname;
                      } catch {
                        return preview.websiteUrl;
                      }
                    })()}
                  </a>
                ) : (
                  <Text type="secondary">—</Text>
                )}
              </div>
            </Space>

            <div>
              <b>Address:</b> {preview.address || "—"}
            </div>

            <div>
              <b>Company Status:</b>{" "}
              {preview.companyStatus ? (
                <Tag
                  color={
                    preview.companyStatus === "Approved"
                      ? "green"
                      : preview.companyStatus === "Pending"
                      ? "gold"
                      : "red"
                  }
                >
                  {preview.companyStatus}
                </Tag>
              ) : (
                "—"
              )}
            </div>

            <div>
              <b>Active:</b>{" "}
              {preview.isActive ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              )}
            </div>

            <div>
              <b>Created At:</b>{" "}
              {preview.createdAt
                ? new Date(preview.createdAt).toLocaleString()
                : "—"}
            </div>
          </Space>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>
      {/* === NEW: Modal nhập lý do Reject === */}
      <Modal
        open={!!rejectingCompany}
        title={
          rejectingCompany
            ? `Reject company #${rejectingCompany.companyId}`
            : "Reject company"
        }
        onCancel={() => {
          setRejectingCompany(null);
          setRejectionReason("");
        }}
        onOk={async () => {
          if (!rejectionReason.trim()) {
            message.warning("Please input rejection reason");
            return;
          }
          if (!rejectingCompany) return;

          await updateCompanyStatus(
            rejectingCompany.companyId,
            "Rejected",
            rejectionReason
          );

          setRejectingCompany(null);
          setRejectionReason("");
        }}
        confirmLoading={loading}
      >
        <div style={{ marginBottom: 8 }}>
          <b>Rejection reason</b>
        </div>
        <Input.TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Nhập lý do từ chối công ty này..."
        />
      </Modal>
    </div>
  );
}
