import { Typography } from "antd";

const { Text } = Typography;

export default function ResourcesFooter({
  right,
}: {
  right?: string;
}) {
  return (
    <div className="resources-footer">
      <Text className="resources-footer-left">
        © 2025 AICES. All rights reserved.
      </Text>
      <Text className="resources-footer-right">
        {right ?? "Resources"}
      </Text>
    </div>
  );
}
