// src/pages/SystemPages/Companies/CompanyList.tsx

import { useEffect, useState } from "react";
import { Card, Form, Button, Select } from "antd"; // ⭐ thêm Button
import { PlusOutlined } from "@ant-design/icons"; // ⭐ thêm icon

import type { TablePaginationConfig } from "antd/es/table";
import { useNavigate } from "react-router-dom";

import { companyService } from "../../../services/companyService";
import type { Company } from "../../../types/company.types";
import type { UploadFile } from "antd/es/upload/interface";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../../components/UI/Toast";
import { useAppSelector } from "../../../hooks/redux";

import CompanySearchBar from "./components/CompanySearchBar";
import CompanyTable from "./components/CompanyTable";
import RejectCompanyModal from "./components/RejectCompanyModal";
import CreateCompanyModal from "./components/CreateCompanyModal";

const DEFAULT_PAGE_SIZE = 10;

export default function CompanyList() {
  const [loading, setLoading] = useState(false);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);

  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [rejectingCompany, setRejectingCompany] = useState<Company | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();

  const nav = useNavigate();

  // ================== FILTER PAGING ==================
  const applyFilterAndPaging = (
    source: Company[],
    kw: string,
    page: number,
    pageSize: number
  ) => {
    const kwLower = kw.trim().toLowerCase();

    const filtered = kwLower
      ? source.filter((c) => (c.name || "").toLowerCase().includes(kwLower))
      : source;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    setTotal(filtered.length);
    setCompanies(filtered.slice(start, end));
    setPagination((p) => ({
      ...p,
      current: page,
      pageSize,
    }));
  };

  const handleChangeStatusFilter = (value: string) => {
    const newStatus = value || "";
    setStatusFilter(newStatus);

    const page = 1;
    const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;

    const source = newStatus
      ? allCompanies.filter((c) => (c.companyStatus || "") === newStatus)
      : allCompanies;

    applyFilterAndPaging(source, keyword, page, pageSize);
  };

  // ================== FETCH ==================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await companyService.getAll({
        page: 1,
        pageSize: 1000,
      });

      if (res?.status === "Success" && res?.data) {
        const rawList = (res.data as any).companies ?? [];

        setAllCompanies(rawList);

        const page = pagination.current || 1;
        const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;

        const source = statusFilter
          ? rawList.filter(
              (c: Company) => (c.companyStatus || "") === statusFilter
            )
          : rawList;

        applyFilterAndPaging(source, keyword, page, pageSize);
      } else {
        toastError("Failed to fetch companies", res?.message);
      }
    } catch {
      toastError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================== STATUS HANDLERS ==================
  const updateCompanyStatus = async (
    companyId: number,
    status: "Approved" | "Rejected" | "Suspended", // ⭐ thêm "Suspended"
    reason?: string
  ) => {
    setLoading(true);
    try {
      const res = await companyService.updateStatus(companyId, {
        status,
        rejectionReason: status === "Rejected" ? reason || "" : null,
      });

      if (res?.status === "Success") {
        const msg =
          status === "Approved"
            ? "Company approved successfully"
            : status === "Rejected"
            ? "Company rejected successfully"
            : status === "Suspended"
            ? "Company suspended successfully"
            : "Company status updated successfully";

        toastSuccess(msg);
        await fetchData();
      } else {
        toastError("Failed to update company status", res?.message);
      }
    } catch {
      toastError("Failed to update company status");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      toastWarning("Please input rejection reason");
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
  };

  // ================== CREATE ==================
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();

      formData.append("name", values.name || "");
      formData.append("description", values.description || "");
      formData.append("address", values.address || "");
      formData.append("website", values.websiteUrl || "");
      formData.append("taxCode", values.taxCode || "");

      const logoList = values.logoFile as UploadFile[] | undefined;
      if (logoList?.length) {
        const logoFile = logoList[0].originFileObj as File;
        if (logoFile) {
          formData.append("logoFile", logoFile, logoFile.name);
        }
      }

      const documents = (values.documents || []) as {
        type?: string;
        file?: File;
      }[];

      const validDocs = documents.filter(
        (d) => d?.type && d?.file instanceof File
      );

      if (validDocs.length === 0) {
        toastWarning("Please add at least one document with type and file");
        setLoading(false);
        return;
      }

      validDocs.forEach((doc, idx) => {
        formData.append(`documentTypes[${idx}]`, doc.type!);
        formData.append("documentFiles", doc.file!);
      });

      const res = await companyService.createAdminForm(formData);

      if (res.status === "Success") {
        toastSuccess("Company created successfully");
        setIsCreateOpen(false);
        form.resetFields();
        await fetchData();
      } else {
        toastError("Failed to create company", res?.message);
      }
    } catch (err: any) {
      if (err?.errorFields) return;
      toastError("Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  // ================== DELETE ==================
  const handleDeleteCompany = async (companyId: number) => {
    setLoading(true);
    try {
      const res = await companyService.deleteCompany(companyId);

      if (res.status === "Success") {
        toastSuccess("Company deleted successfully");

        setAllCompanies((prev) => {
          const updated = prev.filter((c) => c.companyId !== companyId);

          const page = pagination.current || 1;
          const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;

          const source = statusFilter
            ? updated.filter((c) => (c.companyStatus || "") === statusFilter)
            : updated;

          applyFilterAndPaging(source, keyword, page, pageSize);

          return updated;
        });
      } else {
        toastError("Failed to delete company", res?.message);
      }
    } catch {
      toastError("Failed to delete company");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (companyId: number) =>
    updateCompanyStatus(companyId, "Approved");

  // ⭐ NEW: tạm ngưng company
  const handleSuspend = (companyId: number) =>
    updateCompanyStatus(companyId, "Suspended");

  const companiesByStatus = statusFilter
    ? allCompanies.filter((c) => (c.companyStatus || "") === statusFilter)
    : allCompanies;

  // ================== TABLE PAGING ==================
  const handleChangeTable = (p: TablePaginationConfig) => {
    const page = p.current || 1;
    const pageSize = p.pageSize || DEFAULT_PAGE_SIZE;

    setPagination(p);

    const source = statusFilter
      ? allCompanies.filter((c) => (c.companyStatus || "") === statusFilter)
      : allCompanies;

    applyFilterAndPaging(source, keyword, page, pageSize);
  };
  const handleOpenCreate = () => {
    setIsCreateOpen(true);
    form.resetFields(); // nếu không cần reset thì có thể bỏ dòng này
  };

  // ==================================================
  const { user } = useAppSelector((state) => state.auth);

  const normalizedRole = (user?.roleName || "")
    .replace(/_/g, " ")
    .toLowerCase();

  // ⭐ Base path theo từng role
  let baseSystemPath = "/system"; // mặc định: System Admin

  if (normalizedRole === "system manager") {
    baseSystemPath = "/system_manager";
  } else if (normalizedRole === "system staff") {
    baseSystemPath = "/system_staff";
  }

  const isStaff = normalizedRole === "system staff";

  return (
    <div className="page-layout">
      <Card className="aices-card">
        {/* 🔥 HÀNG TOP: Search + Search/Reset + Status + Add Company */}
        <div className="company-header-row">
          {/* LEFT - Search */}
          <div className="company-left">
            <CompanySearchBar
              keyword={keyword}
              setKeyword={setKeyword}
              loading={loading}
              allCompanies={companiesByStatus}
              pagination={pagination}
              defaultPageSize={DEFAULT_PAGE_SIZE}
              applyFilterAndPaging={applyFilterAndPaging}
            />
          </div>

          {/* RIGHT - Status + Add Company */}
          <div className="company-right">
            {/* ⭐ Dropdown filter status */}
            <Select
              value={statusFilter || ""} // "" = All
              onChange={handleChangeStatusFilter}
              style={{ width: 140 }}
            >
              <Select.Option value="">All status</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
              <Select.Option value="Suspended">Suspended</Select.Option>
              <Select.Option value="Canceled">Canceled</Select.Option>
            </Select>
            {/* Add Company chỉ cho Manager/Admin */}
            {!isStaff && (
              <Button
                icon={<PlusOutlined />}
                className="accounts-new-btn"
                onClick={handleOpenCreate}
              >
                Add Company
              </Button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="accounts-table-wrapper">
          <CompanyTable
            loading={loading}
            companies={companies}
            pagination={pagination}
            total={total}
            defaultPageSize={DEFAULT_PAGE_SIZE}
            onChangePagination={handleChangeTable}
            onOpenDetail={(id) => nav(`${baseSystemPath}/company/${id}`)} // ⭐ sửa ở đây
            onApprove={handleApprove}
            onOpenReject={(c) => {
              setRejectingCompany(c);
              setRejectionReason("");
            }}
            onDelete={handleDeleteCompany}
            onSuspend={handleSuspend} // ⭐ thêm dòng này
          />
        </div>
      </Card>

      {/* MODALS */}
      <RejectCompanyModal
        open={!!rejectingCompany}
        loading={loading}
        company={rejectingCompany}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
        onCancel={() => {
          setRejectingCompany(null);
          setRejectionReason("");
        }}
        onConfirm={handleConfirmReject}
      />

      {!isStaff && (
        <CreateCompanyModal
          open={isCreateOpen}
          loading={loading}
          form={form}
          onCancel={() => setIsCreateOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
