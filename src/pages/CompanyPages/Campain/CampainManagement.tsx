import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, message } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import CampaignCreateDrawer from './component/CampaignCreateDrawer';
import CampaignTable from './component/CampaignTable';
import { campaignService } from "../../../services/campaignService";


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

    const navigate = useNavigate();

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
    }, []);

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
            <CampaignCreateDrawer
                open={editDrawerOpen}
                onClose={() => { setEditDrawerOpen(false); setEditingCampaign(null); }}
                initialValues={editingCampaign || undefined}
                campaignId={editingCampaign?.campaignId}
                onUpdated={async () => {
                    await loadCampaigns();
                    setEditDrawerOpen(false);
                    setEditingCampaign(null);
                }}
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