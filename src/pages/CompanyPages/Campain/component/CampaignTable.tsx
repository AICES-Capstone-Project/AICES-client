import React, { useState } from 'react';
import { Table, Button, Tooltip, Space, Progress, Tag, Popconfirm, message, Switch } from 'antd';
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
  onStatusChange?: (campaignId: number, newStatus: string) => void;
};

import { campaignService } from '../../../../services/campaignService';

const CampaignTable: React.FC<Props> = ({ data, loading, tableHeight, currentPage, pageSize, onView, onEdit, onDelete, onStatusChange }) => {
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [localStatus, setLocalStatus] = useState<Record<number, string>>({});
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

        const candidateKeys = ['candidates', 'applications', 'resumes', 'applicants', 'cvs'];

        const countHiredInArray = (arr: any[]) => {
          if (!Array.isArray(arr) || !arr.length) return 0;
          return arr.reduce((acc, it) => {
            const st = String(it?.status ?? it?.applicationStatus ?? it?.stage ?? '').toLowerCase().replace(/[_\s-]+/g, '');
            return acc + (st === 'hired' ? 1 : 0);
          }, 0 as number);
        };

        const hiredFromJob = (j: any) => {
          // numeric filled/hired fields take precedence
          const num = Number(j?.filled ?? j?.filledCount ?? j?.hired ?? j?.hiredCount ?? 0) || 0;
          if (num) return num;

          // otherwise try candidate arrays on the job
          for (const k of candidateKeys) {
            const arr = j?.[k];
            if (Array.isArray(arr) && arr.length) return countHiredInArray(arr);
          }

          return 0;
        };

        if (jobsArr.length) {
          jobsArr.forEach((j: any) => {
            const t = Number(j?.target ?? j?.targetQuantity ?? j?.targetQty ?? j?.target_total ?? 0) || 0;
            const f = hiredFromJob(j);
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
            <Progress percent={percent} size="small" status={percent >= 100 ? 'success' : 'active'} strokeColor="var(--color-primary-medium)" />
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
      width: 160,
      render: (_: any, record: any) => {
        const id = Number(record?.campaignId ?? record?.id ?? 0);
        const endDate = record?.endDate ? new Date(record.endDate) : null;
        const isExpired = endDate ? endDate < new Date() : false;
        const current = localStatus[id] ?? (record?.status ?? 'Pending');

        if (isExpired) {
          return <Tag color="red">Expired</Tag>;
        }

        const updating = updatingIds.includes(id);

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <Switch
              className="campaign-status-switch"
              checked={current === 'Published'}
              onChange={async (checked) => {
                const newStatus = checked ? 'Published' : 'Pending';
                try {
                  setUpdatingIds(prev => Array.from(new Set([...prev, id])));
                  // attempt to update on server
                  await campaignService.updateCampaign(id, { status: newStatus });
                  setLocalStatus(prev => ({ ...prev, [id]: newStatus }));
                  onStatusChange && onStatusChange(id, newStatus);
                  message.success('Status updated');
                } catch (err) {
                  console.error('Failed to update campaign status', err);
                  message.error('Failed to update status');
                } finally {
                  setUpdatingIds(prev => prev.filter(x => x !== id));
                }
              }}
              loading={updating}
            />
            <div style={{ fontSize: 12, color: '#444' }}>{current === 'Published' ? 'Published' : 'Pending'}</div>
          </div>
        );
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
        pageSize:10,
        showSizeChanger: false,
        total: data.length,
        showTotal: (total) => `Total ${total} campaigns`,

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
