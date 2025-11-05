// pages/SystemPages/Accounts/index.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Form,
  Select,
  Switch,
  message,
  Tooltip,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { userService } from "../../../services/userService";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../../../types/user.types";

const DEFAULT_PAGE_SIZE = 10;

export default function Accounts() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [createForm] = Form.useForm<CreateUserRequest>();
  const [editForm] = Form.useForm<UpdateUserRequest>();

  const page = useMemo(() => pagination.current || 1, [pagination.current]);
  const pageSize = useMemo(
    () => pagination.pageSize || DEFAULT_PAGE_SIZE,
    [pagination.pageSize]
  );

  const fetchData = useCallback(
    async (p = page, ps = pageSize, kw = keyword) => {
      try {
        setLoading(true);

        const res = await userService.getAll({
          page: p,
          pageSize: ps,
          search: kw,
        });
        // log để nhìn thấy response thật
        console.log("[Users] GET /user res =", res);

        const statusStr = String(res.status);
        const ok =
          statusStr === "Success" ||
          statusStr === "200" ||
          statusStr === "success";
        if (!ok) {
          message.error(res.message || `Request failed (status: ${statusStr})`);
          setUsers([]);
          setTotal(0);
          return;
        }
        if (!res.data) {
          setUsers([]);
          setTotal(0);
          return;
        }

        const d: any = res.data;

        // 1) lấy mảng users từ nhiều key khác nhau
        const rawList =
          d.users ?? d.items ?? d.data?.users ?? d.data?.items ?? [];

        // 2) chuẩn hóa field cho Table: userId, email, fullName, roleName, isActive, ...
        const list: User[] = rawList.map((x: any) => ({
          userId: x.userId ?? x.id ?? x.user_id ?? 0,
          email: x.email ?? x.mail ?? "",
          fullName: x.fullName ?? x.fullname ?? x.name ?? "",
          roleName: x.roleName ?? x.role ?? x.role_name ?? "",
          isActive:
            x.isActive ??
            x.active ??
            (typeof x.status === "boolean" ? x.status : x.status === 1) ??
            true,
          address: x.address ?? "",
          dateOfBirth: x.dateOfBirth ?? x.dob ?? null,
          avatarUrl: x.avatarUrl ?? x.avatar ?? "",
          phoneNumber: x.phoneNumber ?? x.phone ?? "",
          loginProviders: x.loginProviders ?? [],
          createdAt: x.createdAt ?? x.created_at ?? new Date().toISOString(),
        }));

        // 3) tính total: ưu tiên totalRecords/total/totalItems; fallback từ totalPages*pageSize
        const totalRecords: number =
          d.totalRecords ??
          d.total ??
          d.totalItems ??
          (d.totalPages && (d.pageSize ?? ps)
            ? d.totalPages * (d.pageSize ?? ps)
            : list.length);

        setUsers(list);
        setTotal(Number(totalRecords) || 0);
      } catch (e: any) {
        message.error(e?.message || "Failed to fetch users");
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, keyword]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: ColumnsType<User> = [
    { title: "ID", dataIndex: "userId", width: 80 },
    { title: "Email", dataIndex: "email" },
    {
      title: "Full name",
      dataIndex: "fullName",
      render: (v: string | null) => v || "—",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      width: 160,
      render: (r: string) => <Tag>{r}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 120,
      render: (active: boolean) =>
        active ? (
          <Tag color="blue">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 260,
      render: (_, record) => (
        <Space>
          <Tooltip title="View details">
            <Button icon={<EyeOutlined />} onClick={() => onViewDetail(record)}>
              View
            </Button>
          </Tooltip>
          <Tooltip title="Edit user">
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
              Edit
            </Button>
          </Tooltip>
          {record.isActive ? (
            <Tooltip title="Delete (soft)">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(record)}
              >
                Delete
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Restore user">
              <Button
                icon={<RollbackOutlined />}
                onClick={() => onRestore(record)}
              >
                Restore
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const onSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchData(1, pageSize, keyword);
  };

  const onReset = () => {
    setKeyword("");
    setPagination({ ...pagination, current: 1 });
    fetchData(1, pageSize, "");
  };

  const onChangePage = (p: TablePaginationConfig) => {
    setPagination(p);
  };

  const onCreate = async () => {
    try {
      const values = await createForm.validateFields();
      const res = await userService.create(values);
      if (res.status === "Success") {
        message.success("User created");
        setIsCreateOpen(false);
        createForm.resetFields();
        fetchData(page, pageSize, keyword);
      } else {
        message.error(res.message || "Create failed");
      }
    } catch {
      message.error("Could not create user. Please check the form inputs.");
    }
  };

  const onViewDetail = async (user: User) => {
    setLoadingDetail(true);
    setIsDetailOpen(true);
    const res = await userService.getById(user.userId);
    if (res.status === "Success" && res.data) setDetailUser(res.data);
    else message.error(res.message || "Failed to fetch user details");
    setLoadingDetail(false);
  };

  const onEdit = (user: User) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      email: user.email,
      fullName: user.fullName || "",
      password: undefined, // để trống
      roleId: roleNameToId(user.roleName),
      isActive: user.isActive,
    });
    setIsEditOpen(true);
  };

  const onUpdate = async () => {
    if (!editingUser) return;
    try {
      const values = await editForm.validateFields();
      // Nếu password rỗng → bỏ field đi
      const payload: UpdateUserRequest = { ...values };
      if (!payload.password) delete (payload as any).password;

      const res = await userService.update(editingUser.userId, payload);
      if (res.status === "Success") {
        message.success("User updated");
        setIsEditOpen(false);
        setEditingUser(null);
        fetchData(page, pageSize, keyword);
      } else {
        message.error(res.message || "Update failed");
      }
    } catch {
      message.error("Could not update user. Please check the form inputs.");
    }
  };

  const onDelete = (user: User) => {
    Modal.confirm({
      title: `Delete user ${user.email}?`,
      content: "This will soft-delete the user.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        const res = await userService.remove(user.userId);
        if (res.status === "Success") {
          message.success("User deleted");
          fetchData(page, pageSize, keyword);
        } else {
          message.error(res.message || "Delete failed");
        }
      },
    });
  };

  const onRestore = (user: User) => {
    Modal.confirm({
      title: `Restore user ${user.email}?`,
      okText: "Restore",
      onOk: async () => {
        const res = await userService.restore(user.userId);
        if (res.status === "Success") {
          message.success("User restored");
          fetchData(page, pageSize, keyword);
        } else {
          message.error(res.message || "Restore failed");
        }
      },
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by email or name"
          allowClear
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          style={{ width: 280 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" onClick={onSearch}>
          Search
        </Button>
        <Button onClick={onReset} icon={<ReloadOutlined />}>
          Reset
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateOpen(true)}
        >
          New User
        </Button>
      </Space>

      <Table
        rowKey="userId"
        loading={loading}
        dataSource={users}
        columns={columns}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={onChangePage}
      />

      {/* Create */}
      <Modal
        open={isCreateOpen}
        title="Create user"
        onCancel={() => setIsCreateOpen(false)}
        onOk={onCreate}
        okText="Create"
        destroyOnClose
      >
        <Form
          form={createForm}
          layout="vertical"
          initialValues={{ roleId: 1, isActive: true }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Full name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit */}
      <Modal
        open={isEditOpen}
        title={`Edit user: ${editingUser?.email || ""}`}
        onCancel={() => setIsEditOpen(false)}
        onOk={onUpdate}
        okText="Save"
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Full name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password (leave empty to keep)">
            <Input.Password />
          </Form.Item>
          <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail */}
      <Modal
        open={isDetailOpen}
        title="User Details"
        onCancel={() => {
          setIsDetailOpen(false);
          setDetailUser(null);
        }}
        footer={<Button onClick={() => setIsDetailOpen(false)}>Close</Button>}
        width={600}
      >
        {loadingDetail ? (
          <div style={{ textAlign: "center", padding: 20 }}>Loading...</div>
        ) : detailUser ? (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <div>
              <strong>User ID:</strong> {detailUser.userId}
            </div>
            <div>
              <strong>Email:</strong> {detailUser.email}
            </div>
            <div>
              <strong>Full Name:</strong> {detailUser.fullName || "—"}
            </div>
            <div>
              <strong>Role:</strong> {detailUser.roleName}
            </div>
            <div>
              <strong>Phone:</strong> {detailUser.phoneNumber || "—"}
            </div>
            <div>
              <strong>Address:</strong> {detailUser.address || "—"}
            </div>
            <div>
              <strong>Date of Birth:</strong>{" "}
              {detailUser.dateOfBirth
                ? new Date(detailUser.dateOfBirth).toLocaleDateString()
                : "—"}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              {detailUser.isActive ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              )}
            </div>
            <div>
              <strong>Created At:</strong>{" "}
              {new Date(detailUser.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Login Providers:</strong>
              <div style={{ marginTop: 8 }}>
                {detailUser.loginProviders.map((p, i) => (
                  <Tag key={i} color={p.isActive ? "blue" : "default"}>
                    {p.authProvider}
                  </Tag>
                ))}
              </div>
            </div>
            {detailUser.avatarUrl && (
              <div>
                <strong>Avatar:</strong>
                <div style={{ marginTop: 8 }}>
                  <img
                    src={detailUser.avatarUrl}
                    alt="Avatar"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            )}
          </Space>
        ) : (
          <div>No user data available</div>
        )}
      </Modal>
    </div>
  );
}

// ===== Helpers =====
const roleOptions = [
  { label: "System Admin", value: 1 },
  { label: "System Manager", value: 2 },
  { label: "System Staff", value: 3 },
  { label: "HR Manager", value: 4 },
  { label: "HR Recruiter", value: 5 },
];

function roleNameToId(roleName: string): number {
  switch (roleName) {
    case "System_Admin":
      return 1;
    case "System_Manager":
      return 2;
    case "System_Staff":
      return 3;
    case "HR_Manager":
      return 4;
    case "HR_Recruiter":
      return 5;
    default:
      return 5;
  }
}
