import React from 'react';
import { Table, Button, Tooltip, Space, Progress, Tag, Popconfirm, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

type Props = {
  data: any[];
  loading: boolean;
  tableHeight?: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, size?: number) => void;
  onView: (record: any) => void;
  onEdit: (record: any) => void;
  onDelete: (record: any) => Promise<void> | void;
};

const CampaignTable: React.FC<Props> = ({ data, loading, tableHeight, currentPage, pageSize, onPageChange, onView, onEdit, onDelete }) => {
  const columns: ColumnsType<any> = [
    {
      title: 'No',
      key: 'no',
      width: 60,
      align: 'center',
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      width: '30%',
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', align: 'center', width: 120, render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', align: 'center', width: 120, ellipsis: true, render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
    {
      title: 'Jobs',
      align: 'center',
      key: 'jobs',
      width: 100,
      render: (_: any, record: any) => {
        const jobsArr = record?.jobs;
        if (Array.isArray(jobsArr)) return jobsArr.length;
        const jobIds = record?.jobIds || [];
        return Array.isArray(jobIds) ? jobIds.length : 0;
      },
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      align: 'center',
      width: 160,
      render: (_: any, record: any) => {
        // Prefer computing totals from record.jobs (array of { jobId, targetQuantity/target, filled })
        const jobsArr = Array.isArray(record?.jobs) ? record.jobs : [];
        let totalTarget = 0;
        let totalHired = 0;
        if (jobsArr.length) {
          jobsArr.forEach((j: any) => {
            const t = Number(j?.target ?? j?.targetQuantity ?? j?.targetQty ?? 0) || 0;
            const f = Number(j?.filled ?? j?.hired ?? 0) || 0;
            totalTarget += t;
            totalHired += f;
          });
        } else {
          totalTarget = Number(record?.totalTarget ?? 0) || 0;
          totalHired = Number(record?.totalHired ?? 0) || 0;
        }
        const percent = totalTarget ? Math.round((totalHired / totalTarget) * 100) : 0;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <Progress percent={percent} size="small" status={percent >= 100 ? 'success' : 'active'} />
            <div style={{ fontSize: 12, color: '#444' }}>{`${totalHired}/${totalTarget}`}</div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 120,
      render: (s: string) => {
        const status = s || '-';
        const color = s === 'Published' ? 'green' : s === 'Private' ? 'blue' : s === 'Expired' ? 'red' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="View campaign details">
            <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => onView(record)} />
          </Tooltip>
          <Tooltip title="Edit campaign">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete campaign">
            <Popconfirm
              title="Delete this campaign?"
              onConfirm={async () => {
                try {
                  await onDelete(record);
                } catch (err) {
                  message.error('Delete campaign failed');
                }
              }}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="campaignId"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize,
        showSizeChanger: true,
        pageSizeOptions: [6, 12, 24, 48],
        total: data.length,
        showTotal: (total) => `Total ${total} campaigns`,
        onChange: onPageChange,
      }}
      size="middle"
      tableLayout="fixed"
      className="job-table"
      scroll={{ y: tableHeight }}
      rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
    />
  );
};

export default CampaignTable;
