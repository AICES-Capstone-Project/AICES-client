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
import CompanyPreviewModal from "./components/CompanyPreviewModal";
import RejectCompanyModal from "./components/RejectCompanyModal";
import CreateCompanyModal from "./components/CreateCompanyModal";

const DEFAULT_PAGE_SIZE = 10;

export default function CompanyList() {
  const [loading, setLoading] = useState(false);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);

  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [preview, setPreview] = useState<Company | null>(null);

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
          const website = (c.websiteUrl || "").toLowerCase();
          return name.includes(keywordLower) || website.includes(keywordLower);
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
        const list = (d.companies ?? []) as Company[];

        setAllCompanies(list);

        applyFilterAndPaging(
          list,
          keyword,
          1,
          pagination.pageSize || DEFAULT_PAGE_SIZE
        );
      } else {
        toastError("Failed to fetch companies", res?.message);
      }
    } catch (err) {
      toastError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
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
      formData.append("Name", values.name);
      if (values.description)
        formData.append("Description", values.description);
      if (values.address) formData.append("Address", values.address);
      if (values.websiteUrl) formData.append("Website", values.websiteUrl);
      if (values.taxCode) formData.append("TaxCode", values.taxCode);

      const logoList = values.logoFile as UploadFile[] | undefined;
      if (logoList && logoList.length > 0) {
        const logoFile = logoList[0].originFileObj as File;
        if (logoFile) {
          formData.append("LogoFile", logoFile);
        }
      }

      const fileList = values.documentFiles as UploadFile[] | undefined;
      if (fileList && fileList.length > 0) {
        const fileObj = fileList[0].originFileObj as File;
        if (fileObj) {
          formData.append("DocumentFiles", fileObj);
        }
      }

      if (values.documentType) {
        formData.append("DocumentTypes", values.documentType);
      }

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

  const openPreview = async (c: Company) => {
    setIsPreviewOpen(true);
    try {
      const res = await companyService.getSystemCompanyById(c.companyId);

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
        toastError("Failed to load company", res?.message);
        setIsPreviewOpen(false);
      }
    } catch {
      toastError("Failed to load company");
      setIsPreviewOpen(false);
    }
  };

  const handleDeleteCompany = async (companyId: number) => {
    setLoading(true);
    try {
      const res = await companyService.deleteCompany(companyId);
      if (res.status === "Success") {
        toastSuccess("Company deleted successfully");
        await fetchData();
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
    applyFilterAndPaging(allCompanies, keyword, page, pageSize);
  };

  return (
    <div>
      <CompanyToolbar
        loading={loading}
        onAdd={() => {
          form.resetFields();
          setIsCreateOpen(true);
        }}
        onRefresh={fetchData}
      />

      <Card style={{ marginTop: 12 }}>
        <CompanySearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          loading={loading}
          allCompanies={allCompanies}
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
          onOpenPreview={openPreview}
          onOpenDetail={handleOpenDetail}
          onApprove={handleApprove}
          onOpenReject={(c) => {
            setRejectingCompany(c);
            setRejectionReason("");
          }}
          onDelete={handleDeleteCompany}
        />
      </Card>

      <CompanyPreviewModal
        open={isPreviewOpen}
        company={preview}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreview(null);
        }}
      />

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
