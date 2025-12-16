import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button} from "antd";
import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { paymentService } from "../../../../services/paymentService";

interface Payment {
  paymentId: number;
  companyId: number;
  comSubId: number | null;
  paymentStatus: string;
  subscriptionStatus: string | null;
  amount: number;
  currency: string | null;
  subscriptionName: string | null;
  startDate: string | null;
  endDate: string | null;
  transactionTime: string | null;
  invoiceUrl?: string;
  sessionStatus?: string;
}

const PaymentHistory: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentService.getPaymentHistory();
      if (response.status === "Success" && response.data) {
        setPayments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to load payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Payment> = [
    {
      title: <div style={{ textAlign: "center" }}>No</div>,
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: <div style={{ textAlign: "center" }}>Subscription</div>,
      dataIndex: "subscriptionName",
      width: 150,
      align: "center" as const,
      render: (name: string | null) => name || "—",
    },
    {
      title: <div style={{ textAlign: "center" }}>Amount</div>,
      width: 80,
      align: "center" as const,
      render: (_: any, record: Payment) => (
        <strong>
          {record.amount === 0
            ? "Free"
            : `$${(record.amount / 100).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
        </strong>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Payment Status</div>,
      dataIndex: "paymentStatus",
      width: 120,
      align: "center" as const,
      render: (status: string) => (
        <Tag color={status === "Paid" ? "success" : status === "Failed" ? "error" : "default"}>
          {status}
        </Tag>
      ),
    },
    // {
    //   title: <div style={{ textAlign: "center" }}>Subscription Status</div>,
    //   dataIndex: "subscriptionStatus",
    //   width: 150,
    //   align: "center" as const,
    //   render: (status: string | null) => {
    //     if (!status) return <Tag>—</Tag>;
    //     return (
    //       <Tag color={status === "Active" ? "green" : status === "Canceled" ? "red" : "default"}>
    //         {status}
    //       </Tag>
    //     );
    //   },
    // },
    {
      title: <div style={{ textAlign: "center" }}>Transaction Time</div>,
      dataIndex: "transactionTime",
      width: 160,
      align: "center" as const,
      render: (time: string | null) =>
        time ? new Date(time).toLocaleString() : "—",
    },
    {
      title: <div style={{ textAlign: "center" }}>Period</div>,
      width: 200,
      align: "center" as const,
      render: (_: any, record: Payment) => {
        if (!record.startDate || !record.endDate) return "—";
        return (
          <div>
            {new Date(record.startDate).toLocaleDateString()} → {new Date(record.endDate).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Invoice</div>,
      width: 80,
      align: "center" as const,
      render: (_: any, record: Payment) => {
        if (record.paymentStatus !== "Paid") return "—";
        return (
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={async () => {
              try {
                const detail = await paymentService.getPaymentById(record.paymentId);
                if (detail.status === "Success" && detail.data?.invoiceUrl) {
                  window.open(detail.data.invoiceUrl, "_blank");
                } else {
                  console.warn("No invoice URL found");
                }
              } catch (error) {
                console.error("Failed to get invoice:", error);
              }
            }}
          >
          </Button>
        );
      },
    },
  ];

  return (
    <Card
      title={
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Button
              className="company-btn"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/company/subscriptions")}
            />
            <span className="font-semibold">Payment History</span>
          </div>
        </div>
      }
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        borderRadius: 12,
      }}
    >
      <Table
        rowKey="paymentId"
        loading={loading}
        dataSource={payments}
        columns={columns}
        scroll={{ y: "67vh" }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: payments.length,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} payments`,
          pageSizeOptions: ["10", "20", "50", "100"],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />
    </Card>
  );
};

export default PaymentHistory;
