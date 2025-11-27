// src/services/bannerService.ts
import api from "./api";
import { API_ENDPOINTS } from "./config";

export const bannerService = {
  // ===== PUBLIC =====
  getAllPublic(params?: any) {
    return api.get(API_ENDPOINTS.BANNER_CONFIG.PUBLIC_GET, { params });
  },

  getByIdPublic(id: number) {
    return api.get(API_ENDPOINTS.BANNER_CONFIG.PUBLIC_GET_BY_ID(id));
  },

  // ===== SYSTEM (System Admin) =====
  getAllSystem(params?: any) {
    return api.get(API_ENDPOINTS.BANNER_CONFIG.SYSTEM_GET, { params });
  },

  getByIdSystem(id: number) {
    return api.get(API_ENDPOINTS.BANNER_CONFIG.SYSTEM_GET_BY_ID(id));
  },

  create(formData: FormData) {
    return api.post(API_ENDPOINTS.BANNER_CONFIG.SYSTEM_CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update(id: number, formData: FormData) {
    return api.patch(
      API_ENDPOINTS.BANNER_CONFIG.SYSTEM_UPDATE(id),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  delete(id: number) {
    return api.delete(API_ENDPOINTS.BANNER_CONFIG.SYSTEM_DELETE(id));
  },
};
