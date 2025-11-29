import { Tag } from "antd";

interface SpecializationStatusTagProps {
  isActive: boolean;
}

export default function SpecializationStatusTag({
  isActive,
}: SpecializationStatusTagProps) {
  return isActive ? (
    <Tag color="green">Active</Tag>
  ) : (
    <Tag color="red">Inactive</Tag>
  );
}
