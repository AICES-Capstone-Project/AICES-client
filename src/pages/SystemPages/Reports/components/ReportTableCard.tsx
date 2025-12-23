import React from "react";
import { Card } from "antd";

import ReportExportDropdown from "./ReportExportDropdown";
import type {
  ReportSection,
  ReportExportFormat,
} from "../../../../services/systemReportExportService";

type ReportTableCardProps = {
  title: React.ReactNode;
  section: ReportSection;                // ✅ card biết section
  loading?: boolean;
  exporting?: boolean;
  onExport: (section: ReportSection, format: ReportExportFormat) => void;
  children: React.ReactNode;
};

export default function ReportTableCard({
  title,
  section,
  loading,
  exporting,
  onExport,
  children,
}: ReportTableCardProps) {
  return (
    <Card
      title={title}
      loading={loading}
      className="aices-card"
      style={{ borderRadius: 16 }}
      bodyStyle={{ paddingTop: 8 }}
      extra={
        <ReportExportDropdown
          exporting={exporting}
          size="small"
          onExport={(format) => onExport(section, format)} // ✅ export đúng section
        />
      }
    >
      {children}
    </Card>
  );
}
