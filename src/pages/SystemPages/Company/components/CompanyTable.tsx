import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import type { Company } from "../../../../types/company.types";

interface CompanyTableProps {
  loading: boolean;
  companies: Company[];
  pagination: TablePaginationConfig;
  total: number;
  keyword: string;
  allCompanies: Company[];
  defaultPageSize: number;
  onChangePagination: (p: TablePaginationConfig) => void;
  onOpenPreview: (c: Company) => void;
  onOpenDetail: (companyId: number) => void;
  onApprove: (companyId: number) => void;
  onOpenReject: (c: Company) => void;
  onDelete: (companyId: number) => void;
}

export default function CompanyTable({
  loading,
  companies,
  pagination,
  total,
  defaultPageSize,
  onChangePagination,
  onOpenPreview,
  onOpenDetail,
  onApprove,
  onOpenReject,
  onDelete,
}: CompanyTableProps) {
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
    {
      title: "Website",
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
    {
      title: "Company Status",
      render: (_, r: any) => {
        const s = r.companyStatus as string | undefined;
        const color =
          s === "Approved" ? "green" : s === "Pending" ? "gold" : "red";
        return s ? <Tag color={color}>{s}</Tag> : "—";
      },
      width: 150,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      width: 110,
      render: (b?: boolean) =>
        b ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Created",
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
          <Button
            icon={<EyeOutlined />}
            onClick={() => onOpenPreview(record)}
          >
            Preview
          </Button>
          <Button
            type="primary"
            onClick={() => onOpenDetail(record.companyId)}
          >
            Open
          </Button>

          <Button
            size="small"
            disabled={record.companyStatus === "Approved"}
            onClick={() => onApprove(record.companyId)}
          >
            Approve
          </Button>

          <Button
            size="small"
            danger
            disabled={record.companyStatus === "Rejected"}
            onClick={() => onOpenReject(record)}
          >
            Reject
          </Button>

          <Popconfirm
            title="Delete company?"
            description="Are you sure you want to delete this company?"
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
            onConfirm={() => onDelete(record.companyId)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
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
      onChange={(p) => {
        const page = p.current || 1;
        const pageSize = p.pageSize || defaultPageSize;

        // parent sẽ applyFilterAndPaging
        onChangePagination({
          ...p,
          current: page,
          pageSize,
        });
      }}
    />
  );
}
