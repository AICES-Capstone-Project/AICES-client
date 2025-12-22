
import { Card, Skeleton } from "antd";

type ReportLoadingProps = {
  title?: string;
  rows?: number;
};

export default function ReportLoading({ title, rows = 3 }: ReportLoadingProps) {
  return (
    <Card title={title} className="aices-card">
      <Skeleton active paragraph={{ rows }} />
    </Card>
  );
}
