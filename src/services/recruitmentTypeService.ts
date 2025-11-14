// src/services/recruitmentTypeService.ts

import api from "./api";
import type { RecruitmentType } from "../types/recruitmentType.types";

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

const BASE = "/employment-types";

export const recruitmentTypeService = {
  async getAll(params: RecruitmentTypeQuery = {}): Promise<RecruitmentTypeListResult> {
    const res = await api.get(BASE, { params });

    const payload = res.data?.data;

    // BE hiện tại trả mảng đơn thuần: data: [ ... ]
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
    const res = await api.get(`${BASE}/${id}`);
    const item = res.data?.data;
    return mapEmploymentType(item);
  },

  async create(data: { name: string }): Promise<void> {
    await api.post(BASE, data);
  },

  async update(id: number, data: { name: string }): Promise<void> {
    await api.patch(`${BASE}/${id}`, data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};
