import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type {
  LevelEntity,
  LevelListData,
  CreateLevelPayload,
  UpdateLevelPayload,
} from "../types/level.types";

export interface LevelListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

const PUBLIC_LEVEL_BASE_URL = "/public/levels";
const SYSTEM_LEVEL_BASE_URL = "/system/levels";

export const levelSystemService = {
  // ---------- PUBLIC ----------
  getLevels(params?: LevelListParams) {
    return api.get<ApiResponse<LevelListData>>(PUBLIC_LEVEL_BASE_URL, {
      params,
    });
  },

  getLevelById(levelId: number) {
    return api.get<ApiResponse<LevelEntity>>(
      `${PUBLIC_LEVEL_BASE_URL}/${levelId}`
    );
  },

  // ---------- SYSTEM ----------
  createLevel(payload: CreateLevelPayload) {
    return api.post<ApiResponse<null>>(SYSTEM_LEVEL_BASE_URL, payload);
  },

  updateLevel(levelId: number, payload: UpdateLevelPayload) {
    return api.patch<ApiResponse<null>>(
      `${SYSTEM_LEVEL_BASE_URL}/${levelId}`,
      payload
    );
  },

  deleteLevel(levelId: number) {
    return api.delete<ApiResponse<null>>(
      `${SYSTEM_LEVEL_BASE_URL}/${levelId}`
    );
  },
};
