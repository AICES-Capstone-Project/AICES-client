// src/services/systemReportExportService.ts
import api from "./api";
import { API_ENDPOINTS } from "./config";

export type ReportExportFormat = "excel" | "pdf";

export interface ExportReportResult {
  blob: Blob;
  filename?: string;
}

const getFilenameFromContentDisposition = (cd?: string): string | undefined => {
  if (!cd) return undefined;

  // Support: filename=abc.xlsx OR filename*=UTF-8''abc.xlsx
  const utf8Match = cd.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1].replace(/"/g, ""));

  const normalMatch = cd.match(/filename=([^;]+)/i);
  if (normalMatch?.[1]) return normalMatch[1].trim().replace(/"/g, "");

  return undefined;
};

export const systemReportExportService = {
  async exportReport(format: ReportExportFormat): Promise<ExportReportResult> {
    const url =
      format === "excel"
        ? API_ENDPOINTS.SYSTEM_REPORTS.EXPORT_EXCEL
        : API_ENDPOINTS.SYSTEM_REPORTS.EXPORT_PDF;

    const response = await api.request({
      url,
      method: "GET",
      responseType: "blob",
    });

    const filename = getFilenameFromContentDisposition(
      response.headers?.["content-disposition"]
    );

    return { blob: response.data as Blob, filename };
  },
};
