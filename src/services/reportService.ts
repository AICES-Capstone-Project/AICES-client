import api from "./api";
import { API_ENDPOINTS } from "./config";

export const reportService = {
  exportJobExcel: async (campaignId: number, jobId: number): Promise<any> => {
    try {
      const resp = await api.get(API_ENDPOINTS.COMPANY_REPORT.JOBS_EXCEL(campaignId, jobId), {
        responseType: "blob",
      });
      return {
        ok: true,
        statusCode: resp.status,
        data: null,
        message: null,
        blob: resp.data,
      } as any;
    } catch (err: any) {
      const r = err?.response;
      const payload = r?.data ?? null;
      let message = err?.message || 'Export failed';
      try {
        if (payload) {
          if (payload instanceof Blob && typeof payload.text === 'function') {
            const txt = await payload.text();
            try {
              const parsed = JSON.parse(txt);
              message = parsed?.message || parsed?.error || txt || message;
            } catch (_) {
              message = txt || message;
            }
          } else if (typeof payload === 'string') {
            try {
              const parsed = JSON.parse(payload);
              message = parsed?.message || parsed?.error || payload || message;
            } catch (_) {
              message = payload || message;
            }
          } else if (typeof payload === 'object' && payload !== null) {
            message = payload.message || payload.error || message;
          }
        }
      } catch (ex) {
        // ignore parsing errors, keep default message
      }
      return { ok: false, statusCode: r?.status || 500, data: payload, message } as any;
    }
  },

  exportJobPdf: async (campaignId: number, jobId: number): Promise<any> => {
    try {
      const resp = await api.get(API_ENDPOINTS.COMPANY_REPORT.JOBS_PDF(campaignId, jobId), {
        responseType: "blob",
      });
      return {
        ok: true,
        statusCode: resp.status,
        data: null,
        message: null,
        blob: resp.data,
      } as any;
    } catch (err: any) {
      const r = err?.response;
      const payload = r?.data ?? null;
      let message = err?.message || 'Export failed';
      try {
        if (payload) {
          if (payload instanceof Blob && typeof payload.text === 'function') {
            const txt = await payload.text();
            try {
              const parsed = JSON.parse(txt);
              message = parsed?.message || parsed?.error || txt || message;
            } catch (_) {
              message = txt || message;
            }
          } else if (typeof payload === 'string') {
            try {
              const parsed = JSON.parse(payload);
              message = parsed?.message || parsed?.error || payload || message;
            } catch (_) {
              message = payload || message;
            }
          } else if (typeof payload === 'object' && payload !== null) {
            message = payload.message || payload.error || message;
          }
        }
      } catch (ex) {
        // ignore parsing errors
      }
      return { ok: false, statusCode: r?.status || 500, data: payload, message } as any;
    }
  },
};

export default reportService;