export interface Category {
  categoryId: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

// For list response
export interface CategoryListResponse {
  categories: Category[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
