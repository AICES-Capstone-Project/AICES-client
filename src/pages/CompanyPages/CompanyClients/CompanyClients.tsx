import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, message, Input, Drawer, Descriptions} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

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

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const axios = (await import("axios")).default;
      const token = localStorage.getItem("access_token");
      const baseURL = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:7220/api";

      const response = await axios.get(`${baseURL}/subscriptions`, {
        params: {
          page: 1,
          pageSize: 10,
          search: "",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "Success" && response.data.data) {
        const subscriptions = response.data.data.subscriptions || [];

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
      }
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
      message.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
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
      const axios = (await import("axios")).default;
      const token = localStorage.getItem("access_token");
      const baseURL = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:7220/api";

      const response = await axios.get(`${baseURL}/subscriptions/${client.clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "Success" && response.data.data) {
        setSelectedSubscription(response.data.data);
        setViewDrawerOpen(true);
      } else {
        message.error("Failed to load subscription details");
      }
    } catch (error) {
      console.error("Failed to load subscription details:", error);
      message.error("Failed to load subscription details");
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
          <Button className="company-btn--filled" size="small">
            Contact
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
          <Button className="company-btn--filled">Add Subscription</Button>
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
    </Card>
  );
};

export default CompanyClients;
