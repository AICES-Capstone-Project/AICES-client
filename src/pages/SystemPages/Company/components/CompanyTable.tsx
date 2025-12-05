import { Button, Popconfirm, Space, Table } from "antd";
import { useAppSelector } from "../../../../hooks/redux";

import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";

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
  onApprove: (companyId: number) => void;
  onOpenReject: (c: Company) => void;
  onDelete: (companyId: number) => void;
  onSuspend: (companyId: number) => void; // ⭐ NEW
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
  onSuspend,
}: CompanyTableProps) {
  const { user } = useAppSelector((state) => state.auth);
  const normalizedRole = (user?.roleName || "")
    .replace(/_/g, " ")
    .toLowerCase();
  const isStaff = normalizedRole === "system staff";

  const columns: ColumnsType<Company> = [
    {
      title: "ID",
      dataIndex: "companyId",
      width: 60,
      align: "center",
    },

    {
      title: "Company",
      dataIndex: "name",
      render: (_, r) => (
        <div className="accounts-user-cell">
          <img src={r.logoUrl || ""} alt="logo" className="company-logo" />

          <div className="accounts-user-text">
            <div className="name">{r.name}</div>
            <div className="email">{r.address || "—"}</div>
          </div>
        </div>
      ),
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
            : status === "Suspended"
            ? "company-status company-status-suspended"
            : "company-status company-status-canceled";

        return <span className={cls}>{status}</span>;
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
      title: "Created",
      width: 170,
      render: (_, r) =>
        r.createdAt ? new Date(r.createdAt).toLocaleString() : "—",
    },

    {
      title: "Actions",
      width: 180,
      align: "center",
      render: (_, record) => {
        const status = (record.companyStatus || "").toString();

        // ===== RULE CHUYỂN TRẠNG THÁI =====
        // Pending  -> Approved / Rejected / Suspended
        // Approved -> Suspended
        // Rejected -> Approved / Suspended
        // Suspended-> Approved
        // Canceled -> (không cho chuyển)

        const isCanceled = status === "Canceled";

        const canApprove =
          (status === "Pending" ||
            status === "Rejected" ||
            status === "Suspended") &&
          !isCanceled;

        const canReject = status === "Pending" && !isCanceled;

        const canSuspend =
          (status === "Pending" ||
            status === "Approved" ||
            status === "Rejected") &&
          !isCanceled;

        const disabledApprove = !canApprove;
        const disabledReject = !canReject;
        const disabledSuspend = !canSuspend;

        // ⭐ System Staff: CHỈ ĐƯỢC XEM
        if (isStaff) {
          return (
            <Space size="small">
              <Button
                size="small"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => onOpenDetail(record.companyId)}
              />
            </Space>
          );
        }

        // ⭐ Admin + Manager: FULL ACTION
        return (
          <Space size="small">
            {/* View */}
            <Button
              size="small"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => onOpenDetail(record.companyId)}
            />

            {/* Approve */}
            <Button
              size="small"
              shape="circle"
              disabled={disabledApprove}
              icon={<CheckOutlined />}
              onClick={() => onApprove(record.companyId)}
            />

            {/* Reject (chỉ từ Pending) */}
            <Button
              size="small"
              shape="circle"
              disabled={disabledReject}
              icon={<CloseOutlined />}
              onClick={() => onOpenReject(record)}
            />

            {/* Suspend */}
            <Button
              size="small"
              shape="circle"
              disabled={disabledSuspend}
              icon={<PauseCircleOutlined />}
              onClick={() => onSuspend(record.companyId)}
            />

            {/* Delete */}
            <Popconfirm
              title="Delete company?"
              okText="Delete"
              okType="danger"
              cancelText="Cancel"
              onConfirm={() => onDelete(record.companyId)}
            >
              <Button
                size="small"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
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
