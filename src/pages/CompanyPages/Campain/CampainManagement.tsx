import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, message, Drawer, Badge, List, Tag, Spin, Divider } from "antd";
import { SearchOutlined, PlusOutlined, BellOutlined, ArrowRightOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import CampaignCreateDrawer from './component/CampaignCreateDrawer';
import CampaignEditDrawer from './component/CampaignEditDrawer';
import CampaignTable from './component/CampaignTable';
import { campaignService } from "../../../services/campaignService";
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
                const campaignList = response.data.campaigns || response.data;
                setCampaigns(Array.isArray(campaignList) ? campaignList : []);
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

    const loadPendingCampaigns = async () => {
        setPendingLoading(true);
        try {
            const resp = await campaignService.getPendingCampaigns();
            if (resp?.status === 'Success' && resp.data) {
                const list = resp.data.campaigns || resp.data || [];
                setPendingCampaigns(Array.isArray(list) ? list : []);
            } else if (Array.isArray(resp)) {
                setPendingCampaigns(resp);
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

    const handleViewPending = async (campaignId: number) => {
        setPendingDetailLoading(true);
        try {
            const resp = await campaignService.getPendingCampaignById(campaignId);
            let detail = null;
            if (resp?.status === 'Success' && resp.data) {
                detail = resp.data.campaign || resp.data;
            } else if (resp) {
                detail = resp;
            }
            setPendingDetail(detail);
            // ensure pending drawer is open
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
            const ok = resp?.status === 'Success' || resp?.statusCode === 200 || resp?.message;
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
            const ok = resp?.status === 'Success' || resp?.statusCode === 200 || resp?.message;
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
        setFiltered(result);
        setCurrentPage(1);
    }, [campaigns, searchText]);

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
                            style={{ width: 400 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
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

            <Drawer
                title={
                    pendingDetail ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontWeight: 600 }}>{pendingDetail.title || 'Campaign details'}</span>
                                <Tag color={pendingDetail.status === 'Pending' ? 'orange' : pendingDetail.status === 'Published' ? 'green' : 'default'}>{pendingDetail.status || '-'}</Tag>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Button type="text" icon={<ArrowRightOutlined />} onClick={() => setPendingDetail(null)} />
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>Pending Campaigns ({pendingCampaigns.length})</span>
                        </div>
                    )
                }
                open={pendingDrawerOpen}
                onClose={() => { setPendingDrawerOpen(false); setPendingDetail(null); loadPendingCampaigns(); }}
                width={760}
                bodyStyle={{ padding: 24 }}
            >
                {pendingDetail ? (
                    pendingDetailLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spin /></div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <div style={{ color: '#666', fontSize: 12 }}>Creator</div>
                                    <div style={{ fontWeight: 600 }}>{pendingDetail.creatorName || pendingDetail.creator || '-'}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#666', fontSize: 12 }}>Created at</div>
                                    <div>{pendingDetail.createdAt ? new Date(pendingDetail.createdAt).toLocaleString() : '-'}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#666', fontSize: 12 }}>Start date</div>
                                    <div>{pendingDetail.startDate ? new Date(pendingDetail.startDate).toLocaleDateString() : '-'}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#666', fontSize: 12 }}>End date</div>
                                    <div>{pendingDetail.endDate ? new Date(pendingDetail.endDate).toLocaleDateString() : '-'}</div>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: '#666', fontSize: 12 }}>Description</div>
                                <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{pendingDetail.description || '-'}</div>
                            </div>

                            <Divider />

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong>Jobs</strong>
                                    <span style={{ color: '#666', fontSize: 12 }}>{Array.isArray(pendingDetail.jobs) ? `${pendingDetail.jobs.length} job(s)` : ''}</span>
                                </div>
                                {Array.isArray(pendingDetail.jobs) && pendingDetail.jobs.length ? (
                                    <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                                        {pendingDetail.jobs.map((j: any) => (
                                            <div key={j.jobId} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px', border: '1px solid #f0f0f0', borderRadius: 8, background: '#fff' }}>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.jobTitle || j.title || `#${j.jobId}`}</div>
                                                </div>
                                                <div style={{ textAlign: 'right', minWidth: 140, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <div style={{ color: '#666', fontSize: 13 }}><strong style={{ color: '#333', fontWeight: 600 }}>Target:</strong>&nbsp;{Number(j.targetQuantity ?? j.target ?? 0)}</div>
                                                    <div style={{ color: '#666', fontSize: 13 }}><strong style={{ color: '#333', fontWeight: 600 }}>Hired:</strong>&nbsp;{Number(j.currentHired ?? j.filled ?? 0)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ marginTop: 8, color: '#666' }}>{Array.isArray(pendingDetail.jobIds) ? `${pendingDetail.jobIds.length} job(s)` : '0 job(s)'}</div>
                                )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
                                <Button danger icon={<CloseOutlined />} onClick={handleReject} loading={pendingActionLoading}>Reject</Button>
                                <Button className="company-btn" icon={<CheckOutlined />} onClick={handleApprove} loading={pendingActionLoading}>Approve</Button>                               
                            </div>
                        </div>
                    )
                ) : (
                    <List
                        dataSource={pendingCampaigns}
                        loading={pendingLoading}
                        renderItem={(item: any, idx) => (
                            <List.Item
                                key={item.campaignId}
                                style={{ padding: 12, borderRadius: 8 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 12 }}>
                                    {/* Column 1: No. */}
                                    <div style={{ width: 40, textAlign: 'center', color: '#666', flexShrink: 0 }}>{idx + 1}</div>

                                    {/* Column 2: Campaign title + created by */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || '-'}</div>
                                        <div style={{ fontSize: 12, color: '#666' }}>{`Created by ${item.creatorName || item.creator || '-'} on ${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}`}</div>
                                    </div>

                                    {/* Column 3: Status + Eye icon */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8, flexShrink: 0 }}>
                                        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewPending(item.campaignId)} />
                                        <Tag color={item.status === 'Pending' ? 'orange' : item.status === 'Published' ? 'green' : 'default'}>{item.status || '-'}</Tag>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                )}
            </Drawer>

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
                        const ok = resp?.status === 'Success' || resp?.statusCode === 200 || resp?.message;
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