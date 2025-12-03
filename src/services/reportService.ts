import { get } from "./api";
import { API_ENDPOINTS } from "./config";

export const reportService = {
  exportJobExcel: (jobId: number) =>
    get<Blob>(API_ENDPOINTS.COMPANY_REPORT.JOBS_EXCEL(jobId), {
      responseType: "blob", 
    }),
    exportJobPdf: (jobId: number) =>
    get<Blob>(API_ENDPOINTS.COMPANY_REPORT.JOBS_PDF(jobId), {
      responseType: "blob",
    }),
};

export default reportService;