// src/services/specializationService.ts

import api from "./api";
import type { Specialization, SpecializationListParams } from "../types/specialization.types";
import type { ApiResponse } from "../types/api.types";

interface SpecializationListResponse {
  specializations: Specialization[];
  totalCount?: number; // BE có thể trả hoặc không, FE tự fallback
}

export const specializationService = {
  getSpecializations(params?: SpecializationListParams) {
    return api.get<ApiResponse<SpecializationListResponse>>("/specializations", {
      params,
    });
  },

  getById(id: number) {
    return api.get<ApiResponse<Specialization>>(`/specializations/${id}`);
  },

  create(payload: { name: string; categoryId: number }) {
    return api.post<ApiResponse<Specialization>>("/specializations", payload);
  },

  update(id: number, payload: { name: string; categoryId: number }) {
    return api.patch<ApiResponse<Specialization>>(`/specializations/${id}`, payload);
  },

  delete(id: number) {
    return api.delete<ApiResponse<null>>(`/specializations/${id}`);
  },
};
