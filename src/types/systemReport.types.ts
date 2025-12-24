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
// ===== NEW: AI Health =====
export interface AiHealthErrorReasonItem {
  errorType: string;
  count: number;
  percentage: number;
}

export interface SystemAiHealthReport {
  successRate: number; // 46.43 (đã là %)
  errorRate: number; // 53.57 (đã là %)
  errorReasons: AiHealthErrorReasonItem[];
  averageProcessingTimeSeconds: number; // seconds
}

// ===== NEW: Client Engagement =====
export interface ClientUsageFrequency {
  averageJobsPerCompanyPerMonth: number;
  averageCampaignsPerCompanyPerMonth: number;
}

export interface ClientAiTrustLevel {
  trustPercentage: number; // % (35.71)
  highScoreCandidatesCount: number;
  highScoreCandidatesHiredCount: number;
}

export interface SystemClientEngagementReport {
  usageFrequency: ClientUsageFrequency;
  aiTrustLevel: ClientAiTrustLevel;
}

// ===== NEW: SaaS Metrics =====
export interface SaasTopCompanyItem {
  companyId: number;
  companyName: string;
  totalResumesUploaded: number;
  totalJobsCreated: number;
  totalCampaignsCreated: number;
  activityScore: number;
}

export interface SaasFeatureAdoption {
  screeningUsageCount: number;
  trackingUsageCount: number;
  exportUsageCount: number;
}

export type ChurnRiskLevel = "High" | "Medium" | "Low";

export interface SaasChurnRiskCompanyItem {
  companyId: number;
  companyName: string;
  subscriptionPlan: string;
  riskLevel: ChurnRiskLevel;
}

export interface SystemSaasMetricsReport {
  topCompanies: SaasTopCompanyItem[];
  featureAdoption: SaasFeatureAdoption;
  churnRiskCompanies: SaasChurnRiskCompanyItem[];
}
