// src/pages/SystemPages/Subscriptions/SubscribedCompaniesPage.tsx

import { useEffect, useState } from "react";
import { Card, Space } from "antd";
import type { TablePaginationConfig } from "antd/es/table";

import {
  companySubscriptionService,
  type CompanySubscriptionQuery,
} from "../../../services/companySubscriptionService";
import type { CompanySubscription } from "../../../types/companySubscription.types";
import { toastError } from "../../../components/UI/Toast";

import SubscribedCompaniesToolbar from "./components/subscribed-companies/SubscribedCompaniesToolbar";
import SubscribedCompaniesTable from "./components/subscribed-companies/SubscribedCompaniesTable";

export default function SubscribedCompaniesPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompanySubscription[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [search, setSearch] = useState("");

  const fetchData = async (params?: CompanySubscriptionQuery) => {
    try {
      setLoading(true);

      const safeParams: CompanySubscriptionQuery = {
        page: params?.page ?? (pagination.current ?? 1),
        pageSize: params?.pageSize ?? (pagination.pageSize ?? 10),
        search: params?.search ?? search ?? "",
      };

      const res = await companySubscriptionService.getList(safeParams);

      // BE trả:
      // {
      //   companySubscriptions: CompanySubscription[];
      //   page: number;
      //   pageSize: number;
      //   totalItems: number;
      // }
      setData(res.companySubscriptions);

      setPagination({
        current: res.page,
        pageSize: res.pageSize,
        total: res.totalItems,
      });
    } catch (error) {
      console.error(error);
      toastError("Failed to load subscribed companies");
    } finally {
      setLoading(false);
    }
  };

  // Khi search đổi thì load lại page 1
  useEffect(() => {
    fetchData({ page: 1, pageSize: pagination.pageSize ?? 10, search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleTableChange = (pag: TablePaginationConfig) => {
    const current = pag.current ?? 1;
    const size = pag.pageSize ?? 10;

    setPagination((prev) => ({
      ...prev,
      current,
      pageSize: size,
    }));

    fetchData({
      page: current,
      pageSize: size,
    });
  };

  const handleSearch = (value: string) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSearch(value.trim());
  };

  return (
    <Card>
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={16}
      >
        <SubscribedCompaniesToolbar onSearch={handleSearch} />

        <SubscribedCompaniesTable
          loading={loading}
          data={data}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Space>
    </Card>
  );
}
