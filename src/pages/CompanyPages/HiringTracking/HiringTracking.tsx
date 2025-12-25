import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Button, Spin, message, Input, Tag, Dropdown, Modal, Tooltip } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, InfoCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { RefreshCw } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import hiringTrackingService from '../../../services/hiringTrackingService';
import resumeService from '../../../services/resumeService';
import { jobService } from '../../../services/jobService';
import { campaignService } from '../../../services/campaignService';
import JobSummary from './components/JobSummary';

type Row = {
  key: number;
  resumeId: number;
  applicationId?: number;
  fullName: string;
  status: string;
  appliedAt?: string | null;
  email?: string | null;
  phone?: string | null;
  note?: string | null;
  totalScore?: number | null;
  adjustedScore?: number | null;
  totalResumeScore?: number | null;
};

const HiringTracking: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ campaignId?: string; jobId?: string }>();
  const location = useLocation();
  const campaignId = params.campaignId ? Number(params.campaignId) : undefined;
  // jobId can come from route param or query param 'jobId'
  const search = new URLSearchParams(location.search);
  const jobIdFromQuery = search.get('jobId');
  const jobId = params.jobId ? Number(params.jobId) : jobIdFromQuery ? Number(jobIdFromQuery) : undefined;

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionModalNote, setActionModalNote] = useState<string>("");
  const [actionModalPayload, setActionModalPayload] = useState<{ appId: number; newStatus: string; rowKey: number } | null>(null);
  const [jobTarget, setJobTarget] = useState<number | null>(null);
  const [jobHiredCount, setJobHiredCount] = useState<number | null>(null);
  const remaining = jobTarget != null ? (jobTarget - (jobHiredCount ?? 0)) : null;

  // Robust extractor for job target from various API response shapes
  const extractTargetFromJobPayload = (payload: any): number | null => {
    if (!payload) return null;
    const maybe = (o: any, keys: string[]) => {
      for (const k of keys) {
        const v = o?.[k];
        if (v !== undefined && v !== null) return v;
      }
      return undefined;
    };

    // common places + alternate names
    let t = maybe(payload, ['target', 'targetQuantity', 'targetQty', 'target_total', 'hiringTarget', 'vacancies', 'positions', 'quantity']);
    // wrapped shapes or nested job object
    if (t === undefined) t = maybe(payload?.data ?? payload?.job ?? payload?.payload ?? {}, ['target', 'targetQuantity', 'targetQty', 'target_total']);

    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  };

  useEffect(() => {
    // Load resumes and also job target/hired count when component mounts or campaign/job changes
    setJobTarget(null);
    setJobHiredCount(null);
    const load = async () => {
      if (!campaignId || !jobId) return;
      setLoading(true);
      try {
        const resp = await hiringTrackingService.fetchResumesScored(campaignId, jobId);
        if (!resp.ok) {
          message.error(resp.message || 'Failed to load resumes');
          setRows([]);
          return;
        }

        const data = (resp.data || []) as any[];

        const mapped = data.map((r: any) => ({
          key: Number(r.resumeId ?? r.applicationId ?? 0),
          resumeId: Number(r.resumeId ?? r.applicationId ?? 0),
          applicationId: Number(r.applicationId ?? r.resumeId ?? 0),
          fullName: r.fullName,
          status: r.status || r.applicationStatus || r.stage,
          appliedAt: r.appliedAt ?? r.createdAt ?? r.submittedAt ?? null,
          email: r.email ?? null,
          phone: r.phone ?? r.phoneNumber ?? null,
          note: r.note ?? null,
          totalScore: r.totalScore ?? null,
          adjustedScore: r.adjustedScore ?? null,
          totalResumeScore: r.totalResumeScore ?? (r.totalScore ?? r.adjustedScore ?? null),
        } as Row));

        setRows(mapped);
      } catch (err) {
        console.error('HiringTracking load error', err);
        message.error('Failed to load tracking data');
      } finally {
        setLoading(false);
      }
    };

    load();
    // also prefetch job target and hired count once
    const loadJobData = async () => {
      if (!campaignId || !jobId) return;
      try {
        // try campaign mapping first
        let target: number | null = null;
        try {
          const campResp = await campaignService.getCampaignById(campaignId);
          const campPayload = campResp && (campResp as any).data ? (campResp as any).data : campResp;
          const jobsArr = Array.isArray(campPayload?.jobs) ? campPayload.jobs : Array.isArray(campPayload?.jobIds) ? campPayload.jobIds : [];
          const entry = (jobsArr || []).find((j: any) => Number(j?.jobId ?? j) === Number(jobId));
          if (entry) {
            const t = Number(entry?.targetQuantity ?? entry?.target ?? entry?.targetQty ?? null);
            if (Number.isFinite(t)) target = t;
          }
        } catch (err) {
          // ignore
        }

        if (target == null) {
          try {
            const jobResp = await jobService.getJobById(jobId);
            const jobPayload = jobResp && (jobResp as any).data ? (jobResp as any).data : jobResp;
            target = extractTargetFromJobPayload(jobPayload);
          } catch (err) {
            // ignore
          }
        }

        // fetch hired count
        let hired: number | null = null;
        try {
          const listResp = await hiringTrackingService.getByJob(campaignId, jobId, { page: 1, pageSize: 1000 });
          const payload = listResp && (listResp as any).data ? (listResp as any).data : listResp;
          const list = hiringTrackingService._normalizeList(payload);
          hired = (list || []).filter((r: any) => {
            const statusKey = String(r?.applicationStatus ?? r?.status ?? r?.stage ?? '')
              .trim()
              .toLowerCase()
              .replace(/[\s_-]+/g, '');
            return statusKey === 'hired';
          }).length;
        } catch (err) {
          // ignore
        }

        setJobTarget(target);
        setJobHiredCount(hired);
      } catch (err) {
        console.error('loadJobData error', err);
      }
    };

    loadJobData();
  }, [campaignId, jobId]);

  const columns = useMemo(() => [
    { title: 'No', key: 'no', width: "5%", align: 'center' as const, render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1 },
    { title: 'Candidate', width: "25%", align: 'center' as const, dataIndex: 'fullName', key: 'fullName' },
    { title: 'Score', key: 'score', width: "10%", align: 'center' as const, render: (_: any, r: Row) => {
      const screening = r.totalScore ?? r.totalResumeScore ?? null;
      const adjusted = r.adjustedScore ?? null;
      const colorFor = (n: number | null) => n == null ? 'default' : (n >= 70 ? 'green' : n >= 40 ? 'orange' : 'red');

      if (screening != null && adjusted != null) {
        return (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Tooltip title="Screening score">
                <Tag color={colorFor(screening)}>{screening}</Tag>
              </Tooltip>
            </div>
            <div style={{ fontSize: 14, color: '#999' }}>- </div>
            <div style={{ textAlign: 'center' }}>
              <Tooltip title="Adjusted score">
                <Tag color={colorFor(adjusted)}>{adjusted}</Tag>
              </Tooltip>
            </div>
          </div>
        );
      }

      if (screening != null) return (
        <Tooltip title="Screening score">
          <Tag color={colorFor(screening)}>{screening}</Tag>
        </Tooltip>
      );
      if (adjusted != null) return (
        <Tooltip title="Adjusted score">
          <Tag color={colorFor(adjusted)}>{adjusted}</Tag>
        </Tooltip>
      );
      return <span>—</span>;
    } },
    { title: 'Status', width: "13%", align: 'center' as const, dataIndex: 'status', key: 'status', render: (s: string) => {
      const st = (s || '').toLowerCase();
      let color: string = 'default';
      if (st.includes('review')) color = 'blue';
      else if (st.includes('shortlist')) color = 'cyan';
      else if (st.includes('interview')) color = 'purple';
      else if (st.includes('hired')) color = 'green';
      else if (st.includes('reject') || st.includes('fail')) color = 'red';
      else if (st.includes('pending')) color = 'gold';
      return <Tag color={color}>{s}</Tag>;
    } },
    { title: 'Note', width: "37%", align: 'center' as const, dataIndex: 'note', key: 'note' },
    {
      title: 'Update',
      key: 'update',
      width: '10%',
      align: 'center' as const,
      render: (_: any, r: Row) => {
        const appId = Number(r.applicationId ?? r.resumeId);
        // Build menu items and disable options that would move backwards.
        const FLOW = ['Reviewed', 'Shortlisted', 'Interview', 'Hired'];
        const currentKey = String(r.status || '').trim();
        const currentNormalized = currentKey;
        const currentIndex = FLOW.indexOf(currentNormalized as any);

        const baseItems = ['Reviewed', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];
        const terminal = ['Rejected', 'Hired'];
        const isTerminalNow = terminal.includes(currentNormalized);

        const allowed = new Set<string>();
        if (!isTerminalNow) {
          // If not yet in the FLOW, allow moving to the first stage ('Reviewed')
          if (currentIndex === -1) {
            allowed.add(FLOW[0]);
          } else if (currentIndex >= 0 && currentIndex < FLOW.length - 1) {
            // Allow only the immediate next stage
            allowed.add(FLOW[currentIndex + 1]);
            // If currently at 'Interview' (index 2), also allow terminal options 'Rejected' and 'Hired'
            const interviewIndex = FLOW.indexOf('Interview');
            if (currentIndex === interviewIndex) {
              allowed.add('Rejected');
              allowed.add('Hired');
            }
          }
        }

        const items = baseItems.map((k) => ({ key: k, label: k, disabled: !allowed.has(k) }));

        const handleMenuClick = async ({ key }: { key: string }) => {
          // For Hired, ensure job data is loaded before opening modal and warn if hiring exceeds target
          try {
            let target: number | null = jobTarget;
            let hired: number | null = jobHiredCount;

            if (key === 'Hired' && campaignId && jobId) {
              // load job/campaign info if we don't have it yet
              if ((target == null) || (hired == null)) {
                try {
                  const campResp = await campaignService.getCampaignById(campaignId);
                  const campPayload = campResp && (campResp as any).data ? (campResp as any).data : campResp;
                  const jobsArr = Array.isArray(campPayload?.jobs) ? campPayload.jobs : Array.isArray(campPayload?.jobIds) ? campPayload.jobIds : [];
                  const entry = (jobsArr || []).find((j: any) => Number(j?.jobId ?? j) === Number(jobId));
                  if (entry) {
                    const t = Number(entry?.targetQuantity ?? entry?.target ?? entry?.targetQty ?? null);
                    if (Number.isFinite(t)) target = t;
                  }
                } catch (err) {
                  // ignore
                }

                if (target == null) {
                  try {
                    const jobResp = await jobService.getJobById(jobId);
                    const jobPayload = jobResp && (jobResp as any).data ? (jobResp as any).data : jobResp;
                    target = extractTargetFromJobPayload(jobPayload);
                  } catch (err) {
                    // ignore
                  }
                }

                try {
                  const listResp = await hiringTrackingService.getByJob(campaignId, jobId, { page: 1, pageSize: 1000 });
                  const payload = listResp && (listResp as any).data ? (listResp as any).data : listResp;
                  const list = hiringTrackingService._normalizeList(payload);
                  const hiredCount = (list || []).filter((r: any) => {
                    const statusKey = String(r?.applicationStatus ?? r?.status ?? r?.stage ?? '')
                      .trim()
                      .toLowerCase()
                      .replace(/[\s_-]+/g, '');
                    return statusKey === 'hired';
                  }).length;
                  hired = hiredCount;
                } catch (err) {
                  // ignore
                }

                // persist fetched values for UI
                if (target != null) setJobTarget(target);
                if (hired != null) setJobHiredCount(hired);
              }

              // if target is known and hiring one more would exceed target, require explicit increase
              const wouldExceed = (typeof hired === 'number' && typeof target === 'number') ? (hired + 1 > target) : false;
              if (wouldExceed) {
                Modal.confirm({
                  title: 'You are exceeding the hiring target',
                  content: (
                    <div>
                      <p>Target: <strong>{target}</strong>, Hired: <strong>{hired}</strong>.</p>
                      <p>If you want to hire this candidate, confirm to increase the target by 1. After confirming, you will be asked to enter a note before the status is updated.</p>
                    </div>
                  ),
                  okText: 'Increase and continue',
                  cancelText: 'Cancel',
                  async onOk() {
                    try {
                      // attempt to increment target in campaign via patchCampaign
                      const newTarget = (Number(target) || 0) + 1;
                      try {
                        await campaignService.patchCampaign(campaignId, { jobs: [{ jobId: Number(jobId), targetQuantity: newTarget }] });
                        setJobTarget(newTarget);
                      } catch (patchErr) {
                        console.error('Failed to increase campaign target', patchErr);
                        message.error('Could not automatically increase target. Please try again.');
                        return;
                      }

                      // open the note modal to collect note and confirm status change
                      setActionModalPayload({ appId, newStatus: key, rowKey: appId });
                      setActionModalNote("");
                      setActionModalOpen(true);
                    } catch (err) {
                      console.error('Modal onOk error', err);
                    }
                  }
                });
                return; // do not open the normal note modal yet
              }
            }
          } catch (err) {
            console.error('handleMenuClick error', err);
          }

          // default: open modal to collect note & confirm
          setActionModalPayload({ appId, newStatus: key, rowKey: appId });
          setActionModalNote("");
          setActionModalOpen(true);
        };

        return (
          <div>
            <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottom">
              <Tooltip title="Change status" getPopupContainer={() => document.body} overlayStyle={{ zIndex: 12000 }}>
                <Button className="company-btn" size="small" icon={<RefreshCw size={14} />} />
              </Tooltip>
            </Dropdown>
          </div>
        );
      },
    },
  ], [currentPage, pageSize, campaignId, jobId]);

  // Modal confirm handler
  const handleActionConfirm = async () => {
    if (!actionModalPayload) return;
    const { appId, newStatus } = actionModalPayload;
    try {
      // If changing to Hired, check job target and current hired count to warn user
      const proceedUpdate = async () => {
        setLoading(true);
        const resp = await resumeService.updateApplicationStatus(appId, newStatus, actionModalNote.trim() || undefined);
        const ok = !!resp && ((resp as any).status === 'Success' || (resp as any).data != null);
        const respData = resp && (resp as any).data ? (resp as any).data : resp;
        if (ok) {
          message.success('Status updated');
          // adjust jobHiredCount if status changed to/from 'hired'
          try {
            const prevRow = rows.find(r => (r.applicationId === appId || r.resumeId === appId));
            const prevKey = String(prevRow?.status ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');
            const newKey = String(newStatus || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
            const prevIsHired = prevKey === 'hired';
            const newIsHired = newKey === 'hired';
            const delta = (newIsHired ? 1 : 0) - (prevIsHired ? 1 : 0);
            if (delta !== 0) {
              setJobHiredCount((c) => {
                const base = c == null ? 0 : c;
                const updated = base + delta;
                return updated < 0 ? 0 : updated;
              });
            }
          } catch (e) {
            // ignore
          }

          setRows(prev => prev.map(row => {
            if (row.applicationId === appId || row.resumeId === appId) {
              return {
                ...row,
                status: newStatus,
                note: (actionModalNote || respData?.note) ?? row.note,
                adjustedScore: respData?.adjustedScore ?? row.adjustedScore,
                totalScore: respData?.totalScore ?? row.totalScore,
                totalResumeScore: respData?.totalResumeScore ?? row.totalResumeScore,
              } as Row;
            }
            return row;
          }));
          setActionModalOpen(false);
          setActionModalPayload(null);
          setActionModalNote("");
        } else {
          message.error(resp?.message || 'Failed to update status');
        }
        setLoading(false);
      };

      if (newStatus === 'Hired' && campaignId && jobId) {
        try {
          // Use prefetched values when available (set when opening modal), otherwise fetch now
          let target = jobTarget;
          let hiredCount = jobHiredCount;

          if ((target == null && hiredCount == null) || target == null) {
            // Try campaign mapping first (may include targetQuantity)
            try {
              const campResp = await campaignService.getCampaignById(campaignId);
              const campPayload = campResp && (campResp as any).data ? (campResp as any).data : campResp;
              const jobsArr = Array.isArray(campPayload?.jobs) ? campPayload.jobs : Array.isArray(campPayload?.jobIds) ? campPayload.jobIds : [];
              const entry = (jobsArr || []).find((j: any) => Number(j?.jobId ?? j) === Number(jobId));
              if (entry) {
                const t = Number(entry?.targetQuantity ?? entry?.target ?? entry?.targetQty ?? null);
                if (Number.isFinite(t)) target = t;
              }
            } catch (err) {
              // ignore
            }

            if (target == null) {
              // fetch job to read target if we don't have it
              try {
                const jobResp = await jobService.getJobById(jobId);
                const jobPayload = jobResp && (jobResp as any).data ? (jobResp as any).data : jobResp;
                target = extractTargetFromJobPayload(jobPayload);
              } catch (err) {
                console.error('Failed to fetch job target', err);
                target = null;
              }
            }
          }
          if (hiredCount == null) {
            try {
              const listResp = await hiringTrackingService.getByJob(campaignId, jobId, { page: 1, pageSize: 1000 });
              const payload = listResp && (listResp as any).data ? (listResp as any).data : listResp;
              const list = hiringTrackingService._normalizeList(payload);
              hiredCount = (list || []).filter((r: any) => {
                const statusKey = String(r?.applicationStatus ?? r?.status ?? r?.stage ?? '')
                  .trim()
                  .toLowerCase()
                  .replace(/[\s_-]+/g, '');
                return statusKey === 'hired';
              }).length;
            } catch (err) {
              console.error('Failed to fetch hired count', err);
              hiredCount = null;
            }
          }

          if (target == null || Number.isNaN(target)) {
            // no target info — proceed directly
            await proceedUpdate();
            return;
          }

          if ((hiredCount ?? 0) + 1 > (target ?? 0)) {
            // previously warned user; now proceed directly without extra confirmation
            await proceedUpdate();
            return;
          }

          // safe to proceed
          await proceedUpdate();
          return;
        } catch (checkErr) {
          console.error('Error checking job target/hired count', checkErr);
          // fallback to proceed with update but inform user
          message.warning('Could not verify job target; attempting update');
        }
      }

      // default: directly update
      setLoading(true);
      try {
        const resp = await resumeService.updateApplicationStatus(appId, newStatus, actionModalNote.trim() || undefined);
        const ok = !!resp && ((resp as any).status === 'Success' || (resp as any).data != null);
        const respData = resp && (resp as any).data ? (resp as any).data : resp;
        if (ok) {
          message.success('Status updated');
          // adjust jobHiredCount if status changed to/from 'hired'
          try {
            const prevRow = rows.find(r => (r.applicationId === appId || r.resumeId === appId));
            const prevKey = String(prevRow?.status ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');
            const newKey = String(newStatus || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
            const prevIsHired = prevKey === 'hired';
            const newIsHired = newKey === 'hired';
            const delta = (newIsHired ? 1 : 0) - (prevIsHired ? 1 : 0);
            if (delta !== 0) {
              setJobHiredCount((c) => {
                const base = c == null ? 0 : c;
                const updated = base + delta;
                return updated < 0 ? 0 : updated;
              });
            }
          } catch (e) {
            // ignore
          }

          setRows(prev => prev.map(row => {
            if (row.applicationId === appId || row.resumeId === appId) {
              return {
                ...row,
                status: newStatus,
                note: (actionModalNote || respData?.note) ?? row.note,
                adjustedScore: respData?.adjustedScore ?? row.adjustedScore,
                totalScore: respData?.totalScore ?? row.totalScore,
                totalResumeScore: respData?.totalResumeScore ?? row.totalResumeScore,
              } as Row;
            }
            return row;
          }));
          setActionModalOpen(false);
          setActionModalPayload(null);
          setActionModalNote("");
        } else {
          message.error(resp?.message || 'Failed to update status');
        }
      } catch (err) {
        console.error('updateApplicationStatus error', err);
        message.error('Failed to update status');
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error('updateApplicationStatus error', err);
      message.error('Failed to update status');
      setLoading(false);
    }
  };

  const sortedRows = useMemo(() => {
    const scoreOf = (x: Row) => (x.adjustedScore ?? x.totalScore ?? x.totalResumeScore ?? -Infinity);
    return [...rows].sort((a, b) => (scoreOf(b) as number) - (scoreOf(a) as number));
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = (searchText || "").toLowerCase().trim();
    if (!q) return sortedRows;
    return sortedRows.filter(r => {
      const name = (r.fullName || "").toLowerCase();
      return name.includes(q);
    });
  }, [sortedRows, searchText]);

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Tooltip title="Go back">
                <Button className="company-btn" onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />} />
              </Tooltip>
            </div>
          <div style={{ flex: '0 0 auto' }}>
            <span className="font-semibold">Hiring Tracking</span>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 10 }}>
            <Input
              placeholder="Search candidate, email or phone..."
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 360 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      }
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        borderRadius: 12,
        height: 'calc(100% - 25px)',
      }}
    >
      
      {(campaignId && jobId) && (
        <JobSummary jobTarget={jobTarget} jobHiredCount={jobHiredCount} remaining={remaining} />
      )}

      <div style={{ marginTop: 16 }}>
          {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : (
          <Table<Row>
            columns={columns}
            dataSource={filteredRows}
            pagination={{ pageSize, current: currentPage, onChange: (p, s) => { setCurrentPage(p); setPageSize(s || pageSize); } }}
            scroll={{ y: '50vh' }}
          />
        )}
      </div>
      
      <Modal
        title={`Confirm status change`}
        open={actionModalOpen}
        onCancel={() => { setActionModalOpen(false); setActionModalPayload(null); setActionModalNote(""); }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, width: '100%' }}>
            <div>
              <Button
                className="company-btn"
                onClick={() => {
                  setActionModalOpen(false);
                  setActionModalPayload(null);
                  setActionModalNote("");
                }}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button
                className="company-btn--filled"
                type="primary"
                danger={actionModalPayload?.newStatus === 'Rejected'}
                loading={loading}
                onClick={async () => { await handleActionConfirm(); }}
              >
                Confirm
              </Button>
            </div>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ margin: 0, textAlign: 'center' }}>You're about to change status to <strong>{actionModalPayload?.newStatus}</strong>. This action cannot be undone.</p>
          {actionModalPayload?.newStatus === 'Hired' && (
            <div style={{ margin: 5, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
              <Tag icon={<InfoCircleOutlined />} color="blue">Job target: {jobTarget ?? 'Unknown'}</Tag>
              <Tag icon={<CheckCircleOutlined />} color="green">Hired: {jobHiredCount ?? 0}</Tag>
              <Tag icon={<ExclamationCircleOutlined />} color={remaining == null ? 'default' : remaining > 0 ? 'geekblue' : remaining === 0 ? 'green' : 'red'}>Remaining: {remaining != null ? remaining : 'N/A'}</Tag>
            </div>
          )}
        </div>
        <Input.TextArea rows={4} placeholder="Add a note (reason, comment)..." value={actionModalNote} onChange={(e) => setActionModalNote(e.target.value)} />
      </Modal>
    </Card>
  );
};

export default HiringTracking;

