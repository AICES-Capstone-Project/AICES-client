import { Button, Input, Space } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";

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
  const currentPageSize = pagination.pageSize || defaultPageSize;

  return (
    <Space style={{ marginBottom: 16 }} wrap>
      <Input
        placeholder="Search by company name"
        allowClear
        value={keyword}
        onChange={(e) => {
          const value = e.target.value;
          setKeyword(value);

          applyFilterAndPaging(
            allCompanies,
            value,
            1,
            currentPageSize
          );
        }}
        onPressEnter={() =>
          applyFilterAndPaging(
            allCompanies,
            keyword,
            1,
            currentPageSize
          )
        }
        style={{ width: 320 }}
        prefix={<SearchOutlined />}
      />
      <Button
        type="primary"
        onClick={() =>
          applyFilterAndPaging(
            allCompanies,
            keyword,
            1,
            currentPageSize
          )
        }
        loading={loading}
      >
        Search
      </Button>
      <Button
        onClick={() => {
          setKeyword("");
          applyFilterAndPaging(
            allCompanies,
            "",
            1,
            currentPageSize
          );
        }}
        disabled={loading}
      >
        Reset
      </Button>
    </Space>
  );
}
