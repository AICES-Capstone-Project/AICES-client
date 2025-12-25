import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Props {
  dataSource: any[];
  columns: ColumnsType<any>;
  rowKey?: string | ((record: any) => string | number);
  current: number;
  pageSize: number;
  total: number;
  tableHeight?: number | undefined;
  onChange: (page: number) => void;
}

const CampaignJobsTable: React.FC<Props> = ({ dataSource, columns, current, pageSize, total, tableHeight, onChange }) => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="jobId"
      size="middle"
      style={{ width: "100%" }}
      scroll={tableHeight ? { y: tableHeight } : undefined}
      tableLayout="fixed"
      className="job-table"
      rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
      pagination={{
        current,
        pageSize,
        total,
        showSizeChanger: false,
        showTotal: (t: number) => `Total ${t} jobs`,
        onChange: (page: number) => onChange(page),
      }}
    />
  );
};

export default CampaignJobsTable;
