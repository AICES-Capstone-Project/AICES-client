import { get } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";

export interface Language {
  id: number;
  name: string;
  code?: string | null;
}

export const languageService = {
  // GET /public/languages
  getPublicLanguages: async (): Promise<ApiResponse<Language[]>> => {
    return await get<Language[]>(API_ENDPOINTS.LANGUAGE.PUBLIC_GET);
  },

  // GET /public/languages/{id}
  getPublicLanguageById: async (
    languageId: number
  ): Promise<ApiResponse<Language>> => {
    return await get<Language>(API_ENDPOINTS.LANGUAGE.PUBLIC_GET_BY_ID(languageId));
  },
};
