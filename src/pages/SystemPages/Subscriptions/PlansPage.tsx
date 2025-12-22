// src/pages/SystemPages/Subscriptions/PlansPage.tsx

import { useEffect, useMemo, useState } from "react";
import { Card, Form, message, Input, Button, Modal } from "antd";
import { useAppSelector } from "../../../hooks/redux";

import { subscriptionService } from "../../../services/subscriptionService";
import type { SubscriptionPlan } from "../../../types/subscription.types";

import PlansTable from "./components/plans/PlansTable";
import PlanFormModal from "./components/plans/PlanFormModal";
import type { SubscriptionPlanFormValues } from "./components/plans/PlanFormModal";
import PlansToolbar from "./components/plans/PlansToolbar";

export default function PlansPage() {
  const [loading, setLoading] = useState(false);
  // ================= PERMISSION =================
  const { user } = useAppSelector((state) => state.auth);
  const normalizedRole = (user?.roleName || "")
    .replace(/_/g, " ")
    .toLowerCase();
  const canManagePlans = normalizedRole === "system admin"; // ✅ chỉ admin được tạo/sửa/xóa

  // ✅ giữ raw plans, filter realtime bằng useMemo
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [filter, setFilter] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [form] = Form.useForm<SubscriptionPlanFormValues>();

  // 🔥 Delete confirm modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionPlan | null>(
    null
  );
  const [deleteText, setDeleteText] = useState("");

  // ================= LOAD =================
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getAll();
      setPlans(data); // ✅ không filter ở đây nữa
    } catch {
      message.error("Failed to load subscription plans");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ realtime filter
  const filteredPlans = useMemo(() => {
    const kw = filter.trim().toLowerCase();
    if (!kw) return plans;

    return plans.filter((p) => (p.name || "").toLowerCase().includes(kw));
  }, [plans, filter]);

  // ================= CREATE =================
  const handleOpenCreate = () => {
    setEditingPlan(null);
    form.resetFields();
    form.setFieldsValue({
      price: 0,
      duration: "Monthly", // ✅ FIX: đúng case theo BE
      resumeLimit: 0,
      hoursLimit: 0,
      compareLimit: 0, // ✅ ADD
      compareHoursLimit: 1, // ✅ ADD (default hợp lý)
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

      compareLimit: record.compareLimit, // ✅ ADD
      compareHoursLimit: record.compareHoursLimit, // ✅ ADD

      stripePriceId: record.stripePriceId,
    });
    setModalVisible(true);
  };

  // ================= DELETE (open modal) =================
  const handleOpenDeleteConfirm = (plan: SubscriptionPlan) => {
    setDeleteTarget(plan);
    setDeleteText("");
    setDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteTarget(null);
    setDeleteText("");
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setLoading(true);
      await subscriptionService.delete(deleteTarget.subscriptionId);
      message.success("Deleted successfully");
      handleCancelDelete();
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

        compareLimit: values.compareLimit, // ✅ ADD
        compareHoursLimit: values.compareHoursLimit, // ✅ ADD

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

  const isDeleteDisabled = deleteText.trim().toLowerCase() !== "delete";

  return (
    <div className="page-layout">
      <Card className="aices-card">
        <PlansToolbar
          keyword={filter}
          onKeywordChange={setFilter}
          onReset={() => setFilter("")}
          onCreate={canManagePlans ? handleOpenCreate : undefined}
        />

        {/* Table */}
        <div className="accounts-table-wrapper">
          <PlansTable
            loading={loading}
            plans={filteredPlans}
            onEdit={canManagePlans ? handleOpenEdit : undefined}
            onDelete={canManagePlans ? handleOpenDeleteConfirm : undefined}
          />
        </div>
      </Card>

      <PlanFormModal
        open={modalVisible}
        loading={loading}
        editingPlan={editingPlan}
        form={form}
        onCancel={() => {
          setModalVisible(false);
          setEditingPlan(null);
          form.resetFields();
        }}
        onSubmit={handleSubmit}
      />

      <Modal
        open={deleteModalVisible}
        title="Delete subscription plan"
        onCancel={handleCancelDelete}
        footer={[
          <Button key="cancel" onClick={handleCancelDelete}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            style={{
              backgroundColor: "var(--aices-green)",
              borderColor: "var(--aices-green)",
            }}
            disabled={isDeleteDisabled}
            loading={loading}
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>,
        ]}
      >
        <p style={{ marginBottom: 8 }}>
          Are you sure you want to delete plan{" "}
          <strong>{deleteTarget?.name}</strong>?
        </p>

        <p style={{ marginBottom: 16 }}>
          <strong>You must type "delete" to confirm.</strong>
        </p>

        <Input
          value={deleteText}
          onChange={(e) => setDeleteText(e.target.value)}
          placeholder='Type "delete" here...'
        />
      </Modal>
    </div>
  );
}
