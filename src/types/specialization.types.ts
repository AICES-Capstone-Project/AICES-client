// src/types/specialization.types.ts

export interface Specialization {
  specializationId: number;
  name: string;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  createdAt: string;
}

export interface SpecializationListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}
