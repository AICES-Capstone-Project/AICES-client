import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, message, Badge, Select } from "antd";
import { SearchOutlined, PlusOutlined, BellOutlined } from "@ant-design/icons";
import CampaignCreateDrawer from './component/CampaignCreateDrawer';
import CampaignEditDrawer from './component/CampaignEditDrawer';
import CampaignTable from './component/CampaignTable';
import PendingCampaignsDrawer from './component/PendingCampaignsDrawer';
import { campaignService } from "../../../services/campaignService";
import { hiringTrackingService } from '../../../services/hiringTrackingService';
import { useNotificationSignalR } from '../../../hooks/useNotificationSignalR';
import { useAppSelector } from "../../../hooks/redux";
import { ROLES } from "../../../services/config";

const CampaignManagement = () => {


    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(12);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
    const [pendingDrawerOpen, setPendingDrawerOpen] = useState(false);
    const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
    const [pendingLoading, setPendingLoading] = useState(false);
    const [pendingDetail, setPendingDetail] = useState<any | null>(null);
    const [pendingDetailLoading, setPendingDetailLoading] = useState(false);
    const [pendingActionLoading, setPendingActionLoading] = useState(false);

    const navigate = useNavigate();

    const { user } = useAppSelector((s) => s.auth);
    const isHrManager = (user?.roleName || "").toLowerCase() === (ROLES.Hr_Manager || "").toLowerCase();

    // Calculate table height
    useEffect(() => {
        const calculate = () => {
            const reserved = 220;
            const h = window.innerHeight - reserved;
            setTableHeight(h > 300 ? h : 300);
        };
        calculate();
        window.addEventListener("resize", calculate);
        return () => window.removeEventListener("resize", calculate);
    }, []);

    // Load campaigns from API
    const loadCampaigns = async () => {
        setLoading(true);
        try {
            const response = await campaignService.getCampaigns();
            if (response.status === "Success" && response.data) {
                let campaignList = response.data.campaigns || response.data;
                campaignList = Array.isArray(campaignList) ? campaignList : [];

                // Enrich jobs with `filled` counts when possible by fetching resumes per job
                // This is optional but ensures progress uses accurate totalHired values.
                const enriched = await Promise.all(
                    campaignList.map(async (camp: any) => {
                        const jobs = Array.isArray(camp.jobs) ? camp.jobs : [];
                        if (!jobs.length) return camp;

                        // For each job, if there's already a numeric filled/hired, keep it.
                        // Otherwise, fetch resumes for that job and count statuses == 'Hired'.
                        const jobsWithCounts = await Promise.all(
                            jobs.map(async (job: any) => {
                                const hasNumeric = Number(job?.filled ?? job?.filledCount ?? job?.hired ?? job?.hiredCount ?? 0) > 0;
                                if (hasNumeric) return job;

                                try {
                                    const resp = await hiringTrackingService.getByJob(camp.campaignId ?? camp.campaign_id ?? camp.id, job.jobId ?? job.jobId ?? job.id, { page: 1, pageSize: 1 });
                                    const payload = resp && (resp as any).data ? (resp as any).data : resp;
                                    const list = hiringTrackingService._normalizeList(payload || resp);
                                    // count hired
                                    const count = (list || []).filter((r: any) => {
                                        const st = String(r?.applicationStatus ?? r?.status ?? r?.stage ?? '').toLowerCase().replace(/[\s_-]+/g, '');
                                        return st === 'hired';
                                    }).length;
                                    return { ...job, filled: count };
                                } catch (e) {
                                    return job;
                                }
                            })
                        );

                        return { ...camp, jobs: jobsWithCounts };
                    })
                );

                setCampaigns(enriched);
            } else {
                console.error("Failed to fetch campaigns:", response);
                setCampaigns([]);
            }
        } catch (error) {
            console.error("Error loading campaigns:", error);
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    };

    // Load pending campaigns by filtering all campaigns (server no longer provides pending endpoint)
    const loadPendingCampaigns = async () => {
        setPendingLoading(true);
        try {
            const response = await campaignService.getCampaigns();
            if (response?.status === 'Success' && response.data) {
                let list = response.data.campaigns || response.data;
                list = Array.isArray(list) ? list : [];
                const pending = list.filter((c: any) => String(c?.status ?? '').toLowerCase() === 'pending');
                setPendingCampaigns(pending);
            } else if (response) {
                // Try to handle other shapes
                const list = Array.isArray(response) ? response : [];
                setPendingCampaigns(list.filter((c: any) => String(c?.status ?? '').toLowerCase() === 'pending'));
            } else {
                setPendingCampaigns([]);
            }
        } catch (err) {
            console.error('Failed to load pending campaigns', err);
            setPendingCampaigns([]);
        } finally {
            setPendingLoading(false);
        }
    };

    useEffect(() => {
        loadCampaigns();
        // load pending campaigns on mount for realtime header badge
        loadPendingCampaigns();
    }, []);

    // Realtime: listen to notifications (server may emit campaign-related events)
    useNotificationSignalR({
        onNewNotification: (notif) => {
            try {
                const t = (notif?.type || notif?.message || '').toString().toLowerCase();
                if (t.includes('campaign') || t.includes('campaigns') || t.includes('campaign_updated') || t.includes('campaignstatus')) {
                    // refresh lists without forcing full page reload
                    loadPendingCampaigns();
                    loadCampaigns();
                }
            } catch (e) {
                console.debug('notif handler error', e);
            }
        },
        enabled: true,
    });

    // (removed loadPendingCount — badge uses pendingCampaigns.length directly)


    const handleViewPending = async (campaignId: number) => {
        setPendingDetailLoading(true);
        try {
            const resp = await campaignService.getCampaignById(campaignId);
            let detail = null;
            if (resp?.status === 'Success' && resp.data) {
                detail = resp.data.campaign || resp.data;
            } else if (resp) {
                detail = resp;
            }
            setPendingDetail(detail);
            setPendingDrawerOpen(true);
        } catch (err) {
            console.error('Failed to load pending campaign detail', err);
            message.error('Failed to load campaign details');
        } finally {
            setPendingDetailLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!pendingDetail?.campaignId) return;
        setPendingActionLoading(true);
        try {
            const resp = await campaignService.updateCampaignStatus(pendingDetail.campaignId, 'Published');
            const ok = !!resp && ((resp as any).status === 'Success' || (resp as any).data != null);
            if (ok) {
                message.success('Campaign approved');
                await loadPendingCampaigns();
                await loadCampaigns();
                setPendingDetail(null);
            } else {
                message.error('Approve failed');
            }
        } catch (err) {
            console.error('Approve error', err);
            message.error('Approve failed');
        } finally {
            setPendingActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!pendingDetail?.campaignId) return;
        setPendingActionLoading(true);
        try {
            const resp = await campaignService.updateCampaignStatus(pendingDetail.campaignId, 'Rejected');
            const ok = !!resp && ((resp as any).status === 'Success' || (resp as any).data != null);
            if (ok) {
                message.success('Campaign rejected');
                await loadPendingCampaigns();
                await loadCampaigns();
                setPendingDetail(null);
            } else {
                message.error('Reject failed');
            }
        } catch (err) {
            console.error('Reject error', err);
            message.error('Reject failed');
        } finally {
            setPendingActionLoading(false);
        }
    };

    // Search/filter campaigns
    useEffect(() => {
        let result = [...campaigns];
        if (searchText) {
            const v = searchText.trim().toLowerCase();
            result = result.filter(
                (c) =>
                    c.title?.toLowerCase().includes(v) ||
                    c.description?.toLowerCase().includes(v) ||
                    c.department?.toLowerCase().includes(v)
            );
        }

        if (statusFilter && statusFilter !== 'all') {
            result = result.filter((c) => String(c?.status ?? '').toLowerCase() === statusFilter);
        }

        setFiltered(result);
        setCurrentPage(1);
    }, [campaigns, searchText, statusFilter]);

    // columns moved into CampaignTable component

    return (
        <Card
            title={
                <div style={{ display: "flex", alignItems: "center", width: '100%', gap: 16 }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span className="font-semibold">Campaign</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 10 }}>
                        <Input
                            placeholder="Search campaign name, description or department..."
                            prefix={<SearchOutlined />}
                            allowClear
                            style={{ width: 360 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                            className="company-select"
                            value={statusFilter}
                            onChange={(v) => setStatusFilter(String(v))}
                            style={{ width: 160 }}
                            options={[
                                { label: 'All statuses', value: 'all' },
                                { label: 'Published', value: 'published' },
                                { label: 'Paused', value: 'paused' },
                                { label: 'Pending', value: 'pending' },
                                { label: 'Rejected', value: 'rejected' },
                                { label: 'Draft', value: 'draft' },
                            ]}
                        />
                    </div>
                    {isHrManager && (
                        <Button
                            className="company-btn"
                            icon={<BellOutlined style={{ fontSize: 16 }} />}
                            onClick={() => {
                                loadPendingCampaigns();
                                setPendingDrawerOpen(true);
                            }}
                        >
                            <Badge className="company-badge" count={pendingCampaigns.length} size="small" offset={[-15, -13]} />
                            <span>Pending</span>
                        </Button>
                    )}

                    <Button
                        className="company-btn--filled"
                        icon={<PlusOutlined />}
                        onClick={() => setCreateDrawerOpen(true)}
                    >
                        Create
                    </Button>
                </div>
            }
            style={{
                maxWidth: 1200,
                margin: "12px auto",
                borderRadius: 12,
                height: 'calc(100% - 25px)',
            }}
        >
            <CampaignCreateDrawer
                open={createDrawerOpen}
                onClose={() => setCreateDrawerOpen(false)}
                onCreated={async () => {
                    // reload campaigns after created
                    await loadCampaigns();
                }}
            />
            <CampaignEditDrawer
                open={editDrawerOpen}
                onClose={() => { setEditDrawerOpen(false); setEditingCampaign(null); }}
                campaignId={editingCampaign?.campaignId}
                onUpdated={async () => {
                    await loadCampaigns();
                    setEditDrawerOpen(false);
                    setEditingCampaign(null);
                }}
            />

            <PendingCampaignsDrawer
                open={pendingDrawerOpen}
                onClose={() => { setPendingDrawerOpen(false); setPendingDetail(null); loadPendingCampaigns(); }}
                pendingCampaigns={pendingCampaigns}
                loading={pendingLoading}
                pendingDetail={pendingDetail}
                pendingDetailLoading={pendingDetailLoading}
                pendingActionLoading={pendingActionLoading}
                onView={handleViewPending}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            <CampaignTable
                data={filtered}
                loading={loading}
                tableHeight={tableHeight}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={(page, size) => {
                    setCurrentPage(page);
                    if (size && size !== pageSize) {
                        // no-op for now
                    }
                }}
                onView={(record) => navigate(`/company/campaign/${record.campaignId}`)}
                onEdit={(record) => { setEditingCampaign(record); setEditDrawerOpen(true); }}
                onDelete={async (record) => {
                    try {
                        const resp = await campaignService.deleteCampaign(record.campaignId);
                        const ok = !!resp && ((resp as any).status === 'Success' || (resp as any).data != null);
                        if (ok) {
                            message.success('Campaign deleted');
                            await loadCampaigns();
                        } else {
                            message.error('Failed to delete campaign');
                        }
                    } catch (err) {
                        console.error('Delete campaign error', err);
                        message.error('Delete failed');
                    }
                }}
            />
        </Card>
    );
};

export default CampaignManagement;