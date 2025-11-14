export interface BannerConfig {
  id: number;
  title: string;
  colorCode?: string | null;
  source: string; // URL ảnh
}

export interface BannerConfigListData {
  bannerConfigs: BannerConfig[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface BannerConfigListResponse {
  status: string;
  message: string;
  data: BannerConfigListData;
}
