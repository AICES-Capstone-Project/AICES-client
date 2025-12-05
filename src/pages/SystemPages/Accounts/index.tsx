// pages/SystemPages/Accounts/index.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Form, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { userService } from "../../../services/userService";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../../../types/user.types";

import AccountsToolbar from "./components/AccountsToolbar";
import AccountsTable from "./components/AccountsTable";
import UserCreateModal from "./components/UserCreateModal";
import UserEditModal from "./components/UserEditModal";
import UserDetailModal from "./components/UserDetailModal";

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

        const rawList =
          d.users ?? d.items ?? d.data?.users ?? d.data?.items ?? [];

        const list: User[] = rawList.map((x: any) => {
          const rawRoleName = x.roleName ?? x.role ?? x.role_name ?? "";
          const normalizedRoleName = String(rawRoleName || "").replace(
            /_/g,
            " "
          );

          return {
            userId: x.userId ?? x.id ?? x.user_id ?? 0,
            email: x.email ?? x.mail ?? "",
            fullName: x.fullName ?? x.fullname ?? x.name ?? "",
            roleName: normalizedRoleName,
            userStatus: x.userStatus ?? "Unverified",

            address: x.address ?? "",
            dateOfBirth: x.dateOfBirth ?? x.dob ?? null,
            avatarUrl: x.avatarUrl ?? x.avatar ?? "",
            phoneNumber: x.phoneNumber ?? x.phone ?? "",
            loginProviders: x.loginProviders ?? [],
            createdAt: x.createdAt ?? x.created_at ?? new Date().toISOString(),
          };
        });

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

      const payload: CreateUserRequest = {
        email: values.email,
        fullName: values.fullName,
        password: values.password,
        roleId: values.roleId,
      };

      const res = await userService.create(payload);

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
    try {
      setLoadingDetail(true);
      setIsDetailOpen(true);

      const res = await userService.getById(user.userId);

      if (res.status === "Success" && res.data) {
        setDetailUser(res.data);
      } else {
        message.error(res.message || "Failed to fetch user details");
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  const onEdit = (user: User) => {
    setEditingUser(user);

    // chuẩn hoá roleName: "System_Admin" -> "System Admin"
    const normalizedRoleName = (user.roleName || "").replace(/_/g, " ");
    // Lấy roleId gốc của user
    const rawRoleId =
      (user as any).roleId ?? ROLE_NAME_TO_ID[normalizedRoleName] ?? 0;

    // Chỉ các role System mới được phép hiển thị khi edit
    const allowedEditRoleIds = [1, 2, 3];

    // Nếu user là HR Manager (4) hoặc HR Recruiter (5) → để undefined
    const roleId = allowedEditRoleIds.includes(rawRoleId)
      ? rawRoleId
      : undefined;

    editForm.setFieldsValue({
      fullName: user.fullName || "",
      roleId,
    } as any);

    setIsEditOpen(true);
  };

  const onUpdate = async () => {
    if (!editingUser) return;

    try {
      const values = await editForm.validateFields(); // { fullName, roleId }

      const payload: UpdateUserRequest = {
        email: editingUser.email,
        fullName: values.fullName,
        roleId: values.roleId,
      };

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

  const onDelete = async (user: User) => {
    try {
      console.log("[Users] deleting user", user.userId);
      await userService.remove(user.userId);
      message.success("User deleted");
      fetchData(page, pageSize, keyword);
    } catch (e: any) {
      console.error("[Users] delete error =", e);
      const apiMsg =
        e?.response?.data?.message || e?.response?.data?.error || e?.message;
      message.error(apiMsg || "Delete failed");
    }
  };

  const onChangeStatus = async (
    user: User,
    status: "Verified" | "Unverified" | "Locked"
  ) => {
    const res = await userService.updateStatus(user.userId, status);
    if (res.status === "Success") {
      message.success("Status updated");

      // ✅ Cập nhật ngay trong state, không refetch => user đứng yên trên cùng 1 page
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === user.userId ? { ...u, userStatus: status } : u
        )
      );
    } else {
      message.error(res.message || "Failed to update status");
    }
  };

  const paginationConfig: TablePaginationConfig = {
    current: page,
    pageSize,
    total,
    showSizeChanger: true,
  };

  return (
    <div className="page-layout">
      {/* ⬇⬇ Toolbar chuyển vào trong Card */}
      <Card className="aices-card">
        <div className="accounts-toolbar">
          <AccountsToolbar
            keyword={keyword}
            onKeywordChange={setKeyword}
            onSearch={onSearch}
            onReset={onReset}
            onOpenCreate={() => setIsCreateOpen(true)}
          />
        </div>

        <div className="accounts-table-wrapper">
          <AccountsTable
            loading={loading}
            data={users}
            pagination={paginationConfig}
            onChangePage={onChangePage}
            onViewDetail={onViewDetail}
            onEdit={onEdit}
            onChangeStatus={onChangeStatus}
            onDelete={onDelete}
          />
        </div>
      </Card>

      <UserCreateModal
        open={isCreateOpen}
        form={createForm}
        roleOptions={createRoleOptions}
        onCancel={() => setIsCreateOpen(false)}
        onCreate={onCreate}
      />

      <UserEditModal
        open={isEditOpen}
        form={editForm}
        roleOptions={editRoleOptions}
        email={editingUser?.email || ""}
        onCancel={() => setIsEditOpen(false)}
        onUpdate={onUpdate}
      />

      <UserDetailModal
        open={isDetailOpen}
        loading={loadingDetail}
        user={detailUser}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailUser(null);
        }}
      />
    </div>
  );
}

// ===== Helpers =====
// Dùng cho Create: bỏ HR Manager, vẫn cho tạo HR Recruiter
const createRoleOptions = [
  { label: "System Admin", value: 1 },
  { label: "System Manager", value: 2 },
  { label: "System Staff", value: 3 },
  { label: "HR Recruiter", value: 5 },
];

// Dùng cho Edit: chỉ cho chọn 3 role System
const editRoleOptions = [
  { label: "System Admin", value: 1 },
  { label: "System Manager", value: 2 },
  { label: "System Staff", value: 3 },
];

const ROLE_NAME_TO_ID: Record<string, number> = {
  "System Admin": 1,
  "System Manager": 2,
  "System Staff": 3,
  "HR Manager": 4,
  "HR Recruiter": 5,
};
