import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Progress, Button, Spin, Modal, Tooltip, Space, Select, Form, InputNumber, Tag, message, Popconfirm } from 'antd';
import { APP_ROUTES } from '../../../../services/config';
import type { ColumnsType } from 'antd/es/table';
import { ArrowLeftOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { campaignService } from '../../../../services/campaignService';
import { jobService } from '../../../../services/jobService';
import { EyeOutlined } from '@ant-design/icons';
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

    // Load campaign detail from API
    const loadCampaign = async () => {
        setLoading(true);
        try {
            const response = await campaignService.getCampaignById(id);
            console.log("Campaign response:", response);

            // Handle both direct campaign object and wrapped response
            let campaignData = null;
            if (response?.data?.campaignId) {
                campaignData = response.data;
            } else if (response?.campaignId) {
                campaignData = response;
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
                console.error("Failed to fetch campaign - invalid data structure");
            }
        } catch (error) {
            console.error("Error loading campaign:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCampaign();
    }, [id]);

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
            const values = await addForm.validateFields();
            const entries = Array.isArray(values.jobs) ? values.jobs : [];
            const jobsPayload = entries
                .map((j: any) => ({ jobId: Number(j.jobId), targetQuantity: Number(j.targetQuantity) }))
                .filter((it: any) => Number.isFinite(it.jobId) && Number.isFinite(it.targetQuantity) && Number(it.targetQuantity) >= 1);
            if (!jobsPayload.length) return;
            const resp = await campaignService.addJobsToCampaign(campaign.campaignId, jobsPayload);
            const ok = resp?.status === 'Success' || resp?.statusCode === 200 || resp?.message;
            if (ok) {
                await loadCampaign();
                setAddJobModalOpen(false);
            } else {
                console.error('Add jobs failed', resp);
            }
        } catch (err) {
            console.error('Add jobs error', err);
        }
    };

    // Remove a job from the current campaign
    const onDelete = async (job: any) => {
        if (!campaign) return;
        try {
            setLoading(true);
            const jobId = Number(job?.jobId ?? job?.jobId);
            if (!Number.isFinite(jobId)) {
                message.error('Invalid job id');
                return;
            }

            // call service to remove job(s) from campaign. API expects an array of jobIds (number[]).
            const resp = await campaignService.removeJobsFromCampaign(campaign.campaignId, [jobId]);
            const ok = resp?.status === 'Success' || resp?.statusCode === 200 || resp?.message;
            if (ok) {
                message.success('Job removed from campaign');
                await loadCampaign();
            } else {
                console.error('Remove job failed', resp);
                message.error('Delete failed');
            }
        } catch (err) {
            console.error('Delete job error', err);
            message.error('Delete failed');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<any> = [
        { title: 'No', key: 'no', align: 'center', width: 60, render: (_: any, __: any, idx: number) => idx + 1 },
        { title: 'Job Title', align: 'center', dataIndex: 'title', key: 'title' },
        { title: 'Target', dataIndex: 'target', key: 'target', width: 100, align: 'center' },
        { title: 'Filled', dataIndex: 'filled', key: 'filled', width: 100, align: 'center' },
        { title: 'Remaining', key: 'remaining', width: 120, align: 'center', render: (_: any, r: any) => Math.max(0, (r.target || 0) - (r.filled || 0)) },
        {
            title: 'Resumes', key: 'resumes', width: 120, align: 'center', render: (_: any, r: any) => (
                    <Button type="text" className="company-btn" size="small" onClick={() => openResumes(r, id)}>List Resumes</Button>
                )
        },
        {
            title: 'Action', dataIndex: 'action', key: 'action', width: 140, align: 'center', render: (_: any, r: any) => (
                <Space>
                    <Tooltip title="View job details">
                        <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => openJobView(r)} />
                    </Tooltip>
                    <Tooltip title="Delete job in campaign">
                        <Popconfirm
                            title="Delete this job in campaign?"
                            onConfirm={async () => {
                                try {
                                    await onDelete(r);
                                } catch (err) {
                                    message.error('Delete failed');
                                }
                            }}
                            okText="Delete"
                            cancelText="Cancel"
                        >
                            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
                        </Popconfirm>
                    </Tooltip>
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
            <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 12, textAlign: 'center' }}>
                    <p style={{ margin: 0 }}>{campaign.description}</p>
                </div>

                <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Tag color="blue" style={{ padding: '4px' }}>
                            <strong style={{ marginRight: 6 }}>Target:</strong> {totalTarget}
                        </Tag>

                        <Tag color="green" style={{ padding: '4px' }}>
                            <strong style={{ marginRight: 6 }}>Hired:</strong> {totalHired}
                        </Tag>

                        <Tag color={campaign?.status === 'Published' ? 'success' : campaign?.status === 'Expired' ? 'error' : 'default'} style={{ padding: '4px' }}>
                            {campaign.status}
                        </Tag>

                        <Tag style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
                            <div style={{ minWidth: 220, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                <strong style={{ whiteSpace: 'nowrap' }}>Progress</strong>
                                <div style={{ flex: 1 }}>
                                    <Progress
                                        percent={percent}
                                        size="small"
                                        strokeColor={percent === 100 ? '#52c41a' : '#ff4d4f'}
                                        trailColor={percent === 0 ? '#b9b9b9ff' : undefined}
                                    />
                                </div>
                            </div>
                        </Tag>
                    </div>
                </div>
            </div>

            <Table
                dataSource={jobs}
                columns={columns}
                rowKey="jobId"
                pagination={false}
                size="middle"
            />
            <JobViewDrawer
                open={jobViewOpen}
                onClose={() => { setJobViewOpen(false); setJobToView(null); }}
                job={jobToView}
            />
            <Modal
                open={addJobModalOpen}
                title="Add jobs to campaign"
                onCancel={() => setAddJobModalOpen(false)}
                onOk={handleAddJobs}
                okText="Add Jobs"
                confirmLoading={jobLoading}
            >
                <div style={{ marginBottom: 8 }}>Select jobs to add to this campaign and specify target quantity for each:</div>
                <Form form={addForm} layout="vertical">
                    <Form.List name="jobs" initialValue={[]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field) => (
                                    <div key={field.key} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'jobId']}
                                            rules={[{ required: true, message: 'Please select a job' }]}
                                            style={{ flex: 1, marginBottom: 0 }}
                                        >
                                            <Select
                                                placeholder={jobLoading ? 'Loading jobs...' : 'Select job'}
                                                options={jobOptions}
                                                loading={jobLoading}
                                                showSearch
                                                optionFilterProp="label"
                                                className="company-select"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'targetQuantity']}
                                            rules={[{ required: true, message: 'Please input target quantity' }]}
                                            style={{ width: 140, marginBottom: 0 }}
                                        >
                                            <InputNumber
                                                min={1}
                                                style={{ width: '100%' }}
                                                placeholder="Target quantity"
                                            />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: 'red', cursor: 'pointer', fontSize: 18 }} />
                                    </div>
                                ))}

                                <Button className="company-btn" onClick={() => add({ jobId: undefined, targetQuantity: undefined })} style={{ width: '100%' }}>
                                    More jobs
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>

        </Card>
    );
};

export default CampaignDetail;
