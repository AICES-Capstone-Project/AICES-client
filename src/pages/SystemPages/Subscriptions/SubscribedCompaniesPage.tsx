import { useEffect, useMemo, useState } from "react";
import { Card } from "antd";
import type { TablePaginationConfig } from "antd/es/table";

import {
  companySubscriptionService,
  type CompanySubscriptionQuery,
} from "../../../services/companySubscriptionService";
import type { CompanySubscription } from "../../../types/companySubscription.types";
import { toastError } from "../../../components/UI/Toast";

import SubscribedCompaniesTable from "./components/subscribed-companies/SubscribedCompaniesTable";
import SubscribedCompaniesToolbar from "./components/subscribed-companies/SubscribedCompaniesToolbar";

const DEFAULT_PAGE_SIZE = 10;

// normalize string for search
const normalize = (str: string) =>
  str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim() || "";

export default function SubscribedCompaniesPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompanySubscription[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string | undefined>(undefined);

  // ====== options cho Select plan (Test 1, Pro, ...) ======
  const planOptions = useMemo(
    () =>
      Array.from(
        new Set(
          data
            .map((item) => item.subscriptionName)
            .filter((x): x is string => Boolean(x))
        )
      ).map((name) => ({ label: name, value: name })),
    [data]
  );

  // ================= FETCH =================
  const fetchData = async (
    params?: CompanySubscriptionQuery,
    selectedPlan?: string
  ) => {
    try {
      setLoading(true);

      const current = params?.page ?? pagination.current ?? 1;
      const size = params?.pageSize ?? pagination.pageSize ?? DEFAULT_PAGE_SIZE;
      const keyword = params?.search ?? search ?? "";

      const safeParams: CompanySubscriptionQuery = {
        page: current,
        pageSize: size,
        search: "", // FE filter only
      };

      const res = await companySubscriptionService.getList(safeParams);
      let items = res.companySubscriptions || [];

      const kw = normalize(keyword);
      if (kw) {
        items = items.filter((item) => {
          const company = normalize(item.companyName);
          const plan = normalize(item.subscriptionName);
          const cid = String(item.companyId);
          const pid = String(item.subscriptionId);
          return (
            company.includes(kw) ||
            plan.includes(kw) ||
            cid.includes(kw) ||
            pid.includes(kw)
          );
        });
      }

      // Filter theo Subscription plan
      const planToUse = selectedPlan ?? planFilter;
      if (planToUse) {
        const normalizedPlan = normalize(planToUse);
        items = items.filter(
          (item) => normalize(item.subscriptionName) === normalizedPlan
        );
      }

      setData(items);
      setPagination({ current, pageSize: size, total: items.length });
    } catch {
      toastError("Failed to load subscribed companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ page: 1, pageSize: DEFAULT_PAGE_SIZE, search: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    const current = pag.current ?? 1;
    const size = pag.pageSize ?? DEFAULT_PAGE_SIZE;

    setPagination((prev) => ({ ...prev, current, pageSize: size }));
    fetchData({ page: current, pageSize: size, search }, planFilter);
  };

  // realtime search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(
      { page: 1, pageSize: pagination.pageSize, search: value },
      planFilter
    );
  };

  const handlePlanChange = (value?: string) => {
    setPlanFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData({ page: 1, pageSize: pagination.pageSize, search }, value);
  };

  const handleReset = () => {
    setSearch("");
    setPlanFilter(undefined);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(
      { page: 1, pageSize: pagination.pageSize, search: "" },
      undefined
    );
  };

  return (
    <div className="page-layout">
      <Card className="aices-card">
        <SubscribedCompaniesToolbar
          search={search}
          onSearchChange={handleSearchChange}
          planFilter={planFilter}
          planOptions={planOptions}
          onPlanChange={handlePlanChange}
          onReset={handleReset}
        />

        <div className="accounts-table-wrapper">
          <SubscribedCompaniesTable
            loading={loading}
            data={data}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </div>
      </Card>
    </div>
  );
}
