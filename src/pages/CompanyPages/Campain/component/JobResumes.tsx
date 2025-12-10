import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Button, Spin } from 'antd';
import { campaignService } from '../../../../services/campaignService';

const JobResumes: React.FC = () => {
    const { campaignId, jobId } = useParams();
    const navigate = useNavigate();
    const cid = Number(campaignId);
    const jid = Number(jobId);

    const [campaign, setCampaign] = useState<any | null>(null);
    const [job, setJob] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const resp = await campaignService.getCampaignById(cid);
                console.log("Campaign response:", resp);
                
                // Handle both direct campaign object and wrapped response
                let campaignData = null;
                if (resp?.data?.campaignId) {
                    campaignData = resp.data;
                } else if (resp?.campaignId) {
                    campaignData = resp;
                }
                
                if (campaignData) {
                    setCampaign(campaignData);
                    const foundJob = (campaignData.jobs || []).find((j: any) => j.jobId === jid);
                    setJob(foundJob || null);
                } else {
                    console.error("Failed to fetch campaign - invalid data structure");
                }
            } catch (error) {
                console.error("Error loading campaign/job:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [cid, jid]);

    // Hardcode demo resumes (placeholder until API available)
    const resumes = job ? Array.from({ length: Math.max(1, Math.min(12, (job.target || 3))) }).map((_, i) => ({
        id: `${job.jobId}-${i + 1}`,
        name: `Candidate ${i + 1}`,
        appliedAt: new Date(Date.now() - i * 86400000).toISOString(),
    })) : [];

    if (loading) {
        return (
            <Card style={{ maxWidth: 1100, margin: '12px auto', textAlign: 'center', padding: 50 }}>
                <Spin />
            </Card>
        );
    }

    if (!campaign || !job) {
        return (
            <Card style={{ maxWidth: 1000, margin: '12px auto' }}>
                <h3>Not found</h3>
                <p>Campaign or job not found.</p>
                <Button onClick={() => navigate(-1)}>Go back</Button>
            </Card>
        );
    }

    return (
        <Card
            title={`${campaign.title} — ${job.title}`}
            style={{ maxWidth: 1100, margin: '12px auto' }}
            extra={<Button onClick={() => navigate(-1)}>Back</Button>}
        >
            <div style={{ marginBottom: 12 }}>
                <strong>Job:</strong> {job.title} • <strong>Target:</strong> {job.target} • <strong>Filled:</strong> {job.filled}
            </div>

            <List
                dataSource={resumes}
                renderItem={(r) => (
                    <List.Item actions={[<Button key="open" type="link">Open</Button>]}> 
                        <List.Item.Meta title={r.name} description={new Date(r.appliedAt).toLocaleString()} />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default JobResumes;