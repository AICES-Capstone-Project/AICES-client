import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "../../../services/subscriptionService";
import SubscriptionDrawer from "./components/SubscriptionDrawer";
import { toastError } from "../../../components/UI/Toast";

interface SubscriptionPlan {
	subscriptionId: number;
	name: string;
	description: string;
	limit?: string;
	price: string;
	status: "Active" | "Inactive" | "Pending";
	durationDays: number;
	createdAt?: string;
}

const CompanyClients: React.FC = () => {
	const navigate = useNavigate();
	const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
	const [filteredSubscriptions, setFilteredSubscriptions] = useState<
		SubscriptionPlan[]
	>([]);
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
			const data = await subscriptionService.getPublic();

			// Map API response to SubscriptionPlan interface
			const mappedPlans: SubscriptionPlan[] = data.map((sub: any) => ({
				subscriptionId: sub.subscriptionId,
				name: sub.name,
				description: sub.description || "—",
				resumeLimit: sub.resumeLimit,
				price: `${sub.price.toLocaleString()} VND`,
				status: sub.isActive ? "Active" : "Inactive",
				durationDays: sub.durationDays,
				hoursLimit: sub.hoursLimit,
				createdAt: sub.createdAt,
			}));

			setSubscriptions(mappedPlans);
			setFilteredSubscriptions(mappedPlans);
		} catch (error) {
			console.error("Failed to load subscriptions:", error);
			toastError("Failed to load subscriptions");
		} finally {
			setLoading(false);
		}
	};

	const handleViewMySubscription = () => {
		navigate("/company/my-subscription");
	};

	const handleSearch = (value: string) => {
		setSearchText(value);
		const v = value.trim().toLowerCase();
		if (!v) {
			setFilteredSubscriptions(subscriptions);
			return;
		}
		const filtered = subscriptions.filter(
			(plan) =>
				plan.name.toLowerCase().includes(v) ||
				plan.description.toLowerCase().includes(v) ||
				plan.price?.toLowerCase().includes(v)
		);
		setFilteredSubscriptions(filtered);
	};

	const handleView = async (plan: SubscriptionPlan) => {
		try {
			const subscription = await subscriptionService.getById(
				plan.subscriptionId
			);
			setSelectedSubscription(subscription);
			setViewDrawerOpen(true);
		} catch (error) {
			console.error("Failed to load subscription details:", error);
			toastError("Failed to load subscription details");
		}
	};

	const handleUpgrade = (plan: SubscriptionPlan) => {
		// Navigate to checkout page with subscription data
		navigate(`/company/checkout/${plan.subscriptionId}`, {
			state: {
				subscriptionName: plan.name,
				price: parseFloat(plan.price.replace(/[^0-9.-]+/g, "")),
				description: plan.description,
				durationDays: plan.durationDays,
			},
		});
	};

	const columns: ColumnsType<SubscriptionPlan> = [
		{
			title: <div style={{ textAlign: "center" }}>No</div>,
			width: 60,
			align: "center" as const,
			render: (_: any, __: SubscriptionPlan, index: number) => index + 1,
		},
		{
			title: <div style={{ textAlign: "center" }}>Plan Name</div>,
			dataIndex: "name",
			width: 270,
			align: "center" as const,
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: <div style={{ textAlign: "center" }}>Price</div>,
			dataIndex: "price",
			width: 180,
			align: "center" as const,
			render: (price?: string) => price || "—",
		},
		{
			title: <div style={{ textAlign: "center" }}>Duration (Days)</div>,
			dataIndex: "durationDays",
			width: 150,
			align: "center" as const,
		},
		{
			title: <div style={{ textAlign: "center" }}>Actions</div>,
			key: "actions",
			fixed: "right",
			width: 180,
			align: "center" as const,
			render: (_: any, record: SubscriptionPlan) => (
				<Space>
					<Button
						className="company-btn"
						size="small"
						onClick={() => handleView(record)}
					>
						View
					</Button>
					<Button
						className="company-btn--filled"
						size="small"
						onClick={() => handleUpgrade(record)}
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
					<Button
						className="company-btn"
						onClick={() => navigate("/company/payment-history")}
					>
						Payment History
					</Button>
					<Button
						className="company-btn--filled"
						onClick={handleViewMySubscription}
					>
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
				rowKey="subscriptionId"
				loading={loading}
				dataSource={filteredSubscriptions}
				columns={columns}
				pagination={{ pageSize: 10 }}
				scroll={{ x: 840 }}
			/>

			<SubscriptionDrawer
				open={viewDrawerOpen}
				onClose={() => {
					setViewDrawerOpen(false);
					setSelectedSubscription(null);
				}}
				subscription={selectedSubscription}
			/>
		</Card>
	);
};

export default CompanyClients;
