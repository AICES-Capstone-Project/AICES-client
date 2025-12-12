import {
  Button,
  Space,
  Table,
  Tooltip,
  Modal,
  Input,
  Typography,
  Popconfirm,
} from "antd";
import { useState } from "react";

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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCompany, setDeleteCompany] = useState<Company | null>(null);
  const [deleteText, setDeleteText] = useState("");

  const openDelete = (c: Company) => {
    setDeleteCompany(c);
    setDeleteText("");
    setDeleteOpen(true);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
    setDeleteCompany(null);
    setDeleteText("");
  };

  const canDelete = deleteCompany ? deleteText === deleteCompany.name : false;

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
      title: "Actions",
      width: 180,
      align: "center",
      render: (_, record) => {
        const status = (record.companyStatus || "").toString();

        // ===== RULE CHUYỂN TRẠNG THÁI (VERSION MỚI) =====
        // Pending   -> Approved / Rejected / Suspended
        // Approved  -> Suspended
        // Suspended -> Approved
        // Rejected  -> (terminal, giống Canceled)
        // Canceled  -> (terminal)

        const isTerminal = status === "Rejected" || status === "Canceled";

        const canApprove =
          (status === "Pending" || status === "Suspended") && !isTerminal;

        const canReject = status === "Pending" && !isTerminal;

        const canSuspend =
          (status === "Pending" || status === "Approved") && !isTerminal;

        const disabledApprove = !canApprove;
        const disabledReject = !canReject;
        const disabledSuspend = !canSuspend;

        // ⭐ System Staff: CHỈ ĐƯỢC XEM
        if (isStaff) {
          return (
            <Space size="small">
              <Tooltip title="View company detail">
                <Button
                  size="small"
                  shape="circle"
                  icon={<EyeOutlined />}
                  onClick={() => onOpenDetail(record.companyId)}
                />
              </Tooltip>
            </Space>
          );
        }

        // ⭐ Admin + Manager: FULL ACTION
        return (
          <Space size="small">
            {/* View */}
            <Tooltip title="View company detail">
              <Button
                size="small"
                shape="circle"
                className="action-btn enabled"
                icon={<EyeOutlined />}
                onClick={() => onOpenDetail(record.companyId)}
              />
            </Tooltip>

            {/* Approve */}
            <Popconfirm
              title={`Approve company "${record.name}"?`}
              okText="Yes"
              cancelText="No"
              onConfirm={() => onApprove(record.companyId)}
              disabled={disabledApprove}
            >
              <Tooltip title="Approve company">
                <Button
                  size="small"
                  shape="circle"
                  disabled={disabledApprove}
                  className={
                    disabledApprove
                      ? "action-btn disabled"
                      : "action-btn enabled"
                  }
                  icon={<CheckOutlined />}
                />
              </Tooltip>
            </Popconfirm>

            {/* Reject */}
            <Tooltip title="Reject company">
              <Button
                size="small"
                shape="circle"
                disabled={disabledReject}
                className={
                  disabledReject ? "action-btn disabled" : "action-btn enabled"
                }
                icon={<CloseOutlined />}
                onClick={() => onOpenReject(record)}
              />
            </Tooltip>

            <Tooltip title="Suspend company">
              <Button
                size="small"
                shape="circle"
                disabled={disabledSuspend}
                className={
                  disabledSuspend ? "action-btn disabled" : "action-btn enabled"
                }
                icon={<PauseCircleOutlined />}
                onClick={() => onSuspend(record.companyId)}
              />
            </Tooltip>

            {/* Delete (giữ nguyên, dùng Popconfirm) */}
            <Tooltip title="Delete company">
              <Button
                size="small"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => openDelete(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
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

      <Modal
        open={deleteOpen}
        title={<div className="system-modal-title">Delete Company</div>}
        onCancel={closeDelete}
        footer={null}
        className="system-modal"
        destroyOnClose
      >
        <Typography.Text type="danger" strong>
          This action is irreversible.
        </Typography.Text>

        <div style={{ marginTop: 12 }}>
          <Typography.Text>
            To confirm deletion, type{" "}
            <Typography.Text strong>{deleteCompany?.name}</Typography.Text>
          </Typography.Text>

          <Input
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder="Type company name exactly..."
            style={{ marginTop: 10 }}
          />
        </div>

        <div className="system-modal-footer" style={{ marginTop: 24 }}>
          <Button
            className="system-modal-btn system-modal-btn-cancel"
            onClick={closeDelete}
          >
            Cancel
          </Button>

          <Button
            className="system-modal-btn system-modal-btn-danger"
            danger
            disabled={!canDelete}
            loading={loading}
            onClick={() => {
              if (!deleteCompany) return;
              onDelete(deleteCompany.companyId);
              closeDelete();
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
