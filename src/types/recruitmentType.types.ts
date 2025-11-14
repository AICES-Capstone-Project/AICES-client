// src/types/recruitmentType.types.ts

export interface RecruitmentType {
  // FE đặt tên recruitmentTypeId, map từ employTypeId của BE
  recruitmentTypeId: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}
