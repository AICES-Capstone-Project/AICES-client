export interface BannerConfig {
  bannerId: number;  
  title: string;
  colorCode?: string | null;
  sourceUrl: string;
  createdAt: string;
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
