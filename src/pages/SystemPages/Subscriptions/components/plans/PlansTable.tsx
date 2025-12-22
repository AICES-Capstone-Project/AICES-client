// PlansTable.tsx
import { Button, Space, Table, Typography, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { SubscriptionPlan } from "../../../../../types/subscription.types";
import { useAppSelector } from "../../../../../hooks/redux";

const { Text } = Typography;

interface PlansTableProps {
  loading: boolean;
  plans: SubscriptionPlan[];
  onEdit?: (plan: SubscriptionPlan) => void; // ✅ optional
  onDelete?: (plan: SubscriptionPlan) => void; // ✅ optional
}

export default function PlansTable({
  loading,
  plans,
  onEdit,
  onDelete,
}: PlansTableProps) {
  const { user } = useAppSelector((state) => state.auth);
  const normalizedRole = (user?.roleName || "")
    .replace(/_/g, " ")
    .toLowerCase();
  const isSystemAdmin = normalizedRole === "system admin";

  const columns: ColumnsType<SubscriptionPlan> = [
    {
      title: "No.",
      key: "no",
      width: 70,
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Plan",
      dataIndex: "name",
      render: (value, record) => (
        <div style={{ minWidth: 200 }}>
          <Text strong>{value}</Text>
          {record.description && (
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 120,
      render: (v: number) => {
        const usd = v / 100;
        return usd.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: 120,
      render: (d) => `${d}`,
    },
    {
      title: "Limit",
      width: 200,
      render: (_, r) => (
        <Text>
          {r.resumeLimit} resumes / {r.hoursLimit}h
        </Text>
      ),
    },
    {
      title: "Compare",

      width: 170,
      render: (_: any, r: SubscriptionPlan) => {
        console.log(
          "ROW",
          r.subscriptionId,
          r.name,
          r.compareLimit,
          r.compareHoursLimit
        );

        const limit = Number(r.compareLimit ?? 0);
        const hours = Number(r.compareHoursLimit ?? 0);

        if (limit <= 0) return <Text type="secondary">Not available</Text>;
        return (
          <Text>
            {limit} / {hours}h
          </Text>
        );
      },
    },

    // ✅ chỉ push Actions column nếu admin
    ...(isSystemAdmin
      ? ([
          {
            title: "Actions",
            width: 160,
            align: "center",
            render: (_: any, record: SubscriptionPlan) => (
              <Space size="small">
                <Tooltip title="Edit plan">
                  <Button
                    size="small"
                    shape="circle"
                    icon={<EditOutlined />}
                    onClick={() => onEdit?.(record)}
                  />
                </Tooltip>

                <Tooltip title="Delete">
                  <Button
                    size="small"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete?.(record)}
                    style={{
                      borderColor: "var(--aices-green)",
                      color: "var(--aices-green)",
                    }}
                  />
                </Tooltip>
              </Space>
            ),
          },
        ] as ColumnsType<SubscriptionPlan>)
      : []),
  ];

  return (
    <Table
      rowKey="subscriptionId"
      loading={loading}
      columns={columns}
      dataSource={plans}
      className="accounts-table"
      pagination={false}
    />
  );
}
