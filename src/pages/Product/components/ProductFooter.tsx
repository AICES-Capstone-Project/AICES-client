import { Typography } from "antd";

const { Text } = Typography;

export default function ProductFooter({
  right,
}: {
  right?: string;
}) {
  return (
    <div className="product-footer">
      <Text className="product-footer-left">© 2025 AICES. All rights reserved.</Text>
      <Text className="product-footer-right">{right ?? "Product"}</Text>
    </div>
  );
}
