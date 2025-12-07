// src/pages/SystemPages/Subscriptions/PlansPage.tsx

import { useEffect, useState } from "react";
import { Card, Form, message, Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

import { subscriptionService } from "../../../services/subscriptionService";
import type { SubscriptionPlan } from "../../../types/subscription.types";

import PlansTable from "./components/plans/PlansTable";
import PlanFormModal from "./components/plans/PlanFormModal";
import type { SubscriptionPlanFormValues } from "./components/plans/PlanFormModal";

export default function PlansPage() {
	const [loading, setLoading] = useState(false);
	const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
	const [filter, setFilter] = useState("");

	const [modalVisible, setModalVisible] = useState(false);
	const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
	const [form] = Form.useForm<SubscriptionPlanFormValues>();

	// ================= LOAD =================
	const fetchPlans = async () => {
		try {
			setLoading(true);
			const data = await subscriptionService.getAll();
			setPlans(
				filter
					? data.filter((p) =>
							p.name.toLowerCase().includes(filter.toLowerCase())
					  )
					: data
			);
		} catch (err) {
			message.error("Failed to load subscription plans");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPlans();
	}, []);

	// ================= CREATE =================
	const handleOpenCreate = () => {
		setEditingPlan(null);
		form.resetFields();
		form.setFieldsValue({
			price: 0,
			duration: "monthly",
			resumeLimit: 0,
			hoursLimit: 0,
			stripePriceId: "",
		});
		setModalVisible(true);
	};

	// ================= EDIT =================
	const handleOpenEdit = (record: SubscriptionPlan) => {
		setEditingPlan(record);
		form.setFieldsValue({
			name: record.name,
			description: record.description,
			price: record.price,
			duration: record.duration,
			resumeLimit: record.resumeLimit,
			hoursLimit: record.hoursLimit,
			stripePriceId: record.stripePriceId,
		});
		setModalVisible(true);
	};

	// ================= DELETE =================
	const handleDelete = async (plan: SubscriptionPlan) => {
		try {
			setLoading(true);
			await subscriptionService.delete(plan.subscriptionId);
			message.success("Deleted successfully");
			fetchPlans();
		} catch {
			message.error("Failed to delete subscription plan");
		} finally {
			setLoading(false);
		}
	};

	// ================= SUBMIT =================
	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);

			const payload = {
				name: values.name,
				description: values.description,
				price: values.price,
				duration: values.duration,
				resumeLimit: values.resumeLimit,
				hoursLimit: values.hoursLimit,
				stripePriceId: values.stripePriceId,
			};

			if (editingPlan) {
				await subscriptionService.update(editingPlan.subscriptionId, payload);
				message.success("Updated successfully");
			} else {
				await subscriptionService.create(payload);
				message.success("Created successfully");
			}

			setModalVisible(false);
			setEditingPlan(null);
			fetchPlans();
		} catch (err: any) {
			if (err?.errorFields) return;
			message.error("Failed to save");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="page-layout">
			<Card className="aices-card">
				{/* 🔥 Toolbar chuẩn AICES giống Company/User */}
				<div className="company-header-row">
					{/* LEFT - Search */}
					<div className="company-left" style={{ display: "flex", gap: 8 }}>
						<Input
							placeholder="Search subscription plans..."
							prefix={<SearchOutlined />}
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className="toolbar-search-input"
							style={{ height: 36, width: 260 }}
						/>

						{/* Search Button */}
						<Button className="btn-search" onClick={() => fetchPlans()}>
							<SearchOutlined /> Search
						</Button>

						{/* Reset Button */}
						<Button
							className="accounts-reset-btn"
							onClick={() => {
								setFilter("");
								fetchPlans();
							}}
						>
							Reset
						</Button>
					</div>

					{/* RIGHT - Add Plan */}
					<div className="company-right">
						<Button
							icon={<PlusOutlined />}
							className="accounts-new-btn"
							onClick={handleOpenCreate}
						>
							New Plan
						</Button>
					</div>
				</div>

				{/* Table */}
				<div className="accounts-table-wrapper">
					<PlansTable
						loading={loading}
						plans={plans}
						onEdit={handleOpenEdit}
						onDelete={handleDelete}
					/>
				</div>
			</Card>

			{/* Modal */}
			<PlanFormModal
				open={modalVisible}
				loading={loading}
				editingPlan={editingPlan}
				form={form}
				onCancel={() => setModalVisible(false)}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
