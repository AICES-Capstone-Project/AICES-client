// src/pages/SystemPages/Companies/CompanyList.tsx

import { useEffect, useState } from "react";
import { Card, Select } from "antd";

import type { TablePaginationConfig } from "antd/es/table";
import { useNavigate } from "react-router-dom";

import { companyService } from "../../../services/companyService";
import type { Company } from "../../../types/company.types";

import { toastError, toastSuccess, toastWarning } from "../../../components/UI/Toast";
import { useAppSelector } from "../../../hooks/redux";

import CompanySearchBar from "./components/CompanySearchBar";
import CompanyTable from "./components/CompanyTable";
import RejectCompanyModal from "./components/RejectCompanyModal";

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

  const [rejectingCompany, setRejectingCompany] = useState<Company | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

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
          ? rawList.filter((c: Company) => (c.companyStatus || "") === statusFilter)
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

  useEffect(() => {
    const t = setTimeout(() => {
      const page = 1;
      const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;

      const source = statusFilter
        ? allCompanies.filter((c) => (c.companyStatus || "") === statusFilter)
        : allCompanies;

      applyFilterAndPaging(source, keyword, page, pageSize);
    }, 250);

    return () => clearTimeout(t);
  }, [keyword, statusFilter, allCompanies, pagination.pageSize]);

  // ================== STATUS HANDLERS ==================
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
        const msg =
          status === "Approved"
            ? "Company approved successfully"
            : status === "Rejected"
            ? "Company rejected successfully"
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

    await updateCompanyStatus(rejectingCompany.companyId, "Rejected", rejectionReason);

    setRejectingCompany(null);
    setRejectionReason("");
  };


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

  return (
    <div className="page-layout">
      <Card className="aices-card">
        <div className="company-header-row">
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

          <div className="company-right">
            <Select
              value={statusFilter || ""} // "" = All
              onChange={handleChangeStatusFilter}
              style={{ width: 140 }}
            >
              <Select.Option value="">All status</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
              <Select.Option value="Canceled">Canceled</Select.Option>
            </Select>
          </div>
        </div>

        <div className="accounts-table-wrapper">
          <CompanyTable
            loading={loading}
            companies={companies}
            pagination={pagination}
            total={total}
            defaultPageSize={DEFAULT_PAGE_SIZE}
            onChangePagination={handleChangeTable}
            onOpenDetail={(id) => nav(`${baseSystemPath}/company/${id}`)}
          />
        </div>
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
    </div>
  );
}
