import api from "./api";
import type { ApiResponse } from "../types/api.types";
import type {
  LanguageEntity,
  LanguageListData,
  CreateLanguagePayload,
  UpdateLanguagePayload,
} from "../types/language.types";

export interface LanguageListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

const PUBLIC_LANGUAGE_BASE_URL = "/public/languages";
const SYSTEM_LANGUAGE_BASE_URL = "/system/languages";

export const languageSystemService = {
  // ---------- PUBLIC ----------
  getLanguages(params?: LanguageListParams) {
    return api.get<ApiResponse<LanguageListData>>(PUBLIC_LANGUAGE_BASE_URL, {
      params,
    });
  },

  getLanguageById(languageId: number) {
    return api.get<ApiResponse<LanguageEntity>>(
      `${PUBLIC_LANGUAGE_BASE_URL}/${languageId}`
    );
  },

  // ---------- SYSTEM ----------
  createLanguage(payload: CreateLanguagePayload) {
    return api.post<ApiResponse<null>>(SYSTEM_LANGUAGE_BASE_URL, payload);
  },

  updateLanguage(languageId: number, payload: UpdateLanguagePayload) {
    return api.patch<ApiResponse<null>>(
      `${SYSTEM_LANGUAGE_BASE_URL}/${languageId}`,
      payload
    );
  },

  deleteLanguage(languageId: number) {
    return api.delete<ApiResponse<null>>(
      `${SYSTEM_LANGUAGE_BASE_URL}/${languageId}`
    );
  },
};
