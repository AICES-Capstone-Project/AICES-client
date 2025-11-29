import { Tag } from "antd";

interface RecruitmentTypeStatusTagProps {
  isActive: boolean;
}

export default function RecruitmentTypeStatusTag({
  isActive,
}: RecruitmentTypeStatusTagProps) {
  return isActive ? (
    <Tag color="green">Active</Tag>
  ) : (
    <Tag color="red">Inactive</Tag>
  );
}
