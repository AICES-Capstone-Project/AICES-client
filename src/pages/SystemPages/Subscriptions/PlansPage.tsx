// src/pages/SystemPages/Subscriptions/PlansPage.tsx

import { useEffect, useState } from "react";
import { Card, Form, message } from "antd";
import { subscriptionService } from "../../../services/subscriptionService";
import type { SubscriptionPlan } from "../../../types/subscription.types";

import PlansToolbar from "./components/plans/PlansToolbar";
import PlansTable from "./components/plans/PlansTable";
import PlanFormModal from "./components/plans/PlanFormModal";
import type { SubscriptionPlanFormValues } from "./components/plans/PlanFormModal";


export default function PlansPage() {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [form] = Form.useForm<SubscriptionPlanFormValues>();

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getAll();
      setPlans(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
    } as Partial<SubscriptionPlanFormValues>);
    setModalVisible(true);
  };

  const handleOpenEdit = (record: SubscriptionPlan) => {
    setEditingPlan(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      durationDays: record.durationDays,
      limit: record.limit,
      isActive: record.isActive,
    });
    setModalVisible(true);
  };

  const handleDelete = async (plan: SubscriptionPlan) => {
    try {
      setLoading(true);
      await subscriptionService.delete(plan.subscriptionId);
      message.success("Deleted subscription plan successfully");
      fetchPlans();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete subscription plan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        durationDays: values.durationDays,
        limit: values.limit,
        isActive: values.isActive,
      };

      if (editingPlan) {
        await subscriptionService.update(editingPlan.subscriptionId, payload);
        message.success("Updated subscription plan successfully");
      } else {
        await subscriptionService.create(payload);
        message.success("Created subscription plan successfully");
      }

      setModalVisible(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (err: any) {
      if (err?.errorFields) return; // lỗi validate form, không show toast
      console.error(err);
      message.error("Failed to save subscription plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <PlansToolbar onReload={fetchPlans} onCreate={handleOpenCreate} />

      <PlansTable
        loading={loading}
        plans={plans}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <PlanFormModal
        open={modalVisible}
        loading={loading}
        editingPlan={editingPlan}
        form={form}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
