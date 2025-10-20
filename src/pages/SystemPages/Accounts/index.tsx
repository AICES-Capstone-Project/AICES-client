import { useEffect, useState } from "react";
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
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	ReloadOutlined,
	SearchOutlined,
	EyeOutlined,
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

	const fetchData = async (page = 1, pageSize = DEFAULT_PAGE_SIZE, kw = "") => {
		setLoading(true);
		const res = await userService.getAll({ page, pageSize, search: kw });
		if (res.status === "Success" && res.data) {
			setUsers(res.data.users);
			setTotal(res.data.totalPages * pageSize);
		} else {
			message.error(res.message || "Failed to fetch users");
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

	const columns: ColumnsType<User> = [
		{ title: "ID", dataIndex: "userId", width: 80 },
		{ title: "Email", dataIndex: "email" },
		{
			title: "Full name",
			dataIndex: "fullName",
			render: (v: string | null) => v || "—",
		},
		{ title: "Role", dataIndex: "roleName", width: 140 },
		{
			title: "Status",
			dataIndex: "isActive",
			width: 120,
			render: (active: boolean) =>
				active ? (
					<Tag color="green">Active</Tag>
				) : (
					<Tag color="red">Inactive</Tag>
				),
		},
		{
			title: "Actions",
			key: "actions",
			width: 200,
			render: (_, record) => (
				<Space>
					<Button icon={<EyeOutlined />} onClick={() => onViewDetail(record)}>
						View
					</Button>
					<Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
						Edit
					</Button>
					<Button
						danger
						icon={<DeleteOutlined />}
						onClick={() => onDelete(record)}
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	const onSearch = () => {
		fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword);
		setPagination({ ...pagination, current: 1 });
	};

	const onReset = () => {
		setKeyword("");
		fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, "");
		setPagination({ ...pagination, current: 1 });
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
				fetchData(
					pagination.current || 1,
					pagination.pageSize || DEFAULT_PAGE_SIZE,
					keyword
				);
			} else {
				message.error(res.message || "Create failed");
			}
		} catch (err) {
			// Inform user when validation fails or request throws
			message.error("Could not create user. Please check the form inputs.");
			console.error(err);
		}
	};

	const onViewDetail = async (user: User) => {
		setLoadingDetail(true);
		setIsDetailOpen(true);
		const res = await userService.getById(user.userId);
		if (res.status === "Success" && res.data) {
			setDetailUser(res.data);
		} else {
			message.error(res.message || "Failed to fetch user details");
		}
		setLoadingDetail(false);
	};

	const onEdit = (user: User) => {
		setEditingUser(user);
		editForm.setFieldsValue({
			email: user.email,
			fullName: user.fullName || undefined,
			password: "",
			roleId: 1, // You need to map roleName to roleId
			isActive: user.isActive,
		});
		setIsEditOpen(true);
	};

	const onUpdate = async () => {
		if (!editingUser) return;
		try {
			const values = await editForm.validateFields();
			const res = await userService.update(editingUser.userId, values);
			if (res.status === "Success") {
				message.success("User updated");
				setIsEditOpen(false);
				setEditingUser(null);
				fetchData(
					pagination.current || 1,
					pagination.pageSize || DEFAULT_PAGE_SIZE,
					keyword
				);
			} else {
				message.error(res.message || "Update failed");
			}
		} catch (err) {
			message.error("Could not update user. Please check the form inputs.");
			console.error(err);
		}
	};

	const onDelete = (user: User) => {
		Modal.confirm({
			title: `Delete user ${user.email}?`,
			content: "This feature is not available in the current API.",
			okButtonProps: { disabled: true },
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
					current: pagination.current,
					pageSize: pagination.pageSize,
					total,
					showSizeChanger: true,
				}}
				onChange={onChangePage}
			/>

			<Modal
				open={isCreateOpen}
				title="Create user"
				onCancel={() => setIsCreateOpen(false)}
				onOk={onCreate}
				okText="Create"
			>
				<Form form={createForm} layout="vertical">
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
					<Form.Item
						name="roleId"
						label="Role"
						rules={[{ required: true }]}
						initialValue={1}
					>
						<Select
							options={[
								{ label: "System Admin", value: 1 },
								{ label: "System Manager", value: 2 },
								{ label: "System Staff", value: 3 },
								{ label: "HR Manager", value: 4 },
								{ label: "HR Recruiter", value: 5 },
							]}
						/>
					</Form.Item>
					<Form.Item
						name="isActive"
						label="Active"
						valuePropName="checked"
						initialValue={true}
					>
						<Switch />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				open={isEditOpen}
				title={`Edit user: ${editingUser?.email || ""}`}
				onCancel={() => setIsEditOpen(false)}
				onOk={onUpdate}
				okText="Save"
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
					<Form.Item
						name="password"
						label="Password (leave empty to keep current)"
					>
						<Input.Password />
					</Form.Item>
					<Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
						<Select
							options={[
								{ label: "System Admin", value: 1 },
								{ label: "System Manager", value: 2 },
								{ label: "System Staff", value: 3 },
								{ label: "HR Manager", value: 4 },
								{ label: "HR Recruiter", value: 5 },
							]}
						/>
					</Form.Item>
					<Form.Item name="isActive" label="Active" valuePropName="checked">
						<Switch />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				open={isDetailOpen}
				title="User Details"
				onCancel={() => {
					setIsDetailOpen(false);
					setDetailUser(null);
				}}
				footer={[
					<Button key="close" onClick={() => setIsDetailOpen(false)}>
						Close
					</Button>,
				]}
				width={600}
			>
				{loadingDetail ? (
					<div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
				) : detailUser ? (
					<div>
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
									{detailUser.loginProviders.map((provider, index) => (
										<Tag
											key={index}
											color={provider.isActive ? "blue" : "gray"}
										>
											{provider.authProvider}
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
					</div>
				) : (
					<div>No user data available</div>
				)}
			</Modal>
		</div>
	);
}
