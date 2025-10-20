import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  recruitmentApprovalService,
  type ApprovalRequest,
  type ListParams,
} from "../../../services/recruitmentApprovalService";

const DEFAULT_PAGE_SIZE = 10;

export default function RecruitmentApprovalPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ApprovalRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const fetchData = async (page = 1, pageSize = DEFAULT_PAGE_SIZE, kw = "") => {
    setLoading(true);
    const params: ListParams = { page, pageSize, keyword: kw };
    const res = await recruitmentApprovalService.list(params);
    if (res.status === "Success" && res.data) {
      setItems(res.data.items);
      setTotal(res.data.total);
    } else {
      message.error(res.message || "Failed to fetch requests");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(
      pagination.current || 1,
      pagination.pageSize || DEFAULT_PAGE_SIZE,
      keyword
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize]);

  const onSearch = () => {
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword);
    setPagination({ ...pagination, current: 1 });
  };

  const onReset = () => {
    setKeyword("");
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, "");
    setPagination({ ...pagination, current: 1 });
  };

  const onChangePage = (p: TablePaginationConfig) => setPagination(p);

  const confirmApprove = (record: ApprovalRequest) => {
    Modal.confirm({
      title: `Approve ${record.fullName} (${record.email}) to join company?`,
      okText: "Approve",
      onOk: async () => {
        const res = await recruitmentApprovalService.approve(record.requestId);
        if (res.status === "Success") {
          message.success("Approved");
          fetchData(
            pagination.current || 1,
            pagination.pageSize || DEFAULT_PAGE_SIZE,
            keyword
          );
        } else {
          message.error(res.message || "Approve failed");
        }
      },
    });
  };

  const confirmReject = (record: ApprovalRequest) => {
    Modal.confirm({
      title: `Reject request of ${record.fullName}?`,
      okText: "Reject",
      okButtonProps: { danger: true },
      onOk: async () => {
        const res = await recruitmentApprovalService.reject(record.requestId);
        if (res.status === "Success") {
          message.success("Rejected");
          fetchData(
            pagination.current || 1,
            pagination.pageSize || DEFAULT_PAGE_SIZE,
            keyword
          );
        } else {
          message.error(res.message || "Reject failed");
        }
      },
    });
  };

  const viewDetail = (record: ApprovalRequest) => {
    Modal.info({
      title: "Recruiter Request Detail",
      content: (
        <div>
          <p><b>Full name:</b> {record.fullName}</p>
          <p><b>Email:</b> {record.email}</p>
          <p><b>Company:</b> {record.companyName}</p>
          <p><b>Role requested:</b> {record.requestedRole}</p>
          <p><b>Note:</b> {record.note || "—"}</p>
          <p><b>Requested at:</b> {new Date(record.requestedAt).toLocaleString()}</p>
          <p><b>Status:</b> {record.status}</p>
        </div>
      ),
      okText: "Close",
    });
  };

  const columns: ColumnsType<ApprovalRequest> = [
    { title: "ID", dataIndex: "requestId", width: 80 },
    { title: "Full name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Company", dataIndex: "companyName", width: 180 },
    {
      title: "Requested role",
      dataIndex: "requestedRole",
      width: 140,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (v: ApprovalRequest["status"]) =>
        v === "Pending" ? (
          <Tag color="blue">Pending</Tag>
        ) : v === "Approved" ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="red">Rejected</Tag>
        ),
    },
    {
      title: "Requested At",
      dataIndex: "requestedAt",
      width: 170,
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 230,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => viewDetail(record)}>
            View
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            disabled={record.status !== "Pending"}
            onClick={() => confirmApprove(record)}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            disabled={record.status !== "Pending"}
            onClick={() => confirmReject(record)}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by name/email/company"
          allowClear
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          style={{ width: 320 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" onClick={onSearch} icon={<SearchOutlined />}>
          Search
        </Button>
        <Button onClick={onReset} icon={<ReloadOutlined />}>
          Reset
        </Button>
      </Space>

      <Table
        rowKey="requestId"
        loading={loading}
        dataSource={items}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={onChangePage}
      />
    </div>
  );
}
