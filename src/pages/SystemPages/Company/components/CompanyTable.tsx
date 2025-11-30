import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined } from "@ant-design/icons";

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
      render: (v, r: Company) => (
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
      title: "Company Status",
      render: (_, r: Company) => {
        const s = r.companyStatus as string | undefined;
        const color =
          s === "Approved" ? "green" : s === "Pending" ? "gold" : "red";
        return s ? <Tag color={color}>{s}</Tag> : "—";
      },
      width: 150,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 150,
      render: (v: Company["address"]) =>
        v ? (
          <Tag
            style={{
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {v}
          </Tag>
        ) : (
          "—"
        ),
    },

    {
      title: "Created By",
      dataIndex: "createdBy",
      render: (v: Company["createdBy"]) => v || "—",
      width: 140,
    },
    {
      title: "Approval By",
      dataIndex: "approvalBy",
      render: (v: Company["approvalBy"]) => v || "—",
      width: 140,
    },

    {
      title: "Created",
      render: (_, r: Company) =>
        r.createdAt ? new Date(r.createdAt).toLocaleString() : "—",
      width: 170,
    },
    {
      title: "Actions",
      key: "actions",
      width: 260,
      render: (_, record: Company) => (
        <Space>
          <Button type="primary" onClick={() => onOpenDetail(record.companyId)}>
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
