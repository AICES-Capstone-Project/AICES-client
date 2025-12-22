// src/types/systemReport.types.ts

// ===== Executive Summary =====
export interface SystemExecutiveSummary {
  totalCompanies: number;
  activeCompanies: number;
  totalJobs: number;
  aiProcessedResumes: number;
  totalRevenue: number;
  companyRetentionRate: number;
}

// ===== Companies Overview =====
export interface CompanySubscriptionBreakdown {
  withActiveSubscription: number;
  withExpiredSubscription: number;
  withoutSubscription: number;
}

export interface CompanyVerificationBreakdown {
  verified: number;
  pending: number;
  rejected: number;
}

export interface SystemCompaniesOverviewReport {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  newCompaniesThisMonth: number;
  subscriptionBreakdown: CompanySubscriptionBreakdown;
  verificationBreakdown: CompanyVerificationBreakdown;
}

// ===== Companies Usage =====
export interface CompanyUsageKpis {
  activeRate: number;
  aiUsageRate: number;
  returningRate: number;
}

export interface SystemCompaniesUsageReport {
  registeredOnly: number;
  activeCompanies: number;
  frequentCompanies: number;
  kpis: CompanyUsageKpis;
}

// ===== Jobs Statistics =====
export interface JobStatusBreakdown {
  published: number;
  draft: number;
  closed: number;
}

export interface JobTopCategoryItem {
  categoryId: number;
  categoryName: string;
  jobCount: number;
}

export interface SystemJobsStatisticsReport {
  totalJobs: number;
  activeJobs: number;
  draftJobs: number;
  closedJobs: number;
  newJobsThisMonth: number;
  averageApplicationsPerJob: number;
  statusBreakdown: JobStatusBreakdown;
  topCategories: JobTopCategoryItem[];
}

// ===== Jobs Effectiveness =====
export interface SystemJobsEffectivenessReport {
  averageResumesPerJob: number;
  qualifiedRate: number;
  successHiringRate: number;
}

// ===== AI Parsing =====
export interface AiParsingCommonErrorItem {
  errorType: string;
  count: number;
  percentage: number;
}

export interface SystemAiParsingReport {
  successRate: number;
  totalResumes: number;
  successfulParsing: number;
  failedParsing: number;
  averageProcessingTimeMs: number;
  commonErrors: AiParsingCommonErrorItem[];
}

// ===== AI Scoring =====
export interface AiScoreDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface AiScoringStatistics {
  totalScored: number;
  averageScore: number;
  medianScore: number;
}

export interface SystemAiScoringReport {
  successRate: number;
  scoreDistribution: AiScoreDistribution;
  averageProcessingTimeMs: number;
  commonErrors: string[];
  statistics: AiScoringStatistics;
}

// ===== Subscriptions =====
export interface SubscriptionPlanStatisticItem {
  subscriptionId: number;
  planName: string;
  companyCount: number;
  revenue: number;
}

export interface SubscriptionRevenueBreakdown {
  planStatistics: SubscriptionPlanStatisticItem[];
  totalRevenue: number;
  averageRevenuePerCompany: number;
}

export interface SystemSubscriptionsReport {
  freeCompanies: number;
  paidCompanies: number;
  monthlyRevenue: number;
  renewalRate: number;
  popularPlan: string;
  breakdown: SubscriptionRevenueBreakdown;
}
