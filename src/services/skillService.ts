// src/services/skillService.ts

import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type { Skill } from "../types/skill.types";

export interface SkillListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

const PUBLIC_SKILL_BASE_URL = "/public/skills";
const SYSTEM_SKILL_BASE_URL = "/system/skills";

export const skillService = {
  // ---------- PUBLIC (GIỮ CHO FE KHÁC XÀI) ----------
  getSkills(params?: SkillListParams) {
    return api.get<ApiResponse<Skill[]>>(PUBLIC_SKILL_BASE_URL, {
      params,
    });
  },

  getSkillById(id: number) {
    return api.get<ApiResponse<Skill>>(`${PUBLIC_SKILL_BASE_URL}/${id}`);
  },

  createSkill(payload: { name: string }) {
    return api.post<ApiResponse<Skill>>(PUBLIC_SKILL_BASE_URL, payload);
  },

  updateSkill(id: number, payload: { name: string }) {
    return api.patch<ApiResponse<Skill>>(
      `${PUBLIC_SKILL_BASE_URL}/${id}`,
      payload
    );
  },

  deleteSkill(id: number) {
    return api.delete<ApiResponse<null>>(`${PUBLIC_SKILL_BASE_URL}/${id}`);
  },

  // ---------- SYSTEM (CHO SYSTEM ADMIN / TAXONOMY) ----------
  getSkillsSystem(params?: SkillListParams) {
    return api.get<ApiResponse<Skill[]>>(SYSTEM_SKILL_BASE_URL, {
      params,
    });
  },

  getSkillByIdSystem(id: number) {
    return api.get<ApiResponse<Skill>>(`${SYSTEM_SKILL_BASE_URL}/${id}`);
  },

  createSkillSystem(payload: { name: string }) {
    return api.post<ApiResponse<Skill>>(SYSTEM_SKILL_BASE_URL, payload);
  },

  updateSkillSystem(id: number, payload: { name: string }) {
    return api.patch<ApiResponse<Skill>>(
      `${SYSTEM_SKILL_BASE_URL}/${id}`,
      payload
    );
  },

  deleteSkillSystem(id: number) {
    return api.delete<ApiResponse<null>>(`${SYSTEM_SKILL_BASE_URL}/${id}`);
  },
};
