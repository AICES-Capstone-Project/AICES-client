import { Button, Space, Table, Tooltip, Avatar } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import { useAppSelector } from "../../../../hooks/redux";

import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { Company } from "../../../../types/company.types";

interface CompanyTableProps {
  loading: boolean;
  companies: Company[];
  pagination: TablePaginationConfig;
  total: number;
  defaultPageSize: number;
  onChangePagination: (p: TablePaginationConfig) => void;
  onOpenDetail: (companyId: number) => void;
}

export default function CompanyTable({
  loading,
  companies,
  pagination,
  total,
  defaultPageSize,
  onChangePagination,
  onOpenDetail,
}: CompanyTableProps) {
  const { user } = useAppSelector((state) => state.auth);
  const normalizedRole = (user?.roleName || "")
    .replace(/_/g, " ")
    .toLowerCase();
  const isStaff = normalizedRole === "system staff";

  const columns: ColumnsType<Company> = [
    {
      title: "No.",
      key: "no",
      width: 60,
      align: "center",
      render: (_: any, __: any, index: number) => {
        const current = pagination.current ?? 1;
        const pageSize = pagination.pageSize ?? defaultPageSize;
        return (current - 1) * pageSize + index + 1;
      },
    },

    {
      title: "Company",
      dataIndex: "name",
      render: (_: any, r) => {
        const hasLogo = !!r.logoUrl && r.logoUrl.trim() !== "";

        return (
          <div className="accounts-user-cell">
            <Avatar
              shape="square"
              size={32}
              src={hasLogo ? r.logoUrl : undefined}
              className={`company-logo-fixed ${
                hasLogo ? "" : "company-logo-default"
              }`}
            >
              {(r.name || "C").charAt(0).toUpperCase()}
            </Avatar>

            <div className="accounts-user-text">
              <div className="name">{r.name}</div>
              <div className="email">{r.address || "—"}</div>
            </div>
          </div>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "companyStatus",
      width: 140,
      render: (status: string | undefined) => {
        if (!status) return "—";

        const cls =
          status === "Approved"
            ? "company-status company-status-approved"
            : status === "Pending"
            ? "company-status company-status-pending"
            : status === "Rejected"
            ? "company-status company-status-rejected"
            : "company-status company-status-canceled";

        const displayText = status;

        return <span className={cls}>{displayText}</span>;
      },
    },

    {
      title: "Created By",
      dataIndex: "createdBy",
      width: 120,
      render: (v) => v || "—",
    },

    {
      title: "Approval By",
      dataIndex: "approvalBy",
      width: 120,
      render: (v) => v || "—",
    },

    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (_: any, record) => {
        // Giữ logic nghiệp vụ: System Staff chỉ được xem
        // Nhưng thực tế bây giờ tất cả role cũng chỉ có "View"
        return (
          <Space size="small">
            <Tooltip title="View company detail">
              <Button
                size="small"
                shape="circle"
                icon={<EyeOutlined />}
                className={!isStaff ? "action-btn enabled" : undefined}
                onClick={() => onOpenDetail(record.companyId)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <Table<Company>
      className="accounts-table"
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
      onChange={(p) =>
        onChangePagination({
          ...p,
          current: p.current || 1,
          pageSize: p.pageSize || defaultPageSize,
        })
      }
    />
  );
}
