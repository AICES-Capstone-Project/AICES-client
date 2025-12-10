import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Progress, Button, Spin, Modal, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { campaignService } from '../../../../services/campaignService';
import { jobService } from '../../../../services/jobService';

const CampaignDetail: React.FC = () => {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const id = Number(campaignId);
    const [campaign, setCampaign] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [addJobModalOpen, setAddJobModalOpen] = useState(false);
    const [jobOptions, setJobOptions] = useState<Array<{ label: string; value: string }>>([]);
    const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
    const [jobLoading, setJobLoading] = useState(false);

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
                // If API returns only jobIds, fetch job details and attach
                const jobIds = Array.isArray(campaignData.jobIds) ? campaignData.jobIds : [];
                if (jobIds.length) {
                    try {
                        const results = await Promise.all(
                            jobIds.map((jid: number) => jobService.getJobById(jid).then(r => r?.data || null).catch(() => null))
                        );
                        const jobs = results.filter(Boolean);
                        campaignData.jobs = jobs;
                    } catch (err) {
                        console.error('Failed to load jobs for campaign', err);
                        campaignData.jobs = [];
                    }
                } else {
                    campaignData.jobs = campaignData.jobs || [];
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

    const openResumes = (job: any) => {
        if (!job) return;
        navigate(`/company/campaign/${campaign?.campaignId}/job/${job.jobId}/resumes`);
    };

    const openAddJobModal = async () => {
        await loadAllJobs();
        setSelectedJobIds([]);
        setAddJobModalOpen(true);
    };

    const handleAddJobs = async () => {
        if (!campaign) return;
        const ids = selectedJobIds.map(s => Number(s)).filter(n => !isNaN(n));
        if (!ids.length) {
            return;
        }
        try {
            const resp = await campaignService.addJobsToCampaign(campaign.campaignId, ids);
            const ok = resp?.status === 'Success' || resp?.statusCode === 200 || resp?.message;
            if (ok) {
                // reload campaign detail
                await loadCampaign();
                setAddJobModalOpen(false);
            } else {
                console.error('Add jobs failed', resp);
            }
        } catch (err) {
            console.error('Add jobs error', err);
        }
    };

    const columns: ColumnsType<any> = [
        { title: 'No', key: 'no', width: 60, render: (_: any, __: any, idx: number) => idx + 1 },
        { title: 'Job Title', dataIndex: 'title', key: 'title' },
        { title: 'Spec', dataIndex: 'level', key: 'level', width: 120, align: 'center' },
        { title: 'Target', dataIndex: 'target', key: 'target', width: 100, align: 'center' },
        { title: 'Filled', dataIndex: 'filled', key: 'filled', width: 100, align: 'center' },
        { title: 'Remaining', key: 'remaining', width: 120, align: 'center', render: (_: any, r: any) => Math.max(0, (r.target || 0) - (r.filled || 0)) },
        { title: 'CVs', key: 'cvs', width: 120, align: 'center', render: (_: any, r: any) => (
            <Button size="small" onClick={() => openResumes(r)}>View CVs</Button>
        )},
        { title: 'Priority', dataIndex: 'priority', key: 'priority', width: 140, align: 'center', render: (p: string) => <span>{p}</span> },
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

    const totalTarget = campaign?.totalTarget || 0;
    const totalHired = campaign?.totalHired || 0;
    const percent = totalTarget ? Math.round((totalHired / totalTarget) * 100) : 0;
    const jobs = campaign?.jobs || [];

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
                        <Button type="primary" onClick={openAddJobModal}>Add Job</Button>
                    </div>
                </div>
            }
            style={{ maxWidth: 1200, margin: '12px auto', borderRadius: 12, height: 'calc(100% - 25px)' }}
        >
            <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, marginBottom: 8 }}>{campaign.description}</p>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <div style={{ padding: 8, background: '#fafafa', borderRadius: 8 }}><strong>Target:</strong> {totalTarget}</div>
                        <div style={{ padding: 8, background: '#fafafa', borderRadius: 8 }}><strong>Hired:</strong> {totalHired}</div>
                        <div style={{ padding: 8, background: '#fafafa', borderRadius: 8 }}><strong>Status:</strong> {campaign.status}</div>
                    </div>
                </div>
                <div style={{ width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: 8 }}><strong>Progress</strong></div>
                    <Progress percent={percent} size="small" status={percent >= 100 ? 'success' : 'active'} />
                </div>
            </div>

            <Table
                dataSource={jobs}
                columns={columns}
                rowKey="jobId"
                pagination={false}
                size="middle"
            />
            {/* Add Job Modal */}
            <Modal
                open={addJobModalOpen}
                title="Add jobs to campaign"
                onCancel={() => setAddJobModalOpen(false)}
                onOk={handleAddJobs}
                okText="Add"
                confirmLoading={jobLoading}
            >
                <div style={{ marginBottom: 8 }}>Select jobs to add to this campaign:</div>
                <Select
                    mode="multiple"
                    placeholder="Select jobs"
                    options={jobOptions}
                    value={selectedJobIds}
                    onChange={(v) => setSelectedJobIds(v)}
                    loading={jobLoading}
                    style={{ width: '100%' }}
                />
            </Modal>
        </Card>
    );
};

export default CampaignDetail;
