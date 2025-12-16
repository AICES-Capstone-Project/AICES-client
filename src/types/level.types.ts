export interface LevelEntity {
  levelId: number;
  name: string;
  createdAt: string;
}

export interface LevelListData {
  levels: LevelEntity[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateLevelPayload {
  name: string;
}

export interface UpdateLevelPayload {
  name: string;
}
