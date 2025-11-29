import { Tag } from "antd";

interface CategoryStatusTagProps {
  isActive: boolean;
}

export default function CategoryStatusTag({ isActive }: CategoryStatusTagProps) {
  return isActive ? (
    <Tag color="green">Active</Tag>
  ) : (
    <Tag color="red">Inactive</Tag>
  );
}
