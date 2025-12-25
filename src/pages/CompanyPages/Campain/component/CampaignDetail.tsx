import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, Modal, Drawer, Tooltip, Space, Select, Form, InputNumber, message, Dropdown, Input } from 'antd';
import CampaignInfoCard from './CampaignInfoCard';
import CampaignJobsTable from './CampaignJobsTable';
import { APP_ROUTES } from '../../../../services/config';
import type { ColumnsType } from 'antd/es/table';
import { ArrowLeftOutlined, MinusCircleOutlined, DeleteOutlined, MoreOutlined, EyeOutlined } from '@ant-design/icons';
import { ClipboardList, Send } from 'lucide-react';
import reportService from '../../../../services/reportService';
import hiringTrackingService from '../../../../services/hiringTrackingService';
import { campaignService } from '../../../../services/campaignService';
import { jobService } from '../../../../services/jobService';
import JobViewDrawer from '../../JobManagement/components/JobViewDrawer';

const CampaignDetail: React.FC = () => {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const id = Number(campaignId);
    const [campaign, setCampaign] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [addJobModalOpen, setAddJobModalOpen] = useState(false);
    const [jobOptions, setJobOptions] = useState<Array<{ label: string; value: string }>>([]);
    const [addForm] = Form.useForm();
    const [jobLoading, setJobLoading] = useState(false);
    const [jobViewOpen, setJobViewOpen] = useState(false);
    const [jobToView, setJobToView] = useState<any | null>(null);
    const [confirmJobModalOpen, setConfirmJobModalOpen] = useState(false);
    const [deletingJob, setDeletingJob] = useState<any | null>(null);
    const [confirmJobInput, setConfirmJobInput] = useState('');
    const [deletingJobLoading, setDeletingJobLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const PAGE_SIZE = 10;
    const [tableHeight, setTableHeight] = useState<number>(
        typeof window !== 'undefined' ? Math.max(300, window.innerHeight - 420) : 600
    );
    const [apiError, setApiError] = useState<string | null>(null);
    const fieldKeyMap = useRef<Map<any, string>>(new Map());
    const fieldKeyCounter = useRef<number>(0);
    const iconStyle = { color: "var(--light)", fontWeight: "bold" };

    // Load campaign detail from API
    const loadCampaign = async () => {
        setLoading(true);
        try {
            setApiError(null);
            const response = await campaignService.getCampaignById(id);
            console.log("Campaign response:", response);

            // Support ApiResponse<T> (wrapper) or legacy raw campaign object
            let campaignData: any = null;
            const payload = response && (response as any).data ? (response as any).data : response;
            if (payload && (payload as any).campaignId) {
                campaignData = payload;
            }

            if (campaignData) {
                // Normalize jobs: support campaignData.jobIds (array of ids)
                // or campaignData.jobs (array of ids or objects { jobId, targetQuantity }).
                const rawJobs = Array.isArray(campaignData.jobs)
                    ? campaignData.jobs
                    : Array.isArray(campaignData.jobIds)
                        ? campaignData.jobIds
                        : [];

                if (rawJobs.length) {
                    try {
                        // collect ids
                        const ids = rawJobs
                            .map((it: any) => (typeof it === 'number' ? it : Number(it?.jobId)))
                            .filter((n: any) => Number.isFinite(n) && !isNaN(n));

                        const results = await Promise.all(
                            ids.map((jid: number) => jobService.getJobById(jid).then(r => r?.data || null).catch(() => null))
                        );
                        const detailsById = new Map<number, any>();
                        results.filter(Boolean).forEach((d: any) => {
                            if (d && d.jobId !== undefined) detailsById.set(Number(d.jobId), d);
                        });

                        // merge raw job entries with fetched details
                        const merged = rawJobs.map((it: any) => {
                            const jobId = typeof it === 'number' ? it : Number(it?.jobId);
                            const detail = detailsById.get(jobId) || {};
                            const title = detail.title || detail.jobTitle || String(jobId);
                            const target = (it && typeof it === 'object' && (it.targetQuantity || it.target))
                                ? Number(it.targetQuantity ?? it.target)
                                : Number(detail.target ?? detail.targetQuantity ?? 0);
                            const filled = Number(detail.filled ?? 0);
                            const level = detail.levelName || (detail.level && (detail.level.name || detail.level.levelId)) || detail.levelId || undefined;
                            return {
                                ...detail,
                                jobId,
                                title,
                                target,
                                filled,
                                level,
                            };
                        });
                        // Fetch hired counts per job and override 'filled' with actual hired resume counts
                        try {
                            const counts = await Promise.all(merged.map(async (j: any) => {
                                const jid = Number(j.jobId);
                                if (!Number.isFinite(jid)) return 0;
                                try {
                                    const resp = await hiringTrackingService.getByJob(campaignData.campaignId, jid, { page: 1, pageSize: 1000 });
                                    const payload = resp && (resp as any).data ? (resp as any).data : resp;
                                    const list = hiringTrackingService._normalizeList(payload);
                                    const hired = (list || []).filter((r: any) => {
                                        const statusKey = String(r?.applicationStatus ?? r?.status ?? r?.stage ?? '')
                                            .trim()
                                            .toLowerCase()
                                            .replace(/[\s_-]+/g, '');
                                        return statusKey === 'hired';
                                    }).length;
                                    return hired;
                                } catch (err) {
                                    console.error('Failed to fetch resumes for job', jid, err);
                                    return Number(j.filled ?? 0) || 0;
                                }
                            }));

                            // Apply counts back to merged entries
                            merged.forEach((m: any, idx: number) => {
                                m.filled = counts[idx] ?? Number(m.filled ?? 0);
                            });
                        } catch (err) {
                            console.error('Failed to compute hired counts for campaign jobs', err);
                        }

                        campaignData.jobs = merged;
                    } catch (err) {
                        console.error('Failed to load jobs for campaign', err);
                        campaignData.jobs = [];
                    }
                } else {
                    campaignData.jobs = [];
                }

                setCampaign(campaignData);
            } else {
                const msg = response?.message || response?.data?.message || 'Failed to fetch campaign - invalid data structure';
                console.error(msg);
                setApiError(msg);
            }
        } catch (error) {
            console.error("Error loading campaign:", error);
            setApiError((error as any)?.message || 'Error loading campaign');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCampaign();
    }, [id]);

    useEffect(() => {
        const handleResize = () => {
            if (typeof window === 'undefined') return;
            setTableHeight(Math.max(300, window.innerHeight - 420));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatDateTime = (s?: string) => {
        if (!s) return "";
        try {
            // support strings like "2025-12-09 17:00:00" by converting to ISO
            const iso = s.includes('T') ? s : s.replace(' ', 'T');
            const d = new Date(iso);
            if (isNaN(d.getTime())) return s;
            const datePart = d.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            const timePart = d.toLocaleTimeString('vi-VN', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            return `${datePart} ${timePart}`;
        } catch (err) {
            return s;
        }
    };

    // Load jobs for add modal
    const loadAllJobs = async () => {
        setJobLoading(true);
        try {
            const resp = await jobService.getCompanyJobs(1, 1000);
            const list = resp?.data?.jobs || [];
            const opts = (list || []).map((j: any) => ({ label: j.title || String(j.jobId), value: String(j.jobId) }));
            setJobOptions(opts);
        } catch (err) {
            console.error('Failed to load jobs list', err);
            setJobOptions([]);
        } finally {
            setJobLoading(false);
        }
    };

    const openResumes = (job: any, campaignIdParam?: number) => {
        if (!job) return;
        const jid = Number(job.jobId ?? job.jobId);
        const cid = campaignIdParam ?? id;
        // Navigate to the resume list route for that job
        const routeTemplate = APP_ROUTES.COMPANY_AI_SCREENING_RESUMES || '/company/ai-screening/:campaignId/:jobId/resumes';
        const route = routeTemplate.replace(':campaignId', String(cid)).replace(':jobId', String(jid));
        navigate(route);
    };

    // Open hiring tracking page for this job (navigate to HIRING_TRACKING route)
    const openTracking = (job: any, campaignIdParam?: number) => {
        if (!job) return;
        const jid = Number(job.jobId ?? job.jobId);
        const cid = campaignIdParam ?? id;
        const routeTemplate = APP_ROUTES.HIRING_TRACKING || '/company/campaign/:campaignId/:jobId/hiring-tracking';
        const route = routeTemplate.replace(':campaignId', String(cid)).replace(':jobId', String(jid));
        navigate(route);
    };

    const openJobView = (job: any) => {
        if (!job) return;
        setJobToView(job);
        setJobViewOpen(true);
    };

    const openAddJobModal = async () => {
        await loadAllJobs();
        addForm.resetFields();
        setAddJobModalOpen(true);
    };

    const handleAddJobs = async () => {
    if (!campaign) return;

    try {
        setApiError(null);

        const values = await addForm.validateFields();
        const entries = Array.isArray(values.jobs) ? values.jobs : [];

        const jobsPayload = entries
            .map((j: any) => ({
                jobId: Number(j.jobId),
                targetQuantity: Number(j.targetQuantity),
            }))
            .filter(
                (it: any) =>
                    Number.isFinite(it.jobId) &&
                    Number.isFinite(it.targetQuantity) &&
                    it.targetQuantity >= 1
            );

        if (!jobsPayload.length) return;

        const resp = await campaignService.addJobsToCampaign(
            campaign.campaignId,
            jobsPayload
        );

        console.log('RAW addJobsToCampaign resp:', resp);

        /**
         * Normalize response safely
         * Support:
         * - { status, message, data }
         * - { data: { status, message, data } }
         * - 204 No Content
         */
        const status =
            resp?.status ??
            resp?.data?.status ??
            'Success';

        const backendMessage =
            resp?.message ??
            resp?.data?.message ??
            'Successfully added job(s) to campaign';

        if (status === 'Success') {
            message.success(backendMessage);
            setAddJobModalOpen(false);
            await loadCampaign();
        } else {
            throw new Error(backendMessage || 'Add jobs failed');
        }
    } catch (err) {
        const msg =
            (err as any)?.message ||
            'Add jobs error';

        console.error('Add jobs error:', err);
        setApiError(msg);
        message.error(msg);
    }
};

    const onDelete = async (job: any) => {
        if (!campaign) return;
        try {
            setLoading(true);
            const jobId = Number(job?.jobId ?? job?.jobId);
            if (!Number.isFinite(jobId)) {
                message.error('Invalid job id');
                return;
            }

            const resp = await campaignService.removeJobsFromCampaign(campaign.campaignId, [jobId]);
            // Normalize backend message
            const backendMessage =
                resp?.message ?? (resp as any)?.data?.message ?? 'Delete failed';
            const ok = !!resp && ((resp as any).status === 'Success' || (resp as any).data != null);
            if (ok) {
                message.success(backendMessage);
                await loadCampaign();
            } else {
                console.error('Remove job failed', resp);
                // Show API-provided message when available
                message.error(backendMessage);
                setApiError(backendMessage);
            }
        } catch (err) {
            console.error('Delete job error', err);
            message.error('Delete failed');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<any> = [
        {
            title: 'No',
            align: 'center',
            width: "7%",
            render: (_: any, __: any, index: number) =>
                (currentPage - 1) * PAGE_SIZE + index + 1,
        }
        ,
        { title: 'Job Title', align: 'center',width: "40%", dataIndex: 'title', key: 'title' },
        {
            title: 'Tracking', key: 'tracking', width: "10%", align: 'center', render: (_: any, r: any) => (
                <Tooltip title="View Tracking">
                    <Button type="text" size="small" style={{ color: 'var(--color-primary-light)' }} icon={<Send size={16} style={iconStyle} />} onClick={() => openTracking(r)} />
                </Tooltip>
            )
        },
        { title: 'Target', dataIndex: 'target', key: 'target', width: "7%", align: 'center' },
        { title: 'Hired', dataIndex: 'filled', key: 'filled', width: "7%", align: 'center' },
        { title: 'Remaining', key: 'remaining', width: "9%", align: 'center', render: (_: any, r: any) => Math.max(0, (r.target || 0) - (r.filled || 0)) },
        {
            title: 'Resumes', key: 'resumes', width: "10%", align: 'center', render: (_: any, r: any) => (
                <Tooltip title="List resumes">
                    <Button type="text" size="small" style={{ color: 'var(--color-primary-light)' }} icon={<ClipboardList size={16} style={iconStyle} />} onClick={() => openResumes(r, id)} />
                </Tooltip>
            )
        },
        {
            title: 'Action', dataIndex: 'action', key: 'action', width: "12%", align: 'center', render: (_: any, r: any) => (
                <Space>
                    <Tooltip title="View job details">
                        <Button type="text" icon={<EyeOutlined style={iconStyle} />} size="small" onClick={() => openJobView(r)} />
                    </Tooltip>
                    
                    <Tooltip title="Delete job in campaign">
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => {
                                setDeletingJob(r);
                                setConfirmJobInput('');
                                setConfirmJobModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Dropdown
                        menu={{
                            items: [
                                { key: 'excel', label: 'Export Excel' },
                                { key: 'pdf', label: 'Export PDF' },
                            ],
                            onClick: async ({ key }) => {
                                try {
                                    const jid = Number(r?.jobId ?? r?.jobId);
                                    if (!Number.isFinite(jid)) {
                                        message.error('Invalid job id for export');
                                        return;
                                    }
                                    const cid = id; // campaign id from component scope
                                    let resp: any;
                                    if (key === 'excel') {
                                        resp = await reportService.exportJobExcel(cid, jid);
                                    } else {
                                        resp = await reportService.exportJobPdf(cid, jid);
                                    }
                                    if (!resp || resp.ok !== true) {
                                        const msg = resp?.message || 'Export failed';
                                        message.error(msg);
                                        console.error('Export failed', resp);
                                        return;
                                    }

                                    const blob: Blob = resp.blob;
                                    const ext = key === 'excel' ? 'xlsx' : 'pdf';
                                    const sanitize = (s?: string) =>
                                        (s || '')
                                            .replace(/[\\/:*?"<>|]/g, '')
                                            .replace(/\s+/g, ' ')
                                            .trim()
                                            .slice(0, 100);
                                    const jobName = sanitize(r?.title ?? r?.jobTitle ?? `Job ${jid}`);
                                    const campaignName = sanitize(campaign?.title ?? `Campaign ${id}`);
                                    const filename = `Job report ${campaignName} - ${jobName}.${ext}`;
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = filename;
                                    document.body.appendChild(a);
                                    a.click();
                                    a.remove();
                                    window.URL.revokeObjectURL(url);
                                } catch (err) {
                                    console.error('Export failed', err);
                                    message.error('Export failed');
                                }
                            },
                        }}
                        placement="bottom"
                    >
                        <Button type="text" icon={<MoreOutlined />} size="small" />
                    </Dropdown>
                </Space>

            )
        },
    ];

    if (loading) {
        return (
            <Card style={{ maxWidth: 1200, margin: '12px auto', textAlign: 'center', padding: 50 }}>
                <Spin />
            </Card>
        );
    }

    if (!campaign) {
        return (
            <Card style={{ maxWidth: 1000, margin: '12px auto' }}>
                <h3>Campaign not found</h3>
                <p>The campaign id {campaignId} does not exist.</p>
                <Button onClick={() => navigate(-1)}>Go back</Button>
            </Card>
        );
    }

    const jobs = campaign?.jobs || [];
    const totalJobs = jobs.length;
    const pagedJobs = jobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const totalTarget = (jobs || []).reduce((s: number, j: any) => s + (Number(j?.target) || 0), 0);
    const totalHired = (jobs || []).reduce((s: number, j: any) => s + (Number(j?.filled) || 0), 0);
    const percent = totalTarget ? Math.round((totalHired / totalTarget) * 100) : 0;

    return (
        <Card
            title={
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 12 }}>
                    <Button
                        className="company-btn"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/company/campaign')}
                    />
                    <div style={{ flex: 1 }}>
                        <span className="font-semibold">{campaign.title}</span>
                    </div>
                    <div style={{ flex: '0 0 auto' }}>
                        <Button className="company-btn--filled" onClick={openAddJobModal}>Add Job</Button>
                    </div>
                </div>
            }
            style={{ maxWidth: 1200, margin: '12px auto', borderRadius: 12, height: 'calc(100% - 25px)' }}
        >
            <CampaignInfoCard campaign={campaign} percent={percent} totalTarget={totalTarget} totalHired={totalHired} formatDateTime={formatDateTime} apiError={apiError} />

            <CampaignJobsTable
                dataSource={pagedJobs}
                columns={columns}
                rowKey="jobId"
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={totalJobs}
                tableHeight={tableHeight}
                onChange={(page: number) => setCurrentPage(page)}
            />
            <JobViewDrawer
                open={jobViewOpen}
                onClose={() => { setJobViewOpen(false); setJobToView(null); }}
                job={jobToView}
            />
            <Drawer
                title="Add jobs to campaign"
                open={addJobModalOpen}
                onClose={() => setAddJobModalOpen(false)}
                placement="right"
                width={560}
            >
                <div style={{ marginBottom: 8 }}>Select jobs to add to this campaign and specify target quantity for each:</div>
                <Form form={addForm} layout="vertical">
                    <Form.List name="jobs" initialValue={[]}>
                        {(fields, { add, remove }) => {
                            return (
                                <div>
                                    {fields.map((field) => {
                                        let uniqueKey = fieldKeyMap.current.get(field.key);
                                        if (!uniqueKey) {
                                            uniqueKey = `${field.key}-${field.name}-${fieldKeyCounter.current++}`;
                                            fieldKeyMap.current.set(field.key, uniqueKey);
                                        }
                                        return (
                                            <div key={uniqueKey} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, minWidth: 0  }}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'jobId']}
                                                    rules={[{ required: true, message: 'Please select a job' }]}
                                                    style={{ flex: 1, marginBottom: 0, minWidth: 0  }}
                                                >
                                                    <Select
                                                        placeholder={jobLoading ? 'Loading jobs...' : 'Select job'}
                                                        options={jobOptions}
                                                        loading={jobLoading}
                                                        showSearch
                                                        optionFilterProp="label"
                                                        className="company-select"
                                                        style={{ minWidth: 0 }}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    name={[field.name, 'targetQuantity']}
                                                    rules={[{ required: true, message: 'Please input target quantity' }]}
                                                    style={{ width: 140, marginBottom: 0 }}
                                                >
                                                    <InputNumber
                                                        className="company-input-number"
                                                        min={1}
                                                        style={{ width: '100%' }}
                                                        placeholder="Target quantity"
                                                    />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: 'red', cursor: 'pointer', fontSize: 18 }} />
                                            </div>
                                        );
                                    })}

                                    <Button className="company-btn" onClick={() => add({ jobId: undefined, targetQuantity: undefined })} style={{ width: '100%' }}>
                                        More jobs
                                    </Button>
                                </div>
                            );
                        }}
                    </Form.List>
                </Form>

                <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', padding: 16, borderTop: '1px solid rgba(0,0,0,0.06)', background: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                    <Button className="company-btn" onClick={() => setAddJobModalOpen(false)}>Cancel</Button>
                    <Button className="company-btn--filled" onClick={handleAddJobs} loading={jobLoading}>Add Jobs</Button>
                </div>
            </Drawer>

            <Modal
                title="Delete job from campaign"
                open={confirmJobModalOpen}
                onCancel={() => { setConfirmJobModalOpen(false); setDeletingJob(null); setConfirmJobInput(''); }}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                            <Button className="company-btn" onClick={() => { setConfirmJobModalOpen(false); setDeletingJob(null); setConfirmJobInput(''); }}>Cancel</Button>
                        </div>
                        <div>
                            <Button
                                danger
                                loading={deletingJobLoading}
                                onClick={async () => {
                                    if (!deletingJob) return;
                                    if (confirmJobInput !== (deletingJob.title ?? deletingJob.jobTitle ?? '')) return;
                                    try {
                                        setDeletingJobLoading(true);
                                        await onDelete(deletingJob);
                                        setConfirmJobModalOpen(false);
                                        setDeletingJob(null);
                                        setConfirmJobInput('');
                                    } catch (err) {
                                        console.error('Delete job failed', err);
                                        message.error('Delete job failed');
                                    } finally {
                                        setDeletingJobLoading(false);
                                    }
                                }}
                                disabled={confirmJobInput !== (deletingJob?.title ?? deletingJob?.jobTitle ?? '')}
                            >Delete</Button>
                        </div>
                    </div>
                }
            >
                <div style={{ marginBottom: 12 }}>
                    Type the job title to confirm deletion: <span style={{ fontWeight: 700 }}>{deletingJob?.title ?? deletingJob?.jobTitle}</span>
                </div>
                <Input placeholder="Type job title exactly" value={confirmJobInput} onChange={(e) => setConfirmJobInput(e.target.value)} />
            </Modal>

        </Card>
    );
};

export default CampaignDetail;
