// src/pages/SystemPages/Subscriptions/components/plans/PlanStatusTag.tsx

import { Tag } from "antd";

interface PlanStatusTagProps {
  isActive: boolean;
}

export default function PlanStatusTag({ isActive }: PlanStatusTagProps) {
  return isActive ? (
    <Tag color="green">Active</Tag>
  ) : (
    <Tag color="default">Inactive</Tag>
  );
}
