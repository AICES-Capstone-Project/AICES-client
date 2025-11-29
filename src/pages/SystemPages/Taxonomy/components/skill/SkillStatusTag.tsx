import { Tag } from "antd";

interface SkillStatusTagProps {
  isActive: boolean;
}

export default function SkillStatusTag({ isActive }: SkillStatusTagProps) {
  return isActive ? (
    <Tag color="green">Active</Tag>
  ) : (
    <Tag color="red">Inactive</Tag>
  );
}
