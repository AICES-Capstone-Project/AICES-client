export interface LanguageEntity {
  languageId: number;
  name: string;
  createdAt: string;
}

export interface LanguageListData {
  languages: LanguageEntity[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export interface CreateLanguagePayload {
  name: string;
}

export interface UpdateLanguagePayload {
  name: string;
}
