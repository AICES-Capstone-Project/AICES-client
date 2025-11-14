// src/services/skillService.ts

import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type { Skill } from "../types/skill.types";

export interface SkillListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

const SKILL_BASE_URL = "/skills";

export const skillService = {
  getSkills(params?: SkillListParams) {
    return api.get<ApiResponse<Skill[]>>(SKILL_BASE_URL, {
      params,
    });
  },

  getSkillById(id: number) {
    return api.get<ApiResponse<Skill>>(`${SKILL_BASE_URL}/${id}`);
  },

  createSkill(payload: { name: string }) {
    return api.post<ApiResponse<Skill>>(SKILL_BASE_URL, payload);
  },

  updateSkill(id: number, payload: { name: string }) {
    return api.patch<ApiResponse<Skill>>(
      `${SKILL_BASE_URL}/${id}`,
      payload
    );
  },

  deleteSkill(id: number) {
    return api.delete<ApiResponse<null>>(`${SKILL_BASE_URL}/${id}`);
  },
};
