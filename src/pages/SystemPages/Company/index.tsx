import { useEffect, useState } from "react";
import { Card, Form } from "antd";
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

import CompanyToolbar from "./components/CompanyToolbar";
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

  // ================== CORE HELPERS ==================
  const applyFilterAndPaging = (
    source: Company[],
    kw: string,
    page: number,
    pageSize: number
  ) => {
    const keywordLower = kw.trim().toLowerCase();

    const filtered = keywordLower
      ? source.filter((c) => {
          const name = (c.name || "").toLowerCase();
          return name.includes(keywordLower);
        })
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await companyService.getAll({
        page: 1,
        pageSize: 1000, // lấy nhiều 1 chút để admin search thoải mái
      });

      if (res?.status === "Success" && res?.data) {
        const d = res.data as any;
        const rawList = (d.companies ?? []) as Company[];

        setAllCompanies(rawList);

        const page = pagination.current || 1;
        const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;

        const source = statusFilter
          ? rawList.filter((c) => (c.companyStatus || "") === statusFilter)
          : rawList;

        applyFilterAndPaging(source, keyword, page, pageSize);
      } else {
        toastError("Failed to fetch companies", res?.message);
      }
    } catch (err) {
      toastError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================== ACTION HANDLERS ==================
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
        toastSuccess(
          status === "Approved"
            ? "Company approved successfully"
            : "Company rejected successfully"
        );
        await fetchData();
      } else {
        toastError("Failed to update company status", res?.message);
      }
    } catch (e) {
      toastError("Failed to update company status");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();

      // ⚠️ dùng giống y MyApartment.tsx: tên field viết thường
      formData.append("name", values.name || "");
      formData.append("description", values.description || "");
      formData.append("address", values.address || "");
      formData.append("website", values.websiteUrl || "");
      formData.append("taxCode", values.taxCode || "");

      // Logo (giữ Upload như cũ nhưng key phải là logoFile)
      const logoList = values.logoFile as UploadFile[] | undefined;
      if (logoList && logoList.length > 0) {
        const logoFile = logoList[0].originFileObj as File;
        if (logoFile) {
          formData.append("logoFile", logoFile, logoFile.name);
        }
      }

      // Documents: lấy từ Form.List documents (type + file)
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
        formData.append(`documentTypes[${idx}]`, doc.type as string);
        formData.append("documentFiles", doc.file as File);
      });

      // debug (nếu cần)
      // for (const p of formData.entries()) console.log(p[0], p[1]);

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

  const handleApprove = (companyId: number) => {
    updateCompanyStatus(companyId, "Approved");
  };

  const handleOpenDetail = (companyId: number) => {
    nav(`/system/company/${companyId}`);
  };

  const handleChangeTable = (p: TablePaginationConfig) => {
    const page = p.current || 1;
    const pageSize = p.pageSize || DEFAULT_PAGE_SIZE;
    setPagination(p);

    const source = statusFilter
      ? allCompanies.filter((c) => (c.companyStatus || "") === statusFilter)
      : allCompanies;

    applyFilterAndPaging(source, keyword, page, pageSize);
  };
  const companiesByStatus = statusFilter
    ? allCompanies.filter((c) => (c.companyStatus || "") === statusFilter)
    : allCompanies;

  return (
    <div>
      <CompanyToolbar
        loading={loading}
        onAdd={() => {
          form.resetFields();
          setIsCreateOpen(true);
        }}
        onRefresh={fetchData}
        statusFilter={statusFilter}
        onChangeStatusFilter={handleChangeStatusFilter}
      />

      <Card style={{ marginTop: 12 }}>
        <CompanySearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          loading={loading}
          allCompanies={companiesByStatus}
          pagination={pagination}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          applyFilterAndPaging={applyFilterAndPaging}
        />

        <CompanyTable
          loading={loading}
          companies={companies}
          pagination={pagination}
          total={total}
          keyword={keyword}
          allCompanies={allCompanies}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onChangePagination={handleChangeTable}
          onOpenDetail={handleOpenDetail}
          onApprove={handleApprove}
          onOpenReject={(c) => {
            setRejectingCompany(c);
            setRejectionReason("");
          }}
          onDelete={handleDeleteCompany}
        />
      </Card>

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

      <CreateCompanyModal
        open={isCreateOpen}
        loading={loading}
        form={form}
        onCancel={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
