// src/pages/SystemPages/Reports/components/ReportExportDropdown.tsx
import React from "react";
import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import type { ReportExportFormat } from "../../../../services/systemReportExportService";

type ReportExportDropdownProps = {
  exporting?: boolean;
  onExport: (format: ReportExportFormat) => void;
  /** optional: disable 1 format (vd: ["pdf"]) */
  disabledFormats?: ReportExportFormat[];
  /** optional: button size */
  size?: "small" | "middle" | "large";
};

export default function ReportExportDropdown({
  exporting = false,
  onExport,
  disabledFormats = [],
  size = "middle",
}: ReportExportDropdownProps) {
  const isDisabled = (f: ReportExportFormat) => disabledFormats.includes(f);

  const items = React.useMemo<MenuProps["items"]>(
    () => [
      {
        key: "excel",
        label: "Export Excel (.xlsx)",
        disabled: exporting || isDisabled("excel"),
        onClick: () => onExport("excel"),
      },
      {
        key: "pdf",
        label: "Export PDF (.pdf)",
        disabled: exporting || isDisabled("pdf"),
        onClick: () => onExport("pdf"),
      },
    ],
    [exporting, onExport, disabledFormats]
  );

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      disabled={exporting}
      placement="bottomRight"
    >
      <Button
        icon={<DownloadOutlined />}
        loading={exporting}
        className="btn-aices"
        size={size}
      >
        <Space>Export</Space>
      </Button>
    </Dropdown>
  );
}
