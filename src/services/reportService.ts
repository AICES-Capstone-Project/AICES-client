import api from "./api";
import { API_ENDPOINTS } from "./config";

export const reportService = {
  exportJobExcel: async (campaignId: number, jobId: number): Promise<Blob> => {
    const resp = await api.get(API_ENDPOINTS.COMPANY_REPORT.JOBS_EXCEL(campaignId, jobId), {
      responseType: "blob",
    });
    return resp.data as Blob;
  },

  exportJobPdf: async (campaignId: number, jobId: number): Promise<Blob> => {
    const resp = await api.get(API_ENDPOINTS.COMPANY_REPORT.JOBS_PDF(campaignId, jobId), {
      responseType: "blob",
    });
    return resp.data as Blob;
  },
};

export default reportService;