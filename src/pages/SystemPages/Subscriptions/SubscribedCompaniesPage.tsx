import { useEffect, useState } from "react";
import { Card, Input, Space, Table, Tag, Typography, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  companySubscriptionService,
  type CompanySubscriptionQuery,
} from "../../../services/companySubscriptionService";
import type { CompanySubscription } from "../../../types/subscription.types";

const { Title, Text } = Typography;
const { Search } = Input;

export default function SubscribedCompaniesPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompanySubscription[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [search, setSearch] = useState("");

  const columns: ColumnsType<CompanySubscription> = [
    {
      title: "ID",
      dataIndex: "comSubId",
      width: 80,
    },
    {
      title: "Company",
      dataIndex: "companyName",
      render: (value, record) => (
        <div>
          <Text strong>{value}</Text>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            Company ID: {record.companyId}
          </div>
        </div>
      ),
    },
    {
      title: "Subscription",
      dataIndex: "subscriptionName",
      render: (value, record) => (
        <div>
          <Text strong>{value}</Text>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            Plan ID: {record.subscriptionId}
          </div>
        </div>
      ),
    },
    {
      title: "Start – End",
      key: "duration",
      render: (_, record) => {
        const start = new Date(record.startDate).toLocaleDateString();
        const end = new Date(record.endDate).toLocaleDateString();
        return (
          <div>
            <Text>
              {start} → {end}
            </Text>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>
              Created: {new Date(record.createdAt).toLocaleDateString()}
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "subscriptionStatus",
      width: 130,
      render: (status) => {
        const lower = String(status).toLowerCase();
        let color: "green" | "gold" | "default" | "red" = "default";

        if (lower === "active") color = "green";
        else if (lower === "pending") color = "gold";
        else if (lower === "expired" || lower === "cancelled") color = "red";

        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const fetchData = async (params?: CompanySubscriptionQuery) => {
    try {
      setLoading(true);

      // GỘP params với default đảm bảo không undefined
      const safeParams: CompanySubscriptionQuery = {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
        search: params?.search ?? "",
      };

      const res = await companySubscriptionService.getList(safeParams);

      // Giả sử BE trả về:
      // {
      //   companySubscriptions: CompanySubscription[];
      //   page: number;
      //   pageSize: number;
      //   totalItems: number;
      // }
      setData(res.companySubscriptions);

      setPagination({
        current: res.page,
        pageSize: res.pageSize,
        total: res.totalItems,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load subscribed companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleTableChange = (pag: TablePaginationConfig) => {
    const current = pag.current ?? 1;
    const size = pag.pageSize ?? 10;

    setPagination((prev) => ({
      ...prev,
      current,
      pageSize: size,
    }));

    fetchData({
      page: current,
      pageSize: size,
      search, // state search nếu bạn có
    });
  };

  return (
    <Card>
      <Space
        style={{
          width: "100%",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Subscribed Companies
        </Title>

        <Search
          allowClear
          placeholder="Search by company or plan..."
          style={{ width: 260 }}
          onSearch={(value) => {
            setPagination((prev) => ({ ...prev, current: 1 }));
            setSearch(value.trim());
          }}
        />
      </Space>

      <Table
        rowKey="comSubId"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Card>
  );
}
