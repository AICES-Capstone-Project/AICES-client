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
  onChange: (page: number) => void;
}

const CampaignJobsTable: React.FC<Props> = ({ dataSource, columns, rowKey = 'jobId', current, pageSize, total, onChange }) => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={rowKey}
      size="middle"
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
