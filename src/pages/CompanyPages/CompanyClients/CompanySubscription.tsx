import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, message, Input, Drawer, Descriptions, Modal} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { subscriptionService } from "../../../services/subscriptionService";
import { paymentService } from "../../../services/paymentService";

interface Client {
  clientId: number;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  status: "Active" | "Inactive" | "Pending";
  rating?: number;
  totalApplications: number;
  lastContact?: string;
}

const CompanyClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [upgradingId, setUpgradingId] = useState<number | null>(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const subscriptions = await subscriptionService.getAll();

      // Map API response to Client interface
      const mappedClients: Client[] = subscriptions.map((sub: any) => ({
        clientId: sub.subscriptionId,
        fullName: sub.name,
        email: sub.description || "—",
        phone: sub.limit,
        company: `${sub.price.toLocaleString()} VND`,
        status: sub.isActive ? "Active" : "Inactive",
        rating: undefined,
        totalApplications: sub.durationDays,
        lastContact: sub.createdAt,
      }));

      setClients(mappedClients);
      setFilteredClients(mappedClients);
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
      message.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubscription = async () => {
    // TODO: Replace with actual API call to get company's current subscription
    // For now, using mock data
    try {
      // Mock data - replace with actual API call
      const mockSubscription = {
        subscriptionName: "Pro Plan",
        startDate: "2025-01-15",
        endDate: "2025-12-15",
        status: "Active",
        remainingDays: 234,
        maxJobPostings: 50,
        price: 299000,
      };
      setCurrentSubscription(mockSubscription);
    } catch (error) {
      console.error("Failed to load current subscription:", error);
      message.error("Failed to load current subscription");
    }
  };

  const handleViewMySubscription = async () => {
    await loadCurrentSubscription();
    setSubscriptionModalVisible(true);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const v = value.trim().toLowerCase();
    if (!v) {
      setFilteredClients(clients);
      return;
    }
    const filtered = clients.filter(
      (client) =>
        client.fullName.toLowerCase().includes(v) ||
        client.email.toLowerCase().includes(v) ||
        client.company?.toLowerCase().includes(v)
    );
    setFilteredClients(filtered);
  };

  const handleView = async (client: Client) => {
    try {
      const subscription = await subscriptionService.getById(client.clientId);
      setSelectedSubscription(subscription);
      setViewDrawerOpen(true);
    } catch (error) {
      console.error("Failed to load subscription details:", error);
      message.error("Failed to load subscription details");
    }
  };

  const handleUpgrade = async (client: Client) => {
    setUpgradingId(client.clientId);
    try {
      const response = await paymentService.createCheckoutSession(client.clientId);

      if (response.status === "Success" && response.data?.url) {
        // Navigate to payment URL
        window.location.href = response.data.url;
      } else {
        // Show error modal with API response message
        const errorMsg = response.message || "Failed to create checkout session";
        setErrorMessage(errorMsg);
        setErrorModalVisible(true);
        setUpgradingId(null);
      }
    } catch (error: any) {
      console.error("Failed to create checkout session:", error);
      // Extract error message from API response if available
      const errorMsg = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to create checkout session";
      setErrorMessage(errorMsg);
      setErrorModalVisible(true);
      setUpgradingId(null);
    }
  };

  const columns: ColumnsType<Client> = [
    {
      title: <div style={{ textAlign: "center" }}>No</div>,
      width: 60,
      align: "center" as const,
      render: (_: any, __: Client, index: number) => index + 1,
    },
    {
      title: <div style={{ textAlign: "center" }}>Name</div>,
      dataIndex: "fullName",
      width: 270,
      align: "center" as const,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: <div style={{ textAlign: "center" }}>Price</div>,
      dataIndex: "company",
      width: 180,
      align: "center" as const,
      render: (company?: string) => company || "—",
    },
    {
      title: <div style={{ textAlign: "center" }}>Duration (Days)</div>,
      dataIndex: "totalApplications",
      width: 150,
      align: "center" as const,
    },
    {
      title: <div style={{ textAlign: "center" }}>Actions</div>,
      key: "actions",
      fixed: "right",
      width: 180,
      align: "center" as const,
      render: (_: any, record: Client) => (
        <Space>
          <Button className="company-btn" size="small" onClick={() => handleView(record)}>
            View
          </Button>
          <Button 
            className="company-btn--filled" 
            size="small" 
            onClick={() => handleUpgrade(record)}
            loading={upgradingId === record.clientId}
            disabled={upgradingId !== null && upgradingId !== record.clientId}
          >
            Upgrade
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Subscription Plans"
      bordered={false}
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        borderRadius: 12,
      }}
      extra={
        <Space>
          <Button className="company-btn--filled" onClick={handleViewMySubscription}>
            View My Subscription
          </Button>
        </Space>
      }
    >
        <Space style={{ marginBottom: 16, width: "100%" }} direction="vertical">
          <Space wrap>
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Space>
        </Space>

        <Table
          rowKey="clientId"
          loading={loading}
          dataSource={filteredClients}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 840 }}
        />

      <Drawer
        title="Subscription Details"
        placement="right"
        width={600}
        open={viewDrawerOpen}
        onClose={() => {
          setViewDrawerOpen(false);
          setSelectedSubscription(null);
        }}
      >
        {selectedSubscription && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
              <strong>{selectedSubscription.name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selectedSubscription.description || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              {selectedSubscription.price?.toLocaleString()} VND
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {selectedSubscription.durationDays} days
            </Descriptions.Item>
            <Descriptions.Item label="Limit">
              {selectedSubscription.limit || "—"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      {/* My Subscription Modal */}
      <Modal
        open={subscriptionModalVisible}
        onCancel={() => setSubscriptionModalVisible(false)}
        footer={[
          <Button key="close" className="company-btn" onClick={() => setSubscriptionModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
        centered
      >
        {currentSubscription ? (
          <div>
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "24px",
              borderRadius: 8,
              marginBottom: 24,
              color: "white"
            }}>
              <h2 style={{ color: "white", margin: 0, marginBottom: 16 }}>
                {currentSubscription.subscriptionName}
              </h2>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, marginBottom: 8 }}>
                    Status: <strong>{currentSubscription.status}</strong>
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, marginBottom: 8 }}>
                    Valid until: <strong>{new Date(currentSubscription.endDate).toLocaleDateString()}</strong>
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    Remaining: <strong>{currentSubscription.remainingDays} days</strong>
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", marginBottom: 8 }}>
                    Max Jobs
                  </div>
                  <div style={{ fontSize: 36, fontWeight: "bold", color: "white" }}>
                    {currentSubscription.maxJobPostings}
                  </div>
                </div>
              </div>
            </div>
            
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Plan Name">
                <strong>{currentSubscription.subscriptionName}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {new Date(currentSubscription.startDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {new Date(currentSubscription.endDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {currentSubscription.price?.toLocaleString()} VND
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <span style={{ 
                  color: currentSubscription.status === "Active" ? "#52c41a" : "#999",
                  fontWeight: 500 
                }}>
                  {currentSubscription.status}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ color: "#999" }}>No active subscription found</p>
          </div>
        )}
      </Modal>

      {/* Error Modal */}
      <Modal
        open={errorModalVisible}
        onCancel={() => setErrorModalVisible(false)}
        footer={[
          <Button key="ok" className="company-btn--filled" onClick={() => setErrorModalVisible(false)}>
            OK
          </Button>
        ]}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ fontSize: 16, marginBottom: 12, fontWeight: 500 }}>Upgrade Failed</p>
          <p style={{ color: "#666" }}>{errorMessage}</p>
        </div>
      </Modal>
    </Card>
  );
};

export default CompanyClients;
