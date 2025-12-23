// src/services/systemReportExportService.ts
import api from "./api";
import { API_ENDPOINTS } from "./config";

export type ReportExportFormat = "excel" | "pdf";

export type ReportSection =
  | "executive-summary"
  | "companies-overview"
  | "companies-usage"
  | "jobs-statistics"
  | "jobs-effectiveness"
  | "ai-parsing"
  | "ai-scoring"
  | "subscriptions";

/**
 * Map section -> endpoint base
 * (KHÓA CONTRACT theo swagger đã check)
 */
const EXPORT_ENDPOINT_MAP: Record<ReportSection, string> = {
  "executive-summary":
    API_ENDPOINTS.SYSTEM_REPORTS.EXECUTIVE_SUMMARY,
  "companies-overview":
    API_ENDPOINTS.SYSTEM_REPORTS.COMPANIES_OVERVIEW,
  "companies-usage":
    API_ENDPOINTS.SYSTEM_REPORTS.COMPANIES_USAGE,
  "jobs-statistics":
    API_ENDPOINTS.SYSTEM_REPORTS.JOBS_STATISTICS,
  "jobs-effectiveness":
    API_ENDPOINTS.SYSTEM_REPORTS.JOBS_EFFECTIVENESS,
  "ai-parsing":
    API_ENDPOINTS.SYSTEM_REPORTS.AI_PARSING,
  "ai-scoring":
    API_ENDPOINTS.SYSTEM_REPORTS.AI_SCORING,
  "subscriptions":
    API_ENDPOINTS.SYSTEM_REPORTS.SUBSCRIPTIONS,
};

export const systemReportExportService = {
  /**
   * Export report theo section + format (excel/pdf)
   */
  async exportReport(
    section: ReportSection,
    format: ReportExportFormat
  ): Promise<Blob> {
    const baseEndpoint = EXPORT_ENDPOINT_MAP[section];

    if (!baseEndpoint) {
      throw new Error(`Unsupported report section: ${section}`);
    }

    const url = `${baseEndpoint}/${format}`;

    const response = await api.request({
      url,
      method: "GET",
      responseType: "blob",
    });

    return response.data as Blob;
  },
};
