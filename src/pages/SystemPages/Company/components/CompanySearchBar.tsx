import { Button, Input } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

import type { TablePaginationConfig } from "antd/es/table";
import type { Company } from "../../../../types/company.types";

interface CompanySearchBarProps {
  keyword: string;
  setKeyword: (value: string) => void;
  loading: boolean;
  allCompanies: Company[];
  pagination: TablePaginationConfig;
  defaultPageSize: number;
  applyFilterAndPaging: (
    source: Company[],
    kw: string,
    page: number,
    pageSize: number
  ) => void;
}

export default function CompanySearchBar({
  keyword,
  setKeyword,
  loading,
  allCompanies,
  pagination,
  defaultPageSize,
  applyFilterAndPaging,
}: CompanySearchBarProps) {
  const pageSize = pagination.pageSize || defaultPageSize;

  const doReset = () => {
    setKeyword("");
    applyFilterAndPaging(allCompanies, "", 1, pageSize);
  };

  return (
    <div className="accounts-searchbar">
      <div className="accounts-toolbar-left">
        <Input
          placeholder="Search by company name"
          allowClear
          value={keyword}
          onChange={(e) => {
            const v = e.target.value;
            setKeyword(v);
            applyFilterAndPaging(allCompanies, v, 1, pageSize); // ✅ realtime
          }}
          style={{ width: 360 }}
          prefix={<SearchOutlined />}
        />

        <Button
          className="accounts-reset-btn"
          icon={<ReloadOutlined />}
          onClick={doReset}
          loading={loading}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
