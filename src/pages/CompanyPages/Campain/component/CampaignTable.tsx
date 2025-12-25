import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Table, Button, Tooltip, Space, Progress, Tag, message, Switch, Modal, Input } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { campaignService } from '../../../../services/campaignService';
import { useAppSelector } from '../../../../hooks/redux';
import { ROLES } from '../../../../services/config';

type Props = {
  data: any[];
  loading: boolean;
  tableHeight?: number;
  currentPage: number;
  pageSize: number;
  total?: number; 
  onPageChange: (page: number, size?: number) => void;
  onView: (record: any) => void;
  onEdit: (record: any) => void;
  onDelete: (record: any) => Promise<void> | void;
  onStatusChange?: (campaignId: number, newStatus: string) => void;
};

const CampaignTable: React.FC<Props> = ({ data, loading, tableHeight, currentPage, pageSize, total, onPageChange, onView, onEdit, onDelete, onStatusChange }) => {
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [localStatus, setLocalStatus] = useState<Record<number, string>>({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<any | null>(null);
  const [confirmInput, setConfirmInput] = useState('');
  const [deletingLoadingLocal, setDeletingLoadingLocal] = useState(false);
  const user = useAppSelector((s: any) => s.auth?.user);
  const isHrRecruiter = (user?.roleName || '').toLowerCase() === (ROLES.Hr_Recruiter || '').toLowerCase();
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
    {
      title: 'Start Date', dataIndex: 'startDate', key: 'startDate', align: 'center', width: 120, render: (v: any) => {
        if (!v) return '-';
        const d = dayjs(v);
        return d.isValid() ? d.format('DD/MM/YYYY') : '-';
      }
    },
    {
      title: 'End Date', dataIndex: 'endDate', key: 'endDate', align: 'center', width: 120, ellipsis: true, render: (v: any) => {
        if (!v) return '-';
        const d = dayjs(v);
        return d.isValid() ? d.format('DD/MM/YYYY') : '-';
      }
    },
    {
      title: 'Total Jobs',
      align: 'center',
      key: 'totalJobs',
      width: 100,
      render: (_: any, record: any) => {
        const apiTotal = record?.totalJobs ?? record?.total_jobs ?? record?.total_jobs_count ?? record?.jobsCount ?? record?.jobs_count;
        if (apiTotal !== undefined && apiTotal !== null) return Number(apiTotal) || 0;

        const jobsArr = Array.isArray(record?.jobs) ? record.jobs : [];
        if (jobsArr.length) return jobsArr.length;

        const jobIds = Array.isArray(record?.jobIds) ? record.jobIds : Array.isArray(record?.job_ids) ? record.job_ids : [];
        if (jobIds.length) return jobIds.length;

        return 0;
      },
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      align: 'center',
      width: 160,
      render: (_: any, record: any) => {
        // Prefer API-provided totals if available (avoid expensive job-level computation)
        const jobsArr = Array.isArray(record?.jobs) ? record.jobs : [];
        let totalTarget = 0;
        let totalHired = 0;

        const apiTotalTargetRaw = record?.totalTarget ?? record?.total_target ?? record?.totalTargets ?? record?.totalTargetsCount;
        const apiTotalHiredRaw = record?.totalHired ?? record?.total_hired ?? record?.totalHiredCount ?? record?.totalHiredCount;
        const hasApiTotals = apiTotalTargetRaw !== undefined && apiTotalTargetRaw !== null;
        if (hasApiTotals) {
          totalTarget = Number(apiTotalTargetRaw) || 0;
          totalHired = Number(apiTotalHiredRaw ?? 0) || 0;
        } else {

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
        const id = Number(record?.campaignId ?? record?.id ?? record?.record?.campaignId ?? record?.record?.id ?? 0);
        const endDate = record?.endDate ? new Date(record.endDate) : null;
        const isExpired = endDate ? endDate < new Date() : false;
        const sourceStatus = record?.status ?? record?.record?.status ?? (record?.record?.data?.status) ?? 'Pending';
        const current = localStatus[id] ?? sourceStatus;
        const statusNormalized = String(current || '').toLowerCase();
        const switchable = statusNormalized === 'published' || statusNormalized === 'paused';
        const isPublished = statusNormalized === 'published';

        const getStatusTagColor = (s: string) => {
          switch (s) {
            case 'published':
              return 'green';
            case 'paused':
              return 'orange';
            case 'pending':
              return 'blue';
            case 'rejected':
              return 'yellow';
            case 'expired':
              return 'red';
            case 'draft':
              return 'default';
            default:
              return 'purple';
          }
        };

        if (isExpired) {
          return <Tag color="red">Expired</Tag>;
        }

        // For recruiters always show a tag (no switches)
        if (isHrRecruiter) {
          const color = getStatusTagColor(statusNormalized);
          return <Tag color={color}>{current}</Tag>;
        }

        // If status is not Published/Paused, show a Tag with the status instead of a Switch
        if (!switchable) {
          const color = getStatusTagColor(statusNormalized);
          return <Tag color={color}>{current}</Tag>;
        }

        const updating = updatingIds.includes(id);

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <Switch
              className="campaign-status-switch"
              checked={isPublished}
              onChange={async (checked) => {
                const newStatus = checked ? 'Published' : 'Paused';
                try {
                  setUpdatingIds(prev => Array.from(new Set([...prev, id])));
                  // attempt to update on server (use dedicated status endpoint)
                  await campaignService.updateCampaignStatus(id, newStatus);
                  setLocalStatus(prev => ({ ...prev, [id]: newStatus }));
                  onStatusChange && onStatusChange(id, newStatus);
                  message.success('Status updated');
                } catch (err: any) {
                  console.error('Failed to update campaign status', err);
                  const serverMsg = err?.response?.data?.message || err?.message || 'Failed to update status';
                  message.error(serverMsg);
                } finally {
                  setUpdatingIds(prev => prev.filter(x => x !== id));
                }
              }}
              loading={updating}
            />
            <div style={{ fontSize: 12, color: '#444' }}>{current}</div>
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
            {!isHrRecruiter && (
              <Button type="text" icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
            )}
          </Tooltip>
          <Tooltip title="Delete campaign">
            {!isHrRecruiter && (
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={() => {
                  setDeletingRecord(record);
                  setConfirmInput('');
                  setConfirmModalOpen(true);
                }}
              />
            )}
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="campaignId"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          total: total || data.length,
          showTotal: (total) => `Total ${total} campaigns`,
          onChange: onPageChange,
        }}
        style={{ width: "100%" }}
        tableLayout="fixed"
        className="job-table"
        scroll={{ y: tableHeight }}
        rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
      />

      <Modal
        title="Delete campaign"
        open={confirmModalOpen}
        onCancel={() => { setConfirmModalOpen(false); setDeletingRecord(null); setConfirmInput(''); }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <Button className="company-btn" onClick={() => { setConfirmModalOpen(false); setDeletingRecord(null); setConfirmInput(''); }}>Cancel</Button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                danger
                loading={deletingLoadingLocal}
                onClick={async () => {
                  if (!deletingRecord) return;
                  if (confirmInput !== (deletingRecord.title ?? '')) return;
                  try {
                    setDeletingLoadingLocal(true);
                    await onDelete(deletingRecord);
                    setConfirmModalOpen(false);
                    setDeletingRecord(null);
                    setConfirmInput('');
                  } catch (err) {
                    console.error('Delete campaign failed', err);
                    message.error('Delete campaign failed');
                  } finally {
                    setDeletingLoadingLocal(false);
                  }
                }}
                disabled={confirmInput !== (deletingRecord?.title ?? '')}
              >Delete</Button>
            </div>
          </div>
        }
      >
        <div style={{ marginBottom: 12 }}>
          Type the campaign name to confirm deletion: <span style={{ fontWeight: 700 }}>{deletingRecord?.title}</span>
        </div>

        <Input placeholder="Type campaign name exactly" value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)} />
      </Modal>
    </>
  );
};

export default CampaignTable;
