// src/pages/SystemPages/Subscriptions/components/subscribed-companies/SubscriptionTypeTag.tsx

import { Tag } from "antd";

interface SubscriptionTypeTagProps {
  status?: string | null;
}

export default function SubscriptionTypeTag({ status }: SubscriptionTypeTagProps) {
  if (!status) return <Tag>—</Tag>;

  const lower = status.toLowerCase();

  // map sang tone AICES (verified / unverified / locked)
  if (lower === "active") {
    return <span className="status-tag status-tag-verified">{status}</span>;
  }

  if (lower === "pending") {
    return <span className="status-tag status-tag-unverified">{status}</span>;
  }

  if (lower === "expired" || lower === "cancelled" || lower === "canceled") {
    return <span className="status-tag status-tag-locked">{status}</span>;
  }

  return <Tag>{status}</Tag>;
}
