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
} from "@ant-design/icons";
import {
	userService,
	type AdminUser,
	type CreateUserRequest,
	type UpdateUserRequest,
} from "../../../services/userService";

const DEFAULT_PAGE_SIZE = 10;

export default function Accounts() {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [total, setTotal] = useState(0);
	const [keyword, setKeyword] = useState("");
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: DEFAULT_PAGE_SIZE,
	});

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

	const [createForm] = Form.useForm<CreateUserRequest>();
	const [editForm] = Form.useForm<UpdateUserRequest>();

	const fetchData = async (page = 1, pageSize = DEFAULT_PAGE_SIZE, kw = "") => {
		setLoading(true);
		const res = await userService.list({ page, pageSize, keyword: kw });
		if (res.status === 200 && res.data) {
			setUsers(res.data.items);
			setTotal(res.data.total);
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

	const columns: ColumnsType<AdminUser> = [
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
			width: 180,
			render: (_, record) => (
				<Space>
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
			if (res.status === 200) {
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

	const onEdit = (user: AdminUser) => {
		setEditingUser(user);
		editForm.setFieldsValue({
			fullName: user.fullName || undefined,
			roleName: user.roleName,
			isActive: user.isActive,
		});
		setIsEditOpen(true);
	};

	const onUpdate = async () => {
		if (!editingUser) return;
		try {
			const values = await editForm.validateFields();
			const res = await userService.update(editingUser.userId, values);
			if (res.status === 200) {
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

	const onDelete = (user: AdminUser) => {
		Modal.confirm({
			title: `Delete user ${user.email}?`,
			okText: "Delete",
			okButtonProps: { danger: true },
			icon: undefined,
			onOk: async () => {
				const res = await userService.remove(user.userId);
				if (res.status === 200) {
					message.success("User deleted");
					fetchData(
						pagination.current || 1,
						pagination.pageSize || DEFAULT_PAGE_SIZE,
						keyword
					);
				} else {
					message.error(res.message || "Delete failed");
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
					<Form.Item name="fullName" label="Full name">
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
						name="roleName"
						label="Role"
						rules={[{ required: true }]}
						initialValue="User"
					>
						<Select
							options={[
								{ value: "Admin" },
								{ value: "Employer" },
								{ value: "User" },
							]}
						/>
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
					<Form.Item name="fullName" label="Full name">
						<Input />
					</Form.Item>
					<Form.Item name="roleName" label="Role" rules={[{ required: true }]}>
						<Select
							options={[
								{ value: "Admin" },
								{ value: "Employer" },
								{ value: "User" },
							]}
						/>
					</Form.Item>
					<Form.Item name="isActive" label="Active" valuePropName="checked">
						<Switch />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
