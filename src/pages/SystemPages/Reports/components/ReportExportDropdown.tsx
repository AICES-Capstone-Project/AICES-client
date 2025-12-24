// src/pages/SystemPages/Reports/components/ReportExportDropdown.tsx
import React from "react";
import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import type { ReportExportFormat } from "../../../../services/systemReportExportService";

type ReportExportDropdownProps = {
  exporting?: boolean;
  onExport: (format: ReportExportFormat) => void;
  disabledFormats?: ReportExportFormat[];
  size?: "small" | "middle" | "large";
  label?: string;
};

export default function ReportExportDropdown({
  exporting = false,
  onExport,
  disabledFormats = [],
  size = "middle",
  label = "Export",
}: ReportExportDropdownProps) {
  const isDisabled = React.useCallback(
    (f: ReportExportFormat) => disabledFormats.includes(f),
    [disabledFormats]
  );

  const items = React.useMemo<MenuProps["items"]>(
    () => [
      {
        key: "excel",
        label: "Export Excel (.xlsx)",
        disabled: exporting || isDisabled("excel"),
      },
      {
        key: "pdf",
        label: "Export PDF (.pdf)",
        disabled: exporting || isDisabled("pdf"),
      },
    ],
    [exporting, isDisabled]
  );

  const handleMenuClick = React.useCallback<NonNullable<MenuProps["onClick"]>>(
    (info) => {
      const key = info.key as ReportExportFormat;
      if (key === "excel" || key === "pdf") onExport(key);
    },
    [onExport]
  );

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
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
        <Space>{label}</Space>
      </Button>
    </Dropdown>
  );
}
