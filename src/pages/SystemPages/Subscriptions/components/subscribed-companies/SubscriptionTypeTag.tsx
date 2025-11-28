// src/pages/SystemPages/Subscriptions/components/subscribed-companies/SubscriptionTypeTag.tsx

import { Tag } from "antd";

interface SubscriptionTypeTagProps {
  status: string;
}

export default function SubscriptionTypeTag({
  status,
}: SubscriptionTypeTagProps) {
  const lower = status.toLowerCase();

  let color: "green" | "gold" | "default" | "red" = "default";

  if (lower === "active") color = "green";
  else if (lower === "pending") color = "gold";
  else if (lower === "expired" || lower === "cancelled") color = "red";

  return <Tag color={color}>{status}</Tag>;
}
