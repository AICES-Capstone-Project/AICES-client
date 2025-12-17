// src/services/recruitmentTypeService.ts

import api from "./api";
import { API_ENDPOINTS } from "./config";
import type { RecruitmentType } from "../types/recruitmentType.types";
import type { ApiResponse } from "../types/api.types";

export interface RecruitmentTypeQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

// ✅ Shape đúng theo BE response bạn gửi
export interface EmploymentTypeListData {
  employmentTypes: RecruitmentType[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

// Base URL theo API_ENDPOINTS
const PUBLIC_BASE = API_ENDPOINTS.EMPLOYMENT_TYPE.PUBLIC_GET; // /public/employment-types
const SYSTEM_BASE = API_ENDPOINTS.EMPLOYMENT_TYPE.SYSTEM_CREATE; // /system/employment-types

export const recruitmentTypeService = {
  // ================== GET (PUBLIC) ==================
  // List & detail dùng public
  getAll(params: RecruitmentTypeQuery = {}) {
    // ✅ đồng bộ pattern với Skill/Level/Language: return AxiosResponse<ApiResponse<...>>
    return api.get<ApiResponse<EmploymentTypeListData>>(PUBLIC_BASE, {
      params,
    });
  },

  getById(id: number) {
    return api.get<ApiResponse<RecruitmentType>>(
      API_ENDPOINTS.EMPLOYMENT_TYPE.PUBLIC_GET_BY_ID(id)
    );
  },

  // ================== CRUD (SYSTEM) ==================
  create(data: { name: string }) {
    return api.post<ApiResponse<RecruitmentType>>(SYSTEM_BASE, data);
  },

  update(id: number, data: { name: string }) {
    return api.patch<ApiResponse<RecruitmentType>>(
      API_ENDPOINTS.EMPLOYMENT_TYPE.SYSTEM_UPDATE(id),
      data
    );
  },

  remove(id: number) {
    return api.delete<ApiResponse<null>>(
      API_ENDPOINTS.EMPLOYMENT_TYPE.SYSTEM_DELETE(id)
    );
  },
};
