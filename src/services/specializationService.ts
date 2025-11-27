// src/services/specializationService.ts

import api from "./api";
import type {
  Specialization,
  SpecializationListParams,
} from "../types/specialization.types";
import type { ApiResponse } from "../types/api.types";
import { API_ENDPOINTS } from "./config";

// Response dạng paging đơn giản
interface SpecializationListResponse {
  specializations: Specialization[];
  totalCount?: number; // BE có thể trả hoặc không, FE tự fallback
}

// Base URL theo config mới
const PUBLIC_SPECIALIZATION_BASE_URL = API_ENDPOINTS.SPECIALIZATION.PUBLIC_GET;
const SYSTEM_SPECIALIZATION_BASE_URL = API_ENDPOINTS.SPECIALIZATION.SYSTEM_GET;

export const specializationService = {
  // ===================== PUBLIC =====================

  // GET list public
  getSpecializations(params?: SpecializationListParams) {
    return api.get<ApiResponse<SpecializationListResponse>>(
      PUBLIC_SPECIALIZATION_BASE_URL,
      { params }
    );
  },

  // GET by id public
  getById(id: number) {
    return api.get<ApiResponse<Specialization>>(
      API_ENDPOINTS.SPECIALIZATION.PUBLIC_GET_BY_ID(id)
    );
  },

  // ===================== SYSTEM =====================

  // GET list system
  getSpecializationsSystem(params?: SpecializationListParams) {
    return api.get<ApiResponse<SpecializationListResponse>>(
      SYSTEM_SPECIALIZATION_BASE_URL,
      { params }
    );
  },

  // GET by id system
  getByIdSystem(id: number) {
    return api.get<ApiResponse<Specialization>>(
      API_ENDPOINTS.SPECIALIZATION.SYSTEM_GET_BY_ID(id)
    );
  },

  // CREATE (system)
  create(payload: { name: string; categoryId: number }) {
    return api.post<ApiResponse<Specialization>>(
      SYSTEM_SPECIALIZATION_BASE_URL,
      payload
    );
  },

  // UPDATE (system)
  update(id: number, payload: { name: string; categoryId: number }) {
    return api.patch<ApiResponse<Specialization>>(
      API_ENDPOINTS.SPECIALIZATION.SYSTEM_UPDATE(id),
      payload
    );
  },

  // DELETE (system)
  delete(id: number) {
    return api.delete<ApiResponse<null>>(
      API_ENDPOINTS.SPECIALIZATION.SYSTEM_DELETE(id)
    );
  },
};
