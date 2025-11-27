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

export interface RecruitmentTypeListResult {
  items: RecruitmentType[];
  total: number;
}

// Map từ BE schema -> FE schema
function mapEmploymentType(item: any): RecruitmentType {
  return {
    recruitmentTypeId: item.employTypeId,
    name: item.name,
    isActive: item.isActive,
    createdAt: item.createdAt,
  };
}

// Base URL theo API_ENDPOINTS mới
const PUBLIC_BASE = API_ENDPOINTS.EMPLOYMENT_TYPE.PUBLIC_GET;        // /public/employment-types
const SYSTEM_BASE = API_ENDPOINTS.EMPLOYMENT_TYPE.SYSTEM_CREATE;     // /system/employment-types

export const recruitmentTypeService = {
  // ================== GET (PUBLIC) ==================
  // BE chỉ có PUBLIC_GET, nên list & detail vẫn dùng public
  async getAll(
    params: RecruitmentTypeQuery = {}
  ): Promise<RecruitmentTypeListResult> {
    const res = await api.get<ApiResponse<any>>(PUBLIC_BASE, { params });

    const payload = res.data?.data;

    // BE có thể trả:
    // - data: [ ... ]
    // - hoặc data: { items: [...], total: number }
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
      ? payload.items
      : [];

    const mapped = list.map(mapEmploymentType);

    const total =
      typeof payload?.total === "number" ? payload.total : mapped.length;

    return {
      items: mapped,
      total,
    };
  },

  async getById(id: number): Promise<RecruitmentType> {
    const res = await api.get<ApiResponse<any>>(
      API_ENDPOINTS.EMPLOYMENT_TYPE.PUBLIC_GET_BY_ID(id)
    );
    const item = res.data?.data;
    return mapEmploymentType(item);
  },

  // ================== CRUD (SYSTEM) ==================

  async create(data: { name: string }): Promise<void> {
    // POST /system/employment-types
    await api.post(SYSTEM_BASE, data);
  },

  async update(id: number, data: { name: string }): Promise<void> {
    // PATCH /system/employment-types/{id}
    await api.patch(API_ENDPOINTS.EMPLOYMENT_TYPE.SYSTEM_UPDATE(id), data);
  },

  async remove(id: number): Promise<void> {
    // DELETE /system/employment-types/{id}
    await api.delete(API_ENDPOINTS.EMPLOYMENT_TYPE.SYSTEM_DELETE(id));
  },
};
