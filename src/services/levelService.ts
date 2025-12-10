import { get } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";

export interface Level {
  id: number;
  name: string;
  description?: string | null;
}

export const levelService = {
  // GET /public/levels
  getPublicLevels: async (): Promise<ApiResponse<Level[]>> => {
    return await get<Level[]>(API_ENDPOINTS.LEVEL.PUBLIC_GET);
  },

  // GET /public/levels/{id}
  getPublicLevelById: async (levelId: number): Promise<ApiResponse<Level>> => {
    return await get<Level>(API_ENDPOINTS.LEVEL.PUBLIC_GET_BY_ID(levelId));
  },
};
